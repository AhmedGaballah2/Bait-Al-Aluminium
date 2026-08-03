from decimal import Decimal

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.db.models import Q, Sum, F, ExpressionWrapper, DecimalField
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from .decorators import rate_limit
from .utils import get_client_ip, verify_turnstile
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

from .forms import ProductForm
from .models import Category, Product, Review
from orders.models import Order, OrderItem
from .serializers import (
    CategorySerializer,
    ProductSerializer,
    ReviewSerializer,
)

# Create your views here.

@login_required
def products_list(request):
    search_query = request.GET.get('search', '').strip()
    products = Product.objects.all()

    if search_query:
        products = products.filter(name__icontains=search_query) | products.filter(description__icontains=search_query)

    context = {
        'products': products,
        'total': products.count(),
        'section': 'dashboard',
        'search_query': search_query,
    }

    return render(request, 'products/products_list.html', context)


def _filter_queryset_by_search(queryset, search_query, fields):
    if not search_query or not fields:
        return queryset

    query = Q()
    for field in fields:
        query |= Q(**{f"{field}__icontains": search_query})
    return queryset.filter(query)


def _paginate_queryset(request, queryset, per_page=15):
    paginator = Paginator(queryset, per_page)
    page_number = request.GET.get('page')
    return paginator.get_page(page_number)


def _dashboard_context(request, active_page, queryset, search_fields=None):
    search_query = request.GET.get('search', '').strip()
    queryset = _filter_queryset_by_search(queryset, search_query, search_fields or [])
    page_obj = _paginate_queryset(request, queryset)

    return {
        'search_query': search_query,
        'page_obj': page_obj,
        'active_page': active_page,
        'result_count': queryset.count(),
    }

@login_required
def dashboard(request):
    # إحصائيات أساسية
    total_products = Product.objects.count()
    total_categories = Category.objects.count()
    total_orders = Order.objects.count()

    # إجمالي المبيعات من الطلبات المؤكدة وما بعدها
    total_sales = (
        Order.objects
        .filter(
            status__in=[
                'confirmed',
                'in_transit',
                'delivered'
            ]
        )
        .aggregate(total=Sum('total_price'))['total']
        or 0
    )

    # حالات الطلبات
    pending_orders = Order.objects.filter(status='pending').count()
    confirmed_orders = Order.objects.filter(status='confirmed').count()
    in_transit_orders = Order.objects.filter(status='in_transit').count()
    delivered_orders = Order.objects.filter(status='delivered').count()

    # المنتجات قليلة المخزون
    low_stock_products = (
        Product.objects
        .filter(stock__lte=5)
        .select_related('category')
        .order_by('stock')[:5]
    )

    # آخر الطلبات
    recent_orders = Order.objects.order_by('-created_at')[:8]

    # أكثر المنتجات مبيعًا
    top_products = (
        OrderItem.objects
        .values('product_id', 'product_name')
        .annotate(
            total_quantity=Sum('quantity'),
            total_sales=Sum(
                ExpressionWrapper(
                    F('price') * F('quantity'),
                    output_field=DecimalField(
                        max_digits=12,
                        decimal_places=2
                    )
                )
            )
        )
        .order_by('-total_quantity')[:5]
    )

    context = {
        'active_page': 'dashboard',

        'total_products': total_products,
        'total_categories': total_categories,
        'total_orders': total_orders,
        'total_sales': total_sales,

        'pending_orders': pending_orders,
        'confirmed_orders': confirmed_orders,
        'in_transit_orders': in_transit_orders,
        'delivered_orders': delivered_orders,

        'low_stock_products': low_stock_products,
        'recent_orders': recent_orders,
        'top_products': top_products,
    }

    return render(
        request,
        'products/dashboard/dashboard.html',
        context
    )


@login_required
def dashboard_products(request):
    products = Product.objects.select_related('category').order_by('-added_at')
    context = _dashboard_context(
        request,
        active_page='products',
        queryset=products,
        search_fields=['name', 'description'],
    )
    return render(request, 'products/dashboard/products_list.html', context)


@login_required
def dashboard_reviews(request):
    reviews = Review.objects.select_related('product').order_by('-created_at')
    context = _dashboard_context(
        request,
        active_page='reviews',
        queryset=reviews,
        search_fields=['name', 'email', 'comment', 'product__name'],
    )
    return render(request, 'products/dashboard/reviews_list.html', context)


@login_required
def dashboard_categories(request):
    categories = Category.objects.all().order_by('name')

    search_query = request.GET.get('search', '').strip()

    if search_query:
        categories = categories.filter(name__icontains=search_query)

    context = {
        'categories': categories,
        'search_query': search_query,
        'active_page': 'categories',
    }

    return render(
        request,
        'products/dashboard/categories_list.html',
        context
    )


@login_required
def add_category(request):
    if request.method == 'POST':
        name = request.POST.get('name', '').strip()

        if not name:
            return render(
                request,
                'products/dashboard/category_form.html',
                {
                    'error': 'اسم التصنيف مطلوب.',
                    'name': name,
                    'active_page': 'categories',
                }
            )

        if Category.objects.filter(name__iexact=name).exists():
            return render(
                request,
                'products/dashboard/category_form.html',
                {
                    'error': 'هذا التصنيف موجود بالفعل.',
                    'name': name,
                    'active_page': 'categories',
                }
            )

        Category.objects.create(name=name)

        return redirect('products:dashboard_categories')

    return render(
        request,
        'products/dashboard/category_form.html',
        {
            'active_page': 'categories',
        }
    )


@login_required
def edit_category(request, pk):
    category = get_object_or_404(Category, pk=pk)

    if request.method == 'POST':
        name = request.POST.get('name', '').strip()

        if not name:
            return render(
                request,
                'products/dashboard/category_form.html',
                {
                    'category': category,
                    'error': 'اسم التصنيف مطلوب.',
                    'name': name,
                    'active_page': 'categories',
                }
            )

        if Category.objects.filter(
            name__iexact=name
        ).exclude(pk=category.pk).exists():
            return render(
                request,
                'products/dashboard/category_form.html',
                {
                    'category': category,
                    'error': 'هذا التصنيف موجود بالفعل.',
                    'name': name,
                    'active_page': 'categories',
                }
            )

        category.name = name
        category.save()

        return redirect('products:dashboard_categories')

    return render(
        request,
        'products/dashboard/category_form.html',
        {
            'category': category,
            'active_page': 'categories',
        }
    )


@login_required
def delete_category(request, pk):
    category = get_object_or_404(Category, pk=pk)

    if request.method == 'POST':
        category.delete()
        return redirect('products:dashboard_categories')

    return render(
        request,
        'products/dashboard/category_confirm_delete.html',
        {
            'category': category,
            'active_page': 'categories',
        }
    )

@login_required
def product_details(request, pk):
    product = get_object_or_404(Product, pk=pk)
    approved_reviews = product.reviews.filter(approved=True).order_by('-created_at')

    context = {
        'product': product,
        'approved_reviews': approved_reviews,
    }

    return render(request, 'products/product_details.html', context)

@login_required
def add_product(request):
    if request.method == "POST":
        form = ProductForm(request.POST, request.FILES)

        if form.is_valid():
            form.save()
            return redirect("products:dashboard_products")
    else:
        form = ProductForm()

    return render(request, 'products/add_product.html', {'form': form})

@login_required
def delete_product(request, pk):
    product = get_object_or_404(Product, pk=pk)
    if request.method == 'POST':
        product.delete()
        return redirect("products:dashboard_products")
    return render(request, 'products/confirm_delete.html', {'product': product})

@login_required
def edit_product(request, pk):
    product = get_object_or_404(Product, pk=pk)

    if request.method == "POST":
        form = ProductForm(request.POST, request.FILES, instance=product)
        
        if form.is_valid():
            form.save()
            return redirect("products:dashboard_products")
    else:
        form = ProductForm(instance=product)

    return render(request, 'products/edit_product.html', {
        'form': form,
        'product': product
    })

@login_required
def review_detail(request, pk):
    review = get_object_or_404(Review, pk=pk)

    if request.method == 'POST':
        action = request.POST.get('action')
        review.approved = True if action == 'publish' else False
        review.save()
        return redirect('products:review_detail', pk=review.pk)

    context = {
        'review': review,
    }

    return render(request, 'products/review_detail.html', context)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_products(request):
    products = Product.objects.all()

    is_new_param = request.GET.get('is_new')
    if is_new_param is not None:
        products = products.filter(is_new=is_new_param.lower() in ['true', '1', 'yes'])

    is_featured_param = request.GET.get('is_featured_new_arrival')
    if is_featured_param is not None:
        products = products.filter(
            is_featured_new_arrival=is_featured_param.lower() in ['true', '1', 'yes']
        )

    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

class CategoryListAPIView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

@api_view(['GET'])
def product_detail(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProductSerializer(product)
    return Response(serializer.data)

class ReviewAPIView(APIView):
    def get(self, request, product_id):
        reviews = Review.objects.filter(product_id=product_id, approved=True)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    @rate_limit(key_prefix="review", limit=settings.RATE_LIMIT_REVIEWS_PER_HOUR)
    def post(self, request, product_id):
        turnstile_token = request.data.get("turnstile_token")
        client_ip = get_client_ip(request)

        if not verify_turnstile(turnstile_token, remote_ip=client_ip):
            return Response(
                {"error": "فشل التحقق الأمني، حاول تاني."},
                status=403
            )

        data = request.data.copy()
        data["product"] = product_id

        serializer = ReviewSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)

@api_view(['GET'])
def related_products(request, pk):
    try:
        product = Product.objects.get(id=pk)
    except Product.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

    related = Product.objects.filter(
        category=product.category
    ).exclude(id=product.id)[:6]

    serializer = ProductSerializer(related, many=True)
    return Response(serializer.data)



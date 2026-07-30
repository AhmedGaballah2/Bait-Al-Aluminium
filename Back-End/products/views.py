from decimal import Decimal

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

from .forms import ProductForm, OfferForm, NewArrivalForm
from .models import Category, NewArrival, Offer, Product, Review, OfferReview, Order, OrderItem
from .serializers import (
    CategorySerializer,
    OfferSerializer,
    ProductSerializer,
    NewArrivalSerializer,
    ReviewSerializer,
    OfferReviewSerializer,
    OrderSerializer,
    OrderCreateSerializer,
)

# Create your views here.

@login_required
def products_list(request):
    section = request.GET.get('section', 'dashboard')
    search_query = request.GET.get('search', '').strip()
    
    # Get all data
    products = Product.objects.all()
    offers = Offer.objects.all()
    new_arrivals = NewArrival.objects.all()
    
    # Apply search filter if query exists
    if search_query:
        if section == 'products' or section == 'dashboard':
            products = products.filter(name__icontains=search_query) | products.filter(description__icontains=search_query)
        if section == 'offers' or section == 'dashboard':
            offers = offers.filter(title__icontains=search_query) | offers.filter(description__icontains=search_query)
        if section == 'new_arrivals' or section == 'dashboard':
            new_arrivals = new_arrivals.filter(title__icontains=search_query) | new_arrivals.filter(description__icontains=search_query)
    
    context = {
        'products': products,
        'offers': offers,
        'new_arrivals': new_arrivals,
        'total': products.count(),
        'offerTotal': offers.count(),
        'newArrivalTotal': new_arrivals.count(),
        'section': section,
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
def dashboard_new_arrivals(request):
    new_arrivals = NewArrival.objects.order_by('-created_at')
    context = _dashboard_context(
        request,
        active_page='new_arrivals',
        queryset=new_arrivals,
        search_fields=['title'],
    )
    return render(request, 'products/dashboard/new_arrivals_list.html', context)


@login_required
def dashboard_offers(request):
    offers = Offer.objects.order_by('-created_at')
    context = _dashboard_context(
        request,
        active_page='offers',
        queryset=offers,
        search_fields=['title', 'subTitle', 'description'],
    )
    return render(request, 'products/dashboard/offers_list.html', context)


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
def add_offer(request):
    if request.method == 'POST':
        form = OfferForm(request.POST, request.FILES)

        if form.is_valid():
            form.save()
            return redirect("products:dashboard_products")
    else:
        form = OfferForm()

    return render(request, 'products/add_offer.html', {'form': form})

@login_required
def edit_offer(request, pk):
    offer = Offer.objects.get(id=pk)

    if request.method == 'POST':
        form = OfferForm(request.POST, request.FILES, instance=offer)

        if form.is_valid():
            form.save()
            return redirect("products:dashboard_products")

    else:
        form = OfferForm(instance=offer)

    return render(request, 'products/edit_offer.html', {'form': form})

@login_required
def delete_offer(request, pk):
    offer = Offer.objects.get(id=pk)

    if request.method == 'POST':
        offer.delete()
        return redirect("products:dashboard_products")

    return redirect("products:dashboard_products")

@login_required
def offer_details(request, pk):
    offer = get_object_or_404(Offer, pk=pk)
    approved_reviews = offer.reviews.filter(approved=True).order_by('-created_at')

    context = {
        'offer': offer,
        'approved_reviews': approved_reviews,
    }

    return render(request, 'products/offer_details.html', context)
@login_required
def order_delete_view(request, pk):
    order = get_object_or_404(Order, id=pk)

    if request.method == 'POST':
        order.delete()
        return redirect('products:dashboard_orders')

    return redirect('products:dashboard_order_detail', pk=pk)

@api_view(['GET'])
@permission_classes([AllowAny])
def offers_list(request):
    offers = Offer.objects.filter(is_active=True)
    serializer = OfferSerializer(offers, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def offer_detail(request, pk):
    try:
        offer = Offer.objects.get(pk=pk)
    except Offer.DoesNotExist:
        return Response({"error": "Offer not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = OfferSerializer(offer)
    return Response(serializer.data)

class OfferReviewAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, offer_id):
        reviews = OfferReview.objects.filter(offer_id=offer_id, approved=True)
        serializer = OfferReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    def post(self, request, offer_id):
        data = request.data.copy()
        data["offer"] = offer_id

        serializer = OfferReviewSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)

@api_view(['GET'])
@permission_classes([AllowAny])
def new_arrivals_list(request):
    new_arrivals = NewArrival.objects.filter(is_active=True)
    serializer = NewArrivalSerializer(new_arrivals, many=True)
    return Response(serializer.data)

@login_required
def add_new_product(request):
    if request.method == 'POST':
        form = NewArrivalForm(request.POST, request.FILES)

        if form.is_valid():
            form.save()
            return redirect("products:dashboard_products")
    else:
        form = NewArrivalForm()

    return render(request, 'products/add_new_product.html', {'form': form})

@login_required
def new_product_details(request, pk):
    new_arrival = get_object_or_404(NewArrival, pk=pk)

    context = {
        'new_arrival': new_arrival
    }

    return render(request, 'products/new_product_details.html', context)


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

@login_required
def edit_new_product(request, pk):
    new_arrival = NewArrival.objects.get(id=pk)

    if request.method == 'POST':
        form = NewArrivalForm(request.POST, request.FILES, instance=new_arrival)

        if form.is_valid():
            form.save()
            return redirect("products:dashboard_products")

    else:
        form = NewArrivalForm(instance=new_arrival)

    return render(request, 'products/edit_new_product.html', {'form': form})

@login_required
def delete_new_product(request, pk):
    new_arrival = NewArrival.objects.get(id=pk)

    if request.method == 'POST':
        new_arrival.delete()
        return redirect("products:dashboard_products")

    return redirect("products:dashboard_products")

@api_view(['GET'])
@permission_classes([AllowAny])
def get_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    
    return Response(serializer.data)

def login_view(request):
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect("products:dashboard_products")
        else:
            return render(request, 'auth/login.html', {
                'error': 'بيانات غير صحيحة'
            })
    return render(request, 'auth/login.html')

def logout_view(request):
    logout(request)
    return redirect('products:login')

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

    def post(self, request, product_id):
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


# ============ Order API Views ============

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def create_order(request):
    """Create a new order from checkout"""
    serializer = OrderCreateSerializer(data=request.data)
    if serializer.is_valid():
        order = serializer.save()
        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@login_required
def dashboard_orders(request):
    """Get all orders for dashboard"""
    orders = Order.objects.all().order_by('-created_at')
    search_query = request.GET.get('search', '').strip()
    
    if search_query:
        orders = orders.filter(
            Q(first_name__icontains=search_query) |
            Q(last_name__icontains=search_query) |
            Q(email__icontains=search_query) |
            Q(phone__icontains=search_query)
        )
    
    context = _dashboard_context(
        request,
        active_page='orders',
        queryset=orders,
        search_fields=['first_name', 'last_name', 'email', 'phone'],
    )
    return render(request, 'products/dashboard/orders_list.html', context)


@api_view(['GET', 'PUT'])
@permission_classes([AllowAny])
def order_detail(request, pk):
    """Get or update order details"""
    try:
        order = Order.objects.get(id=pk)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = OrderSerializer(order)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        # Only allow updating status and notes
        if 'status' in request.data:
            status_value = request.data.get('status')
            if status_value in dict(Order._meta.get_field('status').choices):
                order.status = status_value
        
        if 'notes' in request.data:
            order.notes = request.data.get('notes')
        
        order.save()
        return Response(OrderSerializer(order).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_orders(request):
    """API endpoint to get all orders (for API calls)"""
    orders = Order.objects.all().order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@login_required
def order_detail_view(request, pk):
    """Display order details page for admin and allow editing order items."""
    order = get_object_or_404(Order, id=pk)
    products = Product.objects.all()
    item_update_message = None

    if request.method == 'POST' and request.POST.get('action') == 'update_items':
        item_ids = request.POST.getlist('item_id')
        product_ids = request.POST.getlist('product_id')
        quantities = request.POST.getlist('quantity')

        total_price = Decimal('0')
        products_count = 0

        for item_id, product_id, quantity_str in zip(item_ids, product_ids, quantities):
            try:
                quantity = int(quantity_str)
            except (ValueError, TypeError):
                quantity = 0

            if quantity <= 0:
                if item_id:
                    OrderItem.objects.filter(id=item_id, order=order).delete()
                continue

            try:
                selected_product = Product.objects.get(id=int(product_id))
            except (Product.DoesNotExist, ValueError, TypeError):
                continue

            if item_id:
                item = OrderItem.objects.filter(id=item_id, order=order).first()
                if item:
                    item.product_id = selected_product.id
                    item.product_name = selected_product.name
                    item.price = selected_product.price
                    item.quantity = quantity
                    item.save()
            else:
                OrderItem.objects.create(
                    order=order,
                    product_id=selected_product.id,
                    product_name=selected_product.name,
                    price=selected_product.price,
                    quantity=quantity,
                )

            total_price += selected_product.price * quantity
            products_count += quantity

        order.total_price = total_price
        order.products_count = products_count
        order.save()
        item_update_message = 'تم تحديث منتجات الطلب بنجاح.'

    context = {
        'order': order,
        'products': products,
        'item_update_message': item_update_message,
    }

    return render(request, 'products/order_detail.html', context)

@login_required
def order_delete_view(request, pk):
    order = get_object_or_404(Order, id=pk)

    if request.method == 'POST':
        order.delete()
        return redirect('products:dashboard_orders')

    return redirect('products:dashboard_order_detail', pk=pk)
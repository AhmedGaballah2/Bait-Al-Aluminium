from decimal import Decimal

from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.db.models import Q, Sum, F, ExpressionWrapper, DecimalField
from django.shortcuts import get_object_or_404, redirect, render

from orders.models import Order, OrderItem
from products.models import Category, Product, Review


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
    total_products = Product.objects.count()
    total_categories = Category.objects.count()
    total_orders = Order.objects.count()

    total_sales = (
        Order.objects.filter(status__in=['confirmed', 'in_transit', 'delivered'])
        .aggregate(total=Sum('total_price'))['total']
        or 0
    )

    pending_orders = Order.objects.filter(status='pending').count()
    confirmed_orders = Order.objects.filter(status='confirmed').count()
    in_transit_orders = Order.objects.filter(status='in_transit').count()
    delivered_orders = Order.objects.filter(status='delivered').count()

    low_stock_products = (
        Product.objects.filter(stock__lte=5).select_related('category').order_by('stock')[:5]
    )
    recent_orders = Order.objects.order_by('-created_at')[:8]
    top_products = (
        OrderItem.objects.values('product_id', 'product_name').annotate(
            total_quantity=Sum('quantity'),
            total_sales=Sum(
                ExpressionWrapper(F('price') * F('quantity'), output_field=DecimalField(max_digits=12, decimal_places=2))
            ),
        ).order_by('-total_quantity')[:5]
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

    return render(request, 'dashboard/dashboard.html', context)


@login_required
def dashboard_products(request):
    products = Product.objects.select_related('category').order_by('-added_at')
    context = _dashboard_context(
        request,
        active_page='products',
        queryset=products,
        search_fields=['name', 'description'],
    )
    return render(request, 'dashboard/products_list.html', context)


@login_required
def dashboard_reviews(request):
    reviews = Review.objects.select_related('product').order_by('-created_at')
    context = _dashboard_context(
        request,
        active_page='reviews',
        queryset=reviews,
        search_fields=['name', 'email', 'comment', 'product__name'],
    )
    return render(request, 'dashboard/reviews_list.html', context)


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
    return render(request, 'dashboard/categories_list.html', context)


@login_required
def add_category(request):
    if request.method == 'POST':
        name = request.POST.get('name', '').strip()

        if not name:
            return render(request, 'dashboard/category_form.html', {'error': 'اسم التصنيف مطلوب.', 'name': name, 'active_page': 'categories'})

        if Category.objects.filter(name__iexact=name).exists():
            return render(request, 'dashboard/category_form.html', {'error': 'هذا التصنيف موجود بالفعل.', 'name': name, 'active_page': 'categories'})

        Category.objects.create(name=name)
        return redirect('dashboard:dashboard_categories')

    return render(request, 'dashboard/category_form.html', {'active_page': 'categories'})


@login_required
def edit_category(request, pk):
    category = get_object_or_404(Category, pk=pk)

    if request.method == 'POST':
        name = request.POST.get('name', '').strip()

        if not name:
            return render(request, 'dashboard/category_form.html', {'category': category, 'error': 'اسم التصنيف مطلوب.', 'name': name, 'active_page': 'categories'})

        if Category.objects.filter(name__iexact=name).exclude(pk=category.pk).exists():
            return render(request, 'dashboard/category_form.html', {'category': category, 'error': 'هذا التصنيف موجود بالفعل.', 'name': name, 'active_page': 'categories'})

        category.name = name
        category.save()
        return redirect('dashboard:dashboard_categories')

    return render(request, 'dashboard/category_form.html', {'category': category, 'active_page': 'categories'})


@login_required
def delete_category(request, pk):
    category = get_object_or_404(Category, pk=pk)

    if request.method == 'POST':
        category.delete()
        return redirect('dashboard:dashboard_categories')

    return render(request, 'dashboard/category_confirm_delete.html', {'category': category, 'active_page': 'categories'})

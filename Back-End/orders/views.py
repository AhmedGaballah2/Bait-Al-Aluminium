from decimal import Decimal

from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import get_object_or_404, redirect, render
from django.db.models import Q, Sum, F, ExpressionWrapper, DecimalField
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt

from products.models import Product
from products.views import _dashboard_context
from .models import Order, OrderItem
from .serializers import OrderCreateSerializer, OrderSerializer
from products.utils import get_client_ip, verify_turnstile
from products.decorators import rate_limit


@csrf_exempt
@rate_limit(key_prefix="order", limit=settings.RATE_LIMIT_ORDERS_PER_HOUR)
@api_view(['POST'])
@permission_classes([AllowAny])
def create_order(request):
    # ده صح إنه AllowAny - العميل لسه معملش تسجيل دخول وبيعمل أوردر جديد
    turnstile_token = request.data.get("turnstile_token")
    client_ip = get_client_ip(request)

    if not verify_turnstile(turnstile_token, remote_ip=client_ip):
        return Response(
            {"error": "فشل التحقق الأمني، حاول تاني."},
            status=status.HTTP_403_FORBIDDEN,
        )

    serializer = OrderCreateSerializer(data=request.data)
    if serializer.is_valid():
        order = serializer.save()
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@staff_member_required
def dashboard_orders(request):
    orders = Order.objects.all().order_by('-created_at')
    search_query = request.GET.get('search', '').strip()

    if search_query:
        orders = orders.filter(
            Q(first_name__icontains=search_query)
            | Q(last_name__icontains=search_query)
            | Q(email__icontains=search_query)
            | Q(phone__icontains=search_query)
        )

    context = _dashboard_context(
        request,
        active_page='orders',
        queryset=orders,
        search_fields=['first_name', 'last_name', 'email', 'phone'],
    )
    return render(request, 'orders/dashboard/orders_list.html', context)


# ⚠️ تم تغييرها من AllowAny لـ IsAdminUser - كانت بتسمح لأي حد يعدل حالة أي طلب
# ويشوف بيانات العميل الكاملة (اسم، إيميل، تليفون) من غير أي تسجيل دخول
@api_view(['GET', 'PUT'])
@permission_classes([IsAdminUser])
def order_detail(request, pk):
    try:
        order = Order.objects.get(id=pk)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = OrderSerializer(order)
        return Response(serializer.data)

    if request.method == 'PUT':
        old_status = order.status

        if 'status' in request.data:
            status_value = request.data.get('status')
            if status_value not in dict(Order._meta.get_field('status').choices):
                return Response({"error": "Invalid order status"}, status=status.HTTP_400_BAD_REQUEST)
            order.status = status_value

        if 'notes' in request.data:
            order.notes = request.data.get('notes')

        if (
            old_status not in ['in_transit', 'delivered']
            and order.status in ['in_transit', 'delivered']
            and not order.stock_deducted
        ):
            for item in order.items.all():
                try:
                    product = Product.objects.get(id=item.product_id)
                except Product.DoesNotExist:
                    continue

                if item.size_id:
                    try:
                        size = product.sizes.get(id=item.size_id)
                    except Product.DoesNotExist:
                        return Response(
                            {"error": f"المقاس الخاص بالمنتج {product.name} غير موجود."},
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                    if size.stock < item.quantity:
                        return Response(
                            {
                                "error": f"المخزون غير كافٍ للمقاس: {size.name} - {product.name}",
                                "available_stock": size.stock,
                                "requested_quantity": item.quantity,
                            },
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                elif product.stock < item.quantity:
                    return Response(
                        {
                            "error": f"المخزون غير كافٍ للمنتج: {product.name}",
                            "available_stock": product.stock,
                            "requested_quantity": item.quantity,
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            for item in order.items.all():
                product = Product.objects.get(id=item.product_id)
                if item.size_id:
                    size = product.sizes.filter(id=item.size_id).first()
                    if size:
                        size.stock -= item.quantity
                        size.save(update_fields=['stock'])
                else:
                    product.stock -= item.quantity
                    product.save(update_fields=['stock'])

            order.stock_deducted = True

        order.save()
        return Response(OrderSerializer(order).data)


# ⚠️ تم تغييرها من AllowAny لـ IsAdminUser - كانت بتكشف بيانات كل العملاء لأي زائر
@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_orders(request):
    orders = Order.objects.all().order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@staff_member_required
def order_detail_view(request, pk):
    order = get_object_or_404(Order, id=pk)
    products = Product.objects.all()
    item_update_message = None

    if request.method == 'POST' and request.POST.get('action') == 'update_items':
        item_ids = request.POST.getlist('item_id')
        product_ids = request.POST.getlist('product_id')
        size_ids = request.POST.getlist('size_id')
        quantities = request.POST.getlist('quantity')

        total_price = Decimal('0')
        products_count = 0

        for item_id, product_id, size_id, quantity_str in zip(item_ids, product_ids, size_ids, quantities):
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

            selected_size = None
            if size_id:
                try:
                    selected_size = selected_product.sizes.get(id=int(size_id))
                except (Product.DoesNotExist, ValueError, TypeError):
                    selected_size = None

            unit_price = selected_size.price if selected_size else selected_product.price
            size_name = selected_size.name if selected_size else None

            if item_id:
                item = OrderItem.objects.filter(id=item_id, order=order).first()
                if item:
                    item.product_id = selected_product.id
                    item.size_id = selected_size.id if selected_size else None
                    item.size_name = size_name
                    item.product_name = selected_product.name
                    item.price = unit_price
                    item.quantity = quantity
                    item.save()
            else:
                OrderItem.objects.create(
                    order=order,
                    product_id=selected_product.id,
                    size_id=selected_size.id if selected_size else None,
                    size_name=size_name,
                    product_name=selected_product.name,
                    price=unit_price,
                    quantity=quantity,
                )

            total_price += unit_price * quantity
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
    return render(request, 'orders/order_detail.html', context)


@staff_member_required
def order_delete_view(request, pk):
    order = get_object_or_404(Order, id=pk)

    if request.method == 'POST':
        order.delete()
        return redirect('orders:dashboard_orders')

    return redirect('orders:dashboard_order_detail', pk=pk)

@api_view(["GET"])
@permission_classes([AllowAny])
def track_order(request, tracking_number):
    # ده صح إنه AllowAny - العميل بيتتبع طلبه برقم التتبع اللي معاه بس
    try:
        order = Order.objects.get(tracking_number=tracking_number)
    except Order.DoesNotExist:
        return Response(
            {"error": "لم يتم العثور على طلب بهذا الرقم."},
            status=status.HTTP_404_NOT_FOUND,
        )

    serializer = OrderSerializer(order)
    return Response(serializer.data)
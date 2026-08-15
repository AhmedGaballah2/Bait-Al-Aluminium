from decimal import Decimal

from rest_framework import serializers

from products.models import Product, ProductSize

from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    size_id = serializers.IntegerField(required=False, allow_null=True)
    size_name = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product_id', 'size_id', 'size_name', 'product_name', 'price', 'quantity']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'tracking_number', 'first_name', 'last_name', 'email', 'phone',
            'governorate', 'city', 'address', 'building_number',
            'total_price', 'shipping_cost', 'products_count',
            'status', 'stock_deducted', 'notes', 'created_at', 'updated_at', 'items'
        ]


class OrderCreateSerializer(serializers.Serializer):
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    phone = serializers.CharField(required=True)
    governorate = serializers.CharField(required=True)
    city = serializers.CharField(required=True)
    address = serializers.CharField(required=True)
    building_number = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, default=Decimal('0.00'))
    shipping_cost = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, default=Decimal('0.00'))
    products_count = serializers.IntegerField(required=False, default=0)
    notes = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    items = serializers.ListField(required=True, child=serializers.DictField())

    @staticmethod
    def _calculate_shipping_cost(governorate, subtotal):
        upper_egypt_and_sinai = {
            'الفيوم', 'بني سويف', 'المنيا', 'أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'شمال سيناء', 'جنوب سيناء'
        }
        if subtotal >= Decimal('2500'):
            return Decimal('0.00')
        if governorate in upper_egypt_and_sinai:
            return Decimal('120.00')
        return Decimal('80.00')

    def validate_items(self, items):
        if not items:
            raise serializers.ValidationError('يجب إدخال منتج واحد على الأقل.')

        for item in items:
            product_id = item.get('product_id')
            quantity = item.get('quantity', 1)

            if not product_id:
                raise serializers.ValidationError('كل عنصر طلب يحتاج إلى معرف المنتج.')

            try:
                quantity = int(quantity)
            except (TypeError, ValueError):
                raise serializers.ValidationError('الكمية غير صحيحة.')

            if quantity <= 0:
                raise serializers.ValidationError('يجب أن تكون الكمية أكبر من صفر.')

            product = Product.objects.filter(pk=product_id).first()
            if not product:
                raise serializers.ValidationError(f'المنتج رقم {product_id} غير موجود.')

            size_id = item.get('size_id')
            if size_id:
                size = product.sizes.filter(pk=size_id).first()
                if not size:
                    raise serializers.ValidationError(f'المقاس المطلوب غير موجود للمنتج {product.name}.')
                if size.stock < quantity:
                    raise serializers.ValidationError(f'المخزون غير كافٍ للمقاس {size.name} في المنتج {product.name}.')
            elif product.stock < quantity:
                raise serializers.ValidationError(f'المخزون غير كافٍ للمنتج {product.name}.')

        return items

    def create(self, validated_data):
        items_data = validated_data.pop('items')

        computed_items = []
        subtotal = Decimal('0.00')
        products_count = 0

        for item_data in items_data:
            product_id = item_data['product_id']
            quantity = int(item_data['quantity'])
            product = Product.objects.get(pk=product_id)

            size_id = item_data.get('size_id')
            selected_size = None
            if size_id:
                selected_size = product.sizes.filter(pk=size_id).first()
                if not selected_size:
                    raise serializers.ValidationError(f'المقاس المحدد غير موجود للمنتج {product.name}.')
                if selected_size.stock < quantity:
                    raise serializers.ValidationError(f'المخزون غير كافٍ للمقاس {selected_size.name} في المنتج {product.name}.')
                unit_price = selected_size.price
                size_name = selected_size.name
            else:
                if product.stock < quantity:
                    raise serializers.ValidationError(f'المخزون غير كافٍ للمنتج {product.name}.')
                unit_price = product.price
                size_name = None

            compiled_item = {
                'product_id': product_id,
                'size_id': selected_size.id if selected_size else None,
                'product_name': product.name,
                'size_name': size_name,
                'price': unit_price,
                'quantity': quantity,
            }

            computed_items.append(compiled_item)
            subtotal += unit_price * quantity
            products_count += quantity

        shipping_cost = self._calculate_shipping_cost(validated_data.get('governorate', ''), subtotal)

        # امسح القيم دي عشان متتكررش مع اللي هنبعتها تحت صراحةً -
        # إحنا بنحسب total_price و shipping_cost و products_count بنفسنا هنا في الباك إند
        # (مش بناخدهم زي ما هما جايين من الفرونت) عشان محدش يقدر يتلاعب بالسعر من الـ dev tools
        validated_data.pop('total_price', None)
        validated_data.pop('shipping_cost', None)
        validated_data.pop('products_count', None)

        order = Order.objects.create(
            **validated_data,
            total_price=subtotal,
            shipping_cost=shipping_cost,
            products_count=products_count,
        )

        for item in computed_items:
            product = Product.objects.get(pk=item['product_id'])
            size = product.sizes.filter(pk=item['size_id']).first() if item['size_id'] else None

            if size:
                size.stock -= item['quantity']
                size.save(update_fields=['stock'])
            else:
                product.stock -= item['quantity']
                product.save(update_fields=['stock'])

            OrderItem.objects.create(order=order, **item)

        return order
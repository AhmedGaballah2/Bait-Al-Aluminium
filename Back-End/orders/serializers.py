from rest_framework import serializers

from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product_id', 'product_name', 'price', 'quantity']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone',
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
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=True)
    shipping_cost = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, default=0)
    products_count = serializers.IntegerField(required=True)
    notes = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    items = serializers.ListField(required=True, child=serializers.DictField())

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order

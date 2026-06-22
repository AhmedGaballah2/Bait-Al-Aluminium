from rest_framework import serializers
from .models import Category, NewArrival, Offer, Product, Review, OfferReview, Order, OrderItem
from django.db.models import Avg

class OfferSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Offer
        fields = '__all__'

    def get_average_rating(self, obj):
        avg = obj.reviews.aggregate(Avg("rating"))["rating__avg"]
        return round(avg, 1) if avg else 0

class NewArrivalSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewArrival
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()
    discount = serializers.ReadOnlyField()
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = "__all__"

    def get_average_rating(self, obj):
        avg = obj.reviews.aggregate(
            Avg("rating")
        )["rating__avg"]

        return round(avg, 1) if avg else 0

    def get_discount(self, obj):
        if obj.old_price and obj.old_price > obj.price:
            return round(((obj.old_price - obj.price) / obj.old_price) * 100)
        return 0

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"

class OfferReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfferReview
        fields = "__all__"


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product_id', 'product_name', 'price', 'quantity']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'first_name', 'last_name', 'email', 'phone', 'governorate', 
                  'city', 'address', 'building_number', 'total_price', 'shipping_cost',
                  'products_count', 'status', 'items', 'notes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class OrderCreateSerializer(serializers.Serializer):
    """Serializer for creating a new order"""
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)
    governorate = serializers.CharField(max_length=100)
    city = serializers.CharField(max_length=100)
    address = serializers.CharField(max_length=255)
    building_number = serializers.CharField(max_length=50, required=False, allow_blank=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    shipping_cost = serializers.DecimalField(max_digits=10, decimal_places=2)
    products_count = serializers.IntegerField()
    notes = serializers.CharField(required=False, allow_blank=True)
    items = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField()
        )
    )
    
    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        order = Order.objects.create(**validated_data)
        
        for item in items_data:
            OrderItem.objects.create(
                order=order,
                product_id=int(item.get('id')) if item.get('id') is not None else None,
                product_name=item.get('name'),
                price=item.get('price'),
                quantity=int(item.get('quantity')) if item.get('quantity') is not None else 0
            )
        
        return order
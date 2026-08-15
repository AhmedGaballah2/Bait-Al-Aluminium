from rest_framework import serializers
from django.db.models import Avg

from .models import Category, Product, ProductSize, Review


class ProductSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSize
        fields = ['id', 'product', 'name', 'price', 'stock']


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()
    discount = serializers.ReadOnlyField()
    average_rating = serializers.SerializerMethodField()
    sizes = ProductSizeSerializer(many=True, read_only=True)

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
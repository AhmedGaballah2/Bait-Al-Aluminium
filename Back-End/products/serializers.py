from rest_framework import serializers
from .models import Category, NewArrival, Offer, Product

class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = '__all__'

class NewArrivalSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewArrival
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()
    discount = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = "__all__"

    def get_discount(self, obj):
        if obj.old_price and obj.old_price > obj.price:
            return round(((obj.old_price - obj.price) / obj.old_price) * 100)
        return 0

from rest_framework import serializers
from .models import Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"
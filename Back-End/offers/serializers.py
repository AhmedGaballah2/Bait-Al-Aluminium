from django.db.models import Avg
from rest_framework import serializers

from .models import Offer, OfferReview


class OfferSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()
    category = serializers.CharField(source="category.name", read_only=True)


    class Meta:
        model = Offer
        fields = '__all__'

    def get_average_rating(self, obj):
        avg = obj.reviews.aggregate(Avg('rating'))['rating__avg']
        return round(avg, 1) if avg else 0


class OfferReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfferReview
        fields = '__all__'

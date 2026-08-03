from django.contrib import admin

from .models import Offer, OfferReview


@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = ['title', 'price', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['title', 'subTitle']


@admin.register(OfferReview)
class OfferReviewAdmin(admin.ModelAdmin):
    list_display = ['offer', 'name', 'rating', 'approved', 'created_at']
    list_filter = ['approved', 'rating']
    search_fields = ['name', 'email', 'comment']

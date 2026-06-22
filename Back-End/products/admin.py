from django.contrib import admin
from .models import Category, Product, Offer, NewArrival, Review, OfferReview

# Register your models here.

admin.site.register(Product)
admin.site.register(Offer)
admin.site.register(NewArrival)
admin.site.register(Category)
admin.site.register(Review)
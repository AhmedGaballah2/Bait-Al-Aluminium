from django.db import models
from products.models import Category


class Offer(models.Model):
    subTitle = models.CharField(max_length=200)
    title = models.CharField(max_length=200)
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="offers",
    )
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    old_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    image = models.ImageField(upload_to='offers/')
    image_2 = models.ImageField(upload_to='offers/', null=True, blank=True)
    image_3 = models.ImageField(upload_to='offers/', null=True, blank=True)
    image_4 = models.ImageField(upload_to='offers/', null=True, blank=True)
    image_5 = models.ImageField(upload_to='offers/', null=True, blank=True)

    price_details = models.TextField(null=True, blank=True)
    specs = models.TextField(null=True, blank=True)
    features = models.TextField(null=True, blank=True)
    stock = models.PositiveIntegerField(default=0)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class OfferReview(models.Model):
    offer = models.ForeignKey(Offer, on_delete=models.CASCADE, related_name='reviews')
    name = models.CharField(max_length=100)
    email = models.EmailField()
    rating = models.IntegerField()
    comment = models.TextField()
    approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review for {self.offer.title} by {self.name}"

from django.db import models


class NewArrival(models.Model):
    title = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    image = models.ImageField(upload_to='new_arrivals/')
    image_2 = models.ImageField(upload_to='new_arrivals/', null=True, blank=True)
    image_3 = models.ImageField(upload_to='new_arrivals/', null=True, blank=True)
    image_4 = models.ImageField(upload_to='new_arrivals/', null=True, blank=True)
    image_5 = models.ImageField(upload_to='new_arrivals/', null=True, blank=True)

    price_details = models.TextField(null=True, blank=True)
    specs = models.TextField(null=True, blank=True)
    features = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

from django.db import models
import random

def generate_tracking_number():
    while True:
        number = str(random.randint(100000, 999999))

        if not Order.objects.filter(tracking_number=number).exists():
            return number

class Order(models.Model):
    ORDER_STATUS_CHOICES = [
        ('pending', 'لم يتم التأكيد'),
        ('confirmed', 'تم التأكيد'),
        ('in_transit', 'في الطريق'),
        ('delivered', 'تم التسليم'),
    ]

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)

    governorate = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    building_number = models.CharField(max_length=50, blank=True, null=True)

    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    products_count = models.PositiveIntegerField()

    status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default='pending')
    tracking_number = models.CharField(
        max_length=6,
        unique=True,
        editable=False,
        db_index=True,
    )
    stock_deducted = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Order #{self.id} - {self.first_name} {self.last_name}"

    def save(self, *args, **kwargs):
        if not self.tracking_number:
            self.tracking_number = generate_tracking_number()

        super().save(*args, **kwargs)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product_id = models.PositiveIntegerField()
    product_name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.product_name} x {self.quantity}"

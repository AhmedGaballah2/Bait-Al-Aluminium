from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    old_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    # Main and side images
    image = models.ImageField(upload_to='products/')
    image_2 = models.ImageField(upload_to='products/', null=True, blank=True)
    image_3 = models.ImageField(upload_to='products/', null=True, blank=True)
    image_4 = models.ImageField(upload_to='products/', null=True, blank=True)
    image_5 = models.ImageField(upload_to='products/', null=True, blank=True)

    # New properties
    more_details = models.TextField(null=True, blank=True)
    specs = models.TextField(null=True, blank=True)
    features = models.TextField(null=True, blank=True)

    stock = models.PositiveIntegerField(default=0)

    category = models.ForeignKey(
        "products.Category",
        on_delete=models.CASCADE,
        related_name="products",
        null=True,
        blank=True
    )

    is_new = models.BooleanField(default=False)

    added_at = models.DateTimeField(auto_now_add=True)

    @property
    def discount(self):
        if self.old_price and self.old_price > self.price:
            return round(
                ((self.old_price - self.price) / self.old_price) * 100
            )
        return 0

    def __str__(self):
        return self.name

class Offer(models.Model):
    subTitle = models.CharField(max_length=200)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    old_price = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    
    # Main and side images
    image = models.ImageField(upload_to='offers/')
    image_2 = models.ImageField(upload_to='offers/', null=True, blank=True)
    image_3 = models.ImageField(upload_to='offers/', null=True, blank=True)
    image_4 = models.ImageField(upload_to='offers/', null=True, blank=True)
    image_5 = models.ImageField(upload_to='offers/', null=True, blank=True)
    
    # New properties
    price_details = models.TextField(null=True, blank=True)
    specs = models.TextField(null=True, blank=True)
    features = models.TextField(null=True, blank=True)
    stock = models.PositiveIntegerField(default=0)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class OfferReview(models.Model):
    offer = models.ForeignKey(
        Offer,
        on_delete=models.CASCADE,
        related_name="reviews"
    )
    name = models.CharField(max_length=100)
    email = models.EmailField()
    rating = models.IntegerField()
    comment = models.TextField()
    approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review for {self.offer.title} by {self.name}"

class NewArrival(models.Model):
    title = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Main and side images
    image = models.ImageField(upload_to='new_arrivals/')
    image_2 = models.ImageField(upload_to='new_arrivals/', null=True, blank=True)
    image_3 = models.ImageField(upload_to='new_arrivals/', null=True, blank=True)
    image_4 = models.ImageField(upload_to='new_arrivals/', null=True, blank=True)
    image_5 = models.ImageField(upload_to='new_arrivals/', null=True, blank=True)
    
    # New properties
    price_details = models.TextField(null=True, blank=True)
    specs = models.TextField(null=True, blank=True)
    features = models.TextField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)


    def __str__(self):
        return self.title

class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="reviews")
    name = models.CharField(max_length=100)
    email = models.EmailField()
    rating = models.IntegerField()
    comment = models.TextField()
    approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


class Order(models.Model):
    ORDER_STATUS_CHOICES = [
        ('pending', 'لم يتم التأكيد'),
        ('confirmed', 'تم التأكيد'),
        ('in_transit', 'في الطريق'),
        ('delivered', 'تم التسليم'),
    ]
    
    # Customer Information
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    
    # Shipping Address
    governorate = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    building_number = models.CharField(max_length=50, blank=True, null=True)
    
    # Order Details
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    products_count = models.PositiveIntegerField()
    
    # Status
    status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default='pending')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Notes
    notes = models.TextField(blank=True, null=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Order #{self.id} - {self.first_name} {self.last_name}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product_id = models.PositiveIntegerField()  # Store product ID for reference
    product_name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    
    def __str__(self):
        return f"{self.product_name} x {self.quantity}"
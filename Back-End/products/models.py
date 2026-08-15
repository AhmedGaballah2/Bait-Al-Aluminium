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
        on_delete=models.SET_NULL,
        related_name="products",
        null=True,
        blank=True
    )

    is_new = models.BooleanField(default=False)

    is_featured_new_arrival = models.BooleanField(
        default=False,
        help_text="المنتج المميز اللي يظهر في قسم New Arrivals - منتج واحد بس ينفع يكون True"
    )

    added_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.is_featured_new_arrival:
            Product.objects.exclude(pk=self.pk).filter(
                is_featured_new_arrival=True
            ).update(is_featured_new_arrival=False)
        super().save(*args, **kwargs)

    @property
    def discount(self):
        if self.old_price and self.old_price > self.price:
            return round(
                ((self.old_price - self.price) / self.old_price) * 100
            )
        return 0

    def __str__(self):
        return self.name


class ProductSize(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='sizes'
    )
    name = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('product', 'name')
        ordering = ['name']

    def __str__(self):
        return f"{self.product.name} - {self.name}"


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



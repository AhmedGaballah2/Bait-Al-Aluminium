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

    image = models.ImageField(upload_to='products/')
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
    image = models.ImageField(upload_to='offers/')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class NewArrival(models.Model):
    title = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='new_arrivals/')
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
    created_at = models.DateTimeField(auto_now_add=True)
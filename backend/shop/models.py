from django.db import models


class Product(models.Model):
    MEN = "men"
    WOMEN = "women"

    CATEGORY_CHOICES = [
        (MEN, "Men"),
        (WOMEN, "Women"),
    ]

    name = models.CharField(max_length=200)
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    description = models.TextField(blank=True)
    image_url = models.URLField(blank=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["category", "name"]

    def __str__(self) -> str:
        return f"{self.name} ({self.category})"


class Order(models.Model):
    STATUS_PLACED = "placed"
    STATUS_CANCELLED = "cancelled"

    STATUS_CHOICES = [
        (STATUS_PLACED, "Placed"),
        (STATUS_CANCELLED, "Cancelled"),
    ]

    created_at = models.DateTimeField(auto_now_add=True)

    customer_name = models.CharField(max_length=200)
    customer_email = models.EmailField()

    address_line1 = models.CharField(max_length=250)
    address_line2 = models.CharField(max_length=250, blank=True)
    city = models.CharField(max_length=120)
    state = models.CharField(max_length=120, blank=True)
    postal_code = models.CharField(max_length=30, blank=True)
    country = models.CharField(max_length=120, blank=True)

    # Cart lines in the shape: [{"product_id": 1, "quantity": 2}, ...]
    items = models.JSONField()

    subtotal_amount = models.DecimalField(max_digits=12, decimal_places=2)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PLACED)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"Order #{self.id} ({self.status})"

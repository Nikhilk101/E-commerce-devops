from decimal import Decimal

from django.core.management.base import BaseCommand

from shop.models import Product


class Command(BaseCommand):
    help = "Seed initial men/women T-shirt products."

    def handle(self, *args, **options):
        products = [
            # Men
            {
                "name": "Classic Men Tee",
                "category": Product.MEN,
                "price": Decimal("19.99"),
                "description": "Everyday comfort t-shirt for daily wear.",
            },
            {
                "name": "Slim Fit Men Tee",
                "category": Product.MEN,
                "price": Decimal("24.99"),
                "description": "A tailored slim fit with soft breathable fabric.",
            },
            {
                "name": "Graphic Men Tee",
                "category": Product.MEN,
                "price": Decimal("29.99"),
                "description": "Bold graphic print with premium cotton.",
            },
            # Women
            {
                "name": "Essential Women Tee",
                "category": Product.WOMEN,
                "price": Decimal("19.99"),
                "description": "An essential tee with a flattering drape.",
            },
            {
                "name": "Soft Touch Women Tee",
                "category": Product.WOMEN,
                "price": Decimal("24.99"),
                "description": "Ultra-soft feel for all-day comfort.",
            },
            {
                "name": "Minimal Women Tee",
                "category": Product.WOMEN,
                "price": Decimal("27.99"),
                "description": "Clean and minimal style for effortless outfits.",
            },
        ]

        created = 0
        updated = 0
        for p in products:
            obj, was_created = Product.objects.update_or_create(
                name=p["name"],
                category=p["category"],
                defaults={
                    "price": p["price"],
                    "description": p.get("description", ""),
                    "image_url": "",
                    "is_active": True,
                },
            )
            if was_created:
                created += 1
            else:
                updated += 1

        self.stdout.write(self.style.SUCCESS(f"Seeded products. Created={created} Updated={updated}"))


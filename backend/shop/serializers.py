from decimal import Decimal

from rest_framework import serializers

from .models import Order, Product


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "name", "category", "price", "description", "image_url"]


class CheckoutItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class CheckoutSerializer(serializers.Serializer):
    items = CheckoutItemSerializer(many=True)

    customer_name = serializers.CharField(max_length=200)
    customer_email = serializers.EmailField()

    address_line1 = serializers.CharField(max_length=250)
    address_line2 = serializers.CharField(max_length=250, allow_blank=True, required=False)
    city = serializers.CharField(max_length=120)
    state = serializers.CharField(max_length=120, allow_blank=True, required=False)
    postal_code = serializers.CharField(max_length=30, allow_blank=True, required=False)
    country = serializers.CharField(max_length=120, allow_blank=True, required=False)

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("Cart cannot be empty.")
        return value

    def validate(self, attrs):
        # Normalize optional address fields so we always have keys.
        attrs.setdefault("address_line2", "")
        attrs.setdefault("state", "")
        attrs.setdefault("postal_code", "")
        attrs.setdefault("country", "")
        return attrs


class OrderConfirmationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ["id", "status", "created_at", "total_amount"]


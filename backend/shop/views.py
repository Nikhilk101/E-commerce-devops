from decimal import Decimal

from django.db.models import Q
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Order, Product
from .serializers import (
    CheckoutSerializer,
    OrderConfirmationSerializer,
    ProductSerializer,
)


class ProductListAPIView(APIView):
    """
    GET /api/products/?category=men|women
    GET /api/products/?ids=1,2,3
    """

    def get(self, request):
        category = request.query_params.get("category")
        ids_param = request.query_params.get("ids")

        qs = Product.objects.filter(is_active=True)
        if category in {Product.MEN, Product.WOMEN}:
            qs = qs.filter(category=category)

        if ids_param:
            try:
                ids = [int(x) for x in ids_param.split(",") if x.strip()]
            except ValueError:
                return Response(
                    {"detail": "Invalid ids parameter."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if ids:
                qs = qs.filter(Q(id__in=ids))

        return Response(ProductSerializer(qs, many=True).data)


class CheckoutAPIView(APIView):
    """
    POST /api/checkout/
    Creates a mock order (no real payment integration).
    """

    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        items = data["items"]
        product_ids = [item["product_id"] for item in items]

        products_by_id = {
            p.id: p
            for p in Product.objects.filter(id__in=product_ids, is_active=True)
        }
        missing = sorted(set(product_ids) - set(products_by_id.keys()))
        if missing:
            return Response(
                {"detail": "One or more products do not exist."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        subtotal = Decimal("0.00")
        normalized_items = []
        for item in items:
            product = products_by_id[item["product_id"]]
            qty = item["quantity"]
            subtotal += product.price * Decimal(qty)
            normalized_items.append({"product_id": product.id, "quantity": qty})

        subtotal = subtotal.quantize(Decimal("0.01"))

        order = Order.objects.create(
            customer_name=data["customer_name"],
            customer_email=data["customer_email"],
            address_line1=data["address_line1"],
            address_line2=data.get("address_line2", "") or "",
            city=data["city"],
            state=data.get("state", "") or "",
            postal_code=data.get("postal_code", "") or "",
            country=data.get("country", "") or "",
            items=normalized_items,
            subtotal_amount=subtotal,
            total_amount=subtotal,
            status=Order.STATUS_PLACED,
        )

        out = OrderConfirmationSerializer(order).data
        # Frontend-friendly keys.
        out["order_id"] = order.id
        return Response(out, status=status.HTTP_201_CREATED)

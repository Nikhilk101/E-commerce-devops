from django.urls import path

from .views import CheckoutAPIView, ProductListAPIView


urlpatterns = [
    path("products/", ProductListAPIView.as_view(), name="product-list"),
    path("checkout/", CheckoutAPIView.as_view(), name="checkout"),
]


from django.urls import path
from .views import addSales, getSales

urlpatterns = [
  path("api/get_sales", getSales, name="getSales_api"),
  path("api/post_sales", addSales, name="postSales_api")
]

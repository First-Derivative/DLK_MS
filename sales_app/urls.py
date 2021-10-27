from django.urls import path
from .views import addSales, getSales

urlpatterns = [
  path("api/get_sales", getSales, name="getSales_api")
]

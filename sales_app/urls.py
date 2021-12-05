from django.urls import path
from .views import *

urlpatterns = [
  path("", salesPage, name="sales"),
  path("api/get_sales", getSales, name="getSales_api"),
  path("api/post_sales", addSales, name="postSales_api"),
  path("api/edit_sales", editSale, name="editSales_api"),
  path('api/get', getSale, name="getSale_api"),
  path('api/search', searchAPI.as_view(), name="searchSales_api")
]

from django.urls import path
from .views import *

urlpatterns = [
  path("", salesPage, name="sales"),
  path("api/get_sales", getAllSales, name="getAllSales_API"),
  path("api/post/new", postNewSales, name="postNewSales_API"),
  path("api/post/edit", postEditSales, name="postEditSaless_API"),
  path('api/get', getSale, name="getSale_API"),
  path('api/search', searchAPI.as_view(), name="searchSales_API")
]

from django.urls import path
from .views import *

urlpatterns = [
  path("", purchasesPage, name="purchases"),
  path("api/getAll", getAllPurchases, name="getAllPurchases_API"),
  path("api/serach", searchAPI.as_view(), name="searchPurchases_API"),
  path("api/post/new", postNewPurchases, name="postNewPurchases_API")
]
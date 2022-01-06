from django.urls import path
from .views import *

urlpatterns = [
  path("", purchasesPage, name="purchases"),
  path("api/getAll", getAllPurchases, name="getAllPurchases_API")
]
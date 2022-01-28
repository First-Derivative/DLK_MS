from django.urls import path
from .views import *

urlpatterns = [
  path('', getAccountsPage, name='accounts'),
  path('api/get/all', getAllPayments, name="getAllPayments_API")
]
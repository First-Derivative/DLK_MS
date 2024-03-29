from django.urls import path
from .views import *

urlpatterns = [
  path('', getAccountsPage, name='accounts'),
  path('api/get/all', getAllPayments, name="getAllPayments_API"),
  path('api/post/new', postNewPayment, name="postNewPayments_API"),
  path('api/post/edit', postEditPayments, name="postEditPayments_API"),
  path('api/search', searchAPI.as_view(), name="searchPayments_API")
]
from django.urls import path
from .views import *

urlpatterns = [
  path("", shippingPage, name="shipping"),
  path("api/getAll", getAllShipping, name="getAllShipping_API"),
  path('api/search', searchAPI.as_view(), name="searchShipping_API"),
  path('api/post/new', postNewShipping, name="postNewShipping_API"),
  path('api/post/edit', postEditShipping, name="postEditShipping_API")
]
from django.urls import path
from .views import * 

urlpatterns = [
  path("", operationsPage, name="operations"),
  path("api/getAll", getAllOperations, name="getAllOperations_API")
]
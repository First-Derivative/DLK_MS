from django.urls import path
from .views import * 

urlpatterns = [
  path("", operationsPage, name="operations"),
  path("api/getAll", getAllOperations, name="getAllOperations_API"),
  path("api/search", searchAPI.as_view(), name="searchOperations_API"),
  path("api/post/new", addOperations, name="postNewOperations_API")
]
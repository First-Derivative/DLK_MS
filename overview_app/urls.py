from django.urls import path
from .views import *

urlpatterns = [
  path('api/post/', postReport, name="postNewReport_API")
]
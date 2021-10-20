from django.urls import path
from .views import *

urlpatterns = [
  path('login/', userLogin, name="login"),
  path('logout/', userLogout, name="logout"),
]
from django.urls import path
from .views import *

urlpatterns = [
  path('login/', userLogin, name="user_login"),
  path('logout/', userLogout, name="user_logout"),
  path('register', userRegister, name="user_register")
]
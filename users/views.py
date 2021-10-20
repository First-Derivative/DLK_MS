from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.http.response import HttpResponse
from ms_app.decorators import unauth_user

def userLogin(request):
  if(request.user.is_authenticated):
    return HttpResponse("You're already logged in")
  if(request.method == "GET"):
    return render(request, "users/login.html", {})
  
def userLogout(request):
  logout(request)
  return HttpResponse("User Logout")

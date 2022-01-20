# Django imports
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.http.response import HttpResponse

# Local library imports
from ms_app.decorators import unauthenticated_check, method_check
from .forms import *

@method_check(allowed_methods=["GET","POST"])
def userLogin(request):
  context = {}
  if(request.user.is_authenticated):
    return redirect("home")
    
  if(request.method == "POST"):
    form = LoginForm(request.POST)

    if(form.is_valid()):
      email = request.POST["email"]  
      password = request.POST["password"]
      
      user = authenticate(email=email, password=password)
      if(user):
        login(request, user)
        return redirect("home")
    else:
      messages.info(request, "Incorrect Credentials")
      return redirect("user_login")
  else:
      context["login_form"] = LoginForm()
  return render(request, "users_app/login.html", context)
  
def userLogout(request):
  logout(request)
  return redirect("user_login")

@method_check(allowed_methods=["GET", "POST"])
def userRegister(request):
  context = {}
  
  if(request.user.is_authenticated):
    return redirect("home") # logged in users redirected
  
  if(request.method == "POST"):
    
    form = RegisterForm(request.POST)
    if(form.is_valid()):
      
      #Validating form and data using DjangoValidation
      user = form.save()
      email = form.cleaned_data.get("email")
      raw_password = form.cleaned_data.get("password1")
  
      #Attempt login
      login(request, user)
      return redirect("home")

    else:
      context["register_form"] = form
  
  # Reached if request is not POST (GET)
  else:
    context["register_form"] = RegisterForm()

  return render(request, "users_app/register.html", context)
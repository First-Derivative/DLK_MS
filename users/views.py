# Django imports
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.http.response import HttpResponse

# Local library imports
from ms_app.decorators import unauthenticated_check, method_check
from .forms import LoginForm

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
  return render(request, "users/login.html", context)
  
def userLogout(request):
  logout(request)
  return HttpResponse("User Logout")

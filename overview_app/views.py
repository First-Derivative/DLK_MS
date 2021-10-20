from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseBadRequest
from ms_app.decorators import unauth_user

def homepage(request):
  if(request.method == "GET"):
    return HttpResponse("homepage")
  else:
    return HttpResponseBadRequest("Invalid Request")

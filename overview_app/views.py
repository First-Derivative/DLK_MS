from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseBadRequest
from ms_app.decorators import unauthenticated_check

@unauthenticated_check
def homepage(request):
  if(request.method == "GET"):
    return HttpResponse("homepage")
  else:
    return HttpResponseBadRequest("Invalid Request")

from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseBadRequest
from ms_app.decorators import unauthenticated_check

@unauthenticated_check
def homepage(request):
  if(request.method == "GET"):
    print("stupid fucking homepage view")
    return render(request, "overview_app/overview.html", {})
  else:
    return HttpResponseBadRequest("Invalid Request")

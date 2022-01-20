from django.core.exceptions import ValidationError
from django.shortcuts import render
from rest_framework.response import Response
from django.http import HttpResponse, HttpResponseBadRequest
from .models import *
from ms_app.decorators import *
from rest_framework.decorators import api_view

@unauthenticated_check
def homepage(request):
  if(request.method == "GET"):
    return render(request, "overview_app/overview.html", {})
  else:
    return HttpResponseBadRequest("Invalid Request")

@method_check(allowed_methods=["POST"])
@unauthenticated_check
@api_view(['POST'])
def postReport(request):
  post = request.POST

  try:
    title = post["title"]
    report = Report.objects.get(title=title)
    return Response(status=400, data={"duplicate_report":"report with {} already exists".format(title)})
  
  # Duplicate Not Found -> Create Report
  except Report.DoesNotExist as e:
    try:
      title = post["title"]
      type = resolveReport(post["type"])
      body = post["body"]
      location = post["location"]
  
      new_report = Report(title=title, type=type, body=body, location=location)
      new_report.full_clean()
      new_report.save()
      return Response(status=200)
    except Exception as ex:
      return Response(status=400, data=dict(ex))



from django.core.exceptions import ValidationError
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import generics, filters
from .models import Operations
from .serializers import OperationsSerializer
from ms_app.decorators import *

# Operations App Frontend
@unauthenticated_check
def operationsPage(request):
  return render(request, "operations_app/operations.html", {})

# GET (Search) Operations
class searchAPI(generics.ListCreateAPIView):
  search_fields = ['project_code', 'project_name', 'client_name']
  filter_backends = (filters.SearchFilter,)
  queryset = Operations.objects.all()
  serializer_class = OperationsSerializer

# GET All Operations
@method_check(allowed_methods=["GET"])
@unauthenticated_check
def getAllOperations(request):
  operations = Operations.objects.all()
  serial = []
  for operation in operations:
    serial.append(OperationsSerializer(operation).data)

  return JsonResponse({"operations":serial})

# POST New Operations
@method_check(allowed_methods=["POST"])
@role_check(allowed_roles="operations")
def postNewOperations(request):
  post = request.POST

  # Validate postdata for duplication 
  try:
    operations = Operations.objects.get(project_code=post["data[project_code]"])
    return JsonResponse({"error":{"duplicate_project_code":"Operations order with that shipping code already exists, please check for duplicate records"}})

  # No Duplicate Found-> Create new Object
  except Operations.DoesNotExist:
    # format true/false from checkbox value
    cancelled = True if post["data[cancelled]"] == 'true' else False
    
    # Instantiate New Operations from Post Data
    new_operations = Operations(project_code=post["data[project_code]"], project_name=post["data[project_name]"], client_name=post["data[client_name]"], status=post["data[status]"], finish_detail=post["data[finish_detail]"], cancelled=cancelled)
    print(new_operations)
    try:
      new_operations.full_clean()
    except ValidationError as e:
      return JsonResponse({"error":dict(e)})
    
    new_operations.save()
    return JsonResponse({"status":"OK"})

# POST Edit Operation
@method_check(allowed_methods=["POST"])
@role_check(allowed_roles="operations")
def postEditOperations(request):
  post = request.POST
  project_code = post["data[project_code]"]
  project_name = post["data[project_name]"]
  client_name = post["data[client_name]"] 
  status = post["data[status]"]
  finish_detail = post["data[finish_detail]"]
  cancelled  = True if post["data[cancelled]"] else False

  try:
    new_operations = Operations(project_code=project_code)
    
    try:
      new_operations.project_code=project_code,
      new_operations.project_name=project_name
      new_operations.client_name=client_name
      new_operations.status=status
      new_operations.finish_detail=finish_detail
      new_operations.cancelled=cancelled

      new_operations.full_clean()
      
      new_operations.save()
    except ValidationError as e:

      return JsonResponse({"error":dict(e)})

  except Operations.DoesNotExist:
    return JsonResponse({"error":{"operations_does_not_exist":"Operation not found. Bad Edit"}})

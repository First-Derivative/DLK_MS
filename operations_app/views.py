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


# @method_check(allowed_methods=["GET"])
# @unauthenticated_check
# def getOperations(request):
#   unserialized_operations = Operations.objects.all()
#   operations = []
#   for operation in unserialized_operations:
#     operations.append(OperationsSerializer(operation).data)
  
#   return JsonResponse({"operations":operations})

@method_check(allowed_methods=["GET"])
@unauthenticated_check
def getAllOperations(request):
  operations = Operations.objects.all()
  serial = []
  for operation in operations:
    serial.append(OperationsSerializer(operation).data)

  return JsonResponse({"operations":serial})

@method_check(allowed_methods=["POST"])
@role_check(allowed_roles=["opreations"])
def addOperations(request):
  post = request.POST

  # Validate postdata for duplication 
  try:
    shipping = Operations.objects.get(project_code=post["data[project_code]"])
    return JsonResponse({"error":"Operations order with that shipping code already exists, please check for duplicate records"})
  # No Duplicate Found-> Create new Object
  except Operations.DoesNotExist:
    project_code = post["data[project_code]"]
    project_name = post["data[project_name]"]
    client_name = post["data[client_name]"]
    status = post["data[status]"]
    finish_detail = post["data[finish_detail]"]

    # Instantiate and save new Shipping object on DB
    new_operations = Operations(project_code=project_code, project_name=project_name, client_name=client_name, status=status, finish_detail=finish_detail, cancelled=False)
    #end of user-flow for succesful request: return status OK
    return JsonResponse({"status":"OK"})


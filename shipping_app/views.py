from django.core.exceptions import ValidationError
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from rest_framework import generics, filters
from ms_app.decorators import *
from .models import Shipping
from .serializers import ShippingSerializer

# GET Shipping Page
@unauthenticated_check
def shippingPage(request):
  return render(request, "shipping_app/shipping.html", {})

# GET (Search) Shipping
class searchAPI(generics.ListCreateAPIView):
  search_fields = ['project_code', 'project_name', 'client_name']
  filter_backends = (filters.SearchFilter,)
  queryset = Shipping.objects.all()
  serializer_class = ShippingSerializer

# GET (ALL) Shipping 
@method_check(allowed_methods=["GET"])
@unauthenticated_check
def getAllShipping(request):
  shipping = Shipping.objects.all()
  serial = []
  for operation in shipping:
    serial.append(ShippingSerializer(operation).data)

  return JsonResponse({"shipping":serial})

# POST Shipping
@method_check(allowed_methods=["POST"])
@role_check(allowed_roles="shipping")
def postNewShipping(request):
  post = request.POST
  print(post)
  # Validate postdata for duplication 
  try:
    shipping = Shipping.objects.get(project_code=post["data[project_code]"])
    return JsonResponse({"error":{"duplicate_project_code":"Shipping order with that shipping code already exists, please check for duplicate records"}})
  
  # No Duplicate Found-> Create new Object
  except Shipping.DoesNotExist:
    cancelled = True if post["data[cancelled]"] == "true" else False
    completed = True if post["data[completed]"] == "true" else False

    # Instantiate New Shipping from Post data
    new_shipping = Shipping(project_code=post["data[project_code]"], project_name=post["data[project_name]"], client_name=post["data[client_name]"], germany=post["data[germany]"], customer=post["data[customer]"], charges=post["data[charges]"], remarks=post["data[remarks]"], cancelled=cancelled, completed=completed)
    try:
      new_shipping.full_clean()
    except ValidationError as e:
      return JsonResponse({"error":dict(e)})
    new_shipping.save()
    return JsonResponse({"status":"OK"})

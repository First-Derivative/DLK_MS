from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from ms_app.decorators import *
from .models import Shipping
from .serializers import ShippingSerializer

@unauthenticated_check
def shippingPage(request):
  return render(request, "shipping_app/shipping.html", {})

@method_check(allowed_methods=["GET"])
@unauthenticated_check
def getShipping(request):
  unserialized_shipping = Shipping.objects.all()
  shipping = []
  for shipment in unserialized_shipping:
    print(shipment)
    # shipping.append(serializeShipping(shipment))
  return JsonResponse({"shipping":shipping})

@method_check(allowed_methods=["GET"])
@unauthenticated_check
def getAllShipping(request):
  shipping = Shipping.objects.all()
  serial = []
  for operation in shipping:
    serial.append(ShippingSerializer(operation).data)

  return JsonResponse({"shipping":serial})

@method_check(allowed_methods=["POST"])
@role_check(allowed_roles=["shipping"])
def addShipping(request):
  post = request.POST

  # Validate postdata for duplication 
  try:
    shipping = Shipping.objects.get(project_code=post["data[project_code]"])
    return JsonResponse({"error":"Shipping order with that shipping code already exists, please check for duplicate records"})
  # No Duplicate Found-> Create new Object
  except Shipping.DoesNotExist:
    project_code = post["data[project_code]"]
    project_name = post["data[project_name]"]
    client_name = post["data[client_name]"]
    customer = post["data[customer]"]
    status = post["data[status]"]
    remark = post["data[remark]"]

    # Instantiate and save new Shipping object on DB
    new_shipping = Shipping(project_code=project_code, project_name=project_name, client_name=client_name, customer=customer, status=status, remark=remark, cancelled=False)
    #end of user-flow for succesful request: return status OK
    return JsonResponse({"status":"OK"})

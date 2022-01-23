from django.shortcuts import render
from django.http import JsonResponse, HttpResponseBadRequest
from ms_app.decorators import *
from .models import Sales
from ms_app.models import Currency, resolveCurrencyLabel
from django.core.exceptions import ValidationError
from rest_framework import generics, filters
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import SalesSerializer

# REST GET SALE API
# @unauthenticated_check
@api_view(['GET'])
def getSale(request):
  project_code = request.query_params.get('project_code', None)

  if(project_code):
    sale = None
    try:
      sale = Sales.objects.get(project_code=project_code)
      sale_serialized = SalesSerializer(sale)
      return Response(sale_serialized.data) 
    except Sales.DoesNotExist as e:
      return JsonResponse({"error": {"not_found": "This is not the sale you're looking for"}})
      
  return Response({})
    
# REST SEARCH API
class searchAPI(generics.ListCreateAPIView):
  search_fields = ['project_code', 'project_name', 'client_name']
  filter_backends = (filters.SearchFilter,)
  queryset = Sales.objects.all()
  serializer_class = SalesSerializer

# GET SALES FRONTEND
@unauthenticated_check
@method_check(allowed_methods=["GET"])
def salesPage(request):
  return render(request, "sales_app/sales.html",  {})

# Get All Sales
@unauthenticated_check
@method_check(allowed_methods=["GET"])
def getAllSales(request):
    unserialized_sales = Sales.objects.all()
    sales = []
    for sale in unserialized_sales:
      sales.append(SalesSerializer(sale).data)

    return JsonResponse({"sales":sales})

# ADD NEW SALE
#@unauthenticated_check 
@method_check(allowed_methods=["POST"])
@role_check(allowed_roles="sales")
def addSales(request):
  post = request.POST
  
  # Validate postdata for duplication 
  try:
    sale = Sales.objects.get(project_code=post["data[project_code]"])
    return JsonResponse({"error": {"duplication_error": "Sale with that project code already exists, please check for duplicate records"}})
  # No Duplicate Found-> Create new Object
  except Sales.DoesNotExist:
    project_code = post["data[project_code]"]
    project_name = post["data[project_name]"]
    client_name = post["data[client_name]"]
    project_detail = post["data[project_detail]"]
    value = post["data[value]"]
    order_date = post["data[order_date]"]
    shipping_date = post["data[shipping_date]"]
    payment_term = post["data[payment_term]"]
    currency = post["data[currency]"] 
    cancelled = True if post["data[cancelled]"] == 'true' else False
    
    #Double check that this logic works for view
    for choice in Currency:
      if choice.label == currency:
        currency = choice
        break
    
    #Instantiate and save new Sale object on DB
    new_sale = Sales(project_code=project_code, project_name=project_name, client_name=client_name, project_detail=project_detail, value=value, currency=currency, order_date=order_date, shipping_date=shipping_date, payment_term=payment_term, cancelled=cancelled)
    try:
      new_sale.full_clean()
    except ValidationError as e:
      return JsonResponse({"error": dict(e)})

    #end of user-flow for succesful request: return status OK
    new_sale.save()
    return JsonResponse({"status":"OK"}) #consider sending new_sale back if necessary instead of status:OK

# EDIT SALE
#@unauthenticated_check 
@method_check(allowed_methods=["POST"])
@role_check(allowed_roles="sales")
def editSale(request):
  post = request.POST
  
  # Validate postdata for duplication 
  try:
    
    try:

      # Creating Temp Sale before full clean
      temp_project_code = post["project_code"]
      temp_project_name = post["project_name"]
      temp_client_name = post["client_name"]
      temp_project_detail = post["project_detail"]
      temp_value = post["value"]
      temp_order_date = post["order_date"]
      temp_shipping_date = post["shipping_date"]
      temp_payment_term = post["payment_term"]
      temp_currency = post["currency"] 
      temp_cancelled = True if (post["cancelled"] == "true") else False
      temp_completed = True if (post["completed"] == "true") else False

      for choice in Currency:
        if choice.label == temp_currency:
          temp_currency = choice
          break
      
      temp_sale = Sales(project_code=temp_project_code, project_name=temp_project_name, client_name=temp_client_name, project_detail=temp_project_detail, value=temp_value, currency=temp_currency, order_date=temp_order_date, shipping_date=temp_shipping_date, payment_term=temp_payment_term, cancelled=temp_cancelled, completed=temp_completed)
      temp_sale.full_clean()

    except ValidationError as e:
      return JsonResponse({"error": dict(e)})


    sale = Sales.objects.get(project_code=post["project_code"])
    project_code = temp_project_code
    project_name = temp_project_name
    client_name = temp_client_name
    project_detail = temp_project_detail
    value = temp_value
    currency = temp_currency
    order_date = temp_order_date
    shipping_date = temp_shipping_date
    payment_term = temp_payment_term
    cancelled = temp_cancelled
    completed = temp_completed
    print("nominal values are {a}, {b}".format(a=cancelled, b=completed))
    
    sale.project_code = project_code
    sale.project_name = project_name
    sale.client_name = client_name
    sale.project_detail = project_detail
    sale.value = value
    sale.currency = currency
    sale.order_date = order_date
    sale.shipping_date = shipping_date
    sale.payment_term = payment_term
    sale.cancelled = cancelled
    sale.completed = completed

    sale.save()
    return JsonResponse({"status":"OK"})

  except Sales.DoesNotExist:
    # Sale not found-> Return error
    return JsonResponse({"error": {"sale_does_not_exist": "Sale with that project code does not exist. Your request has been flagged as suspicious"}})

    
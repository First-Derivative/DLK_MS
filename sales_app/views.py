from django.shortcuts import render
from django.http import JsonResponse
from ms_app.decorators import *
from .models import Sales
from ms_app.models import Currency, resolveCurrency
from django.core.exceptions import ValidationError
from rest_framework import generics, filters
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import SalesSerializer

# REST GET SALE API
@unauthenticated_check
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
  search_fields = ['project_code', 'project_name', 'client_name', 'project_detail', 'currency', 'order_date', 'shipping_date', 'payment_term']
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

# postNewSale
@unauthenticated_check 
@method_check(allowed_methods=["POST"])
@role_check(allowed_roles="sales")
@api_view(['POST'])
def postNewSales(request):
  post = request.POST
  
  # Validate postdata for duplication 
  try:
    sale = Sales.objects.get(project_code=post["data[project_code]"])
    return Response(status=400, data={"duplication_error": "Sale with that project code already exists, please check for duplicate records"})
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
    currency = resolveCurrency(post["data[currency]"] )
    cancelled = True if post["data[cancelled]"] == 'true' else False
    completed = True if post["data[completed]"] == 'true' else False
    
    #Instantiate and save new Sale object on DB
    new_sales = Sales(project_code=project_code, project_name=project_name, client_name=client_name, project_detail=project_detail, value=value, currency=currency, order_date=order_date, shipping_date=shipping_date, payment_term=payment_term, cancelled=cancelled, completed=completed)
    try:
      new_sales.full_clean()
    except ValidationError as e:
      return Response(status=400, data=dict(e))

    #end of user-flow for succesful request: return new_sales
    new_sales.save()
    return JsonResponse({"new_sales":SalesSerializer(new_sales).data}) 

# EDIT SALE
@unauthenticated_check 
@method_check(allowed_methods=["POST"])
@role_check(allowed_roles="sales")
@api_view(['POST'])
def postEditSales(request):
  post = request.POST

  project_code = post["project_code"]
  project_name = post["project_name"]
  client_name = post["client_name"]
  project_detail = post["project_detail"]
  value = post["value"]
  order_date = post["order_date"]
  shipping_date = post["shipping_date"]
  payment_term = post["payment_term"]
  currency = post["currency"] 
  cancelled = True if ("cancelled" in post) else False
  completed = True if ("completed" in post) else False

  # Validate postdata for duplication 
  try:
    sales = Sales.objects.get(project_code=post["project_code"])
    
    try:
      sales.project_code = project_code
      sales.project_name = project_name
      sales.client_name = client_name
      sales.project_detail = project_detail
      sales.value = value
      sales.currency = currency
      sales.order_date = order_date
      sales.shipping_date = shipping_date
      sales.payment_term = payment_term
      sales.cancelled = cancelled
      sales.completed = completed
      sales.full_clean()

    except ValidationError as e:
      return Response(status=400, data=dict(e))

    sales.save()
    return JsonResponse({"sales":SalesSerializer(sales).data})

  except Sales.DoesNotExist:
    # Sale not found-> Return error
    return Response(status=400, data={"sale_does_not_exist": "Sale with that project code does not exist. Your request has been flagged as suspicious"})

    
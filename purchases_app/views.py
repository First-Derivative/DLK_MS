from django.core.exceptions import ValidationError
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework import generics, filters
from rest_framework.response import Response
from ms_app.decorators import *
from ms_app.models import Currency, resolveCurrencyLabel
from .models import Purchases
from .serializers import PurchasesSerializer

# Purchases Page
@method_check(allowed_methods=["GET"])
@unauthenticated_check
def purchasesPage(request):
  return render(request, "purchases_app/purchases.html", {})

# GET (Search) Purchases
class searchAPI(generics.ListCreateAPIView):
  search_fields = ['project_code','supplier_name', "purchased_items", "po_date", "purchase_order", "expected_date", "supplier_date"]
  filter_backends = (filters.SearchFilter,)
  queryset = Purchases.objects.all()
  serializer_class = PurchasesSerializer

# Get All Purchases
def getAllPurchases(request):
  purchases = Purchases.objects.all()
  serial = []
  for purchase in purchases:
    serial.append(PurchasesSerializer(purchase).data)

  if(len(serial) != 0):
    return JsonResponse({"purchases":serial})

  return JsonResponse({"error":"database empty"})

@method_check(allowed_methods=["POST"])
@role_check(allowed_roles="purchases")
@api_view(['POST'])
def postNewPurchases(request):
  post = request.POST

  # Validate postdata for duplication 
  try:
    purchase = Purchases.objects.get(purchase_order=post["data[purchase_order]"])
    return Response(status=400, data={"duplicate_purchase_order":"Purchase with that purchase order already exists, please check for duplicate records"})
  
  # No Duplicate Found-> Create new Object
  except Purchases.DoesNotExist:

    # Formatting Data for DB
    currency = post["data[currency]"]
    for choice in Currency:
      if choice.label == currency:
        currency = choice
        break

    # Instantiate and save new Purchases object on DB
    new_purchase = Purchases(purchase_order=post["data[purchase_order]"], project_code=post["data[project_code]"], 
    po_date=post["data[po_date]"], supplier_name=post["data[supplier_name]"], purchased_items=post["data[purchased_items]"], 
    value=post["data[value]"], currency=currency, expected_date=post["data[expected_date]"], supplier_date=post["data[supplier_date]"])
    
    try: 
      new_purchase.full_clean()
    except ValidationError as e:
      return Response(status=400, data=dict(e))

    new_purchase.save()

    return JsonResponse({"new_purchases": PurchasesSerializer(new_purchase).data})


# POST Edit Purchases
@method_check(allowed_methods=["POST"])
@role_check(allowed_roles="purchases")
@api_view(['POST'])
def postEditPurchases(request):
  post = request.POST

  purchases_id = post["data[purchases_id]"]
  purchase_order = post["data[purchase_order]"]
  project_code = post["data[project_code]"]
  po_date = post["data[po_date]"]
  supplier_name = post["data[supplier_name]"]
  purchased_items = post["data[purchased_items]"]
  value = post["data[value]"]
  currency = post["data[currency]"]
  expected_date = post["data[expected_date]"]
  supplier_date = post["data[supplier_date]"]

  try:
    new_purchases = Purchases.objects.get(purchases_id=purchases_id)
    
    try:
      
      new_purchases.purchase_order=purchase_order
      new_purchases.project_code=project_code
      new_purchases.po_date=po_date
      new_purchases.supplier_name=supplier_name
      new_purchases.purchased_items=purchased_items
      new_purchases.value=value
      new_purchases.currency=currency
      new_purchases.expected_date=expected_date
      new_purchases.supplier_date=supplier_date

      new_purchases.full_clean()
      new_purchases.save()
      return JsonResponse({"purchases": PurchasesSerializer(new_purchases).data})
      
    except ValidationError as e:
      return Response(status=400, data=dict(e))

  except Purchases.DoesNotExist:
    return JsonResponse({"error":{"purchases_does_not_exist":"Purchase not found. Bad Edit"}})

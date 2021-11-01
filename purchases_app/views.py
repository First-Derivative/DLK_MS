from django.shortcuts import render
from django.http import JsonResponse
from ms_app.decorators import *
from .models import Purchases
from ms_app.models import Currency, resolveCurrencyLabel


def serializePurchase(purchase):
  serial = {}
  serial["purchase_code"] = purchase.purchase_code
  serial["project_code"] = purchase.project_code
  serial["po_date"] = purchase.po_date
  serial["supplier_name"] = purchase.supplier_name
  serial["purchased_items"] = purchase.purchased_items
  serial["value"] = purchase.value
  serial["currency"] = resolveCurrencyLabel(purchase.currency)
  serial["expected_date"] = purchase.expected_date
  serial["supplier_date"] = purchase.supplier_date
  serial["cancelled"] = purchase.cancelled

  return serial


@method_check(allowed_methods=["GET"])
@unauthenticated_check
def getPurchases(request):
  unserialized_purchases = Purchases.objects.all()
  purchases = []
  for purchase in unserialized_purchases:
    purchases.append(serializePurchase(purchase))
  
  return JsonResponse({"purchases":purchases})

@method_check(allowed_methods=["POST"])
@role_check(allowed_roles=["purchases"])
def addPurchase(request):
  post = request.post

  # Validate postdata for duplication 
  try:
    purchase = Purchases.objects.get(purchase_code=post["data[purchase_code]"])
    return JsonResponse({"error":"Purchase with that purchase code already exists, please check for duplicate records"})
  # No Duplicate Found-> Create new Object
  except Purchases.DoesNotExist:
    purchase_code = post["data[purchase_code]"]
    project_code = post["data[project_code]"]
    po_date = post["data[po_date]"]
    supplier_name = post["data[supplier_name]"]
    purchased_items = post["data[purchased_items]"]
    value = post["data[value]"]
    currency = post["data[currency]"]
    expected_date = post["data[expected_date]"]
    supplier_date = post["data[supplier_date]"]

    # Resolving Currency
    for choice in Currency:
      if choice.label == currency:
        currency = choice
        break

    # Instantiate and save new Purchases object on DB
    new_purchase = Purchases(purchase_code=purchase_code, project_code=project_code, po_date=po_date, supplier_name=supplier_name, purchased_items=purchased_items, value=value, currency=currency, expected_date=expected_date, supplier_date=supplier_date, cancelled=False)
    new_purchase.save()

    #end of user-flow for succesful request: return status OK
    return JsonResponse({"status":"OK"})

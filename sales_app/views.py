from django.shortcuts import render
from django.http import JsonResponse, HttpResponseBadRequest
from ms_app.decorators import *
from .models import Sales
from accounts_app.models import Currency, resolveCurrency

def SerializeSale(sale):
  serial = {}
  serial["project_code"] = sale.project_code
  serial["project_name"] = sale.project_name
  serial["client_name"] = sale.client_name
  serial["project_detail"] = sale.project_detail
  serial["value"] = sale.value
  serial["order_date"] = sale.order_date #.strftime('%d %B %Y') Consider this strftime format in case of error
  serial["shipping_date"] = sale.shipping_date
  serial["payment_term"] = sale.payment_term
  serial["currency"] = resolveCurrency(sale.currency)
  serial["cancelled"] = sale.cancelled

  return serial

# @unauthenticated_check
@method_check(allowed_methods=["GET"])
def getSales(request):
    unserialized_sales = Sales.objects.all()
    sales = []
    for sale in unserialized_sales:
      sales.append(SerializeSale(sale))

    return JsonResponse({"sales":sales})

#@unauthenticated_check 
@role_check(allowed_roles=["sales"])
def addSales(request):
  if(request.method == "POST"):
    post = request.post
    
    # Validate postdata for duplication 
    try:
      sale = Sales.objects.get(project_code=post["data[project_code]"])
      return JsonResponse({"error": "Sale with that project code already exists, please check for duplicate records"})
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
      currency = post["content[currency]"] 
      
      #Double check that this logic works for view
      for choice in Currency:
        if choice.label == currency:
          currency = choice
          break
      
      #Instantiate and save new Sale object on DB
      new_sale = Sales(project_code=project_code, projcet_name=project_name, client_name=client_name, project_detail=project_detail, value=value, currency=currency, order_date=order_date, shipping_date=shipping_date, payment_term=payment_term, cancelled=False)
      new_sale.save()

      #end of user-flow for succesful request: return status OK
      return JsonResponse({"status":"OK"}) #consider sending new_sale back if necessary instead of status:OK
  return HttpResponseBadRequest("Bad Request not POST")
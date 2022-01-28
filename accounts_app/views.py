from django.core.exceptions import ValidationError
from django.shortcuts import render
from .models import PaymentStatus
from ms_app.decorators import *

@unauthenticated_check
@method_check(allowed_methods=['GET'])
def getAccountsPage(request):
  context = { "accounts": "" }
  if(request.GET.get('search')):
    search = request.GET.get('search')
    results = {}
    invoice_date_query = {}

    # Search all fields for search value
    invoice_number_query = PaymentStatus.objects.filter(invoice_number = search)
    try:
      invoice_date_query = PaymentStatus.objects.filter(invoice_date = search)
    except ValidationError:
      pass
    status_query = PaymentStatus.objects.filter(status = search)
    
    for entry in invoice_number_query:
      results[entry.paymentstatus_id] = entry
    for entry in invoice_date_query:
      results[entry.paymentstatus_id] = entry
    for entry in status_query:
      results[entry.paymentstatus_id] = entry
    
    # Remove duplicates from results
    print(results)
    context["accounts"] = list(results.values())
    context["search"] = True
  else:
    context["accounts"] = PaymentStatus.objects.all() 
    
    
  return render(request, "accounts_app/accounts.html", context)
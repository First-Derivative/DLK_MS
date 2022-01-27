from django.shortcuts import render
from .models import PaymentStatus
from ms_app.decorators import *

@unauthenticated_check
@method_check(allowed_methods=['GET'])
def getAccountsPage(request):
  context = { "accounts": PaymentStatus.objects.all() }
  return render(request, "accounts_app/accounts.html", context)
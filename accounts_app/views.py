from django.core.exceptions import ValidationError
from django.shortcuts import render
from django.http import JsonResponse
from .models import PaymentStatus
from .serializers import PaymentStatusSerializer
from ms_app.decorators import *

# Get Accounts Page
@unauthenticated_check
@method_check(allowed_methods=['GET'])
def getAccountsPage(request):
  return render(request, "accounts_app/accounts.html")

# Get ALL Payments
@method_check(allowed_methods=["GET"])
@unauthenticated_check
def getAllPayments(request):
  payments = PaymentStatus.objects.all()
  serial = []
  for record in payments:
    serial.append(PaymentStatusSerializer(record).data)
  print("sending over {} records".format(len(serial)))
  return JsonResponse({"data":serial})
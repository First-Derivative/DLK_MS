from django.core.exceptions import ValidationError
from django.shortcuts import render
from django.http import JsonResponse
from .models import PaymentStatus
from .serializers import PaymentStatusSerializer
from ms_app.decorators import *

from rest_framework.decorators import api_view
from rest_framework import generics, filters
from rest_framework.response import Response

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
  return JsonResponse({"data":serial})

# Get search Payment
class searchAPI(generics.ListCreateAPIView):
  search_fields = ['invoice_number', 'invoice_date', 'status']
  filter_backends = (filters.SearchFilter,)
  queryset = PaymentStatus.objects.all()
  serializer_class = PaymentStatusSerializer
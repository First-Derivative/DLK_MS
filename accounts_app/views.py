from django.core.exceptions import ValidationError
from django.shortcuts import render
from django.http import JsonResponse
from .models import PaymentStatus, Sales
from .serializers import PaymentStatusSerializer
from ms_app.decorators import *

from rest_framework.decorators import api_view
from rest_framework import generics, filters
from rest_framework.response import Response

# Get Accounts Page
@unauthenticated_check
@method_check(allowed_methods=['GET'])
def getAccountsPage(request):
  context = {"sales_project_code_library" : []}

  for sale in Sales.objects.all():
    context["sales_project_code_library"].append(sale.project_code)

  if( 'search' in request.GET ):
    context["search"] = request.GET['search']

  return render(request, "accounts_app/accounts.html", context)

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

# Post new Payment
@method_check(allowed_methods=["POST"])
@role_check(allowed_roles="shipping")
@api_view(['POST'])
def postNewPayment(request):
  post = request.POST
  print(post)
  sale = None
  try:
    sale = Sales.objects.get(project_code=post["sales_project_code"])
  except Sales.DoesNotExist: 
    return Response(status=400, data={"sale_not_found":"Cannot create payment with project code '{}' -Sale does not exist".format(post['sales_project_code'])})
    
  # Validate postdata for duplication 
  try:
    temp = PaymentStatus.objects.get(sales_relation=sale)
    return Response(status=400, data={"duplicate_payment_entry":"Payment order tied to that sales project_code already exists, please check for duplicate records"})
  
  # No Duplicate Found-> Create new Object
  except PaymentStatus.DoesNotExist:
    cancelled = post["cancelled"] if "cancelled" in post else False
    completed = post["completed"] if "completed" in post else False

    # Instantiate New Payment from Post data
    new_payment = PaymentStatus(sales_relation=sale, invoice_number=post["invoice_number"], invoice_date=post["invoice_date"], status=post["status"], cancelled=cancelled, completed=completed)
    
    # Validate new_payment with validators
    try:
      new_payment.full_clean()
    except ValidationError as e:
      return Response(status=400, data=dict(e))

    # new_payment.save()
    return JsonResponse({"data":PaymentStatusSerializer(new_payment).data})
    # return Response(status=200, data=PaymentStatusSerializer(new_payment).data)
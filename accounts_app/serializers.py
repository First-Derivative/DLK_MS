from rest_framework import serializers
from .models import PaymentStatus

class PaymentStatusSerializer(serializers.ModelSerializer):
  invoice_number_isNull = serializers.ReadOnlyField()
  invoice_date_isNull = serializers.ReadOnlyField()
  status_isNull = serializers.ReadOnlyField()
  sales_project_code = serializers.ReadOnlyField()
  sales_invoice_amount = serializers.ReadOnlyField()

  class Meta:
    model = PaymentStatus
    fields = ('paymentstatus_id','sales_project_code', "invoice_number", "invoice_date","status", "sales_invoice_amount", "completed", "cancelled", "invoice_date_isNull", "invoice_number_isNull", "status_isNull")


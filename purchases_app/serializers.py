from rest_framework import serializers
from .models import Purchases

class PurchasesSerializer(serializers.ModelSerializer):
  invoice_amount = serializers.ReadOnlyField()
  
  class Meta:
    model = Purchases
    fields = ('purchase_order', "project_code",'po_date', "supplier_name", "purchased_items","invoice_amount","expected_date", "supplier_date", "created_at", "updated_at")

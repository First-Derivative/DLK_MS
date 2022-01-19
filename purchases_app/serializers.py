from rest_framework import serializers
from .models import Purchases

class PurchasesSerializer(serializers.ModelSerializer):
  invoice_amount = serializers.ReadOnlyField()
  po_date_isNull = serializers.ReadOnlyField()
  expected_date_isNull = serializers.ReadOnlyField()
  supplier_date_isNull = serializers.ReadOnlyField()
  supplier_name_isNull = serializers.ReadOnlyField()
  
  class Meta:
    model = Purchases
    fields = ('purchases_id', 'purchase_order', "project_code",'po_date', "supplier_name", "purchased_items","invoice_amount","expected_date", "supplier_date", "created_at", "updated_at", "po_date_isNull", "expected_date_isNull", "supplier_date_isNull", "supplier_name_isNull")

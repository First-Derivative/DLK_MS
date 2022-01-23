from rest_framework import serializers
from .models import Sales

class SalesSerializer(serializers.ModelSerializer):
  invoice_amount = serializers.ReadOnlyField()
  project_detail_isNull = serializers.ReadOnlyField()
  order_date_isNull = serializers.ReadOnlyField()
  shipping_date_isNull = serializers.ReadOnlyField()
  payment_term_isNull = serializers.ReadOnlyField()

  class Meta:
    model = Sales
    fields = ('project_code','project_name','client_name','project_detail','invoice_amount','order_date','shipping_date','payment_term','cancelled','completed', 'project_detail_isNull', 'order_date_isNull', 'shipping_date_isNull' ,'payment_term_isNull')
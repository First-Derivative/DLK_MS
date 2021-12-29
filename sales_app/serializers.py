from rest_framework import serializers
from .models import Sales

class SalesSerializer(serializers.ModelSerializer):
  invoice_amount = serializers.ReadOnlyField()

  class Meta:
      model = Sales
      fields = ('project_code','project_name','client_name','project_detail','invoice_amount','order_date','shipping_date','payment_term','cancelled','completed')
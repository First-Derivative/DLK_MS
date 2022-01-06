from rest_framework import serializers
from .models import Shipping

class ShippingSerializer(serializers.ModelSerializer):
  class Meta:
    model = Shipping
    fields = ('project_code','project_name', "client_name", "germany","customer","remarks", "cancelled", "completed")


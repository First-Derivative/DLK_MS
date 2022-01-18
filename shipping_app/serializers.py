from rest_framework import serializers
from .models import Shipping

class ShippingSerializer(serializers.ModelSerializer):
  germany_isNull = serializers.ReadOnlyField()
  customer_isNull = serializers.ReadOnlyField()
  charges_isNull = serializers.ReadOnlyField()
  remarks_isNull = serializers.ReadOnlyField()

  class Meta:
    model = Shipping
    fields = ('project_code','project_name', "client_name", "germany","customer", "charges","remarks", "cancelled", "completed", "germany_isNull", "customer_isNull", "charges_isNull", "remarks_isNull")


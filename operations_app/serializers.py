from rest_framework import serializers
from .models import Operations

class OperationsSerializer(serializers.ModelSerializer):
  status_isNull = serializers.ReadOnlyField()
  finish_detail_isNull = serializers.ReadOnlyField()

  class Meta:
    model = Operations
    fields = ('project_code','project_name', "client_name", "status","finish_detail","cancelled", "status_isNull", "finish_detail_isNull")


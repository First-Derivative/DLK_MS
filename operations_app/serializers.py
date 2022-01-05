from rest_framework import serializers
from .models import Operations

class OperationsSerializer(serializers.ModelSerializer):
  class Meta:
    model = Operations
    fields = ('project_code','project_name', "client_name", "status","finish_detail","cancelled")


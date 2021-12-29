from django.db import models
from sales_app.models import Sales

class Shipping(models.Model):
  shipping_id = models.BigAutoField(primary_key=True)
  project_code = models.CharField(max_length=10)
  project_name = models.CharField(max_length=80)
  client_name = models.CharField(max_length=100)
  # germany = models.BooleanField(default=False) Double Check with Mum on purpose
  customer = models.CharField(max_length=500)
  status = models.CharField(null=True, blank=True,max_length=100)
  remark = models.CharField(null=True, blank=True,max_length=100)
  cancelled = models.BooleanField(default=False)
  completed = models.BooleanField(default=False)
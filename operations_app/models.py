from django.db import models
from sales_app.models import Sales

class Operations(models.Model):
  project_code = models.CharField(max_length=10)
  project_name = models.CharField(max_length=80)
  client_name = models.CharField(max_length=100)
  status = models.CharField(null=True, blank=True,max_length=600,verbose_name="Production Status")
  finish_detail = models.CharField(null=True, blank=True, max_length=100)

  cancelled = models.BooleanField(default=False)
from re import L
from django.db import models

class Shipping(models.Model):
  shipping_id = models.BigAutoField(primary_key=True)
  project_code = models.CharField(max_length=10)
  project_name = models.CharField(max_length=80)
  client_name = models.CharField(max_length=100)
  germany = models.CharField(null=True, blank=False, max_length=500)
  customer = models.CharField(null=True, blank=False,max_length=500)
  charges = models.CharField(null=True, blank=False,max_length=100)
  remarks = models.CharField(null=True, blank=False,max_length=100)
  cancelled = models.BooleanField(default=False)
  completed = models.BooleanField(default=False)

  def __str__(self):
    return "{a} {b}".format(a=self.project_code, b=self.project_name)

  class Meta:
    verbose_name = "Shipping"
    verbose_name_plural = "Shipping"
from datetime import datetime, date
from django.db import models
from django.db.models.deletion import PROTECT
from sales_app.models import Sales
from ms_app.validators import *


class PaymentStatus(models.Model):
  sales_relation = models.ForeignKey(Sales, on_delete=PROTECT, related_name="sales")
  paymentstatus_id = models.BigAutoField(primary_key=True)
  invoice_number = models.CharField(null=True, default="null", max_length=100, validators=[check_null])
  invoice_date = models.DateField(null=True,default=datetime(1950, 1, 1))
  status = models.CharField(null=True, default="null", max_length=200, validators=[check_null])
  completed = models.BooleanField(default=False)
  cancelled = models.BooleanField(default=False)

  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  @property
  def payment_value(self):
    return self.sales_relation.invoice_amount

  @property
  def invoice_number_isNull(self):
    if(self.invoice_number.lower() == "null"):
      return True
    return False

  @property
  def invoice_date_isNull(self):
    if(self.invoice_date == date(1950, 1, 1)):
      return True
    return False

  @property
  def status_isNull(self):
    if(self.status.lower() == "null"):
      return True
    return False

  def __str__(self):
    return "{a} : {b}".format(a=self.invoice_number, b=self.status)

  class Meta:
    verbose_name = "Payment Status"
    verbose_name_plural = "Payment Status"

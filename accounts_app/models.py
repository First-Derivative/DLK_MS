from django.db import models
from django.db.models.deletion import PROTECT
from sales_app.models import Sales
from purchases_app.models import Purchases


class PaymentStatus(models.Model):
  sales_relation = models.ForeignKey(Sales, on_delete=PROTECT, related_name="sales")
  paymentstatus_id = models.BigAutoField(primary_key=True)
  invoice_number = models.CharField(max_length=30)
  invoice_date = models.DateField()
  status = models.CharField(max_length=100)
  completed = models.BooleanField(default=False)
  cancelled = models.BooleanField(default=False)

  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  class Meta:
    verbose_name = "Payment Status"
    verbose_name_plural = "Payment Status"

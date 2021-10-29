from django.db import models
from ms_app.models import Currency
from sales_app.models import Sales

class Purchases(models.Model):
  purchases_id = models.BigAutoField(primary_key=True)
  purchase_code = models.CharField(verbose_name="Purchase Order Number",max_length=10)
  project_code = models.CharField(max_length=10)
  po_date = models.DateField()
  supplier_name	= models.CharField(max_length=100)
  purchased_items = models.CharField(max_length=80)
  value = models.DecimalField(max_digits=8, decimal_places=2)
  currency = models.CharField(max_length=5, choices=Currency.choices, default=Currency.MYR)
  expected_date = models.DateField(verbose_name="Expected Paymenet Date")
  supplier_date = models.DateField(verbose_name="Supplier Delivary Date")

  cancelled = models.BooleanField(default=False)

  

  @property
  def amount(self):
    return "{a}{b.2f}".format(a=self.currency, b=self.value)
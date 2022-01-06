from django.utils import timezone
from django.db import models
from ms_app.models import Currency, resolveCurrencyLabel

class Purchases(models.Model):
  purchases_id = models.BigAutoField(primary_key=True)
  purchase_order = models.CharField(verbose_name="Purchase Order Number",max_length=10)
  project_code = models.CharField(max_length=100, verbose_name="Purchased For")
  po_date = models.DateField(null=True, blank=False, verbose_name="Purchase Order Date")
  supplier_name	= models.CharField(max_length=100, verbose_name="Supplier Name")
  purchased_items = models.CharField(max_length=80, verbose_name="Purchased Item")
  value = models.DecimalField(max_digits=8, decimal_places=2)
  currency = models.CharField(max_length=5, choices=Currency.choices, default=Currency.MYR)
  expected_date = models.CharField(null=True, max_length=200, verbose_name="Expected Paymenet Date")
  supplier_date = models.CharField(null=True, max_length=200, verbose_name="Supplier Delivary Date")
  
  created_at = models.DateTimeField(null=True, auto_now_add=True)
  updated_at = models.DateTimeField(null=True, auto_now=True)
  
  class Meta:
    verbose_name = "Purchases"
    verbose_name_plural = "Purchases"

  def __str__(self):
    return "{a} {b}".format(a=self.purchase_order, b=self.purchased_items)

  @property
  def invoice_amount(self):
    currency_label = resolveCurrencyLabel(self.currency)
    return "{a}{b}".format(a=currency_label, b=self.value)
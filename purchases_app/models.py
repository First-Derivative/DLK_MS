from django.utils import timezone
from datetime import datetime
from django.db import models
from ms_app.models import Currency, resolveCurrencyLabel
from .validators import *

class Purchases(models.Model):
  purchases_id = models.BigAutoField(primary_key=True)
  purchase_order = models.CharField(verbose_name="Purchase Order Number", null=True ,max_length=20, validators=[validate_purchase_order])
  project_code = models.CharField(max_length=100, verbose_name="Purchased For", validators=[validate_project_code])
  po_date = models.DateField(verbose_name="Purchase Order Date", default=datetime(1950, 1, 1))
  supplier_name	= models.CharField(max_length=100, default='null', verbose_name="Supplier Name", validators=[check_null])
  purchased_items = models.CharField(max_length=80, verbose_name="Purchased Item", validators=[check_null])
  value = models.DecimalField(max_digits=8, decimal_places=2)
  currency = models.CharField(max_length=10, choices=Currency.choices, default=Currency.MYR)
<<<<<<< Updated upstream
  expected_date = models.CharField(max_length=200, verbose_name="Expected Paymenet Date", validators=[check_null])
  supplier_date = models.CharField(max_length=200, verbose_name="Supplier Delivary Date", validators=[check_null])
=======
  expected_date = models.CharField(max_length=200, default='null', verbose_name="Expected Paymenet Date", validators=[check_null])
  supplier_date = models.CharField(max_length=200, default='null', verbose_name="Supplier Delivary Date", validators=[check_null])
>>>>>>> Stashed changes
  
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  @property
  def supplier_name_isNull(self):
    if(self.supplier_name == "" or self.supplier_name == "null"):
      return True
    return False

  @property
  def supplier_date_isNull(self):
    if(self.supplier_date == "" or self.supplier_date == "null"):
      return True
    return False

  @property
  def po_date_isNull(self):
    if(self.po_date == "" or self.po_date == "null"):
      return True
    return False

  @property
  def expected_date_isNull(self):
    if(self.expected_date == "" or self.expected_date == "null"):
      return True
    return False
  
  class Meta:
    verbose_name = "Purchases"
    verbose_name_plural = "Purchases"

  def __str__(self):
    return "{a} {b}".format(a=self.purchase_order, b=self.purchased_items)

  @property
  def invoice_amount(self):
    currency_label = resolveCurrencyLabel(self.currency)
    return "{a}{b}".format(a=currency_label, b=self.value)
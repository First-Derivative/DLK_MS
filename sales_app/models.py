from django.utils import timezone
from django.db import models
from ms_app.models import Currency, resolveCurrencyLabel
from .validators import *

class Sales(models.Model):
  sales_id = models.BigAutoField(primary_key=True)
  project_code = models.CharField(max_length=20, validators=[validate_project_code])
  project_name = models.CharField(max_length=80)
  client_name = models.CharField(max_length=100)
  project_detail = models.CharField(max_length=600, blank=False, null=True)
  value = models.DecimalField(max_digits=10, decimal_places=2, validators=[validate_value])
  currency = models.CharField(max_length=5, choices=Currency.choices, default=Currency.MYR)
  order_date = models.DateField(verbose_name="Customer Order Date", blank=False, null=True)
  shipping_date = models.CharField(verbose_name= "Customer Working Date", max_length=100,null=True) 
  payment_term = models.CharField(max_length=100, null=True)
  cancelled = models.BooleanField(default=False)
  completed = models.BooleanField(default=False)

  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  # DJango Model DT Format: YYYY-MM-DD
  # Website Input DT Format: DD/MM/YYYY
  # Gspread Sheets DT Format:MM-DD-YYYY
  class Meta:
    verbose_name = "Sales"
    verbose_name_plural = "Sales"

  @property
  def invoice_amount(self):
    currency_label = resolveCurrencyLabel(self.currency)
    return "{a}{b}".format(a=currency_label, b=self.value)

  @property
  def shipping_date_isNull(self):
    if(self.shipping_date.lower() == "null" or self.shipping_date.lower() == 'TBA'):
      return True
    return False

  @property
  def payment_term_isNull(self):
    if(self.payment_term.lower() == "null" or self.payment_term.lower() == "tba"):
      return True
    return False

  def __str__(self):
    return "{a} {b}".format(a=self.project_code, b=self.project_name)
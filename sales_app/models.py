from django.utils import timezone
from django.db import models
from ms_app.models import Currency, resolveCurrencyLabel
from .validators import *

class Sales(models.Model):
  sales_id = models.BigAutoField(primary_key=True)
  project_code = models.CharField(max_length=20, validators=[validate_project_code, check_null])
  project_name = models.CharField(max_length=80, validators=[check_null])
  client_name = models.CharField(max_length=100, validators=[check_null])
  project_detail = models.CharField(max_length=600, blank=False, null=True, validators=[check_null])
  value = models.DecimalField(max_digits=10, decimal_places=2, validators=[validate_value])
  currency = models.CharField(max_length=5, choices=Currency.choices, default=Currency.MYR)
  order_date = models.DateField(blank=False)
  shipping_date = models.CharField(max_length=100,null=True, validators=[check_null]) 
  payment_term = models.CharField(max_length=100, validators=[check_null])
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
  def payment_term_isNull(self):
    if(self.payment_term.lower() == "null" or self.payment_term.lower() == ""):
      return True
    return False

  def __str__(self):
    return "{a} {b}".format(a=self.project_code, b=self.project_name)
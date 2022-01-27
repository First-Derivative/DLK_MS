from django.utils import timezone
from datetime import datetime 
from django.db import models
from ms_app.models import Currency, resolveCurrencyLabel
from ms_app.validators import *

class Sales(models.Model):
  sales_id = models.BigAutoField(primary_key=True)
  project_code = models.CharField(max_length=20, validators=[validate_project_code])
  project_name = models.CharField(max_length=80, validators=[check_null])
  client_name = models.CharField(max_length=100, validators=[check_null])
  project_detail = models.CharField(max_length=600, default='null', validators=[check_null])
  value = models.DecimalField(max_digits=10, decimal_places=2, validators=[validate_value])
  currency = models.CharField(max_length=5, choices=Currency.choices, default=Currency.MYR)
  order_date = models.DateField(verbose_name="Customer Order Date", default=datetime(1950, 1, 1))
  shipping_date = models.CharField(verbose_name= "Customer Working Date", default='null', max_length=100, validators=[check_null]) 
  payment_term = models.CharField(max_length=100, default='null', validators=[check_null])
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
  def project_detail_isNull(self):
    if(self.project_detail.lower() == "null" or self.project_detail.lower() == "tba"):
      return True
    return False

  @property
  def order_date_isNull(self):
    if(self.order_date.lower() == "null" or self.order_date == ""):
      return True
    return False

  @property
  def shipping_date_isNull(self):
    if(self.shipping_date.lower() == "null" or self.shipping_date.lower() == 'tba'):
      return True
    return False

  @property
  def payment_term_isNull(self):
    if(self.payment_term.lower() == "null" or self.payment_term.lower() == "tba"):
      return True
    return False

  def __str__(self):
    return "{a} {b}".format(a=self.project_code, b=self.project_name)
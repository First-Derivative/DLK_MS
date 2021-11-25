from django.db import models
from ms_app.models import Currency, resolveCurrencyLabel
from .validators import validate_project_code

class Sales(models.Model):
  sales_id = models.BigAutoField(primary_key=True)
  project_code = models.CharField(max_length=20, validators=[validate_project_code])
  project_name = models.CharField(max_length=80)
  client_name = models.CharField(max_length=100)
  project_detail = models.CharField(max_length=600, null=True)
  value = models.DecimalField(max_digits=10, decimal_places=2)
  currency = models.CharField(max_length=5, choices=Currency.choices, default=Currency.MYR)
  order_date = models.DateField()
  shipping_date = models.CharField(max_length=100,null=True) 
  payment_term = models.CharField(max_length=100)
  cancelled = models.BooleanField(default=False)

  # created_at = models.DateTimeField(auto_now_add=True)
  # updated_at = models.DateTimeField(auto_now=True)

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

  def __str__(self):
    return "{a} {b}".format(a=self.project_code, b=self.project_name)
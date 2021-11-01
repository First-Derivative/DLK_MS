from django.db import models
from ms_app.models import Currency, resolveCurrency

class Sales(models.Model):
  sales_id = models.BigAutoField(primary_key=True)
  project_code = models.CharField(max_length=20)
  project_name = models.CharField(max_length=80)
  client_name = models.CharField(max_length=100)
  project_detail = models.CharField(max_length=600, null=True, blank=True)
  value = models.DecimalField(max_digits=8, decimal_places=2)
  currency = models.CharField(max_length=5, choices=Currency.choices, default=Currency.MYR)
  order_date = models.DateField()
  shipping_date = models.DateField(null=True, blank=True) 
  payment_term = models.CharField(max_length=100)
  cancelled = models.BooleanField(default=False)

  class Meta:
    verbose_name = "Sales"
    verbose_name_plural = "Sales"

  @property
  def invoice_amount(self):
    currency_label = resolveCurrency(self.currency)
    return "{a}{b}".format(a=currency_label, b=self.value)
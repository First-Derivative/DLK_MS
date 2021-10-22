from django.db import models
from accounts_app.models import Currency

class Sales(models.Model):
  project_code = models.CharField(primary_key=True,max_length=10)
  project_name = models.CharField(max_length=80)
  client_name = models.CharField(max_length=100)
  project_detail = models.CharField(max_length=600, null=True, blank=True)
  value = models.DecimalField(max_digits=8, decimal_places=2)
  currency = models.CharField(max_length=5, choices=Currency.choices, default=Currency.MYR)
  order_date = models.DateField()
  shipping_date = models.DateField(null=True, blank=True) 
  payment_term = models.CharField(max_length=100)
  cancelled = models.BooleanField(default=False)

  @property
  def invoice_amount(self):
    return "{a}{b.2f}".format(a=self.currency, b=self.value)
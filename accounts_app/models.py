from django.db import models
from django.db.models.deletion import PROTECT
from sales_app.models import Sales
from purchases_app.models import Purchases

class Currency(models. TextChoices):
  MYR = ("MYR","RM")
  EUR = ("EUR","€")
  USD = ("USD","$")

#Auxiliary Function to resolve object currency value for serialization
def resolveCurrency(currency):
  for choice in Currency:
    if(choice == currency):
      return choice.label

class PaymentStatus(models.Model):

  sales_relation = models.ForeignKey(Sales, on_delete=PROTECT)
  purchases_relation = models.ForeignKey(Purchases, on_delete=PROTECT)

  paymentstatus_id = models.BigAutoField(primary_key=True)
  proforma_number = models.CharField(max_length=30)
  invoice_number = models.CharField(max_length=30)
  invoice_date = models.DateField()
  due_date = models.DateField(blank=True, null=True)
  value = models.DecimalField(max_digits=12, decimal_places=2)
  status = models.CharField(max_length=100)
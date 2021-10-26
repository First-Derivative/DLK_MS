from django.db import models

class Currency(models.TextChoices):
  MYR = ("MYR","RM")
  EUR = ("EUR","€")
  USD = ("USD","$")

#Auxiliary Function to resolve object currency value for serialization
def resolveCurrency(currency):
  for choice in Currency:
    if(choice == currency):
      return choice.label
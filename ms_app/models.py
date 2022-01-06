from django.db import models

#Currency Class which is used in Sales and Purchases
class Currency(models. TextChoices):
  MYR = ("MYR","RM")
  EUR = ("EUR","€")
  USD = ("USD","$")

#Auxiliary Function to resolve object currency value for serialization
def resolveCurrencyLabel(currency):
  for choice in Currency:
    if(choice == currency):
      return choice.label

def resolveCurrency(currency):
  for choice in Currency:
    if(choice.label == currency or choice == currency):
      return choice
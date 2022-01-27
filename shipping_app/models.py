from django.db import models
from ms_app.validators import *

class Shipping(models.Model):
  shipping_id = models.BigAutoField(primary_key=True)
  project_code = models.CharField(max_length=20, validators=[validate_project_code])
  project_name = models.CharField(default='null',max_length=80)
  client_name = models.CharField(max_length=100)
  germany = models.CharField( max_length=500, default='null', validators=[check_null])
  customer = models.CharField(max_length=500, default='null', validators=[check_null])
  charges = models.CharField(max_length=100, default='null', validators=[check_null])
  remarks = models.CharField(max_length=100, default='null', validators=[check_null])
  cancelled = models.BooleanField(default=False)
  completed = models.BooleanField(default=False)

  @property
  def germany_isNull(self):
    if( self.germany == "" or self.germany.lower() == "null"):
      return True
    return False
    
  @property
  def customer_isNull(self):
    if( self.customer == "" or self.customer.lower() == "null"):
      return True
    return False
  
  @property
  def charges_isNull(self):
    if( self.charges == "" or self.charges.lower() == "null"):
      return True
    return False

  @property
  def remarks_isNull(self):
    if( self.remarks == "" or self.remarks.lower() == "null"):
      return True
    return False

  def __str__(self):
    return "{a} {b}".format(a=self.project_code, b=self.project_name)

  class Meta:
    verbose_name = "Shipping"
    verbose_name_plural = "Shipping"
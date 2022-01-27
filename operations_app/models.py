from django.db import models
from ms_app.validators import *

class Operations(models.Model):
  operations_id = models.BigAutoField(primary_key=True)
  project_code = models.CharField(max_length=20, validators=[validate_project_code])
  project_name = models.CharField(max_length=80, validators=[check_null])
  client_name = models.CharField(max_length=100, validators=[check_null])
  status = models.CharField(max_length=600, default='null',verbose_name="Production Status", validators=[check_null])
  finish_detail = models.CharField(max_length=100, default='null', validators=[check_null])
  cancelled = models.BooleanField(default=False)

  @property
  def status_isNull(self):
    if(self.status == "" or self.status == "null"):
      return True
    return False
  
  @property
  def finish_detail_isNull(self):
    if(self.finish_detail == "" or self.finish_detail == "null"):
      return True
    return False

  class Meta:
    verbose_name = "Operations"
    verbose_name_plural = "Operations"

  def __str__(self):
    return "{a} {b}".format(a=self.project_code, b=self.project_name)
from django.db import models
from .validators import *

class Operations(models.Model):
  operations_id = models.BigAutoField(primary_key=True)
  project_code = models.CharField(max_length=20, validators=[validate_project_code])
  project_name = models.CharField(max_length=80, validators=[null_check])
  client_name = models.CharField(max_length=100, validators=[null_check])
  status = models.CharField(null=True, blank=False,max_length=600,verbose_name="Production Status", validators=[null_check])
  finish_detail = models.CharField(null=True, blank=False, max_length=100, validators=[null_check])
  cancelled = models.BooleanField(default=False)

  @property
  def status_isNull(self):
    if(self.status == ""):
      return True
    return False
  
  @property
  def finish_detail_isNull(self):
    if(self.finish_detail == ""):
      return True
    return False

  class Meta:
    verbose_name = "Operations"
    verbose_name_plural = "Operations"

  def __str__(self):
    return "{a} {b}".format(a=self.project_code, b=self.project_name)
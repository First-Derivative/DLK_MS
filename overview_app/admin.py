from django.contrib import admin
from .models import *

class ReportAdmin(admin.ModelAdmin):
  list_display = ("title", "type", "location", "created_at")
  search_fields = ("type",)
  
admin.site.register(Report, ReportAdmin)
from django.contrib import admin
from .models import Sales

class SalesAdmin(admin.ModelAdmin):
  list_display = ("project_code","project_name","client_name","project_detail","value","currency","order_date","shipping_date","payment_term","cancelled","completed")
  search_fields = ("project_code","project_name","client_name","project_detail","value","currency","order_date","shipping_date","payment_term","cancelled","completed")

admin.site.register(Sales, SalesAdmin)
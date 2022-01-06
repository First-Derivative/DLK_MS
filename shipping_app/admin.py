from django.contrib import admin

from shipping_app.models import Shipping

class ShippingAdmin(admin.ModelAdmin):
  list_display = ("project_code","project_name","client_name", "germany", "customer", "charges", "remarks", "cancelled", "completed")
  search_fields = ("project_code","project_name","client_name", "germany", "customer", "charges", "remarks", "cancelled", "completed")
  
admin.site.register(Shipping, ShippingAdmin)
from django.contrib import admin
from .models import Purchases

class PurchasesAdmin(admin.ModelAdmin):
  list_display = ("purchase_order","project_code","po_date","supplier_name","purchased_items","value","currency","expected_date","supplier_date", "created_at", "updated_at")
  search_fields = ("purchase_order","project_code","po_date","supplier_name","purchased_items","value","currency","expected_date","supplier_date", "created_at", "updated_at")

admin.site.register(Purchases, PurchasesAdmin)
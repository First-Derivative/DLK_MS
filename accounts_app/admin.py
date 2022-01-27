from django.contrib import admin

from accounts_app.models import PaymentStatus

class PaymentStatusAdmin(admin.ModelAdmin):
  list_display = ("sales_relation","invoice_number","invoice_date", "cancelled", "completed")
  search_fields = ("sales_relation","invoice_number","invoice_date", "cancelled", "completed")
  
admin.site.register(PaymentStatus, PaymentStatusAdmin)
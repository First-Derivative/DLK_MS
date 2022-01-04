from django.contrib import admin

from operations_app.models import Operations

class OperationsAdmin(admin.ModelAdmin):
  list_display = ("project_code","project_name","client_name", "status", "finish_detail", "cancelled")
  search_fields = ("project_code","project_name","client_name", "status", "finish_detail", "cancelled")
  
admin.site.register(Operations, OperationsAdmin)
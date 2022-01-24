from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

class UserAdminView(BaseUserAdmin):
  model = User
  list_display = ("username","first_name","last_name", "is_admin")
  search_fields = ("username","first_name","last_name")
  ordering = ("username","first_name")
  filter_horizontal = ()
  list_filter = ("is_admin",)
  fieldsets = ()
  


admin.site.register(User, UserAdminView)
  
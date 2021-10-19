from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin

# from django.core.exceptions import SuspiciousOperation # Consider writing on Error Classs

class UserManager(BaseUserManager):
  def create_user(self, email, first_name, last_name, password=None):
    if not (first_name or last_name or email):
      raise ValueError("This field is required")

    user = self.model(
      email =  self.normalize_email(email),
      first_name = first_name,
      last_name = last_name
    )
  
    user.set_password(password)
    user.save()
    return user

  def create_superuser(self, email, first_name, last_name, password):
    user = self.create_user(
      email =  self.normalize_email(email),
      first_name = first_name,
      last_name = last_name,
      password = password
    )

    user.is_admin = True;
    user.save(using=self._db)
    return user


class User(AbstractBaseUser, PermissionsMixin):

  email = models.EmailField(verbose_name="email",max_length=50, unique=True)
  first_name = models.CharField(max_length=30)
  last_name = models.CharField(max_length=30)
  is_admin = models.BooleanField(default=False)
  is_active = models.BooleanField(default=True)
  is_staff = models.BooleanField(default=True)  

  USERNAME_FIELD = 'email'
  REQUIRED_FIELDS = ('first_name','last_name')

  objects = UserManager()

  def __str__(self):
    return "{a} {b}".format(a=self.first_name, b=self.last_name)

  #default override for has_perm
  def has_perm(self, perm, obj=None):
    return self.is_staff

  #default override for has_module_perms
  def has_module_perms(self, app_label):
    return self.is_active

 
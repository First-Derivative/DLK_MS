
from django import forms
from django.forms import ModelForm
from django.contrib.auth import authenticate
from .models import User

class LoginForm(ModelForm):
  
  class Meta:
    model = User
    fields = ("email", "password")

  email = forms.CharField(max_length=50,widget=forms.TextInput(attrs={
    "class": "form-control std_input",
    "id": "login_email",
  }))

  password = forms.CharField(widget=forms.PasswordInput(attrs={
    "class": "form-control std_input",
    "id": "login_password",
  }))

  # field cleaning and login auth
  def clean(self):
    email = self.cleaned_data["email"]
    password = self.cleaned_data["password"]
    if not authenticate(email=email, password=password):
      raise forms.ValidationError("Incorrect Credentials")
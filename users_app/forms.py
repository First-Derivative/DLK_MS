from django import forms
from django.forms import ModelForm
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import authenticate
from .models import User

class LoginForm(ModelForm):
  
  class Meta:
    model = User
    fields = ("email", "password")

  email = forms.CharField(max_length=50,widget=forms.TextInput(attrs={
    "class": "form-control login_input",
    "id": "login_email",
    "placeholder": "Email"
  }))

  password = forms.CharField(widget=forms.PasswordInput(attrs={
    "class": "form-control login_input",
    "id": "login_password",
    "placeholder": "Password"
  }))

  # field cleaning and login auth
  def clean(self):
    email = self.cleaned_data["email"]
    password = self.cleaned_data["password"]
    if not authenticate(email=email, password=password):
      raise forms.ValidationError("Incorrect Credentials")

class RegisterForm(UserCreationForm):
  class Meta:
      model = User
      fields = ("email", "first_name", "last_name", "password1", "password2")

  email = forms.CharField(max_length=50, help_text="This is what you'll use to login",widget=forms.EmailInput(attrs={
    'placeholder': 'email@dlk.com',
    'class': 'form-control ',
  }))

  first_name = forms.CharField(label="First Name", widget=forms.TextInput(attrs={
    'placeholder': 'Claudius',
    'class': 'form-control ',
    'name': 'first_name',
  }))

  last_name = forms.CharField(label="Last Name", widget=forms.TextInput(attrs={
    'placeholder': 'Claudius',
    'class': 'form-control ',
    'name' : 'last_name',
  }))

  password1 = forms.CharField(widget=forms.PasswordInput(attrs={
    'placeholder': 'Password',
    'class': 'form-control ',
  }))

  password2 = forms.CharField(widget=forms.PasswordInput(attrs={
    'placeholder': 'Confirm Password',
    'class': 'form-control ',
  }))


  def __init__(self, *args, **kwargs):
      super().__init__(*args, **kwargs)
      self.fields['password1'].label = "Password"
      self.fields['password2'].label = "Re-Enter Password"
from django import forms
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.core.validators import validate_email


class SignupForm(forms.Form):
    username = forms.CharField(max_length=50)
    password1 = forms.CharField(max_length=50, widget=forms.PasswordInput)
    password2 = forms.CharField(max_length=50, widget=forms.PasswordInput)
    email = forms.EmailField(max_length=50, required=False)
    first_name = forms.CharField(max_length=50, required=False)
    last_name = forms.CharField(max_length=50, required=False)
    phone_num = forms.CharField(max_length=50, required=False)

    def clean(self):
        data = super().clean()
        username = data.get('username', '')
        password1 = data.get('password1', '')
        password2 = data.get('password2', '')
        email = data.get('email', '')
        first_name = data.get('first_name', '')
        last_name = data.get('last_name', '')
        phone_num = data.get('phone_num', '')

        if email != '':
            try:
                validate_email(email)
            except ValidationError:
                self.add_error('email', 'Invalid email')
        if username != '':
            user = User.objects.filter(username=username)
            if user:
                self.add_error('username', 'Account existed!')
        else:
            self.add_error('username', 'Empty Username')

        if password1 != password2:
            self.add_error('password1', 'Two password fields did not match!')
        return data


class LoginForm(forms.Form):
    username = forms.CharField(max_length=50)
    password = forms.CharField(max_length=50, widget=forms.PasswordInput)

    def clean(self):
        data = super().clean()
        username = data.get('username', '')
        password = data.get('password', '')

        user = authenticate(username=username,
                            password=password,)
        if not user:
            self.add_error('username', 'Incorrect username or password')
        return data


class ProfileEditForm(forms.Form):
    email = forms.EmailField(max_length=50, required=False)
    first_name = forms.CharField(max_length=50, required=False)
    last_name = forms.CharField(max_length=50, required=False)
    phone_num = forms.CharField(max_length=50, required=False)

    def clean(self):
        data = super().clean()
        email = data.get('email', '')
        first_name = data.get('first_name', '')
        last_name = data.get('last_name', '')
        phone_num = data.get('phone_num', '')
        if email != '':
            try:
                validate_email(email)
            except ValidationError:
                self.add_error('email', 'Invalid email')
        return data
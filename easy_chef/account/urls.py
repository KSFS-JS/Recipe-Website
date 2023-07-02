from django.urls import path, include

from account.views import signup, app_login, app_logout, ProfileView, profile_edit

urlpatterns = [
    path('signup/', signup),
    path('login/', app_login),
    path('logout/', app_logout),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile_edit', profile_edit),
]
import hashlib

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpResponseBadRequest, HttpResponseNotAllowed, HttpResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from rest_framework.views import APIView

from account.forms import SignupForm, LoginForm, ProfileEditForm
from account.models import Profile


# Create your views here.
@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
def signup(request):
    """
    Signup function that creates a user
    Only accept POST request
    """
    if request.method == "POST":
        form = SignupForm(request.POST, request.FILES)
        if form.is_valid():
            user = User.objects.create_user(
                username=form.cleaned_data['username'],
                password=form.cleaned_data['password1'],
                email=form.cleaned_data['email'],
                first_name=form.cleaned_data['first_name'],
                last_name=form.cleaned_data['last_name'],
            )
            avatar_img = request.FILES.getlist('avatar')
            if avatar_img:
                avatar_hash = hashlib.md5((avatar_img[0].name + str(avatar_img[0].size)).encode('utf-8')).hexdigest()
                potential_avatar = Profile.objects.filter(avatar_hash=avatar_hash).first()
                if potential_avatar:
                    Profile.objects.create(
                        user=user,
                        phone_num=form.cleaned_data['phone_num'],
                        avatar=potential_avatar.avatar
                    )
                else:
                    Profile.objects.create(
                        user=user,
                        phone_num=form.cleaned_data['phone_num'],
                        avatar=avatar_img[0],
                        avatar_hash=avatar_hash
                    )
            else:
                Profile.objects.create(
                    user=user,
                    phone_num=form.cleaned_data['phone_num'],
                )
            return HttpResponse("Signup Complete, now login to obtain token", status=200)

        else:
            errors = form.errors
            e = {}
            for error in errors:
                if error == "email":
                    e[error] = "Invalid Email"
                elif error == "username":
                    e[error] = "Account existed!"
                elif error == "password1":
                    e[error] = "Two passwords did not match!"
            payload = {"errors": e, }
            return Response(payload, status=400)

    else:
        return HttpResponseNotAllowed(['POST'])


@api_view(["GET", "POST"])
@permission_classes((AllowAny,))
def app_login(request):
    """
    Login with given info, return token on success
    """
    if request.method == "POST":
        form = LoginForm(request.POST)
        if form.is_valid():
            user = authenticate(username=form.cleaned_data['username'],
                                password=form.cleaned_data['password'])
            token = Token.objects.get_or_create(user=user)
            if token:
                login(request, user=user)
                return Response({'token': token[0].key}, status=HTTP_200_OK)
            else:
                return Response({'token': 'Failed to create a token'}, status=500)
        else:
            errors = form.errors
            e = ""
            for error in errors:
                e += str(errors[error])
            return HttpResponseBadRequest(e)
    else:
        return HttpResponseNotAllowed(['POST'])


@api_view(["GET", "POST"])
def app_logout(request):
    """
    Log the current user out, delete the token
    """
    if request.method == "POST" or request.method == "GET":
        token = Token.objects.filter(user=request.user)
        # Delete token for the current user
        token.delete()
        logout(request)
        return HttpResponse('Logged out', status=200)
    else:
        return HttpResponseNotAllowed(['POST', 'GET'])


class ProfileView(APIView):
    """
    Returns a JSON file that contains all user profile information
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = user.profile
        content = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'phone_num': profile.phone_num,
            'avatar': profile.avatar.url
        }
        return Response(content, status=200)


@api_view(['GET', 'POST'])
def profile_edit(request):
    if request.method == "POST" or request.method == "GET":
        if request.method == "POST":
            form = ProfileEditForm(request.POST)
        else:
            form = ProfileEditForm(request.GET)

        if form.is_valid():
            avatar = request.FILES.getlist('avatar')
            user = request.user
            first_name = form.cleaned_data['first_name']
            last_name = form.cleaned_data['last_name']
            email = form.cleaned_data['email']
            phone_num = form.cleaned_data['phone_num']
            # Change anyway, use front-end to prefill the data
            user.first_name = first_name
            user.last_name = last_name
            user.email = email
            user.profile.phone_num = phone_num
            if avatar:
                user.profile.avatar = avatar[0]
            # Save update
            user.save()
            user.profile.save()
            return HttpResponseRedirect('/account/profile/')
        else:
            errors = form.errors
            e = ""
            for error in errors:
                e += str(errors[error])
            return HttpResponseBadRequest(e)

    else:
        return HttpResponseNotAllowed(["GET", "POST"])


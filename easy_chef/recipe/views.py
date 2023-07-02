import hashlib
import json
import os
import sys
from functools import reduce

from django.core.paginator import Paginator, EmptyPage
from django.db.models import Q, Avg, Count
from django.http import HttpResponseNotAllowed, HttpResponseBadRequest, HttpResponse, HttpResponseRedirect
from django.urls import reverse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from recipe.forms import RecipeCreateForm, RecipeEditForm, ReviewForm, RatingEditForm
from recipe.models import Recipe, Diet, Cuisine, Ingredient, RecipeDiet, RecipeCuisine, RecipeIngredient, RecipeStep, \
    RecipeBase, RecipeReview, RecipeImage, RecipeVideo, UserInteractedRecipe, UserFavoriteRecipe, UserCart


# Create your views here.
@api_view(['GET', 'POST'])
def recipe_create(request):
    """
    Create a recipe
    """
    if request.method == "POST":
        form = RecipeCreateForm(request.POST)
        if form.is_valid():
            base = form.cleaned_data['base']
            name = form.cleaned_data['name']
            diets = form.cleaned_data['diets']
            cuisines = form.cleaned_data['cuisines']
            description = form.cleaned_data['description']
            ingredients = json.loads(form.cleaned_data['ingredients'])
            prep_time = form.cleaned_data['prep_time']
            cook_time = form.cleaned_data['cook_time']
            serving = form.cleaned_data['serving']
            steps = json.loads(form.cleaned_data['steps'])
            recipe = Recipe.objects.get_or_create(owner=request.user,
                                                  name=name,
                                                  description=description,
                                                  prep_time=prep_time,
                                                  cook_time=cook_time,
                                                  serving=serving)
            recipe = recipe[0]
            diets = diets.split(',')
            cuisines = cuisines.split(',')
            # Update database
            for diet in diets:
                diet = diet.strip(' ')
                d = Diet.objects.get_or_create(name=diet)
                RecipeDiet.objects.get_or_create(recipe=recipe, diet=d[0])
            for cuisine in cuisines:
                cuisine = cuisine.strip(' ')
                c = Cuisine.objects.get_or_create(name=cuisine)
                RecipeCuisine.objects.get_or_create(recipe=recipe, cuisine=c[0])
            for _, (name, amount) in enumerate(ingredients.items()):
                i = Ingredient.objects.get_or_create(name=name)
                RecipeIngredient.objects.get_or_create(recipe=recipe, ingredient=i[0], amount=amount)
            for _, (order, content) in enumerate(steps.items()):
                RecipeStep.objects.get_or_create(recipe=recipe, order=order, content=content)
            if base:
                RecipeBase.objects.get_or_create(curr=recipe, base=base)

            images = request.FILES.getlist('images[]')
            videos = request.FILES.getlist('videos[]')
            for img in images:
                img_hash = hashlib.md5((img.name + str(img.size)).encode('utf-8')).hexdigest()
                potential_img = RecipeImage.objects.filter(image_hash=img_hash).first()
                if not potential_img:
                    RecipeImage.objects.get_or_create(recipe=recipe, image=img, image_hash=img_hash)
                else:
                    RecipeImage.objects.get_or_create(recipe=recipe, image=potential_img.image)
            for vid in videos:
                vid_hash = hashlib.md5((vid.name + str(vid.size)).encode('utf-8')).hexdigest()
                potential_vid = RecipeVideo.objects.filter(video_hash=vid_hash)
                if not potential_vid:
                    RecipeVideo.objects.get_or_create(recipe=recipe, video=vid, video_hash=vid_hash)
                else:
                    RecipeVideo.objects.get_or_create(recipe=recipe, video=potential_vid.video)
            # Marked as interacted
            UserInteractedRecipe.objects.get_or_create(user=request.user, recipe=recipe)
            return HttpResponse(status=200)
        else:
            errors = form.errors
            e = ""
            for error in errors:
                e += str(errors[error])
            return HttpResponseBadRequest(e)
    else:
        return HttpResponseNotAllowed(['POST'])


@api_view(['GET', 'POST'])
def recipe_edit(request):
    if request.method == "POST":
        recipe_id = request.POST.get('recipe_id', '')
        if recipe_id:
            recipe = Recipe.objects.filter(id=recipe_id)
            if recipe:
                recipe = recipe[0]
                if recipe.owner != request.user:
                    return HttpResponse("Unauthorized", status=401)
                else:
                    form = RecipeEditForm(request.POST)
                    if form.is_valid():
                        base = form.cleaned_data['base']
                        name = form.cleaned_data['name']
                        diets = form.cleaned_data['diets']
                        cuisines = form.cleaned_data['cuisines']
                        description = form.cleaned_data['description']
                        ingredients = form.cleaned_data['ingredients']
                        prep_time = form.cleaned_data['prep_time']
                        cook_time = form.cleaned_data['cook_time']
                        serving = form.cleaned_data['serving']
                        steps = form.cleaned_data['steps']

                        if base:
                            rb = RecipeBase.objects.get_or_create(curr_id=recipe.id)
                            rb[0].base = base
                            rb.save()
                        if name:
                            recipe.name = name
                        if diets:
                            diets = diets.split(",")
                            for diet in diets:
                                diet = diet.strip(' ')
                                d = Diet.objects.get_or_create(name=diet)
                                RecipeDiet.objects.get_or_create(recipe=recipe, diet=d[0])
                            for diet in recipe.diets.all():
                                if diet.diet.name not in diets:
                                    diet.delete()
                        if cuisines:
                            cuisines = cuisines.split(",")
                            for cuisine in cuisines:
                                cuisine = cuisine.strip(' ')
                                c = Cuisine.objects.get_or_create(name=cuisine)
                                RecipeCuisine.objects.get_or_create(recipe=recipe, cuisine=c[0])
                            for cuisine in recipe.cuisines.all():
                                if cuisine.cuisine.name not in cuisines:
                                    cuisine.delete()
                        if description:
                            recipe.description = description
                        if ingredients:
                            ingredients = json.loads(ingredients)
                            keys = ingredients.keys()
                            for _, (name, amount) in enumerate(ingredients.items()):
                                i = Ingredient.objects.get_or_create(name=name)
                                ri = RecipeIngredient.objects.get_or_create(recipe=recipe,
                                                                            ingredient=i[0])
                                ri[0].amount = amount
                                ri[0].save()
                            for ingredient in recipe.ingredients.all():
                                if ingredient.ingredient.name not in keys:
                                    ingredient.delete()
                        if prep_time:
                            recipe.prep_time = prep_time
                        if cook_time:
                            recipe.cook_time = cook_time
                        if serving:
                            recipe.serving = serving
                        if steps:
                            steps = json.loads(steps)
                            keys = steps.keys()
                            for _, (order, content) in enumerate(steps.items()):
                                if s := recipe.steps.all().filter(order=order):
                                    s[0].content = content
                                    s[0].save()
                                else:
                                    RecipeStep.objects.get_or_create(recipe=recipe, order=order, content=content)
                            for s in recipe.steps.all():
                                if str(s.order) not in keys:
                                    s.delete()
                        images = request.FILES.getlist('images[]')
                        videos = request.FILES.getlist('videos[]')
                        if images:
                            for img in recipe.images.all():
                                os.remove(img.image.path)
                                img.delete()
                            for img in images:
                                img_hash = hashlib.md5((img.name + str(img.size)).encode('utf-8')).hexdigest()
                                potential_img = RecipeImage.objects.filter(image_hash=img_hash).first()
                                if not potential_img:
                                    RecipeImage.objects.get_or_create(recipe=recipe, image=img, image_hash=img_hash)
                                else:
                                    RecipeImage.objects.get_or_create(recipe=recipe, image=potential_img.image)
                        if videos:
                            for vid in recipe.videos.all():
                                os.remove(vid.video.path)
                                vid.delete()
                            for vid in videos:
                                vid_hash = hashlib.md5((vid.name + str(vid.size)).encode('utf-8')).hexdigest()
                                potential_vid = RecipeVideo.objects.filter(video_hash=vid_hash)
                                if not potential_vid:
                                    RecipeVideo.objects.get_or_create(recipe=recipe, video=vid, video_hash=vid_hash)
                                else:
                                    RecipeVideo.objects.get_or_create(recipe=recipe, video=potential_vid.video)
                        recipe.save()
                        return HttpResponse(status=200)
                    else:
                        errors = form.errors
                        e = ""
                        for error in errors:
                            e += str(errors[error])
                        return HttpResponseBadRequest(e)

            else:
                return HttpResponseBadRequest("Recipe not found")
        else:
            return HttpResponseBadRequest("Missing recipe id")
    else:
        return HttpResponseNotAllowed(['POST'])


@api_view(['GET', 'POST'])
def recipe_delete(request):
    if request.method == "POST":
        recipe_id = request.POST.get('id', '')
        if not recipe_id:
            return HttpResponseBadRequest("Invalid Id")
        else:
            if r := Recipe.objects.filter(id=recipe_id):
                if r[0].owner != request.user:
                    return HttpResponse("Unauthorized", status=401)
                else:
                    r[0].delete()
                    return HttpResponse("Deletion Done", status=200)
            else:
                return HttpResponseBadRequest("Invalid Id")

    else:
        return HttpResponseNotAllowed(['POST'])


@api_view(['GET', 'POST'])
def add_review(request):
    if request.method == "POST":
        form = ReviewForm(request.POST)
        if form.is_valid():
            images = request.FILES.getlist('images[]')
            videos = request.FILES.getlist('videos[]')
            recipe = Recipe.objects.filter(id=int(form.cleaned_data['id'])).first()
            review_obj = RecipeReview.objects.get_or_create(recipe=recipe,
                                                            user=request.user)[0]
            review_obj.comment = form.cleaned_data['comment']
            review_obj.rating = form.cleaned_data['rating']
            if images:
                for img in images:
                    img_hash = hashlib.md5((img.name + str(img.size)).encode('utf-8')).hexdigest()
                    potential_img = RecipeImage.objects.filter(image_hash=img_hash).first()
                    if not potential_img:
                        RecipeImage.objects.get_or_create(recipe=recipe, image=img, image_hash=img_hash, review=review_obj)
                    else:
                        RecipeImage.objects.get_or_create(recipe=recipe, image=potential_img.image, review=review_obj)
            if videos:
                for vid in videos:
                    vid_hash = hashlib.md5((vid.name + str(vid.size)).encode('utf-8')).hexdigest()
                    potential_vid = RecipeVideo.objects.filter(video_hash=vid_hash)
                    if not potential_vid:
                        RecipeVideo.objects.get_or_create(recipe=recipe, video=vid, video_hash=vid_hash, review=review_obj)
                    else:
                        RecipeVideo.objects.get_or_create(recipe=recipe, video=potential_vid.video, review=review_obj)

            # Mark as interacted recipe
            UserInteractedRecipe.objects.get_or_create(user=request.user, recipe=recipe)
            review_obj.save()
            return HttpResponse(status=200)

        else:
            return HttpResponseBadRequest(form.errors)
    else:
        return HttpResponseNotAllowed(['POST'])


@api_view(['GET', 'POST'])
def edit_rating(request):
    if request.method == "POST":
        form = RatingEditForm(request.POST)
        if form.is_valid():
            r = RecipeReview.objects.filter(recipe=int(form.cleaned_data['id']),
                                            user=request.user).first()
            if r:
                r.rating = form.cleaned_data['rating']
                r.save()
                return HttpResponse(status=200)
            else:
                return HttpResponseBadRequest("Review not exist")
        else:
            return HttpResponseBadRequest('Invalid Form')
    else:
        return HttpResponseNotAllowed(['POST'])


@api_view(['GET', 'POST'])
def add_fav_recipe(request):
    if request.method == "POST":
        recipe_id = request.POST.get('id', '')
        if r := Recipe.objects.filter(id=recipe_id).first():
            UserFavoriteRecipe.objects.get_or_create(user=request.user, recipe=r)
            # Mark as interacted recipe
            UserInteractedRecipe.objects.get_or_create(user=request.user, recipe=r)
            return HttpResponse("Recipe added to favorite", status=200)
        else:
            return HttpResponseBadRequest('Invalid Recipe Id')
    else:
        return HttpResponseNotAllowed(['POST'])


@api_view(['GET', 'POST'])
def delete_fav_recipe(request):
    if request.method == "POST":
        recipe_id = request.POST.get('id', '')
        if r := Recipe.objects.filter(id=recipe_id).first():
            UserFavoriteRecipe.objects.get_or_create(user=request.user, recipe=r)[0].delete()
            return HttpResponse("Recipe deleted from favorite", status=200)
        else:
            return HttpResponseBadRequest('Invalid Recipe Id')
    else:
        return HttpResponseNotAllowed(['POST'])


@api_view(['GET', 'POST'])
def delete_interacted_recipe(request):
    if request.method == "POST":
        recipe_id = request.POST.get('id', '')
        if r := Recipe.objects.filter(id=int(recipe_id)).first():
            UserInteractedRecipe.objects.get_or_create(user=request.user, recipe=r)[0].delete()
            return HttpResponse("Recipe deleted from interacted", status=200)
        else:
            return HttpResponseBadRequest('Invalid Recipe Id')
    else:
        return HttpResponseNotAllowed(['POST'])


@api_view(['GET'])
@permission_classes((AllowAny,))
def ingredient_list(request):
    if request.method == "GET":
        page_num = request.GET.get('page', 1)
        page_size = request.GET.get('page_size', 12)
        try:
            page_num = abs(int(page_num))
            page_size = abs(int(page_size))
        except ValueError:
            return HttpResponseBadRequest("Invalid page value or page_size")
        ingredients = Ingredient.objects.all()
        content = {}
        data = []
        for obj in ingredients:
            data.append(obj.name)
        content['data'] = data
        return Response(content, status=200)

    else:
        return HttpResponseNotAllowed(['GET'])


@api_view(['GET'])
@permission_classes((AllowAny,))
def diet_list(request):
    if request.method == "GET":
        page_num = request.GET.get('page', 1)
        page_size = request.GET.get('page_size', 12)
        try:
            page_num = abs(int(page_num))
            page_size = abs(int(page_size))
        except ValueError:
            return HttpResponseBadRequest("Invalid page value or page_size")
        diets = Diet.objects.all()
        content = {}
        data = []
        for obj in diets:
            data.append(obj.name)
        content['data'] = data
        return Response(content, status=200)

    else:
        return HttpResponseNotAllowed(['GET'])


@api_view(['GET'])
@permission_classes((AllowAny,))
def cuisine_list(request):
    if request.method == "GET":
        page_num = request.GET.get('page', 1)
        page_size = request.GET.get('page_size', 12)
        try:
            page_num = abs(int(page_num))
            page_size = abs(int(page_size))
        except ValueError:
            return HttpResponseBadRequest("Invalid page value or page_size")
        cuisines = Cuisine.objects.all()
        content = {}
        data = []
        for obj in cuisines:
            data.append(obj.name)
        content['data'] = data
        return Response(content, status=200)

    else:
        return HttpResponseNotAllowed(['GET'])


@api_view(['GET'])
@permission_classes((AllowAny,))
def recipe_view(request):
    if request.method == "GET":
        recipe_id = request.GET.get('id', '')
        try:
            recipe_id = int(recipe_id)
        except ValueError:
            return HttpResponseBadRequest("Invalid recipe ID")

        recipe = Recipe.objects.filter(id=recipe_id).first()
        if not recipe:
            return HttpResponseBadRequest("Invalid recipe ID")
        base = recipe.base_recipe.first()
        if not base:
            base = 'None'
        else:
            base = str(base.id)

        name = recipe.name
        diet = []
        for d in recipe.diets.all():
            diet.append(d.diet.name)
        cuisine = []
        for c in recipe.cuisines.all():
            cuisine.append(c.cuisine.name)
        description = recipe.description
        prep_time = recipe.prep_time
        cook_time = recipe.cook_time

        if prep_time < 0:
            prep_time = ''
        if cook_time < 0:
            cook_time = ''

        serving = str(recipe.serving)
        images = recipe.images.all()
        images = [r.image.url for r in images]
        videos = recipe.videos.all()
        videos = [r.video.url for r in videos]
        ingredient = {}
        for i in recipe.ingredients.all():
            ingredient[i.ingredient.name] = i.amount
        step = {}
        for o in recipe.steps.all():
            step[str(o.order)] = o.content
        my_rating = None
        curr_user_favorite = False
        if request.user.is_authenticated:
            rating = request.user.reviews.filter(recipe_id=recipe).first()
            if rating:
                my_rating = rating.rating
            if recipe.favorite.filter(user=request.user).first() is not None:
                curr_user_favorite = 1
            else:
                curr_user_favorite = 0

        payload = {
            'id': recipe_id,
            'base': base,
            'name': name,
            'diet': diet,
            'cuisine': cuisine,
            'description': description,
            'prep_time': prep_time,
            'cook_time': cook_time,
            'serving': serving,
            'ingredients': ingredient,
            'steps': step,
            'comment_link': reverse('comment_view') + f'?id={recipe_id}',
            'images': images,
            'videos': videos,
            'rating': recipe.reviews.aggregate(Avg("rating"))['rating__avg'],
            'rating_quant': recipe.reviews.count(),
            'my_rating': my_rating,
            'favorite': recipe.favorite.count(),
            'curr_user_favorite': curr_user_favorite,
        }
        return Response(payload)

    else:
        return HttpResponseNotAllowed(['GET'])


@api_view(['GET'])
@permission_classes((AllowAny,))
def comment_view(request):
    if request.method == 'GET':
        # Check
        recipe_id = request.GET.get('id', '')
        try:
            recipe_id = int(recipe_id)
        except ValueError:
            return HttpResponseBadRequest("Invalid recipe ID")
        page_num = request.GET.get('page', 1)
        page_size = request.GET.get('page_size', 12)
        if page_num == '':
            page_num = 1
        if page_size == '':
            page_size = 12
        try:
            page_num = abs(int(page_num))
            page_size = abs(int(page_size))
        except ValueError:
            return HttpResponseBadRequest("Invalid page value or page_size")
        if page_size < 1:
            page_size = 12

        # Pagination setup
        reviews = RecipeReview.objects.filter(recipe=recipe_id)
        user_rating = None
        if request.user:
            if request.user.is_authenticated:
                user_rating = reviews.filter(user=request.user).first()
                if user_rating:
                    user_rating = user_rating.rating
        paginator = Paginator(reviews, page_size)
        page_obj = paginator.get_page(page_num)
        payload = {}
        lst = []
        for r in page_obj:
            lst.append({
                'name':r.user.username,
                'rating': str(r.rating),
                'comment': r.comment,
                'avatar': r.user.profile.avatar.url,
                'images': [img.image.url for img in r.images.all()],
                'videos': [vid.video.url for vid in r.videos.all()],
            })
        payload['total_page'] = paginator.num_pages

        payload['total_review'] = reviews.count()
        payload['data'] = lst
        payload['curr_user_rating'] = user_rating
        return Response(payload)

    else:
        return HttpResponseNotAllowed(['GET'])


@api_view(['GET'])
def ingredient_autocomplete(request):
    if request.method == "GET":
        ingredients = Ingredient.objects.all().order_by('name')
        content = []
        for i in ingredients:
            content.append({"name": i.name})
        payload = {"data": content}
        return Response(payload)
    else:
        return HttpResponseNotAllowed(["GET"])


@api_view(['GET'])
def diet_autocomplete(request):
    if request.method == "GET":
        diets = Diet.objects.all().order_by('name')
        content = []
        for i in diets:
            content.append({"name": i.name})
        payload = {"data": content}
        return Response(payload)
    else:
        return HttpResponseNotAllowed(["GET"])


@api_view(['GET'])
def cuisine_autocomplete(request):
    if request.method == "GET":
        cuisines = Cuisine.objects.all().order_by('name')
        content = []
        for i in cuisines:
            content.append({"name": i.name})
        payload = {"data": content}
        return Response(payload)
    else:
        return HttpResponseNotAllowed(["GET"])


@api_view(['GET'])
@permission_classes((AllowAny,))
def search(request):
    if request.method == "GET":
        search_input = request.GET.get('input', '')
        cuisine = request.GET.get('cuisine', '')
        diet = request.GET.get('diet', '')
        cooktime_min = request.GET.get('cooktime_min', -sys.maxsize)
        cooktime_max = request.GET.get('cooktime_max', sys.maxsize)
        sort_by_rating = request.GET.get('sort_by_rating', '')
        sort_by_favorite = request.GET.get('sort_by_favorite', '')

        page_num = request.GET.get('page', 1)
        page_size = request.GET.get('page_size', 12)
        if page_num == '':
            page_num = 1
        if page_size == '':
            page_size = 12
        try:
            page_num = abs(int(page_num))
            page_size = abs(int(page_size))
        except ValueError:
            return HttpResponseBadRequest("Invalid page value or page_size")
        if page_size < 1:
            page_size = 12
        recipe = Recipe.objects.all()

        if search_input != '':
            # Filter name
            search_input = search_input.split(',')
            name_recipe = recipe.all()
            name_recipe = name_recipe.filter(
                reduce(lambda x, y: x | y, [Q(name__icontains=word) for word in search_input]))

            # Filter ingredient
            ingredient_recipe = recipe.all()
            ingredient_recipe = ingredient_recipe.filter(
                reduce(lambda x, y: x | y, [Q(ingredients__ingredient__name__icontains=word) for word in search_input]))

            # Filter creator
            creator_recipe = recipe.all()
            creator_recipe = creator_recipe.filter(
                reduce(lambda x, y: x | y, [Q(owner__username__icontains=word) for word in search_input]))

            # Combine all recipe from previous result, eliminating duplicates
            recipe = (name_recipe | ingredient_recipe | creator_recipe).distinct()
        if cuisine != '':
            cuisine = cuisine.split(',')
            recipe = recipe.filter(cuisines__cuisine__name__in=cuisine)
        if diet != '':
            diet = diet.split(',')
            recipe = recipe.filter(diets__diet__name__in=diet)

        try:
            min_time = int(cooktime_min)
            max_time = int(cooktime_max)
            recipe = recipe.filter(Q(cook_time__gte=min_time) & Q(cook_time__lte=max_time))
        except ValueError:
            return HttpResponseBadRequest("Incorrect cook time format")
        if sort_by_rating != '' and sort_by_favorite != '':
            recipe = recipe.annotate(avg_rating=Avg('reviews__rating'), count_favorite=Count('favorite')).order_by(
                '-avg_rating', '-count_favorite')
        elif sort_by_rating != '' and sort_by_favorite == '':
            recipe = recipe.annotate(avg_rating=Avg('reviews__rating')).order_by('-avg_rating')
        elif sort_by_rating == '' and sort_by_favorite != '':
            recipe = recipe.annotate(count_favorite=Count('favorite')).order_by('-count_favorite')
        pagination = Paginator(recipe, page_size)
        page_obj = pagination.get_page(page_num)
        payload = {}
        data = []
        for r in page_obj:
            img = r.images.filter(review=None).first()
            if img:
                img = img.image.url
            else:
                img = None
            data.append({
                'id': str(r.id),
                'name': r.name,
                'owner': r.owner.username,
                'average_rating': r.reviews.aggregate(Avg('rating'))['rating__avg'],
                'tags': list(r.cuisines.all().values_list('cuisine__name', flat=True)) + list(r.diets.all().
                                                                                              values_list('diet__name',
                                                                                                          flat=True)),
                'icon': img
            })
        payload['data'] = data
        payload['max_page'] = pagination.num_pages
        return Response(payload)

    else:
        return HttpResponseNotAllowed(["GET"])


@api_view(['GET'])
def user_list(request):
    if request.method == 'GET':
        page_num = request.GET.get('page', 1)
        page_size = request.GET.get('page_size', 12)
        if page_num == '':
            page_num = 1
        if page_size == '':
            page_size = 12
        list_type = request.GET.get('type', '')
        if list_type not in ['owned', 'favorite', 'interacted']:
            return HttpResponseBadRequest("type must be one of [owned, favorite, interacted]")
        try:
            page_num = abs(int(page_num))
            page_size = abs(int(page_size))
        except ValueError:
            return HttpResponseBadRequest("Invalid page value or page_size")
        if list_type == 'owned':
            recipe = Recipe.objects.filter(owner=request.user)
        elif list_type == 'favorite':
            recipe = request.user.favorite_recipes.all()
        else:
            recipe = request.user.interacted_recipes.all()
        paginator = Paginator(recipe, page_size)
        page_obj = paginator.get_page(page_num)
        content = {}
        data = []
        for r in page_obj:
            try:
                r = r.recipe
            # Only will trigger if list_type == "owned" due to different data structure
            except AttributeError:
                pass
            img = r.images.filter(review=None).first()
            if img:
                img = img.image.url
            else:
                img = None
            data.append({
                'id': str(r.id),
                'name': r.name,
                'owner': r.owner.username,
                'average_rating': r.reviews.aggregate(Avg('rating'))['rating__avg'],
                'tags': list(r.cuisines.all().values_list('cuisine__name', flat=True)) + list(r.diets.all().
                                                                                              values_list('diet__name',
                                                                                                          flat=True)),
                'icon': img,
            })
        content['data'] = data
        content['max_page'] = paginator.num_pages
        return Response(content)

    else:
        return HttpResponseNotAllowed(['GET'])


@api_view(['POST'])
def add_cart(request):
    if request.method == "POST":
        recipe_id = request.POST.get('id', '')
        amount = request.POST.get('amount', '')
        try:
            recipe_id = int(recipe_id)
            amount = int(amount)
        except ValueError:
            return HttpResponseBadRequest("Invalid recipe Id or amount, must be integer value")
        if amount < 1:
            return HttpResponseBadRequest("Invalid amount value, must be >= 1")
        recipe = Recipe.objects.filter(id=recipe_id).first()
        if recipe:
            obj = UserCart.objects.get_or_create(user=request.user, recipe=recipe)[0]
            # Add to cart
            UserInteractedRecipe.objects.get_or_create(user=request.user, recipe=recipe)
            obj.amount = amount
            obj.save()
            return HttpResponse('Done')
        else:
            return HttpResponseBadRequest('Recipe does not exist')
    else:
        return HttpResponseNotAllowed(['POST'])


@api_view(['POST'])
def edit_cart(request):
    if request.method == "POST":
        recipe_id = request.POST.get('id', '')
        amount = request.POST.get('amount', '')
        try:
            recipe_id = int(recipe_id)
            amount = int(amount)
        except ValueError:
            return HttpResponseBadRequest("Invalid recipe Id or amount, must be integer value")
        recipe = Recipe.objects.filter(id=recipe_id).first()
        if recipe:
            obj = UserCart.objects.filter(user=request.user, recipe=recipe).first()
            if obj:
                if amount < 1:
                    # Delete obj
                    obj.delete()
                    return HttpResponse("Recipe Deleted")
                else:
                    # Update obj
                    obj.amount = amount
                    obj.save()
                    return HttpResponse('Recipe Amount updated')
            else:
                return HttpResponseBadRequest('Recipe does not exist in the cart')
        else:
            return HttpResponseBadRequest('Recipe does not exist')
    else:
        return HttpResponseNotAllowed(['POST'])


@api_view(['GET'])
def cart_list(request):
    if request.method == "GET":
        cart_lst = request.user.cart.all()
        payload = {}
        ingredients = {}
        data = []
        for obj in cart_lst:
            data.append({
                        'id': str(obj.recipe.id),
                        'name': obj.recipe.name,
                        'quant': obj.amount,
                        'ingredients': obj.recipe.ingredients.values_list(
                            'ingredient__name', flat=True),
                        'ingredient_amount': obj.recipe.ingredients.values_list('amount',
                                                                                flat=True),
            })
        payload['data'] = data
        return Response(payload)
    else:
        return HttpResponseNotAllowed(['GET'])

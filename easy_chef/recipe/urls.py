from django.urls import path

from recipe.views import recipe_create, recipe_edit, recipe_delete, add_review, edit_rating, add_fav_recipe, \
    delete_fav_recipe, delete_interacted_recipe, ingredient_list, diet_list, cuisine_list, recipe_view, comment_view, \
    ingredient_autocomplete, search, user_list, add_cart, edit_cart, cart_list, diet_autocomplete, cuisine_autocomplete

urlpatterns = [
    path('create/', recipe_create),
    path('edit/', recipe_edit),
    path('delete/', recipe_delete),
    path('review_add/', add_review),
    path('rating_edit/', edit_rating),
    path('favorite/add/', add_fav_recipe),
    path('favorite/delete/', delete_fav_recipe),
    path('interacted/delete/', delete_interacted_recipe),
    path('ingredients/', ingredient_list),
    path('diets/', diet_list),
    path('cuisines/', cuisine_list),
    path('recipe_view/', recipe_view, name='recipe_view'),
    path('comment_view/', comment_view, name='comment_view'),
    path('ingredient_autocomplete/', ingredient_autocomplete),
    path('diet_autocomplete/', diet_autocomplete),
    path('cuisine_autocomplete/', cuisine_autocomplete),
    path('search/', search),
    path('user_list/', user_list),
    path('add_to_cart/', add_cart),
    path('edit_cart/', edit_cart),
    path('cart/', cart_list)
]

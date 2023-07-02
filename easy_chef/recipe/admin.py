from django.contrib import admin

from recipe.models import Recipe, Diet, Cuisine, Ingredient, RecipeDiet, RecipeCuisine, RecipeIngredient, RecipeStep, \
    RecipeImage, RecipeVideo, RecipeReview, RecipeBase, UserCart, UserFavoriteRecipe, UserInteractedRecipe

# Register your models here.
admin.site.register(Recipe)
admin.site.register(Diet)
admin.site.register(Cuisine)
admin.site.register(Ingredient)
admin.site.register(RecipeDiet)
admin.site.register(RecipeCuisine)
admin.site.register(RecipeIngredient)
admin.site.register(RecipeStep)
admin.site.register(RecipeImage)
admin.site.register(RecipeVideo)
admin.site.register(RecipeReview)
admin.site.register(RecipeBase)
admin.site.register(UserCart)
admin.site.register(UserFavoriteRecipe)
admin.site.register(UserInteractedRecipe)
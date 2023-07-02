from django.contrib.auth.models import User
from django.db import models


# Create your models here.
class Recipe(models.Model):
    """
    Model that stores basic information about a recipe (Need additional table for base recipe)
    """
    # Required
    owner = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='recipe')
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True, default='')
    prep_time = models.IntegerField(blank=True, default=0)
    cook_time = models.IntegerField(blank=True, default=0)
    serving = models.PositiveIntegerField(default=1)

    def __str__(self):
        return self.name


class Diet(models.Model):
    """
    Model that stores all type of diets in the database
    """
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Cuisine(models.Model):
    """
    Model that stores all types of cuisine in the database
    """
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Ingredient(models.Model):
    """
    Model that stores all ingredients in the database
    """
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class RecipeDiet(models.Model):
    """
    Diet for a specific recipe
    """
    recipe = models.ForeignKey(to=Recipe, on_delete=models.CASCADE, related_name='diets')
    diet = models.ForeignKey(to=Diet, on_delete=models.CASCADE)


class RecipeCuisine(models.Model):
    """
    Cuisine for a specific recipe
    """
    recipe = models.ForeignKey(to=Recipe, on_delete=models.CASCADE, related_name='cuisines')
    cuisine = models.ForeignKey(to=Cuisine, on_delete=models.CASCADE)


class RecipeIngredient(models.Model):
    """
    Ingredients for a specific recipe
    """
    recipe = models.ForeignKey(to=Recipe, on_delete=models.CASCADE, related_name='ingredients')
    ingredient = models.ForeignKey(to=Ingredient, on_delete=models.CASCADE)
    amount = models.CharField(max_length=50, blank=True, default='appropriate amount')


class RecipeStep(models.Model):
    """
    Steps for a specific recipe
    """
    recipe = models.ForeignKey(to=Recipe, on_delete=models.CASCADE, related_name='steps')
    # Using additional identifier to incase default ID messed up
    order = models.PositiveIntegerField()
    content = models.TextField()


class RecipeReview(models.Model):
    """
    Rating and review from a specific user to a specific recipe
    """
    recipe = models.ForeignKey(to=Recipe, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveIntegerField(blank=True, default=5)
    comment = models.TextField(blank=True, default='')


class RecipeImage(models.Model):
    """
    Photos of a specific recipe from a specific user (can be from review section)
    """
    recipe = models.ForeignKey(to=Recipe, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='recipe/images/')
    image_hash = models.CharField(max_length=65535)
    review = models.ForeignKey(to=RecipeReview, on_delete=models.CASCADE, related_name='images', blank=True, null=True)


class RecipeVideo(models.Model):
    """
    Videos of a specific recipe (can be from review section)
    """
    recipe = models.ForeignKey(to=Recipe, on_delete=models.CASCADE, related_name='videos')
    video = models.FileField(upload_to='recipe/videos/')
    video_hash = models.CharField(max_length=65535)
    review = models.ForeignKey(to=RecipeReview, on_delete=models.CASCADE, related_name='videos', blank=True, null=True)


class RecipeBase(models.Model):
    """
    Stores the base recipe of a specific recipe
    """
    curr = models.OneToOneField(to=Recipe, on_delete=models.CASCADE, related_name='curr_recipe')
    base = models.ForeignKey(to=Recipe, on_delete=models.SET_NULL, null=True, related_name='base_recipe')


class UserCart(models.Model):
    """
    Model that contains all recipe a user added to the cart
    """
    user = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='cart')
    recipe = models.ForeignKey(to=Recipe, on_delete=models.CASCADE)
    amount = models.PositiveIntegerField(blank=True, default=1)


class UserFavoriteRecipe(models.Model):
    """
    Contains all favorite recipe of a specific user
    """
    user = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='favorite_recipes')
    recipe = models.ForeignKey(to=Recipe, on_delete=models.CASCADE, related_name='favorite')


class UserInteractedRecipe(models.Model):
    """
    Contains all recipe that user interacted with
    """
    user = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='interacted_recipes')
    recipe = models.ForeignKey(to=Recipe, on_delete=models.CASCADE)

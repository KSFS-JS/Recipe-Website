import json

from django import forms

from recipe.models import Recipe


class RecipeCreateForm(forms.Form):
    base = forms.IntegerField(required=False)
    name = forms.CharField(max_length=50)
    diets = forms.CharField(max_length=512)
    cuisines = forms.CharField(max_length=512)
    description = forms.CharField(max_length=4096, required=False)
    ingredients = forms.CharField(max_length=4096)
    prep_time = forms.IntegerField(required=False)
    cook_time = forms.IntegerField(required=False)
    serving = forms.IntegerField()
    steps = forms.CharField(max_length=8192)

    def clean(self):
        data = super().clean()
        base = data.get('base', '')
        serving = data.get('serving', '')
        ingredients = data.get('ingredients', '')
        steps = data.get('steps', '')
        prep_time = data.get('prep_time', '')
        cook_time = data.get('cook_time', '')
        try:
            ingredients = json.loads(ingredients)
        except ValueError:
            self.add_error('ingredients', 'Incorrect Json format')
        try:
            steps = json.loads(steps)
        except ValueError:
            self.add_error('steps', 'Incorrect Json format')
        try:
            serving = int(serving)
            if serving < 1:
                self.add_error('serving', 'Serving must be >= 1')
        except ValueError:
            self.add_error('serving', 'Serving must be an integer >= 1')
        if base:
            r = Recipe.objects.filter(id=base)
            if not r:
                self.add_error('base', 'Base recipe does not exist')
        if prep_time:
            try:
                prep_time = int(prep_time)
                if prep_time < 1:
                    self.add_error('prep_time', 'Invalid prep_time, must be an integer >= 1', )
            except (ValueError, TypeError):
                self.add_error('prep_time', 'Invalid prep_time, must be an integer >= 1', )
        else:
            data['prep_time'] = -1
        if cook_time:
            try:
                cook_time = int(cook_time)
                if cook_time < 1:
                    self.add_error('cook_time', 'Invalid prep_time, must be an integer >= 1', )
            except (ValueError, TypeError):
                self.add_error('cook_time', 'Invalid prep_time, must be an integer >= 1', )
        else:
            data['cook_time'] = -1
        return data


class RecipeEditForm(forms.Form):
    base = forms.IntegerField(required=False)
    name = forms.CharField(max_length=50, required=False)
    diets = forms.CharField(max_length=512, required=False)
    cuisines = forms.CharField(max_length=512, required=False)
    description = forms.CharField(max_length=4096, required=False)
    ingredients = forms.CharField(max_length=4096, required=False)
    prep_time = forms.IntegerField(required=False)
    cook_time = forms.IntegerField(required=False)
    serving = forms.IntegerField(required=False)
    steps = forms.CharField(max_length=8192, required=False)

    def clean(self):
        data = super().clean()
        base = data.get('base', '')
        serving = data.get('serving', '')
        ingredients = data.get('ingredients', '')
        steps = data.get('steps', '')
        prep_time = data.get('prep_time', '')
        cook_time = data.get('cook_time', '')
        if ingredients != '':
            try:
                ingredients = json.loads(ingredients)
            except ValueError:
                self.add_error('ingredients', 'Incorrect Json format')
        if steps != '':
            try:
                steps = json.loads(steps)
            except ValueError:
                self.add_error('steps', 'Incorrect Json format')
        if serving:
            try:
                serving = int(serving)
                if serving < 1:
                    self.add_error('serving', 'Serving must be >= 1')
            except ValueError:
                self.add_error('serving', 'Serving must be an integer >= 1')
        if base:
            r = Recipe.objects.filter(id=base)
            if not r:
                self.add_error('base', 'Base recipe does not exist')
        if prep_time:
            try:
                prep_time = int(prep_time)
                if prep_time < 1:
                    self.add_error('prep_time', 'Invalid prep_time, must be an integer >= 1', )
            except (ValueError, TypeError):
                self.add_error('prep_time', 'Invalid prep_time, must be an integer >= 1', )
        else:
            data['prep_time'] = -1
        if cook_time:
            try:
                cook_time = int(cook_time)
                if cook_time < 1:
                    self.add_error('cook_time', 'Invalid prep_time, must be an integer >= 1', )
            except (ValueError, TypeError):
                self.add_error('cook_time', 'Invalid prep_time, must be an integer >= 1', )
        else:
            data['cook_time'] = -1
        return data


class ReviewForm(forms.Form):
    id = forms.CharField(required=False)
    rating = forms.IntegerField(required=False)
    comment = forms.CharField(required=False, max_length=4096)

    def clean(self):
        data = super().clean()
        rating = data.get('rating', '')
        try:
            rating = int(rating)
            if rating < 1 or rating > 5:
                self.add_error('rating', 'Give an integer value between 1-5')
        except ValueError:
            self.add_error('rating', "Give an integer value between 1-5")
        recipe_id = data.get('id', '')
        if not (r := Recipe.objects.filter(id=recipe_id)):
            self.add_error('id', 'Invalid recipe id')
        return data


class RatingEditForm(forms.Form):
    id = forms.CharField()
    rating = forms.IntegerField()

    def clean(self):
        data = super().clean()
        rating = data.get('rating', '')
        try:
            rating = int(rating)
            if rating < 1 or rating > 5:
                self.add_error('rating', 'Give an integer value between 1-5')
        except ValueError:
            self.add_error('rating', "Give an integer value between 1-5")
        recipe_id = data.get('id', '')
        if not (r := Recipe.objects.filter(id=recipe_id)):
            self.add_error('id', 'Invalid recipe id')
        return data


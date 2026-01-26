from django.db import models
from django.contrib.auth.models import User

class Page(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Media(models.Model):
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='uploads/')  # файлы будут сохраняться в media/uploads/
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _
class Page(models.Model):

    STATUS_CHOICES = (
        ("published", "Published"),
        ("draft", "Draft"),
    )

    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)

    content = models.TextField(blank=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="draft"
    )

    author = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

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


class PageBlock(models.Model):
    class BlockType(models.TextChoices):
        TEXT = 'text', _('Text')
        IMAGE = 'image', _('Image')
        FILE = 'file', _('File')
        LIST = 'list', _('List')
        TABLE = 'table', _('Table')
        HERO = 'hero', _('Hero/CTA')
        VIDEO = 'video', _('Video')

    page = models.ForeignKey(Page, related_name='blocks', on_delete=models.CASCADE)
    block_type = models.CharField(max_length=20, choices=BlockType.choices)
    order = models.PositiveIntegerField(default=0)

    title = models.CharField(max_length=255, blank=True)  # новое поле
    content = models.JSONField(default=dict)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.page.title} - {self.block_type} ({self.order})"


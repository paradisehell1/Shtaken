from rest_framework import viewsets
from .models import Page, Media
from .serializers import PageSerializer, MediaSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, permissions
from .models import Media
from .serializers import MediaSerializer
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Media

class PageViewSet(viewsets.ModelViewSet):
    queryset = Page.objects.all().order_by('-created_at')
    serializer_class = PageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # автоматически ставим текущего пользователя как автора
        serializer.save(author=self.request.user)

class MediaViewSet(viewsets.ModelViewSet):
    queryset = Media.objects.all()
    serializer_class = MediaSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        # Если имя не передано, ставим имя файла
        file = self.request.data.get('file')
        name = self.request.data.get('name') or (file.name if file else "unnamed")
        serializer.save(name=name)

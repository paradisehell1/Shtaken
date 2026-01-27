from rest_framework import viewsets, filters
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
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import Page,PageBlock
from .serializers import PageSerializer
from .serializers import PageSerializer, PageBlockSerializer
class PageViewSet(ModelViewSet):


    queryset = Page.objects.all()   # 👈 ВАЖНО
    serializer_class = PageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Page.objects.all().order_by("-created_at")

        status = self.request.query_params.get("status")
        if status:
            qs = qs.filter(status=status)

        return qs

    def perform_create(self, serializer):
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

class PageViewSet(viewsets.ModelViewSet):
    queryset = Page.objects.all()
    serializer_class = PageSerializer
    permission_classes = [permissions.IsAuthenticated]

class PageBlockViewSet(viewsets.ModelViewSet):
    queryset = PageBlock.objects.all()
    serializer_class = PageBlockSerializer
    permission_classes = [permissions.IsAuthenticated]
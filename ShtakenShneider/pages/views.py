from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
import logging
from rest_framework.exceptions import ValidationError
from .models import Page, Media, PageBlock
from .serializers import PageSerializer, MediaSerializer, PageBlockSerializer

logger = logging.getLogger(__name__)


# ------------------------
# PAGES
# ------------------------

class PageViewSet(ModelViewSet):
    queryset = Page.objects.all().order_by("-created_at")
    serializer_class = PageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()

        status_param = self.request.query_params.get("status")
        if status_param:
            qs = qs.filter(status=status_param)

        return qs

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


# ------------------------
# MEDIA
# ------------------------

class MediaViewSet(ModelViewSet):
    queryset = Media.objects.all()
    serializer_class = MediaSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        file = self.request.data.get("file")

        # ❗ если файл не передан — не сохраняем
        if not file:
            raise ValidationError({"file": "File is required"})

        name = self.request.data.get("name") or file.name

        serializer.save(
            file=file,
            name=name
        )


# ------------------------
# BLOCKS
# ------------------------

class PageBlockViewSet(ModelViewSet):
    queryset = PageBlock.objects.all()
    serializer_class = PageBlockSerializer
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        block = self.get_object()

        logger.info(f"Deleting block id={block.id}")

        block.delete()

        return Response({"success": True}, status=status.HTTP_200_OK)

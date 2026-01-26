from rest_framework.routers import DefaultRouter
from .views import PageViewSet, MediaViewSet
from rest_framework import routers
from .views import MediaViewSet
router = DefaultRouter()
router.register(r'pages', PageViewSet)
router.register(r'media', MediaViewSet, basename='media')

urlpatterns = router.urls

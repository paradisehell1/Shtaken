from rest_framework.routers import DefaultRouter
from .views import PageViewSet, MediaViewSet, PageBlockViewSet
from rest_framework import routers
router = DefaultRouter()
router.register(r'pages', PageViewSet)
router.register(r'media', MediaViewSet, basename='media')
router.register(r'blocks', PageBlockViewSet)
urlpatterns = router.urls

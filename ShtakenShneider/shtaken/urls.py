from django.urls import path
from . import views

urlpatterns = [
    path('', views.booking, name='booking'),
    path('api/bookings/', views.get_bookings, name='get_bookings'),
    path('miniApp', views.miniApp, name='miniApp'),
]

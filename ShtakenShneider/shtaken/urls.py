# ShtakenShneider/urls.py
from django.contrib import admin
from django.urls import path, re_path
from shtaken import views

urlpatterns = [
    path('', views.booking, name='booking'),
    path('banket/', views.banket, name='banket'),  # главная
    path('api/bookings/', views.get_bookings, name='get_bookings'),
    path('admin/', admin.site.urls),
    path('debug/', views.debug_proto),

]

# ShtakenShneider/urls.py
from django.contrib import admin
from django.urls import path, re_path
from shtaken import views

urlpatterns = [
    path('', views.booking, name='booking'),               # главная
    re_path(r'^miniApp/?$', views.miniApp, name='miniApp'), # optional slash
    path('api/bookings/', views.get_bookings, name='get_bookings'),
    path('admin/', admin.site.urls),
    path('debug/', views.debug_proto),

]

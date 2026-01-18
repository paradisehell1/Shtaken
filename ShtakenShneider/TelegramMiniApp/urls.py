from django.contrib import admin
from django.urls import path, re_path
from TelegramMiniApp import views

urlpatterns = [
    path('', views.miniApp, name='miniApp'),               # главная
    path('<int:booking_id>/', views.booking_detail, name='booking_detail'),
    path('change_status/', views.change_status, name='change_status'),
]
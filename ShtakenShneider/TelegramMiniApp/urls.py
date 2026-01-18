from django.contrib import admin
from django.urls import path, re_path
from TelegramMiniApp import views

urlpatterns = [
    path('', views.miniApp, name='miniApp'),
    path('miniAppBanket/', views.miniAppBanket, name='miniAppBanket'),
    path('change_status/', views.change_status, name='change_status'),
    path('change_status_banket/', views.change_status_banket, name='change_status_banket'),
]
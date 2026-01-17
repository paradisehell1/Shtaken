from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ("first_name", "last_name", "phone", "guests", "hall", "created_at")
    list_filter = ("hall", "created_at")
    search_fields = ("first_name", "last_name", "phone")

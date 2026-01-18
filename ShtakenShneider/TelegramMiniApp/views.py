from django.shortcuts import render, get_object_or_404
from shtaken.models import Booking ,BookingBanket  # берем модель из shtaken
from django.http import JsonResponse


# views.py
def miniApp(request):
    # Берем все бронирования, сортируем по дате
    bookings = Booking.objects.all().order_by('-created_at')

    # Фильтруем на новые и обработанные
    new_bookings = bookings.filter(status='waiting')
    processed_bookings = bookings.filter(status__in=['confirmed', 'cancelled'])

    return render(request, "MiniApp.html", {
        'new_bookings': new_bookings,
        'processed_bookings': processed_bookings,
        'bookings': bookings,  # для сводки сверху
    })

def change_status(request):
    if request.method == "POST":
        booking_id = request.POST.get('id')
        new_status = request.POST.get('status')
        try:
            booking = Booking.objects.get(id=booking_id)
            booking.status = new_status
            booking.save()
            return JsonResponse({'success': True, 'status': new_status})
        except Booking.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Booking not found'})
    return JsonResponse({'success': False, 'error': 'Invalid request'})


# Страница со списком банкетных бронирований
def miniAppBanket(request):
    # Берем все бронирования, сортируем по дате
    bookings = BookingBanket.objects.all().order_by('-created_at')

    # Фильтруем на новые и обработанные
    new_bookings = bookings.filter(status='waiting')
    processed_bookings = bookings.filter(status__in=['confirmed', 'cancelled'])

    return render(request, "MiniAppBanket.html", {
        'new_bookings': new_bookings,
        'processed_bookings': processed_bookings,
        'bookings': bookings,  # для сводки сверху
    })

# AJAX для смены статуса банкетного бронирования
def change_status_banket(request):
    if request.method == "POST":
        booking_id = request.POST.get('id')
        new_status = request.POST.get('status')
        try:
            booking = BookingBanket.objects.get(id=booking_id)
            booking.status = new_status
            booking.save()
            return JsonResponse({'success': True, 'status': new_status})
        except BookingBanket.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Booking not found'})
    return JsonResponse({'success': False, 'error': 'Invalid request'})
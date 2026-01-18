from django.shortcuts import render, get_object_or_404
from shtaken.models import Booking ,BookingBanket  # берем модель из shtaken
from django.http import JsonResponse


# views.py
def miniApp(request):
    bookings = Booking.objects.all().order_by('-created_at')
    new_bookings = bookings.filter(status='waiting')
    processed_bookings = bookings.filter(status__in=['confirmed', 'cancelled'])

    # Количество новых банкетов для вкладки
    new_bankets_count = BookingBanket.objects.filter(status='waiting').count()

    return render(request, "MiniApp.html", {
        'new_bookings': new_bookings,
        'processed_bookings': processed_bookings,
        'bookings': bookings,
        'new_count': new_bookings.count(),
        'new_bankets_count': new_bankets_count,
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
    bookings = BookingBanket.objects.all().order_by('-created_at')
    new_bookings = bookings.filter(status='waiting')
    processed_bookings = bookings.filter(status__in=['confirmed', 'cancelled'])

    # Количество новых столов для вкладки
    new_tables_count = Booking.objects.filter(status='waiting').count()
    print(new_tables_count)
    return render(request, "MiniAppBanket.html", {
        'new_bookings': new_bookings,
        'processed_bookings': processed_bookings,
        'bookings': bookings,
        'new_count': new_bookings.count(),
        'new_tables_count': new_tables_count,
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
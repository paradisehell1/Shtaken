from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from .models import Booking
import requests
import json
import threading


def booking(request):
    if request.method == "POST":
        first_name = request.POST.get("first_name", "")
        last_name = request.POST.get("last_name", "")
        phone = request.POST.get("phone", "")
        guests = request.POST.get("guests", "")
        hall = request.POST.get("hall", "")
        status="waiting"
        comments = request.POST.get("comments", "")

        booking = Booking.objects.create(
            first_name=first_name,
            last_name=last_name,
            phone=phone,
            guests=guests,
            hall=hall,
            status=status,
            comments=comments
        )

        message = (
            f"Новая бронь!\n"
            f"Имя: {first_name}\n"
            f"Фамилия: {last_name}\n"
            f"Телефон: {phone}\n"
            f"Гостей: {guests}\n"
            f"Зал: {hall}\n"
            f"Комментарии: {comments}"
        )

        reply_markup = {
            "inline_keyboard": [
                [
                   # {"text": "🍽 Открыть бронирование", "web_app": {"url": WEB_APP_URL}}
                ]
            ]
        }

        #try:
           # requests.post(TELEGRAM_API_URL, data={
            #    "chat_id": CHAT_ID,
             #   "text": message,
             #   "reply_markup": json.dumps(reply_markup)
            #})
        #except Exception as e:
         #   print("Ошибка отправки Telegram:", e)

        return HttpResponse(f"Бронь сохранена! ID: {booking.id}")

    return render(request, "booking.html")
def get_bookings(request):
    """
    Возвращает список всех бронирований в JSON
    """
    # Можно фильтровать по дате или chat_id если нужно
    bookings = Booking.objects.all().order_by('-created_at')
    data = []

    for b in bookings:
        data.append({
            "first_name": b.first_name,
            "last_name": b.last_name,
            "phone": b.phone,
            "guests": b.guests,
            "hall": b.hall,
            "comments": b.comments,
            "created_at": b.created_at.strftime("%Y-%m-%d %H:%M")
        })

    return JsonResponse(data, safe=False)




def debug_proto(request):
    return HttpResponse(f"""
        scheme: {request.scheme}<br>
        X-Forwarded-Proto: {request.META.get('HTTP_X_FORWARDED_PROTO')}<br>
        is_secure(): {request.is_secure()}
    """)
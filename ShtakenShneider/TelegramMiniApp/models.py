from django.db import models

# Create your models here.
class Booking(models.Model):
    first_name = models.CharField("Имя", max_length=50)
    last_name = models.CharField("Фамилия", max_length=50)
    phone = models.CharField("Телефон", max_length=20)
    guests = models.PositiveIntegerField("Количество гостей")
    hall = models.CharField("Зал", max_length=10)
    comments = models.TextField("Комментарии", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} — {self.hall}"
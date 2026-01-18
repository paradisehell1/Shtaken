from django.shortcuts import render

# Create your views here.

def miniApp(request):
    return render(request, "MiniApp.html")
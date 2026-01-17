# ShtakenShneider/settings.py
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# ==============================
# Основные настройки
# ==============================
SECRET_KEY = 'django-insecure-y7958($-iargdwfx@id(kqb5v$(o0+qjn%$2*)i2z&i1(uwui4'
DEBUG = False

ALLOWED_HOSTS = [
    'dfgfdfgdgffdgfdf.website',
    'www.dfgfdfgdgffdgfdf.website',
    '195.161.54.46',  # если нужен доступ по IP
]

# ==============================
# Приложения
# ==============================
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'shtaken',
]

# ==============================
# Middleware
# ==============================
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# ==============================
# URLs и WSGI
# ==============================
ROOT_URLCONF = 'ShtakenShneider.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'ShtakenShneider.wsgi.application'

# ==============================
# База данных
# ==============================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# ==============================
# Безопасность HTTPS
# ==============================
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = False  # редирект делает Nginx
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000  # HTTP Strict Transport Security
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# ==============================
# Статика
# ==============================
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'static/'

# ==============================
# Локализация и время
# ==============================
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ==============================
# Дополнительно
# ==============================
APPEND_SLASH = True

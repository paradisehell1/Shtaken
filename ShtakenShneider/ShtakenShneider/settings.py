# ShtakenShneider/settings.py
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# ==============================
# ОСНОВНЫЕ
# ==============================
SECRET_KEY = 'dev-secret-key'
DEBUG = True

ALLOWED_HOSTS = ['127.0.0.1', 'localhost']

# ==============================
# ПРИЛОЖЕНИЯ
# ==============================
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'shtaken',
    'TelegramMiniApp',
]

# ==============================
# MIDDLEWARE
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
# URLS
# ==============================
ROOT_URLCONF = 'ShtakenShneider.urls'

# ==============================
# ШАБЛОНЫ
# ==============================
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

# ==============================
# WSGI
# ==============================
WSGI_APPLICATION = 'ShtakenShneider.wsgi.application'

# ==============================
# DATABASE
# ==============================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# ==============================
# STATIC
# ==============================
STATIC_URL = '/static/'

# ==============================
# I18N
# ==============================
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ==============================
# DEFAULT PK
# ==============================
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ==============================
# DEV ONLY
# ==============================
APPEND_SLASH = True

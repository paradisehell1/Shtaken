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

    # REST & Auth
    'rest_framework',
    'rest_framework.authtoken',
    'djoser',
    'corsheaders',

    # Приложения проекта
    'pages',
    'shtaken',
    'TelegramMiniApp',
]

# ==============================
# MIDDLEWARE
# ==============================
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # <- важно поставить первым
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
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "loggers": {
        # Логгер для твоего приложения
        "pages": {
            "handlers": ["console"],
            "level": "INFO",  # выводим INFO и выше
        },
        # Логгер Django
        "django": {
            "handlers": ["console"],
            "level": "INFO",
        },
    },
}
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
# STATIC & MEDIA
# ==============================
STATIC_URL = '/static/'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# ==============================
# REST FRAMEWORK
# ==============================
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

# ==============================
# DJOSER
# ==============================
DJOSER = {
    'USER_ID_FIELD': 'id',
    'LOGIN_FIELD': 'username',
    'TOKEN_MODEL': 'rest_framework.authtoken.models.Token',
}

# ==============================
# CORS
# ==============================
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

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

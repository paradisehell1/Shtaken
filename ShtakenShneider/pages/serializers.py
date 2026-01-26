from rest_framework import serializers
from .models import Page, Media

class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = ['id', 'title', 'slug', 'content', 'author', 'created_at', 'updated_at']
        read_only_fields = ['id', 'author', 'created_at', 'updated_at']

class MediaSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Media
        fields = ['id', 'name', 'file', 'file_url', 'created_at']

    def get_file_url(self, obj):
        request = self.context.get("request")
        print("Serializing media:", obj.name)
        if obj.file:
            url = request.build_absolute_uri(obj.file.url)
            print("File URL:", url)
            return url
        print("No file")
        return None

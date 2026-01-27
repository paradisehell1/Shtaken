from rest_framework import serializers
from .models import Page, Media,PageBlock
import logging
logger = logging.getLogger(__name__)
class PageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Page
        fields = [
            "id",
            "title",
            "slug",
            "content",
            "status",
            "created_at",
            "updated_at",
        ]

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

class PageBlockSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)  # для существующих блоков
    title = serializers.CharField(required=False, allow_blank=True)
    content = serializers.JSONField()

    class Meta:
        model = PageBlock
        fields = ['id', 'block_type', 'title', 'content', 'order']

class PageSerializer(serializers.ModelSerializer):
    blocks = PageBlockSerializer(many=True)

    class Meta:
        model = Page
        fields = ['id', 'title', 'slug', 'status', 'author', 'blocks']

    def create(self, validated_data):
        blocks_data = validated_data.pop('blocks', [])
        logger.info(f"Creating Page with data: {validated_data}")
        logger.info(f"Blocks data: {blocks_data}")

        page = Page.objects.create(**validated_data, author=self.context['request'].user)
        for block in blocks_data:
            logger.info(f"Creating block: {block}")
            PageBlock.objects.create(
                page=page,
                block_type=block['block_type'],
                title=block.get('title', ''),
                content=block['content'],
                order=block.get('order', 0)
            )
        logger.info(f"Page created with id: {page.id}")
        return page

    def update(self, instance, validated_data):
        blocks_data = validated_data.pop('blocks', [])
        logger.info(f"Updating Page id={instance.id} with data: {validated_data}")
        logger.info(f"Blocks data: {blocks_data}")

        # Обновляем поля страницы
        instance.title = validated_data.get('title', instance.title)
        instance.slug = validated_data.get('slug', instance.slug)
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        logger.info(f"Page updated: {instance}")

        existing_blocks = {b.id: b for b in instance.blocks.all()}
        logger.info(f"Existing blocks: {existing_blocks}")

        sent_existing_ids = []
        new_blocks_ids = []

        for block_data in blocks_data:
            block_id = block_data.get('id')
            if block_id and block_id in existing_blocks:
                # обновляем существующий блок
                b = existing_blocks[block_id]
                logger.info(f"Updating existing block id={block_id} with data: {block_data}")
                b.block_type = block_data['block_type']
                b.title = block_data.get('title', '')
                b.content = block_data['content']
                b.order = block_data.get('order', 0)
                b.save()
                sent_existing_ids.append(block_id)
            else:
                # создаём новый блок
                logger.info(f"Creating new block: {block_data}")
                new_block = PageBlock.objects.create(
                    page=instance,
                    block_type=block_data['block_type'],
                    title=block_data.get('title', ''),
                    content=block_data['content'],
                    order=block_data.get('order', 0)
                )
                new_blocks_ids.append(new_block.id)
                logger.info(f"New block created with id={new_block.id}")

        # удаляем только существующие блоки, которых больше нет в пришедших данных
        to_delete = instance.blocks.exclude(id__in=sent_existing_ids + new_blocks_ids)
        if to_delete.exists():
            logger.info(f"Deleting blocks: {[b.id for b in to_delete]}")
            to_delete.delete()

        return instance


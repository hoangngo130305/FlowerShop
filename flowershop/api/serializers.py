# api/serializers.py
from rest_framework import serializers
from .models import (
    Tag, Product, ProductMedia, ProductTag,
    Review, Author, News, Contact, Order
)


# ----------------------------
# 🔹 TAG SERIALIZER
# ----------------------------
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'


# ----------------------------
# 🔹 PRODUCT MEDIA SERIALIZER
# ----------------------------
class ProductMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductMedia
        fields = '__all__'


# ----------------------------
# 🔹 REVIEW SERIALIZER
# ----------------------------
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'


# ----------------------------
# 🔹 PRODUCT SERIALIZER
# ----------------------------
class ProductSerializer(serializers.ModelSerializer):
    media = serializers.SerializerMethodField()
    Tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = '__all__'

    def get_media(self, obj):
        media_qs = ProductMedia.objects.filter(Product=obj)
        return ProductMediaSerializer(media_qs, many=True).data


# ----------------------------
# 🔹 PRODUCT TAG SERIALIZER
# ----------------------------
class ProductTagSerializer(serializers.ModelSerializer):
    ProductID = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    TagID = serializers.PrimaryKeyRelatedField(queryset=Tag.objects.all())

    class Meta:
        model = ProductTag
        fields = '__all__'


# ----------------------------
# 🔹 AUTHOR SERIALIZER
# ----------------------------
class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = '__all__'


# ----------------------------
# 🔹 NEWS SERIALIZER
# ----------------------------
class NewsSerializer(serializers.ModelSerializer):
    AuthorID = AuthorSerializer(read_only=True)

    class Meta:
        model = News
        fields = '__all__'


# ----------------------------
# 🔹 NEWS LIST SERIALIZER (hiển thị ngắn)
# ----------------------------
class NewsListSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = ['NewsID', 'Title', 'Slug', 'Image', 'Category', 'CreatedAt', 'ViewCount', 'Content', 'AuthorID']


# ----------------------------
# 🔹 CONTACT SERIALIZER
# ----------------------------
class ContactSerializer(serializers.ModelSerializer):
    FullName = serializers.SerializerMethodField()

    class Meta:
        model = Contact
        fields = '__all__'

    def get_FullName(self, obj):
        return f"{obj.FirstName or ''} {obj.LastName or ''}".strip()
    

    # ----------------------------
# 🔹 ORDER SERIALIZER
# ----------------------------
class OrderSerializer(serializers.ModelSerializer):
    ProductName = serializers.CharField(source='Product.Name', read_only=True)  # hiển thị tên sản phẩm

    class Meta:
        model = Order
        fields = '__all__'

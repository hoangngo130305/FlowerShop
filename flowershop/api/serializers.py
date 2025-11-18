# api/serializers.py
from rest_framework import serializers
from .models import (
    Tag, Product, ProductTag,
    Review, Author, News, Contact, Order, Transaction, OrderSchedule
)
from .models import ProductCategory, NewsCategory, Admin
from django.templatetags.static import static
from django.conf import settings
from urllib.parse import urljoin
# ----------------------------
# 🔹 TAG SERIALIZER
# ----------------------------
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
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
# api/serializers.py
class ProductSerializer(serializers.ModelSerializer):
    Tags = serializers.SerializerMethodField()
    Media = serializers.SerializerMethodField()  # ← ĐÚNG: DÙNG METHOD FIELD

    class Meta:
        model = Product
        fields = '__all__'

    def get_Tags(self, obj):
        return [
            {"TagID": t.TagID, "TagName": t.TagName}
            for t in obj.Tags.all()
        ]

    def get_Media(self, obj):
        request = self.context.get('request')
        if not obj.Media:
            return []

        media_list = []
        for item in obj.Media:
            url = item.get("url", "")
            if request and url and not url.startswith(("http://", "https://")):
                url = request.build_absolute_uri(url)
            media_list.append({
                "type": item.get("type"),
                "url": url
            })
        return media_list


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
    ImageFull = serializers.SerializerMethodField()  # trả về URL đầy đủ

    class Meta:
        model = News
        fields = '__all__'

    def get_ImageFull(self, obj):
        request = self.context.get('request')
        if obj.Image and hasattr(obj.Image, 'url'):
            return request.build_absolute_uri(obj.Image.url)
        return None


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

class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = '__all__'

class NewsCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsCategory
        fields = '__all__'

class AdminSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Admin
        fields = '__all__'


class TransactionSerializer(serializers.ModelSerializer):
    order_number = serializers.SerializerMethodField()
    customer_name = serializers.SerializerMethodField()
    product_name = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = [
            'TransactionID', 'Type', 'Category', 'Amount', 'Description',
            'TransactionDate', 'OrderID', 'order_number', 'customer_name',
            'product_name', 'CreatedAt', 'UpdatedAt'
        ]
        read_only_fields = ['TransactionID', 'CreatedAt', 'UpdatedAt']

    def get_order_number(self, obj):
        return f"ORD-{str(obj.OrderID.OrderID).zfill(5)}" if obj.OrderID else None

    def get_customer_name(self, obj):
        return obj.OrderID.CustomerName if obj.OrderID else None

    def get_product_name(self, obj):
        return obj.OrderID.Product.Name if obj.OrderID and obj.OrderID.Product else None


class OrderScheduleSerializer(serializers.ModelSerializer):
    order_number = serializers.SerializerMethodField()
    customer_name = serializers.SerializerMethodField()
    customer_phone = serializers.SerializerMethodField()
    product_name = serializers.SerializerMethodField()
    total_amount = serializers.SerializerMethodField()

    class Meta:
        model = OrderSchedule
        fields = [
            'ScheduleID', 'OrderID', 'order_number', 'customer_name', 'customer_phone',
            'product_name', 'total_amount', 'ScheduledDate', 'ScheduledTime',
            'Status', 'Note', 'CreatedAt', 'UpdatedAt'
        ]
        read_only_fields = ['ScheduleID', 'CreatedAt', 'UpdatedAt']

    def get_order_number(self, obj):
        return f"ORD-{str(obj.OrderID.OrderID).zfill(5)}"

    def get_customer_name(self, obj):
        return obj.OrderID.CustomerName

    def get_customer_phone(self, obj):
        return obj.OrderID.Phone

    def get_product_name(self, obj):
        return obj.OrderID.Product.Name if obj.OrderID.Product else None

    def get_total_amount(self, obj):
        return float(obj.OrderID.TotalAmount)
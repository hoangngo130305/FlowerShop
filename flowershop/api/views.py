# api/views.py
from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils.text import slugify
from .models import (
    Product, Tag, ProductMedia, ProductTag,
    Review, Author, News, Contact
)
from .serializers import (
    ProductSerializer, TagSerializer, ProductMediaSerializer,
    ProductTagSerializer, ReviewSerializer, AuthorSerializer,
    NewsSerializer, NewsListSerializer, ContactSerializer
)

from rest_framework.permissions import AllowAny
# ----------------------------
# 🔹 PRODUCT VIEWSET
# ----------------------------
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-CreatedAt')
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['Name', 'Origin', 'Description', 'Slug']  # 👈 thêm 'Slug'
    permission_classes = [AllowAny]  # 👈 ai cũng có thể GET

    @action(detail=True, methods=['get'])
    def reviews(self, request, pk=None):
        reviews = Review.objects.filter(ProductID=pk)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured = Product.objects.filter(IsFeatured=True)
        serializer = ProductSerializer(featured, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        name = serializer.validated_data.get('Name')
        serializer.save(Slug=slugify(name))


# ----------------------------
# 🔹 TAG VIEWSET
# ----------------------------
class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all().order_by('TagName')
    serializer_class = TagSerializer


# ----------------------------
# 🔹 PRODUCT MEDIA VIEWSET
# ----------------------------
class ProductMediaViewSet(viewsets.ModelViewSet):
    queryset = ProductMedia.objects.all()
    serializer_class = ProductMediaSerializer


# ----------------------------
# 🔹 PRODUCT TAG VIEWSET
# ----------------------------
class ProductTagViewSet(viewsets.ModelViewSet):
    queryset = ProductTag.objects.all()
    serializer_class = ProductTagSerializer


# ----------------------------
# 🔹 REVIEW VIEWSET
# ----------------------------
class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all().order_by('-ReviewDate')
    serializer_class = ReviewSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['CustomerName', 'Comment']

    def get_queryset(self):
        queryset = super().get_queryset()
        product_id = self.request.query_params.get('product')
        if product_id:
            queryset = queryset.filter(ProductID=product_id)
        return queryset



# ----------------------------
# 🔹 AUTHOR VIEWSET
# ----------------------------
class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer


# ----------------------------
# 🔹 NEWS VIEWSET
# ----------------------------
class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all().order_by('-CreatedAt')
    filter_backends = [filters.SearchFilter]
    # 👇 thêm Content vào trường tìm kiếm
    search_fields = ['Title', 'Category', 'Tags', 'Content']
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == 'list':
            return NewsListSerializer
        return NewsSerializer

    def perform_create(self, serializer):
        title = serializer.validated_data.get('Title')
        serializer.save(Slug=slugify(title))

    @action(detail=False, methods=['get'])
    def top(self, request):
        top_news = News.objects.all().order_by('-ViewCount')[:5]
        serializer = NewsListSerializer(top_news, many=True)
        return Response(serializer.data)

# ----------------------------
# 🔹 CONTACT VIEWSET
# ----------------------------
class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all().order_by('-CreatedAt')
    serializer_class = ContactSerializer

# ----------------------------
# 🔹 ORDER VIEWSET
# ----------------------------
from .models import Order
from .serializers import OrderSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-OrderDate')
    serializer_class = OrderSerializer
    permission_classes = [AllowAny]

    # Cho phép lọc theo sản phẩm nếu cần
    def get_queryset(self):
        queryset = super().get_queryset()
        product_id = self.request.query_params.get('product')
        if product_id:
            queryset = queryset.filter(Product__ProductID=product_id)
        return queryset

    def create(self, request, *args, **kwargs):
        """
        ✅ Khi người dùng đặt hàng (POST /api/orders/):
        - Tự động lưu thời gian
        - Trả lại thông tin đơn hàng vừa tạo
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

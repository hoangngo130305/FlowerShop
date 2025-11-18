# api/views.py
from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
from django.utils.text import slugify
from .models import (
    Product, Tag, ProductTag, Review, Author, News, Contact,
    ProductCategory, NewsCategory, Admin, Order, Transaction, OrderSchedule
)
from .serializers import (
    ProductSerializer, TagSerializer, ProductTagSerializer,
    ReviewSerializer, AuthorSerializer, NewsSerializer, ContactSerializer,
    ProductCategorySerializer, NewsCategorySerializer, AdminSerializer,
    OrderSerializer, TransactionSerializer, OrderScheduleSerializer
)
import traceback


# ----------------------------
# PRODUCT VIEWSET
# ----------------------------
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-CreatedAt')
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['Name', 'Origin', 'Description', 'Slug']
    permission_classes = [AllowAny]
    parser_classes = (MultiPartParser, FormParser)

    @action(detail=True, methods=['get'])
    def reviews(self, request, pk=None):
        reviews = Review.objects.filter(ProductID=pk)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured = Product.objects.filter(IsFeatured=True)
        serializer = ProductSerializer(featured, many=True, context={'request': request})
        return Response(serializer.data)

    def generate_unique_slug(self, name):
        base_slug = slugify(name)
        slug = base_slug
        num = 1
        while Product.objects.filter(Slug=slug).exists():
            slug = f"{base_slug}-{num}"
            num += 1
        return slug

    def create(self, request, *args, **kwargs):
        print("\n" + "="*70)
        print("🚀 CREATE PRODUCT - START")
        print("="*70)
        
        # 🔍 DEBUG
        print(f"📥 request.data keys: {list(request.data.keys())}")
        print(f"📥 request.FILES keys: {list(request.FILES.keys())}")
        
        # ⚠️ FIX: Tạo dict mới chỉ với TEXT fields, KHÔNG copy file objects
        data = {}
        for key, value in request.data.items():
            # Chỉ lấy text fields, bỏ qua file fields
            if key != 'media_files' and not hasattr(value, 'read'):
                data[key] = value
        
        print(f"📝 Cleaned data keys: {list(data.keys())}")
        
        # Xóa Media nếu có (sẽ xử lý riêng)
        if 'Media' in data:
            del data['Media']

        # Validate Name
        name = data.get('Name', '').strip()
        if not name:
            return Response(
                {"error": "Tên sản phẩm không được để trống"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Generate slug
        data['Slug'] = self.generate_unique_slug(name)
        print(f"📝 Name: {name}")
        print(f"📝 Slug: {data['Slug']}")

        # Tạo product
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        print(f"✅ Đã tạo Product #{product.ProductID}")

        # ========================================
        # 📸 XỬ LÝ UPLOAD MEDIA FILES
        # ========================================
        media_files = request.FILES.getlist('media_files')
        print(f"\n📸 NHẬN ĐƯỢC {len(media_files)} FILE(S)")
        
        media_data = []

        try:
            for i, file in enumerate(media_files):
                print(f"\n   [{i}] Processing: {file.name}")
                print(f"       Size: {file.size} bytes")
                print(f"       Type: {file.content_type}")
                
                # Xác định loại media
                is_video = file.name.lower().endswith(('.mp4', '.mov', '.avi', '.webm', '.mkv'))
                media_type = 'video' if is_video else 'image'
                
                # Lưu file vào storage
                filename = default_storage.save(f"products/media/{file.name}", file)
                file_url = default_storage.url(filename)
                
                # ⚠️ CHỈ LƯU STRING, KHÔNG LƯU FILE OBJECT
                media_data.append({
                    "type": media_type,
                    "url": file_url  # ← String, không phải file object
                })
                
                print(f"       ✅ Saved to: {filename}")
                print(f"       ✅ URL: {file_url}")
        
        except Exception as e:
            print(f"\n❌ LỖI KHI UPLOAD FILE: {str(e)}")
            import traceback
            traceback.print_exc()

        # ========================================
        # 💾 LƯU MEDIA VÀO DATABASE
        # ========================================
        print(f"\n💾 Có {len(media_data)} media item(s) để lưu")
        
        if media_data:
            print(f"💾 TRƯỚC SAVE - product.Media: {product.Media}")
            print(f"💾 media_data type: {type(media_data)}")
            print(f"💾 media_data: {media_data}")
            
            # Gán media_data (list of dicts với string values)
            product.Media = media_data
            
            # Chỉ update field Media
            product.save(update_fields=['Media'])
            
            print(f"💾 SAU SAVE - product.Media: {product.Media}")
            
            # Refresh từ DB
            product.refresh_from_db()
            print(f"💾 SAU REFRESH - product.Media: {product.Media}")
        else:
            print("⚠️ KHÔNG CÓ MEDIA FILES!")

        # ========================================
        # 📤 TRẢ VỀ RESPONSE
        # ========================================
        full_serializer = ProductSerializer(product, context={'request': request})
        response_data = full_serializer.data
        
        print(f"\n📤 RESPONSE - Media field: {response_data.get('Media')}")
        print("="*70)
        print("✅ CREATE PRODUCT - DONE\n")
        
        return Response(response_data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # ⚠️ FIX: Tạo dict mới, không copy file objects
        data = {}
        for key, value in request.data.items():
            if key != 'media_files' and not hasattr(value, 'read'):
                data[key] = value
        
        # Xóa Media nếu có
        if 'Media' in data:
            del data['Media']

        # Update product
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()

        # Xử lý media mới
        media_files = request.FILES.getlist('media_files')
        
        if media_files:
            existing_media = list(product.Media) if product.Media else []
            
            new_media = []
            for file in media_files:
                is_video = file.name.lower().endswith(('.mp4', '.mov', '.avi', '.webm', '.mkv'))
                media_type = 'video' if is_video else 'image'
                filename = default_storage.save(f"products/media/{file.name}", file)
                file_url = default_storage.url(filename)
                new_media.append({"type": media_type, "url": file_url})
            
            product.Media = existing_media + new_media
            product.save(update_fields=['Media'])
            product.refresh_from_db()

        full_serializer = ProductSerializer(product, context={'request': request})
        return Response(full_serializer.data)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)



# ----------------------------
# TAG VIEWSET
# ----------------------------
class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all().order_by('TagName')
    serializer_class = TagSerializer


# ----------------------------
# PRODUCT TAG VIEWSET
# ----------------------------
class ProductTagViewSet(viewsets.ModelViewSet):
    queryset = ProductTag.objects.all()
    serializer_class = ProductTagSerializer


# ----------------------------
# REVIEW VIEWSET
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
# AUTHOR VIEWSET
# ----------------------------
class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer


# ----------------------------
# NEWS VIEWSET
# ----------------------------
class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all().order_by('-CreatedAt')
    serializer_class = NewsSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['Title', 'Category', 'Tags', 'Content']
    permission_classes = [AllowAny]
    
    # ✅ BẮT BUỘC: HỖ TRỢ UPLOAD FILE ẢNH
    parser_classes = (MultiPartParser, FormParser)

    def generate_unique_slug(self, title):
        """Sinh slug duy nhất từ title"""
        base_slug = slugify(title)
        slug = base_slug
        num = 1
        while News.objects.filter(Slug=slug).exists():
            slug = f"{base_slug}-{num}"
            num += 1
        return slug

    def create(self, request, *args, **kwargs):
        print("\n" + "="*70)
        print("📰 CREATE NEWS - START")
        print("="*70)
        
        # 🔍 DEBUG
        print(f"📥 request.data keys: {list(request.data.keys())}")
        print(f"📥 request.FILES keys: {list(request.FILES.keys())}")
        
        # ✅ Tạo dict mới, CHỈ lấy text fields (không copy file objects)
        data = {}
        for key, value in request.data.items():
            # Bỏ qua file fields
            if key != 'Image' and not hasattr(value, 'read'):
                data[key] = value
        
        print(f"📝 Cleaned data: {data}")
        
        # Validate Title
        title = data.get('Title', '').strip()
        if not title:
            return Response(
                {"error": "Tiêu đề không được để trống"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Generate unique slug
        data['Slug'] = self.generate_unique_slug(title)
        print(f"📝 Title: {title}")
        print(f"📝 Slug: {data['Slug']}")
        
        # Tạo news (Image = None ban đầu)
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        news = serializer.save()
        print(f"✅ Đã tạo News #{news.NewsID}")
        
        # ========================================
        # 📸 XỬ LÝ UPLOAD IMAGE FILE
        # ========================================
        image_file = request.FILES.get('Image')
        
        if image_file:
            print(f"\n📸 NHẬN ĐƯỢC IMAGE FILE:")
            print(f"   Name: {image_file.name}")
            print(f"   Size: {image_file.size} bytes")
            print(f"   Type: {image_file.content_type}")
            
            try:
                # Lưu file vào storage
                filename = default_storage.save(f"news/{image_file.name}", image_file)
                file_url = default_storage.url(filename)
                
                print(f"   ✅ Saved to: {filename}")
                print(f"   ✅ URL: {file_url}")
                
                # Cập nhật Image cho news
                news.Image = filename  # Lưu path, không phải URL
                news.save(update_fields=['Image'])
                news.refresh_from_db()
                
                print(f"💾 SAU SAVE - news.Image: {news.Image}")
                
            except Exception as e:
                print(f"\n❌ LỖI KHI UPLOAD IMAGE: {str(e)}")
                import traceback
                traceback.print_exc()
        else:
            print("⚠️ KHÔNG CÓ IMAGE FILE!")
        
        # ========================================
        # 📤 TRẢ VỀ RESPONSE
        # ========================================
        full_serializer = NewsSerializer(news, context={'request': request})
        response_data = full_serializer.data
        
        print(f"\n📤 RESPONSE - Image field: {response_data.get('Image')}")
        print("="*70)
        print("✅ CREATE NEWS - DONE\n")
        
        return Response(response_data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        print("\n" + "="*70)
        print(f"📰 UPDATE NEWS #{instance.NewsID} - START")
        print("="*70)
        
        # ✅ Tạo dict mới, không copy file objects
        data = {}
        for key, value in request.data.items():
            if key != 'Image' and not hasattr(value, 'read'):
                data[key] = value
        
        print(f"📝 Update data: {data}")
        
        # Nếu có Title mới → generate slug mới
        if 'Title' in data and data['Title']:
            # Chỉ generate slug mới nếu title thay đổi
            if data['Title'] != instance.Title:
                data['Slug'] = self.generate_unique_slug(data['Title'])
                print(f"📝 New Slug: {data['Slug']}")
        
        # Update các field thông thường
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        news = serializer.save()
        
        # Xử lý image mới (nếu có)
        image_file = request.FILES.get('Image')
        
        if image_file:
            print(f"\n📸 NHẬN ĐƯỢC IMAGE FILE MỚI:")
            print(f"   Name: {image_file.name}")
            print(f"   Size: {image_file.size} bytes")
            
            try:
                # Xóa ảnh cũ (nếu có)
                if news.Image:
                    try:
                        default_storage.delete(news.Image.name)
                        print(f"   🗑️ Deleted old image: {news.Image.name}")
                    except:
                        pass
                
                # Lưu ảnh mới
                filename = default_storage.save(f"news/{image_file.name}", image_file)
                news.Image = filename
                news.save(update_fields=['Image'])
                news.refresh_from_db()
                
                print(f"   ✅ Saved new image: {filename}")
                
            except Exception as e:
                print(f"\n❌ LỖI KHI UPLOAD IMAGE: {str(e)}")
                import traceback
                traceback.print_exc()
        
        full_serializer = NewsSerializer(news, context={'request': request})
        
        print("="*70)
        print("✅ UPDATE NEWS - DONE\n")
        
        return Response(full_serializer.data)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)


# ----------------------------
# CONTACT VIEWSET
# ----------------------------
class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all().order_by('-CreatedAt')
    serializer_class = ContactSerializer


# ----------------------------
# ORDER VIEWSET
# ----------------------------
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-OrderDate')
    serializer_class = OrderSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        product_id = self.request.query_params.get('product')
        if product_id:
            queryset = queryset.filter(Product__ProductID=product_id)
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # LẤY PRODUCT ID AN TOÀN (hỗ trợ cả gửi object và gửi ID)
        product_input = serializer.validated_data.get('Product')
        if isinstance(product_input, int):
            product_id = product_input
        elif hasattr(product_input, 'ProductID'):
            product_id = product_input.ProductID
        else:
            product_id = int(product_input)  # fallback

        quantity = serializer.validated_data.get('Quantity', 1)

        try:
            product = Product.objects.get(ProductID=product_id)
            total_amount = product.Price * quantity
            serializer.validated_data['TotalAmount'] = total_amount
        except Product.DoesNotExist:
            serializer.validated_data['TotalAmount'] = 0
        except Exception as e:
            return Response({"error": f"Lỗi tính tiền: {str(e)}"}, status=400)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


# ----------------------------
# CATEGORY VIEWSETS
# ----------------------------
class ProductCategoryViewSet(viewsets.ModelViewSet):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer
    permission_classes = [AllowAny]


class NewsCategoryViewSet(viewsets.ModelViewSet):
    queryset = NewsCategory.objects.all()
    serializer_class = NewsCategorySerializer
    permission_classes = [AllowAny]


# ----------------------------
# ADMIN VIEWSET
# ----------------------------
from rest_framework import permissions

class AdminViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Admin.objects.select_related('user').all()
    serializer_class = AdminSerializer
    permission_classes = [permissions.IsAdminUser]

    # api/views.py (chèn vào cuối file, trước </DOCUMENT> nếu có)


from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import datetime
# ==========================
# TRANSACTION VIEWSET
# ==========================
class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all().order_by('-TransactionDate', '-CreatedAt')
    serializer_class = TransactionSerializer

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        end_date = request.query_params.get('end_date', timezone.now().date())
        if isinstance(end_date, str):
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()

        start_date = request.query_params.get('start_date')
        if start_date:
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        else:
            start_date = end_date.replace(day=1)

        transactions = Transaction.objects.filter(TransactionDate__range=[start_date, end_date])

        income = transactions.filter(Type='income').aggregate(
            total=Sum('Amount'), count=Count('TransactionID')
        )
        expense = transactions.filter(Type='expense').aggregate(
            total=Sum('Amount'), count=Count('TransactionID')
        )

        data = {
            'total_income': income['total'] or 0,
            'total_expense': expense['total'] or 0,
            'net_profit': (income['total'] or 0) - (expense['total'] or 0),
            'income_count': income['count'] or 0,
            'expense_count': expense['count'] or 0,
            'period_start': start_date,
            'period_end': end_date,
        }

        return Response({"success": True, "data": data})


# ==========================
# ORDER SCHEDULE VIEWSET
# ==========================
class OrderScheduleViewSet(viewsets.ModelViewSet):
    queryset = OrderSchedule.objects.select_related('OrderID__Product').all()
    serializer_class = OrderScheduleSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        status = self.request.query_params.get('status')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        if status:
            queryset = queryset.filter(Status=status)
        if start_date and end_date:
            queryset = queryset.filter(ScheduledDate__range=[start_date, end_date])

        return queryset.order_by('-ScheduledDate', '-ScheduledTime')

    @action(detail=False, methods=['get'])
    def today(self, request):
        today = timezone.now().date()
        schedules = self.get_queryset().filter(ScheduledDate=today)
        serializer = self.get_serializer(schedules, many=True)
        return Response({"success": True, "count": schedules.count(), "data": serializer.data})
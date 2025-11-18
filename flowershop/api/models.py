# api/models.py
from django.db import models
from django.utils.text import slugify
from django.utils import timezone
from django.contrib.auth.models import User

# ==========================
# 🔹 TAG MODEL
# ==========================
class Tag(models.Model):
    TagID = models.AutoField(primary_key=True)
    TagName = models.CharField(max_length=50, unique=True, null=True, blank=True)

    class Meta:
        db_table = 'tags'
        ordering = ['TagName']

    def __str__(self):
        return self.TagName or "Unnamed Tag"


# ==========================
# 🔹 PRODUCT MODEL
# ==========================
class Product(models.Model):
    STATUS_CHOICES = [
        ('Còn hàng', 'Còn hàng'),
        ('Hết hàng', 'Hết hàng'),
    ]

    category = models.ForeignKey(
        'ProductCategory',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='products',
        db_column='CategoryID'  # <-- thêm dòng này
    )

    ProductID = models.AutoField(primary_key=True)
    Name = models.CharField(max_length=255)
    Slug = models.CharField(max_length=255, unique=True, null=True, blank=True)
    Description = models.TextField(null=True, blank=True)
    Price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    Origin = models.CharField(max_length=100, null=True, blank=True)
    FreshDuration = models.CharField(max_length=50, null=True, blank=True)
    IsFeatured = models.BooleanField(default=False)
    Status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Còn hàng')
    CreatedAt = models.DateTimeField(default=timezone.now)
    Media = models.JSONField(null=True, blank=True, help_text="Danh sách ảnh và video của sản phẩm")
    Tags = models.ManyToManyField('Tag', through='ProductTag', related_name='products', blank=True)

    class Meta:
        db_table = 'products'
        ordering = ['-CreatedAt']

    def __str__(self):
        return self.Name

    def save(self, *args, **kwargs):
        if not self.Slug:
            self.Slug = slugify(self.Name)
        super().save(*args, **kwargs)






# ==========================
# 🔹 PRODUCT TAG (MANY-TO-MANY RELATION)
# ==========================

class ProductTag(models.Model):
    id = models.AutoField(primary_key=True)
    ProductID = models.ForeignKey(Product, on_delete=models.CASCADE, db_column='ProductID')
    TagID = models.ForeignKey(Tag, on_delete=models.CASCADE, db_column='TagID')

    class Meta:
        db_table = 'product_tags'
        unique_together = ('ProductID', 'TagID')



# ==========================
# 🔹 REVIEW MODEL
# ==========================
class Review(models.Model):
    ReviewID = models.AutoField(primary_key=True)
    ProductID = models.IntegerField(null=True, blank=True)
    CustomerName = models.CharField(max_length=100, null=True, blank=True)
    Rating = models.IntegerField(null=True, blank=True)
    Comment = models.TextField(null=True, blank=True)
    Purchased = models.BooleanField(default=False)
    Attachments = models.CharField(max_length=255, null=True, blank=True)
    ReviewDate = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'reviews'
        ordering = ['-ReviewDate']

    def __str__(self):
        return f"{self.CustomerName or 'Anonymous'} ({self.Rating or 0}/5)"


# ==========================
# 🔹 AUTHOR MODEL
# ==========================
class Author(models.Model):
    AuthorID = models.AutoField(primary_key=True)
    Name = models.CharField(max_length=100, null=True, blank=True)
    Bio = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'authors'
        ordering = ['Name']

    def __str__(self):
        return self.Name or "Unknown Author"


# ==========================
# 🔹 NEWS MODEL
# ==========================
class News(models.Model):
    NewsID = models.AutoField(primary_key=True)
    Title = models.CharField(max_length=255)
    Slug = models.CharField(max_length=255, unique=True, null=True, blank=True)
    Content = models.TextField(null=True, blank=True)
    Image = models.FileField(upload_to='news/', null=True, blank=True)
    Category = models.CharField(max_length=100, null=True, blank=True)
    AuthorID = models.IntegerField(null=True, blank=True)   
    CreatedAt = models.DateTimeField(default=timezone.now)
    ViewCount = models.IntegerField(default=0)
    ReadingTime = models.CharField(max_length=50, null=True, blank=True)
    Tags = models.CharField(max_length=255, null=True, blank=True)
    news_category = models.ForeignKey(
    'NewsCategory',
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name='articles',
    db_column='CategoryID'
)
    class Meta:
        db_table = 'news'
        ordering = ['-CreatedAt']

    def __str__(self):
        return self.Title

    def save(self, *args, **kwargs):
        if not self.Slug:
            self.Slug = slugify(self.Title)
        super().save(*args, **kwargs)


# ==========================
# 🔹 CONTACT MODEL
# ==========================
class Contact(models.Model):
    ContactID = models.AutoField(primary_key=True)
    FirstName = models.CharField(max_length=50, null=True, blank=True)
    LastName = models.CharField(max_length=50, null=True, blank=True)
    Phone = models.CharField(max_length=20, null=True, blank=True)
    InterestedProduct = models.CharField(max_length=255, null=True, blank=True)
    Message = models.TextField(null=True, blank=True)
    CreatedAt = models.DateTimeField(default=timezone.now)
    Status = models.CharField(   # ✅ bổ sung
        max_length=20,
        choices=[
            ('new', 'Mới'),
            ('read', 'Đã đọc'),
            ('replied', 'Đã phản hồi'),
        ],
        default='new'
    )

    class Meta:
        db_table = 'contacts'
        ordering = ['-CreatedAt']

    def __str__(self):
        return f"{self.FirstName or ''} {self.LastName or ''}".strip() or "Anonymous"

# ==========================
# 🔹 ORDER MODEL
# ==========================
class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Đang chờ'),
        ('confirmed', 'Đã xác nhận'),
        ('shipping', 'Đang giao'),
        ('completed', 'Hoàn thành'),
        ('cancelled', 'Đã hủy'),
    ]

    OrderID = models.AutoField(primary_key=True)
    CustomerName = models.CharField(max_length=100)
    Phone = models.CharField(max_length=20)
    Email = models.CharField(max_length=100, null=True, blank=True)
    CustomerAddress = models.CharField(max_length=255, null=True, blank=True)  # ✅ thêm
    Quantity = models.IntegerField(default=1)
    Unit = models.CharField(max_length=50, default='bó')  # ✅ thêm
    TotalAmount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # ✅ thêm
    Note = models.TextField(null=True, blank=True)  # ✅ thêm
    Status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')  # ✅ thêm

    # 🔗 Liên kết với Product
    Product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        db_column='ProductID',
        related_name='orders'
    )

    OrderDate = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'orders'
        ordering = ['-OrderDate']

    def __str__(self):
        return f"Đơn #{self.OrderID} - {self.CustomerName}"


# --- Product Categories ---
class ProductCategory(models.Model):
    CategoryID = models.AutoField(primary_key=True)  # ✅ trùng tên cột SQL
    Name = models.CharField(max_length=100, unique=True)
    Description = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "product_categories"  # ✅ trùng tên bảng MySQL
        verbose_name = "Danh mục sản phẩm"
        verbose_name_plural = "Danh mục sản phẩm"

    def __str__(self):
        return self.Name




# --- News Categories ---
class NewsCategory(models.Model):
    CategoryID = models.AutoField(primary_key=True)  # <- thêm field này
    Name = models.CharField(max_length=100, unique=True)
    Description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.Name

    class Meta:
        db_table = "news_categories"  # trùng với MySQL
        verbose_name = "Danh mục bài viết"
        verbose_name_plural = "Danh mục bài viết"



# --- Admin Management ---
class Admin(models.Model):
    ROLE_CHOICES = [
        ('superadmin', 'Super Admin'),
        ('editor', 'Biên tập viên'),
        ('viewer', 'Người xem'),
    ]

    admin_id = models.AutoField(primary_key=True, db_column='AdminID')  # <-- primary key
    user = models.OneToOneField(User, on_delete=models.CASCADE, db_column='UserID')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='editor', db_column='Role')
    permissions = models.TextField(blank=True, help_text="JSON hoặc danh sách quyền tùy chỉnh", db_column='Permissions')
    last_login = models.DateTimeField(auto_now=True, db_column='LastLogin')

    def __str__(self):
        return f"{self.user.username} ({self.get_role_display()})"

    class Meta:
        db_table = 'admins'
        verbose_name = "Quản trị viên"
        verbose_name_plural = "Quản trị viên"

# api/finance_models.py
from django.db import models
from django.utils import timezone
from .models import Order  # Import Order từ models.py chính


class Transaction(models.Model):
    TYPE_CHOICES = [
        ('income', 'Thu nhập'),
        ('expense', 'Chi phí'),
    ]

    TransactionID = models.AutoField(primary_key=True, db_column='TransactionID')
    Type = models.CharField(max_length=10, choices=TYPE_CHOICES, db_column='Type')
    Category = models.CharField(max_length=100, db_column='Category')
    Amount = models.DecimalField(max_digits=15, decimal_places=0, db_column='Amount')
    Description = models.TextField(blank=True, null=True, db_column='Description')
    TransactionDate = models.DateField(default=timezone.now, db_column='TransactionDate')
    OrderID = models.ForeignKey(
        Order,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_column='OrderID',
        related_name='transactions'
    )
    CreatedAt = models.DateTimeField(auto_now_add=True, db_column='CreatedAt')
    UpdatedAt = models.DateTimeField(auto_now=True, db_column='UpdatedAt')

    class Meta:
        db_table = 'transactions'
        ordering = ['-TransactionDate', '-CreatedAt']
        indexes = [
            models.Index(fields=['Type', 'TransactionDate'], name='idx_type_date'),
            models.Index(fields=['TransactionDate'], name='idx_transaction_date'),
        ]

    def __str__(self):
        return f"{self.get_Type_display()} - {self.Category} - {self.Amount}"


class OrderSchedule(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Chờ xử lý'),
        ('confirmed', 'Đã xác nhận'),
        ('completed', 'Hoàn thành'),
        ('cancelled', 'Đã hủy'),
    ]

    ScheduleID = models.AutoField(primary_key=True, db_column='ScheduleID')
    OrderID = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        db_column='OrderID',
        related_name='schedules'
    )
    ScheduledDate = models.DateField(db_column='ScheduledDate')
    ScheduledTime = models.TimeField(null=True, blank=True, db_column='ScheduledTime')
    Status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', db_column='Status')
    Note = models.TextField(blank=True, null=True, db_column='Note')
    CreatedAt = models.DateTimeField(auto_now_add=True, db_column='CreatedAt')
    UpdatedAt = models.DateTimeField(auto_now=True, db_column='UpdatedAt')

    class Meta:
        db_table = 'order_schedules'
        ordering = ['-ScheduledDate', '-ScheduledTime']
        indexes = [
            models.Index(fields=['Status', 'ScheduledDate'], name='idx_status_date'),
            models.Index(fields=['ScheduledDate'], name='idx_schedule_date'),
        ]

    def __str__(self):
        time = self.ScheduledTime.strftime('%H:%M') if self.ScheduledTime else ''
        return f"ORD-{str(self.OrderID.OrderID).zfill(5)} - {self.ScheduledDate} {time}"
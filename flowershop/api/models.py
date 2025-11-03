# api/models.py
from django.db import models
from django.utils.text import slugify
from django.utils import timezone


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

    Tags = models.ManyToManyField(Tag, through='ProductTag', related_name='products', blank=True)

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
# 🔹 PRODUCT MEDIA MODEL
# ==========================
class ProductMedia(models.Model):
    MEDIA_CHOICES = [
        ('image', 'image'),
        ('video', 'video'),
    ]

    MediaID = models.AutoField(primary_key=True)

    # 🔧 ForeignKey trỏ về Product, KHỚP VỚI CỘT ProductID trong database
    Product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='media',
        db_column='ProductID'  # ✅ chỉ định tên cột thật trong DB
    )

    MediaType = models.CharField(max_length=10, choices=MEDIA_CHOICES, default='image')
    Url = models.CharField(max_length=255, null=True, blank=True)
    IsPrimary = models.BooleanField(default=False)

    class Meta:
        db_table = 'product_media'
        ordering = ['-IsPrimary']

    def __str__(self):
        return f"{self.Product.Name} - {self.MediaType}"



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
    Image = models.CharField(max_length=255, null=True, blank=True)
    Category = models.CharField(max_length=100, null=True, blank=True)
    AuthorID = models.IntegerField(null=True, blank=True)   
    CreatedAt = models.DateTimeField(default=timezone.now)
    ViewCount = models.IntegerField(default=0)
    ReadingTime = models.CharField(max_length=50, null=True, blank=True)
    Tags = models.CharField(max_length=255, null=True, blank=True)

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

    class Meta:
        db_table = 'contacts'
        ordering = ['-CreatedAt']

    def __str__(self):
        return f"{self.FirstName or ''} {self.LastName or ''}".strip() or "Anonymous"
# ==========================
# 🔹 ORDER MODEL
# ==========================
class Order(models.Model):
    OrderID = models.AutoField(primary_key=True)
    CustomerName = models.CharField(max_length=100)
    Phone = models.CharField(max_length=20)
    Email = models.CharField(max_length=100, null=True, blank=True)

    # 🔗 Liên kết với Product
    Product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        db_column='ProductID',
        related_name='orders'
    )

    Quantity = models.IntegerField(default=1)
    OrderDate = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'orders'
        ordering = ['-OrderDate']

    def __str__(self):
        return f"Đơn hàng #{self.OrderID} - {self.CustomerName} ({self.Product.Name})"

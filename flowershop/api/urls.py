# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
# project/urls.py

router = DefaultRouter()
router.register(r'products', views.ProductViewSet, basename='products')
router.register(r'tags', views.TagViewSet, basename='tags')
router.register(r'product-tags', views.ProductTagViewSet, basename='product-tags')
router.register(r'reviews', views.ReviewViewSet, basename='reviews')
router.register(r'news', views.NewsViewSet, basename='news')
router.register(r'contacts', views.ContactViewSet, basename='contacts')
router.register(r'authors', views.AuthorViewSet, basename='authors')
router.register(r'orders', views.OrderViewSet, basename='orders')
router.register(r'product-categories', views.ProductCategoryViewSet, basename='product-categories')
router.register(r'news-categories', views.NewsCategoryViewSet)
router.register(r'admins', views.AdminViewSet, basename='admin')
router.register(r'categories', views.ProductCategoryViewSet, basename='categories')
router.register(r'transactions', views.TransactionViewSet, basename='transactions')
router.register(r'order-schedules', views.OrderScheduleViewSet, basename='order-schedules')
urlpatterns = [
    path('', include(router.urls)),

]
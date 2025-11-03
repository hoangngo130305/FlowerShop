# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'products', views.ProductViewSet, basename='products')
router.register(r'tags', views.TagViewSet, basename='tags')
router.register(r'product-tags', views.ProductTagViewSet, basename='product-tags')
router.register(r'reviews', views.ReviewViewSet, basename='reviews')
router.register(r'news', views.NewsViewSet, basename='news')
router.register(r'contacts', views.ContactViewSet, basename='contacts')
router.register(r'authors', views.AuthorViewSet, basename='authors')
router.register(r'product-media', views.ProductMediaViewSet, basename='product-media')

urlpatterns = [
    path('', include(router.urls)),

]
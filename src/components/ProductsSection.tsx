"use client";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion, AnimatePresence } from "motion/react";
import { Package, Phone, Heart, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { useState, useEffect } from "react";

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  price: string;
  featured?: boolean;
  origin?: string;
  freshDuration?: string;
  media?: Array<{ type: 'image' | 'video'; url: string }>;
}

interface ProductsSectionProps {
  onProductClick: (product: any) => void;
}

const API_BASE_URL = "http://14.224.210.210:8000/api";

export default function ProductsSectionAPI({
  onProductClick,
}: ProductsSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // FETCH SẢN PHẨM TỪ API
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/products/`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData.detail || `Lỗi ${res.status}: Không thể tải sản phẩm`
        );
      }
      const data = await res.json();

      console.log("📦 Raw API Response:", data);

      const mappedProducts: Product[] = data.map((p: any) => {
        // ✅ 1. LẤY MEDIA (ẢNH/VIDEO) - API trả về "Media" JSONField
        let mediaArray: Array<{ type: 'image' | 'video'; url: string }> = [];
        let primaryImage = "";

        if (p.Media && Array.isArray(p.Media)) {
          // Django trả về Media là JSONField: [{"type": "image", "url": "/media/..."}]
          mediaArray = p.Media.map((m: any) => ({
            type: m.type || 'image',
            url: m.url || ''
          })).filter((m: any) => m.url);

          // Lấy ảnh đầu tiên làm ảnh chính
          const firstImage = mediaArray.find(m => m.type === 'image');
          primaryImage = firstImage?.url || '';
        }

        // ✅ 2. LẤY TAGS - Ưu tiên Tags (ManyToMany), fallback Categories
        let tags: string[] = [];
        if (Array.isArray(p.Tags) && p.Tags.length > 0) {
          // Tags là ManyToMany với Tag model: [{TagID, TagName}, ...]
          tags = p.Tags.map((t: any) => 
            typeof t === 'string' ? t : (t.TagName || '')
          ).filter((tag: string) => tag && tag.trim());
        } else if (Array.isArray(p.Categories) && p.Categories.length > 0) {
          tags = p.Categories;
        }

        // ✅ 3. FORMAT GIÁ
        const formattedPrice = Number(p.Price)?.toLocaleString('vi-VN') + 'đ';

        console.log(`✅ Product "${p.Name}":`, {
          rawMedia: p.Media,
          mediaArray,
          primaryImage,
          tags,
          price: formattedPrice,
          origin: p.Origin,
          freshDuration: p.FreshDuration,
        });

        return {
          id: p.ProductID,
          title: p.Name,
          description: p.Description || "Hoa sen tươi chất lượng cao",
          image: primaryImage,
          tags,
          price: formattedPrice,
          featured: p.IsFeatured,
          origin: p.Origin,
          freshDuration: p.FreshDuration,
          media: mediaArray,
        };
      });

      setProducts(mappedProducts);
    } catch (err: any) {
      console.error("❌ Lỗi fetch sản phẩm:", err);
      setError(err.message || "Đã có lỗi xảy ra");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // GỌI API KHI COMPONENT MOUNT
  useEffect(() => {
    fetchProducts();
  }, []);

  // PHÂN TRANG
  const PRODUCTS_PER_PAGE = 6;
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = products.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    setCurrentPage(newPage);
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  // LOADING UI
  if (isLoading) {
    return (
      <section id="products" className="py-16 px-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Đang tải sản phẩm...</p>
      </section>
    );
  }

  // ERROR UI
  if (error) {
    return (
      <section id="products" className="py-16 px-4 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchProducts}>Thử lại</Button>
      </section>
    );
  }

  // MAIN UI
  return (
    <section
      id="products"
      className="py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-6 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 md:mb-4 text-foreground"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Sản phẩm nổi bật
          </motion.h2>
          <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Hoa sen tươi chất lượng cao từ vùng trồng nổi tiếng, đảm bảo độ tươi
            hoàn hảo.
          </p>

          {/* Wholesale Notice */}
          <motion.div
            className="mt-4 sm:mt-6 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-2.5 sm:p-3 md:p-4 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  <span className="text-center sm:text-left">
                    <span className="text-foreground">
                      Giá hiển thị là giá lẻ.
                    </span>{" "}
                    Mua số lượng lớn để nhận giá sỉ ưu đãi!
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="whitespace-nowrap"
                  onClick={() =>
                    window.open("https://zalo.me/84822774784", "_blank")
                  }
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Liên hệ ngay
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Product Grid */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4"
            >
              {currentProducts.map((product) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    className={`group overflow-hidden transition-all duration-300 h-full flex flex-col ${
                      product.featured ? "ring-2 ring-primary shadow-xl" : "hover:shadow-lg"
                    }`}
                  >
                    {/* ✅ IMAGE/VIDEO DISPLAY */}
                    <div className="aspect-square sm:aspect-video overflow-hidden relative">
                      {product.image ? (
                        <ImageWithFallback
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                          <Package className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                      
                      {/* Media badge */}
                      {product.media && product.media.length > 0 && (
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Badge variant="secondary" className="bg-black/70 text-white text-xs">
                            <Camera className="w-3 h-3 mr-1" />
                            {product.media.filter(m => m.type === 'image').length}
                          </Badge>
                          {product.media.some(m => m.type === 'video') && (
                            <Badge variant="secondary" className="bg-red-600 text-white text-xs">
                              VIDEO
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Featured badge */}
                      {product.featured && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-gradient-to-r from-[#FF7BBF] to-[#FF4D91] text-white">
                            Nổi bật
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardHeader className="p-3 md:p-4 flex-grow">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base md:text-lg leading-tight line-clamp-2">
                          {product.title}
                        </CardTitle>
                        <div className="flex-shrink-0 text-right">
                          <div className="text-xs text-muted-foreground mb-0.5">
                            Giá lẻ
                          </div>
                          <div className="text-sm md:text-base text-primary font-bold">
                            {product.price}
                          </div>
                        </div>
                      </div>
                      
                      {/* ✅ DESCRIPTION */}
                      <CardDescription className="text-sm md:text-base leading-relaxed line-clamp-2">
                        {product.description}
                      </CardDescription>

                      {/* ✅ ADDITIONAL INFO */}
                      {(product.origin || product.freshDuration) && (
                        <div className="text-xs text-muted-foreground mt-2 space-y-1">
                          {product.origin && (
                            <div>📍 {product.origin}</div>
                          )}
                          {product.freshDuration && (
                            <div>⏰ Tươi {product.freshDuration}</div>
                          )}
                        </div>
                      )}
                    </CardHeader>

                    <CardContent className="p-3 md:p-4 pt-0">
                      {/* ✅ TAGS */}
                      {product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {product.tags.map((tag, idx) => (
                            <Badge
                              key={`${product.id}-tag-${idx}`}
                              variant="secondary"
                              className="text-xs py-0.5 px-1.5"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* ACTIONS */}
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Button
                            className="flex-1 bg-gradient-to-r from-[#FF7BBF] to-[#FF4D91] text-white hover:shadow-md transition-shadow text-sm md:text-base h-9 md:h-10"
                            onClick={() => onProductClick(product)}
                          >
                            <Heart className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                            <span className="hidden sm:inline">Chi tiết</span>
                            <span className="sm:hidden">Xem</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 md:h-10 px-2 md:px-3"
                            onClick={() =>
                              window.open(
                                "https://zalo.me/84822774784",
                                "_blank"
                              )
                            }
                            title="Tư vấn giá sỉ"
                          >
                            <Package className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-center text-muted-foreground">
                          Mua số lượng lớn?{" "}
                          <span
                            className="text-primary cursor-pointer hover:underline"
                            onClick={() =>
                              window.open(
                                "https://zalo.me/84822774784",
                                "_blank"
                              )
                            }
                          >
                            Liên hệ giá sỉ
                          </span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-8 md:mt-12 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Trang trước</span>
            </Button>

            <div className="flex items-center gap-1 md:gap-2 mx-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 p-0 ${
                      currentPage === page
                        ? "bg-gradient-to-r from-[#FF7BBF] to-[#FF4D91] text-white"
                        : "hover:bg-primary/10"
                    }`}
                  >
                    {page}
                  </Button>
                )
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <span className="hidden sm:inline">Trang sau</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        <div className="text-center mt-4 text-sm text-muted-foreground">
          Hiển thị {startIndex + 1}-
          {Math.min(startIndex + PRODUCTS_PER_PAGE, products.length)} trong tổng
          số {products.length} sản phẩm
        </div>
      </div>
    </section>
  );
}

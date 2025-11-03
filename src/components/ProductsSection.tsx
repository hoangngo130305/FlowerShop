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
import { Package, Phone, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  price: string;
  featured?: boolean;
}

interface ProductsSectionProps {
  onProductClick: (product: any) => void;
}

const API_BASE_URL = "http://localhost:8000/api"; // Thay bằng domain thật khi deploy

export default function ProductsSection({
  onProductClick,
}: ProductsSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // FETCH SẢN PHẨM KHÔNG CẦN TOKEN
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

      const mappedProducts: Product[] = data.map((p: any) => {
        // 1. LẤY ẢNH CHÍNH
        const primaryImage = p.media?.find(
          (m: any) => m.IsPrimary && m.MediaType === "image"
        )?.Url;
        const fallbackImage = p.media?.find(
          (m: any) => m.MediaType === "image"
        )?.Url;
        const image =
          primaryImage ||
          fallbackImage ||
          "https://images.unsplash.com/photo-1659532165024-29510c914b04?w=400&q=75";

        const tags = Array.isArray(p.Tags)
          ? p.Tags.map((t: any) => t.TagName).filter(
              (tag: string) => tag && tag.trim()
            )
          : [];

        return {
          id: p.ProductID,
          title: p.Name,
          description: p.Description || "Hoa sen tươi chất lượng cao",
          image,
          tags,
          price: `${Number(p.Price).toLocaleString()}đ`,
          featured: p.IsFeatured,
        };
      });

      setProducts(mappedProducts);
    } catch (err: any) {
      console.error("Lỗi fetch sản phẩm:", err);
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
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 md:mb-4 text-foreground">
            Sản phẩm nổi bật
          </h2>
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
                    <span className="font-bold text-foreground">
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
                    window.open("https://zalo.me/84123456789", "_blank")
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
                <div key={product.id}>
                  <Card
                    className={`group overflow-hidden transition-all duration-300 ${
                      product.featured
                        ? "ring-2 ring-primary/50 shadow-xl"
                        : "hover:shadow-lg"
                    }`}
                  >
                    <div className="aspect-square sm:aspect-video overflow-hidden relative">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* {product.featured && (
                        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
                          <Badge className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg">
                            Special product
                          </Badge>
                          <Badge className="bg-green-600 text-white shadow-lg">Tự nhiên 100%</Badge>
                        </div>
                      )} */}
                    </div>
                    <CardHeader className="p-3 md:p-4">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base md:text-lg font-bold leading-tight">
                          {product.title}
                        </CardTitle>
                        <div className="flex-shrink-0">
                          <div className="text-xs text-muted-foreground mb-0.5">
                            Giá lẻ
                          </div>
                          <div className="text-sm md:text-base text-primary font-bold">
                            {product.price}
                          </div>
                        </div>
                      </div>
                      <CardDescription className="text-sm md:text-base leading-relaxed truncate">
                        {product.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 md:p-4 pt-0">
                      {product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {product.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs py-0.5 px-1.5"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
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
                                "https://zalo.me/84123456789",
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
                                "https://zalo.me/84123456789",
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
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pagination */}
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
            ))}
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

        <div className="text-center mt-4 text-sm text-muted-foreground">
          Hiển thị {startIndex + 1}-
          {Math.min(startIndex + PRODUCTS_PER_PAGE, products.length)} trong tổng
          số {products.length} sản phẩm
        </div>
      </div>
    </section>
  );
}

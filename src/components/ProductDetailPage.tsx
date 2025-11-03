import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  Heart,
  Star,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Package,
  Camera,
  Trash2,
  Phone,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import ReviewForm from "./ReviewForm";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";
import { SharedFooter } from "./SharedFooter";
import { SharedHeader } from "./SharedHeader";

interface ProductDetailPageProps {
  selectedProduct: any;
  products: any[];
  newsArticles: any[];
  onBack: () => void;
  onProductClick?: (product: any) => void;
  onNewsClick?: (newsId: number) => void;
  productImageIndex: number;
  setProductImageIndex: (value: number | ((prev: number) => number)) => void;
}

export default function ProductDetailPage({
  selectedProduct,
  products,
  newsArticles,
  onBack,
  onProductClick,
  onNewsClick,
  productImageIndex,
  setProductImageIndex,
}: ProductDetailPageProps) {
  // ==================== DEBUG & VALIDATION ====================
  console.log("selectedProduct prop:", selectedProduct);

  if (!selectedProduct) return null;

  const productId = selectedProduct.id ?? selectedProduct.ProductID;
  if (!productId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  // ==================== TẤT CẢ STATE & HOOK Ở ĐÂY (TRƯỚC MỌI RETURN) ====================
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = "http://localhost:8000/api";

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(
    new Set()
  );
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [quantity, setQuantity] = useState(1); // ← STATE SỐ LƯỢNG
  const currentUserName = "Khách hàng";

  const videoRef = useRef<HTMLVideoElement>(null);
  const currentImageIndex = productImageIndex;
  const setCurrentImageIndex = setProductImageIndex;

  // RESPONSIVE STATE
  const getItemsPerView = () => {
    if (typeof window === "undefined") return 3;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 3;
    if (window.innerWidth >= 640) return 2;
    return 2;
  };
  const [itemsPerView, setItemsPerView] = useState(getItemsPerView());
  const [relatedProductIndex, setRelatedProductIndex] = useState(0);

  // ==================== COMPUTED VALUES (SAU KHI CÓ DATA) ====================
  // Chỉ lấy media của sản phẩm hiện tại (ảnh và video)
  const productImages =
    product?.media
      ?.map((m: any) => m.Url)
      ?.filter((url: string) => !!url) || [];

  // ==================== FETCH DATA ====================
  useEffect(() => {
    console.log("useEffect chạy với productId:", productId);

    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Bắt đầu fetch cho ID:", productId);

        const [productRes, reviewsRes, allProductsRes] = await Promise.all([
          fetch(`${API_BASE}/products/${productId}/`),
          fetch(`${API_BASE}/products/${productId}/reviews/`),
          fetch(`${API_BASE}/products/`),
        ]);

        if (!productRes.ok) throw new Error(`Product: ${productRes.status}`);
        if (!reviewsRes.ok) throw new Error(`Reviews: ${reviewsRes.status}`);
        if (!allProductsRes.ok)
          throw new Error(`All: ${allProductsRes.status}`);

        const [productData, reviewsData, allProducts] = await Promise.all([
          productRes.json(),
          reviewsRes.json(),
          allProductsRes.json(),
        ]);

        const related = allProducts
          .filter((p: any) => p.ProductID !== productId)
          .slice(0, 6);

        setProduct(productData);
        setReviews(reviewsData);
        setRelatedProducts(related);
        console.log("Tải dữ liệu thành công!");
      } catch (err: any) {
        console.error("Lỗi fetch:", err);
        toast.error(err.message || "Không thể tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  // ==================== RESIZE HANDLER ====================
  useEffect(() => {
    const handleResize = () => {
      const newItemsPerView = getItemsPerView();
      setItemsPerView(newItemsPerView);
      setRelatedProductIndex((prev) =>
        Math.min(prev, Math.max(0, relatedProducts.length - newItemsPerView))
      );
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [relatedProducts.length]);

  // ==================== KEYBOARD NAV ====================
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentImageIndex((prev) =>
          prev === 0 ? productImages.length - 1 : prev - 1
        );
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setCurrentImageIndex((prev) =>
          prev === productImages.length - 1 ? 0 : prev + 1
        );
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [productImages.length]);

  // ==================== VIDEO AUTOPLAY ====================
  useEffect(() => {
    if (
      productImages[currentImageIndex]?.endsWith(".mp4") &&
      videoRef.current
    ) {
      videoRef.current.play().catch(() => {});
    }
  }, [currentImageIndex, productImages]);

  // ==================== LOADING SCREEN (SAU TẤT CẢ HOOK) ====================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-muted-foreground">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  const maxIndex = Math.max(0, relatedProducts.length - itemsPerView);
  const canScrollLeft = relatedProductIndex > 0;
  const canScrollRight = relatedProductIndex < maxIndex;

  const scrollLeft = () =>
    setRelatedProductIndex((prev) => Math.max(0, prev - 1));
  const scrollRight = () =>
    setRelatedProductIndex((prev) => Math.min(maxIndex, prev + 1));

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 4);

  // ==================== HANDLERS ====================
  const handleBackToProducts = onBack;
  const handlePhoneCall = () => {
    window.location.href = "tel:0822 774 784";
  };
  const handleProductClick = (clickedProduct: any) =>
    onProductClick?.(clickedProduct);
  const handleNewsClick = (newsId: string | number) => {
    onNewsClick?.(Number(newsId)); // ép về number để tương thích với App.tsx
  };

  const toggleReviewExpansion = (id: number) => {
    setExpandedReviews((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const handleDeleteReview = (reviewId: number, reviewName: string) => {
    if (confirm(`Bạn có chắc muốn xóa đánh giá của ${reviewName}?`)) {
      toast.success(`Đã xóa đánh giá của ${reviewName}`);
    }
  };

  const handleReviewSubmit = async (data: any) => {
    try {
      const res = await fetch(`${API_BASE}/reviews/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ProductID: product.ProductID,
          CustomerName: data.name,
          Rating: data.rating,
          Comment: data.comment,
          Purchased: true,
          Attachments: JSON.stringify(data.images),
        }),
      });
      if (res.ok) {
        const newReview = await res.json();
        setReviews((prev) => [newReview, ...prev]);
        toast.success("Cảm ơn bạn đã đánh giá!");
        setShowReviewForm(false);
      }
    } catch (err) {
      toast.error("Gửi đánh giá thất bại");
    }
  };

  // ==================== QUANTITY HANDLERS ====================
  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setQuantity(value > 0 ? value : 1);
  };

  // ==================== ĐẶT HÀNG TRỰC TIẾP ====================
const handleOrderNow = async () => {
  const unitPrice = Number(product.Price) || 0;
  const totalPrice = unitPrice * quantity;
  const formattedTotal = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(totalPrice);

  // Hiển thị toast thành công trước
  toast.success(
    <div className="space-y-2">
      <p className="font-bold text-base">Đặt hàng thành công!</p>
      <div className="text-sm space-y-1">
        <p><span className="font-semibold">{product.Name}</span> × {quantity}</p>
        <p>Đơn giá: <span className="font-medium">{unitPrice.toLocaleString("vi-VN")}đ</span></p>
        <p className="border-t pt-1 mt-1">
          Tổng cộng: <span className="font-bold text-primary text-base">{formattedTotal}</span>
        </p>
      </div>
      <p className="text-xs text-muted-foreground mt-2 pt-2 border-t">
        Chúng tôi sẽ liên hệ bạn sớm nhất!
      </p>
    </div>,
    { duration: 6000 }
  );

  // ĐÚNG FORMAT THEO BACKEND
  const order = {
    CustomerName: "Khách hàng",
    Phone: "0822774784",
    Email: "example@gmail.com",
    Quantity: quantity,
    OrderDate: new Date().toISOString(),  // ← đúng tên
    Product: product.ProductID,           // ← đúng tên, đúng giá trị
    // Không gửi TotalPrice nếu backend không cần
  };

  console.log("Gửi đơn hàng:", order); // DEBUG

  try {
    const response = await fetch(`${API_BASE}/orders/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Lỗi server:", errorData);
      throw new Error(`Lỗi ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const savedOrder = await response.json();
    console.log("Đơn hàng lưu thành công:", savedOrder);

    // Lưu localStorage
    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    localStorage.setItem("orders", JSON.stringify([order, ...existingOrders]));
  } catch (error: any) {
    console.error("Lỗi khi lưu đơn hàng:", error);
    toast.error("Không thể lưu đơn hàng lên máy chủ.");
  }
};


  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <SharedHeader
        onNavigateToMain={handleBackToProducts}
        onPhoneCall={handlePhoneCall}
        activeSection="products"
        products={products}
        newsArticles={newsArticles}
        onProductClick={handleProductClick}
        onNewsClick={handleNewsClick}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Product Detail Content */}
      <section className="pt-20 md:pt-24 pb-12 md:pb-16 px-4 md:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6 md:mb-8">
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
              <button
                onClick={handleBackToProducts}
                className="hover:text-primary transition-colors"
              >
                Trang chủ
              </button>
              <span>/</span>
              <button
                onClick={handleBackToProducts}
                className="hover:text-primary transition-colors"
              >
                Sản phẩm
              </button>
              <span>/</span>
              <span className="text-foreground font-medium">
                {product.Name || selectedProduct.title}
              </span>
            </nav>
          </div>

          {/* Product Detail Grid */}
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 mb-12">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent rounded-xl md:rounded-2xl overflow-hidden relative group">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full h-full"
                >
                  {productImages[currentImageIndex]?.endsWith(".mp4") ? (
                    <video
                      ref={videoRef}
                      src={productImages[currentImageIndex]}
                      controls
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <ImageWithFallback
                      src={productImages[currentImageIndex]}
                      alt={`${product.Name} ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                    />
                  )}
                </motion.div>

                {/* Product badges */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-gradient-to-r from-[#FF7BBF] to-[#FF4D91] text-white">
                    Bán chạy
                  </Badge>
                </div>

                <div className="absolute top-4 right-4">
                  <Badge
                    variant="secondary"
                    className="bg-white/90 text-primary font-bold"
                  >
                    100% Tươi
                  </Badge>
                </div>

                {/* Image/Video counter and badge */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                  {productImages[currentImageIndex]?.endsWith(".mp4") && (
                    <Badge
                      variant="secondary"
                      className="bg-red-600 text-white text-xs flex items-center gap-1"
                    >
                      <Camera className="w-3 h-3" />
                      VIDEO
                    </Badge>
                  )}
                  <Badge
                    variant="secondary"
                    className="bg-black/70 text-white text-xs"
                  >
                    {currentImageIndex + 1}/{productImages.length}
                  </Badge>
                </div>

                {/* Navigation arrows for images */}
                {productImages.length > 1 && (
                  <>
                    <motion.button
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === 0 ? productImages.length - 1 : prev - 1
                        )
                      }
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronLeft className="w-4 h-4 text-primary" />
                    </motion.button>

                    <motion.button
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === productImages.length - 1 ? 0 : prev + 1
                        )
                      }
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronRight className="w-4 h-4 text-primary" />
                    </motion.button>
                  </>
                )}
              </div>

              {/* Thumbnail images */}
              <div className="grid grid-cols-4 gap-2 mt-4">
                {productImages.map((img: string, index: number) => {
                  const isVideo = img?.endsWith(".mp4");
                  return (
                    <motion.div
                      key={index}
                      className={`aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer transition-all duration-300 relative group/thumb ${
                        currentImageIndex === index
                          ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-105"
                          : "hover:ring-2 hover:ring-primary/50 hover:scale-102"
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                      whileHover={{
                        scale: currentImageIndex === index ? 1.05 : 1.02,
                      }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      title={
                        isVideo
                          ? `${product.Name} - Video`
                          : index === 0
                          ? `${product.Name} - Ảnh chính`
                          : `${product.Name} - Ảnh ${index + 1}`
                      }
                    >
                      {isVideo ? (
                        <>
                          <video
                            src={img}
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          />
                          {/* Play icon overlay for video */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-10 h-10 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm">
                              <div className="w-0 h-0 border-l-[10px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <ImageWithFallback
                          src={img}
                          alt={`${product.Name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      )}

                      {/* Image/Video number indicator */}
                      <div className="absolute bottom-1 left-1 w-4 h-4 bg-black/70 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-200 rounded-lg"></div>

                      {/* Active indicator overlay */}
                      {currentImageIndex === index && (
                        <motion.div
                          className="absolute inset-0 bg-primary/10 rounded-lg"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}

                      {/* Check mark for active image/video */}
                      {currentImageIndex === index && (
                        <motion.div
                          className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-lg"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          <CheckCircle className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Image navigation hint */}
              <div className="text-center mt-3">
                <p className="text-xs text-muted-foreground">
                  Click vào ảnh/video nhỏ để xem chi tiết •{" "}
                  {productImages.filter((img: string) => !img?.endsWith(".mp4"))
                    .length}{" "}
                  ảnh,{" "}
                  {productImages.filter((img: string) => img?.endsWith(".mp4"))
                    .length}{" "}
                  video
                </p>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-4">
                {product.Tags && product.Tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {product.Tags.map((tag: any) => (
                      <Badge
                        key={tag.TagID}
                        variant="outline"
                        className="text-sm"
                      >
                        {tag.TagName}
                      </Badge>
                    ))}
                  </div>
                )}

                <h1
                  className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4"
                  style={{ fontFamily: "Fraunces, serif" }}
                >
                  {product.Name}
                </h1>

                <div className="mb-6">
                  {/* Price Section */}
                  <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-4 mb-4 border border-primary/20">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Giá lẻ:
                      </span>
                      <div className="text-2xl md:text-3xl font-bold text-primary">
                        {Number(product.Price)?.toLocaleString("vi-VN")}đ
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Mua số lượng lớn?
                      </span>
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-primary hover:text-primary/80"
                        onClick={() => {
                          const message = `Tôi muốn tư vấn giá sỉ cho ${product.Name}. Vui lòng liên hệ.`;
                          const whatsappUrl = `https://wa.me/84123456789?text=${encodeURIComponent(
                            message
                          )}`;
                          const zaloUrl = `https://zalo.me/84123456789`;

                          if (
                            confirm(
                              `Tư vấn giá sỉ ${product.Name}?\nChọn OK để liên hệ qua Zalo/WhatsApp, Cancel để gọi điện trực tiếp.`
                            )
                          ) {
                            window.open(zaloUrl, "_blank") ||
                              window.open(whatsappUrl, "_blank");
                          } else {
                            handlePhoneCall();
                          }
                        }}
                      >
                        Liên hệ tư vấn giá sỉ →
                      </Button>
                    </div>
                  </div>

                  {/* Reviews */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">
                      ({reviews.length} đánh giá)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3">Mô tả sản phẩm</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {product.Description}. Hoa sen tươi được chọn lọc kỹ càng từ
                  vùng trồng nổi tiếng, đảm bảo chất lượng cao nhất với độ tươi
                  lâu bền.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Tươi lâu 5-7 ngày</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Giao hàng nhanh</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Đóng gói cẩn thận</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Hỗ trợ 24/7</span>
                  </div>
                </div>
              </div>

              {/* Quantity & Actions - ĐÃ CẬP NHẬT */}
              <div className="mb-6">
                <div className="mb-4">
                  <label className="text-sm font-medium mb-2 block">
                    Số lượng:
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 w-10 p-0 hover:bg-primary/10 transition-colors"
                        onClick={handleDecreaseQuantity}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={handleQuantityChange}
                        min="1"
                        className="w-16 h-10 text-center border-0 bg-transparent font-semibold focus:outline-none
                                   [appearance:textfield] 
                                   [&::-webkit-outer-spin-button]:hidden 
                                   [&::-webkit-inner-spin-button]:hidden"
                        style={{
                          MozAppearance: "textfield",
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 w-10 p-0 hover:bg-primary/10 transition-colors"
                        onClick={handleIncreaseQuantity}
                      >
                        +
                      </Button>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      bông/lá
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-[#FF7BBF] to-[#FF4D91] text-white text-base md:text-lg h-12 shadow-md hover:shadow-lg transition-all"
                    onClick={handleOrderNow}
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Đặt hàng ngay
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full h-12 text-lg"
                    onClick={handlePhoneCall}
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Gọi tư vấn: 0822 774 784
                  </Button>
                </div>
              </div>

              {/* Product Features */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-bold mb-4">Thông tin thêm</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Xuất xứ:</span>
                    <span className="font-medium">
                      {product.Name === "Sen" ? (
                        <span className="text-amber-600 font-bold">
                          Đồng Tháp Mười, Việt Nam 🌾
                        </span>
                      ) : (
                        "Việt Nam"
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Thời gian tươi:
                    </span>
                    <span className="font-medium">5-7 ngày</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Giao hàng:</span>
                    <span className="font-medium">Toàn quốc</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cam kết:</span>
                    <span className="font-medium">100% Tươi tự nhiên</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews in Product Detail */}
          <div className="border-t pt-6 md:pt-8 mb-8 md:mb-12">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-lg md:text-xl font-bold mb-3">
                Đánh giá khách hàng
              </h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
                Những chia sẻ chân thật từ khách hàng đã mua {product.Name}
              </p>
            </div>

            {/* Two-column Layout: Reviews Left, Stats Right */}
            <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
              {/* Left Column - Reviews Interface */}
              <div className="lg:col-span-2">
                {/* Reviews Grid */}
                <div
                  className={`${
                    showAllReviews
                      ? "border border-border rounded-lg bg-muted/20 p-2 md:p-3"
                      : ""
                  } mb-6`}
                >
                  <div
                    className={`grid md:grid-cols-2 gap-4 md:gap-6 ${
                      showAllReviews
                        ? "max-h-96 md:max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent pr-2"
                        : ""
                    }`}
                    style={
                      showAllReviews
                        ? {
                            scrollBehavior: "smooth",
                            scrollbarWidth: "thin",
                            scrollbarColor:
                              "rgba(244, 166, 205, 0.3) transparent",
                          }
                        : {}
                    }
                  >
                    <AnimatePresence>
                      {displayedReviews.map((review: any, index: number) => (
                        <motion.div
                          key={review.ReviewID}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{
                            duration: 0.3,
                            delay: showAllReviews ? index * 0.02 : 0,
                          }}
                        >
                          <Card
                            className={`hover:shadow-lg transition-all duration-300 h-full ${
                              showAllReviews
                                ? "bg-background/80 backdrop-blur-sm"
                                : ""
                            }`}
                          >
                            <CardHeader className="p-4 md:p-6">
                              <div className="flex items-start gap-3 md:gap-4 mb-3">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden flex-shrink-0 bg-primary/10 flex items-center justify-center">
                                  <span className="text-lg font-bold text-primary">
                                    {review.CustomerName?.charAt(0) || "K"}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2 mb-1">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                      <h4 className="font-bold text-sm md:text-base truncate">
                                        {review.CustomerName}
                                      </h4>
                                      {review.Purchased && (
                                        <Badge
                                          variant="secondary"
                                          className="text-xs flex-shrink-0"
                                        >
                                          <CheckCircle className="w-3 h-3 mr-1" />
                                          Đã mua
                                        </Badge>
                                      )}
                                    </div>
                                    {/* Delete button */}
                                    {review.CustomerName ===
                                      currentUserName && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                                        onClick={() =>
                                          handleDeleteReview(
                                            review.ReviewID,
                                            review.CustomerName
                                          )
                                        }
                                        title="Xóa đánh giá của bạn"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="flex items-center">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`w-3 h-3 md:w-4 md:h-4 ${
                                            i < review.Rating
                                              ? "text-yellow-400 fill-current"
                                              : "text-gray-300"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(
                                        review.CreatedAt
                                      ).toLocaleDateString("vi-VN")}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <p className="text-sm md:text-base leading-relaxed">
                                  {expandedReviews.has(review.ReviewID)
                                    ? review.Comment
                                    : `${review.Comment.slice(0, 60)}${
                                        review.Comment.length > 60 ? "..." : ""
                                      }`}
                                </p>

                                {review.Comment.length > 60 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-primary hover:text-primary/80 p-0 h-auto text-sm"
                                    onClick={() =>
                                      toggleReviewExpansion(review.ReviewID)
                                    }
                                  >
                                    {expandedReviews.has(review.ReviewID)
                                      ? "Thu gọn"
                                      : "Đọc thêm"}
                                  </Button>
                                )}
                              </div>
                            </CardHeader>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-6">
                  {reviews.length > 4 && (
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto hover:bg-primary/10 transition-colors"
                      onClick={() => setShowAllReviews(!showAllReviews)}
                    >
                      {showAllReviews
                        ? "Thu gọn đánh giá"
                        : `Hiện tất cả đánh giá (${reviews.length})`}
                    </Button>
                  )}

                  <Button
                    className="w-full sm:w-auto bg-gradient-to-r from-[#FF7BBF] to-[#FF4D91] text-white hover:shadow-lg transition-shadow"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                  >
                    <Star className="w-4 h-4 mr-2" />
                    {showReviewForm ? "Đóng form đánh giá" : "Viết đánh giá"}
                  </Button>
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <div className="mt-6">
                    <ReviewForm
                      productTitle={product.Name}
                      onSubmit={handleReviewSubmit}
                      onCancel={() => setShowReviewForm(false)}
                    />
                  </div>
                )}
              </div>

              {/* Right Column - Stats */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="text-base md:text-lg mb-4">
                      Thống kê đánh giá
                    </CardTitle>

                    {/* Overall Rating */}
                    <div className="text-center mb-6 pb-6 border-b">
                      <div className="text-3xl md:text-4xl font-bold mb-2">
                        {reviews.length > 0
                          ? (
                              reviews.reduce(
                                (acc: number, r: any) => acc + r.Rating,
                                0
                              ) / reviews.length
                            ).toFixed(1)
                          : "5.0"}
                      </div>
                      <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {reviews.length} đánh giá
                      </p>
                    </div>

                    {/* Rating Distribution */}
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = reviews.filter(
                          (r: any) => r.Rating === star
                        ).length;
                        const percentage =
                          reviews.length > 0
                            ? (count / reviews.length) * 100
                            : 0;
                        return (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-xs w-6">{star}★</span>
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div
                                className="bg-primary rounded-full h-2 transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-xs w-8 text-right">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="border-t pt-6 md:pt-8">
            <h2 className="text-lg md:text-xl font-bold text-center mb-4 md:mb-6">
              Sản phẩm liên quan
            </h2>
            <div className="max-w-6xl mx-auto px-4 md:px-6">
              <div className="relative">
                {/* Products Container */}
                <div className="overflow-hidden">
                  <motion.div
                    className="flex gap-3 md:gap-4"
                    animate={{
                      x: `${-relatedProductIndex * (100 / itemsPerView)}%`,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                    style={{
                      width: `${
                        (relatedProducts.length / itemsPerView) * 100
                      }%`,
                    }}
                  >
                    {relatedProducts.map((relProduct: any) => (
                      <motion.div
                        key={relProduct.ProductID}
                        className="flex-shrink-0"
                        style={{
                          width: `${100 / relatedProducts.length}%`,
                        }}
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card
                          className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full cursor-pointer"
                          onClick={() =>
                            handleProductClick({ id: relProduct.ProductID })
                          }
                        >
                          <div className="aspect-[4/3] overflow-hidden">
                            <ImageWithFallback
                              src={
                                relProduct.media?.find((m: any) => m.IsPrimary)
                                  ?.Url ||
                                relProduct.media?.[0]?.Url ||
                                ""
                              }
                              alt={relProduct.Name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <CardHeader className="p-1.5 md:p-2">
                            <div className="flex flex-col gap-0.5">
                              <CardTitle className="text-xs font-bold leading-tight line-clamp-2">
                                {relProduct.Name}
                              </CardTitle>
                              <div className="text-xs text-primary font-bold">
                                {Number(relProduct.Price)?.toLocaleString(
                                  "vi-VN"
                                )}
                                đ
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-1.5 md:p-2 pt-0">
                            <div className="flex flex-wrap gap-0.5">
                              {relProduct.Tags?.slice(0, 2).map((tag: any) => (
                                <Badge
                                  key={tag.TagID}
                                  variant="secondary"
                                  className="text-[10px] md:text-xs py-0 px-1"
                                >
                                  {tag.TagName}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* Navigation Controls */}
                {relatedProducts.length > itemsPerView && (
                  <div className="flex items-center justify-center gap-1 md:gap-3 mt-1 md:mt-4">
                    <motion.button
                      className={`w-4 h-4 md:w-10 md:h-10 bg-gradient-to-r from-[#FF7BBF] to-[#FF4D91] rounded-full flex items-center justify-center shadow-sm transition-all duration-300 ${
                        canScrollLeft
                          ? "opacity-100 hover:shadow-md cursor-pointer"
                          : "opacity-30 cursor-not-allowed"
                      }`}
                      onClick={scrollLeft}
                      disabled={!canScrollLeft}
                      whileHover={{ scale: canScrollLeft ? 1.08 : 1 }}
                      whileTap={{ scale: canScrollLeft ? 0.92 : 1 }}
                    >
                      <ChevronLeft
                        className="w-2.5 h-2.5 md:w-5 md:h-5 text-white"
                        strokeWidth={2.5}
                      />
                    </motion.button>

                    <div className="flex gap-0.5 md:gap-1.5">
                      {Array.from({ length: maxIndex + 1 }, (_, i) => (
                        <motion.button
                          key={i}
                          className={`h-[3px] w-[3px] md:h-2 md:w-2 rounded-full transition-all duration-300 ${
                            i === relatedProductIndex
                              ? "bg-primary md:scale-110"
                              : "bg-primary/40 hover:bg-primary/60"
                          }`}
                          onClick={() => setRelatedProductIndex(i)}
                          whileHover={{
                            scale: i === relatedProductIndex ? 1 : 1.02,
                          }}
                          whileTap={{ scale: 0.95 }}
                        />
                      ))}
                    </div>

                    <motion.button
                      className={`w-4 h-4 md:w-10 md:h-10 bg-gradient-to-r from-[#FF7BBF] to-[#FF4D91] rounded-full flex items-center justify-center shadow-sm transition-all duration-300 ${
                        canScrollRight
                          ? "opacity-100 hover:shadow-md cursor-pointer"
                          : "opacity-30 cursor-not-allowed"
                      }`}
                      onClick={scrollRight}
                      disabled={!canScrollRight}
                      whileHover={{ scale: canScrollRight ? 1.08 : 1 }}
                      whileTap={{ scale: canScrollRight ? 0.92 : 1 }}
                    >
                      <ChevronRight
                        className="w-2.5 h-2.5 md:w-5 md:h-5 text-white"
                        strokeWidth={2.5}
                      />
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <SharedFooter onNavigateToMain={handleBackToProducts} />

      {/* Toast Notifications */}
      <Toaster richColors position="top-right" />
    </div>
  );
}

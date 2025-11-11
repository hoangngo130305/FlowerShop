"use client";

import { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Chatbot from "./components/Chatbot";
import { SharedHeader } from "./components/SharedHeader";
import ContactSection from "./components/ContactSection";
import { SharedFooter } from "./components/SharedFooter";
import ProductDetailPage from "./components/ProductDetailPage";
import NewsDetailPage from "./components/NewsDetailPage"; // ✅ USE API VERSION
import ProductsSection from "./components/ProductsSection";
import NewsSection from "./components/NewsSection"; // ✅ USE API VERSION
import HeroSection from "./components/HeroSection";
import WhyChooseUs from "./components/WhyChooseUs"; // ✅ NEW
import DeliverySection from "./components/DeliverySection"; // ✅ NEW
import { useIsMobile } from "./components/ui/use-mobile";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Flower } from "lucide-react";
import { AdminLogin } from "./components/AdminLogin";
import { AdminPage } from "./components/AdminPage";
import { DataProvider } from "./components/DataContext"; // ✅ USE DataContextAPI

function AppContent() {
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  
  // ✅ CHANGED: Lưu newsId thay vì news object
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [showNewsDetail, setShowNewsDetail] = useState(false);
  
  const [productImageIndex, setProductImageIndex] = useState(0);
  const [showAllNews, setShowAllNews] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    product: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Check URL for admin route
  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname;
      if (path === "/admin" || path.endsWith("/admin")) {
        setIsAdminMode(true);
      }
    };

    checkAdminRoute();
    window.addEventListener("popstate", checkAdminRoute);
    return () => window.removeEventListener("popstate", checkAdminRoute);
  }, []);

  // === XỬ LÝ SẢN PHẨM ===
  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setShowProductDetail(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToProducts = () => {
    setShowProductDetail(false);
    setSelectedProduct(null);
    setProductImageIndex(0);
  };

  // === XỬ LÝ TIN TỨC - ✅ FIXED ===
  const handleReadMore = (newsId: string | number) => {
    console.log('🔍 handleReadMore called with newsId:', newsId);
    setSelectedNewsId(String(newsId)); // ✅ Lưu ID thay vì tìm object
    setShowNewsDetail(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToNews = () => {
    setShowNewsDetail(false);
    setSelectedNewsId(null);
    setTimeout(() => {
      const element = document.getElementById("news");
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleNavigateToMain = () => {
    setShowProductDetail(false);
    setShowNewsDetail(false);
    setSelectedProduct(null);
    setSelectedNewsId(null);
    setProductImageIndex(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // === FORM LIÊN HỆ ===
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success("Cảm ơn bạn đã liên hệ!");
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      product: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  const handlePhoneCall = () => {
    window.location.href = "tel:0123456789";
  };

  // === RENDER CHI TIẾT SẢN PHẨM ===
  if (showProductDetail && selectedProduct) {
    return (
      <ProductDetailPage
        selectedProduct={selectedProduct}
        products={[]}
        newsArticles={[]}
        productImageIndex={productImageIndex}
        setProductImageIndex={setProductImageIndex}
        onBack={handleBackToProducts}
      />
    );
  }

  // === RENDER CHI TIẾT TIN TỨC - ✅ FIXED ===
  if (showNewsDetail && selectedNewsId) {
    return (
      <NewsDetailPage
        newsId={selectedNewsId} // ✅ Truyền ID thay vì object
        onBack={handleBackToNews}
        handleReadMore={handleReadMore}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onNavigateToMain={handleNavigateToMain}
        onNavigateToSection={(sectionId) => {
          handleNavigateToMain();
          setTimeout(() => {
            document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }}
        onGoToAdmin={() => setIsAdminMode(true)}
      />
    );
  }

  // === RENDER TRANG ADMIN ===
  if (isAdminMode) {
    return (
      <>
        {!isAdminLoggedIn ? (
          <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />
        ) : (
          <AdminPage
            onLogout={() => {
              setIsAdminLoggedIn(false);
              setIsAdminMode(false);
              window.history.pushState({}, "", "/");
            }}
          />
        )}
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Sen Việt - Hoa Sen Tươi Chất Lượng Cao</title>
        <meta
          name="description"
          content="Sen Việt chuyên cung cấp hoa sen tươi cao cấp..."
        />
      </Helmet>

      <Toaster />

      <div className="relative min-h-screen overflow-hidden">
        {/* SUBTLE PINK BACKGROUND - FIGMA STYLE */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          {/* Soft Pink Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100/50"></div>

          {/* Floating Lotus Flowers - Soft Pink Tones */}
          <motion.div
            className="absolute top-20 left-10"
            animate={{
              y: [0, -15, 0],
              rotate: [0, 3, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Flower
              className="w-16 h-16 md:w-20 md:h-20"
              style={{ color: "rgba(251, 207, 232, 0.4)" }}
            />
          </motion.div>

          <motion.div
            className="absolute top-1/4 right-16"
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 0],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          >
            <Flower
              className="w-24 h-24 md:w-28 md:h-28"
              style={{ color: "rgba(244, 114, 182, 0.35)" }}
            />
          </motion.div>

          <motion.div
            className="absolute bottom-1/3 left-1/4"
            animate={{
              y: [0, -18, 0],
              rotate: [0, 4, 0],
              scale: [1, 1.06, 1],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4,
            }}
          >
            <Flower
              className="w-20 h-20 md:w-24 md:h-24"
              style={{ color: "rgba(251, 207, 232, 0.3)" }}
            />
          </motion.div>

          <motion.div
            className="absolute top-2/3 right-1/4"
            animate={{
              y: [0, 12, 0],
              rotate: [0, -3, 0],
              x: [0, -8, 0],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <Flower
              className="w-14 h-14 md:w-16 md:h-16"
              style={{ color: "rgba(236, 72, 153, 0.3)" }}
            />
          </motion.div>

          <motion.div
            className="absolute top-1/2 left-16"
            animate={{
              y: [0, -12, 0],
              rotate: [0, 5, 0],
              scale: [1, 1.07, 1],
            }}
            transition={{
              duration: 11,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
          >
            <Flower
              className="w-18 h-18 md:w-22 md:h-22"
              style={{ color: "rgba(251, 207, 232, 0.35)" }}
            />
          </motion.div>

          <motion.div
            className="absolute bottom-20 right-12"
            animate={{
              y: [0, 15, 0],
              rotate: [0, -4, 0],
              scale: [1, 1.06, 1],
            }}
            transition={{
              duration: 13,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5,
            }}
          >
            <Flower
              className="w-16 h-16 md:w-20 md:h-20"
              style={{ color: "rgba(244, 114, 182, 0.4)" }}
            />
          </motion.div>

          <motion.div
            className="absolute top-1/3 left-1/3"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 6, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 6,
            }}
          >
            <Flower
              className="w-14 h-14 md:w-18 md:h-18"
              style={{ color: "rgba(251, 207, 232, 0.3)" }}
            />
          </motion.div>

          <motion.div
            className="absolute bottom-1/2 right-1/3"
            animate={{
              y: [0, 18, 0],
              rotate: [0, -6, 0],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 7,
            }}
          >
            <Flower
              className="w-20 h-20 md:w-24 md:h-24"
              style={{ color: "rgba(236, 72, 153, 0.35)" }}
            />
          </motion.div>

          {/* Floating Stars/Sparkles - Pink Sparkles */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-pink-300/40 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Soft Pink Gradient Orbs */}
          <motion.div
            className="absolute top-1/3 left-10 w-64 h-64 bg-gradient-to-r from-pink-200/20 to-rose-200/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute bottom-1/3 right-10 w-56 h-56 bg-gradient-to-r from-rose-200/20 to-pink-200/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.25, 0.45, 0.25],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          <SharedHeader
            onNavigateToMain={handleNavigateToMain}
            onPhoneCall={handlePhoneCall}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            products={[]}
            newsArticles={[]}
            onProductClick={handleProductClick}
            onNewsClick={handleReadMore}
          />
          
          <HeroSection
            onBuyNow={() =>
              document
                .getElementById("products")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          />
                    {/* ✅ NEW: Why Choose Us Section */}
          <WhyChooseUs />
          {/* ✅ ProductsSection tự fetch API */}
          <ProductsSection onProductClick={handleProductClick} />
          {/* ✅ NEW: Delivery Section */}
          <DeliverySection />
          {/* ✅ NewsSection_API - tự fetch từ Django */}
          <NewsSection
            newsArticles={[]} // ✅ Không cần truyền data, component tự fetch
            showAllNews={showAllNews}
            setShowAllNews={setShowAllNews}
            handleReadMore={handleReadMore}
          />
          
          <ContactSection />
          <SharedFooter onNavigateToMain={handleNavigateToMain} />
        </div>
      </div>

      <Chatbot />
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <DataProvider>
        <Helmet>
          <title>Sen Đồng Tháp - Hoa Sen Tươi Chất Lượng Cao</title>
          <meta
            name="description"
            content="Chuyên cung cấp hoa sen tươi từ Đồng Tháp Mười với chất lượng cao nhất. Giao hàng nhanh chóng, giá cả hợp lý."
          />
        </Helmet>
        <AppContent />
        <Toaster />
      </DataProvider>
    </HelmetProvider>
  );
}

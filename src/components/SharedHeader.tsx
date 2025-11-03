"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Badge } from "./ui/badge";
import { Flower, Phone, Search, Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { useIsMobile } from "./ui/use-mobile";

const API_BASE_URL = "http://localhost:8000/api";

interface SharedHeaderProps {
  onNavigateToMain: () => void;
  onPhoneCall: () => void;
  activeSection?: string;
  setActiveSection?: (section: string) => void;
  onProductClick?: (product: any) => void;
  onNewsClick?: (newsId: number) => void;
  products?: any[]; // ✅ thêm dòng này
  newsArticles?: any[]; // ✅ và dòng này
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
}

export function SharedHeader({
  onNavigateToMain,
  onPhoneCall,
  activeSection = "",
  setActiveSection = () => {},
  onProductClick = () => {},
  onNewsClick = () => {},
  isMobileMenuOpen: externalMobileMenuOpen,
  setIsMobileMenuOpen: externalSetMobileMenuOpen,
}: SharedHeaderProps) {
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [internalMobileMenuOpen, internalSetMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const isMobileMenuOpen =
    externalMobileMenuOpen !== undefined
      ? externalMobileMenuOpen
      : internalMobileMenuOpen;
  const setIsMobileMenuOpen =
    externalSetMobileMenuOpen || internalSetMobileMenuOpen;

  // ĐÃ SỬA: MENU TIẾNG VIỆT
  const MENU_ITEMS = [
    { id: "home", label: "Trang chủ" },
    { id: "products", label: "Sản phẩm" },
    { id: "delivery", label: "Giao hàng" },
    { id: "news", label: "Tin tức" },
    { id: "contact", label: "Liên hệ" },
  ];

  // DEBOUNCE + GỌI API
  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) {
      setProducts([]);
      setNewsArticles([]);
      setIsLoading(false);
      return;
    }

    const timeout = setTimeout(() => {
      searchFromAPI(query);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const searchFromAPI = async (q: string) => {
    setIsLoading(true);
    const newProducts: any[] = [];
    const newNews: any[] = [];

    try {
      const productRes = await fetch(
        `${API_BASE_URL}/products/?search=${encodeURIComponent(q)}`
      );
      if (productRes.ok) {
        const data = await productRes.json();
        data.slice(0, 5).forEach((p: any) => {
          const primaryMedia = p.media?.find((m: any) => m.IsPrimary);
          const image =
            primaryMedia?.Url ||
            p.media?.[0]?.Url ||
            `/` + (p.Image || "placeholder.jpg"); // nếu có trường Image trong API

          newProducts.push({
            id: p.ProductID,
            title: p.Name,
            image: image.startsWith("http") ? image : image, // dùng đường dẫn tương đối
            price: `${Number(p.Price).toLocaleString()}đ`,
            description: p.Description || "",
            category: p.Origin || "Sản phẩm",
          });
        });
      }
    } catch (err) {
      console.error("Lỗi tìm sản phẩm:", err);
    }

    try {
      const newsRes = await fetch(
        `${API_BASE_URL}/news/?search=${encodeURIComponent(q)}`
      );
      if (newsRes.ok) {
        const data = await newsRes.json();
        data.slice(0, 3).forEach((n: any) => {
          newNews.push({
            id: n.NewsID,
            title: n.Title,
            // Nếu API trả về chỉ tên file, ví dụ "baiviet1.jpg" → tự động gắn "/"
            image: n.Image
              ? n.Image.startsWith("http")
                ? n.Image
                : `/${n.Image}`
              : "/placeholder.jpg",
            excerpt: n.Content?.slice(0, 80) + "..." || "",
            date: new Date(n.CreatedAt).toLocaleDateString("vi-VN"),
            category: n.Category || "Tin tức",
          });
        });
      }
    } catch (err) {
      console.error("Lỗi tìm tin tức:", err);
    }

    setProducts(newProducts);
    setNewsArticles(newNews);
    setIsLoading(false);
  };

  const handleSearchIconClick = () => {
    setShowSearchInput((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => searchInputRef.current?.focus(), 100);
      } else {
        setSearchQuery("");
        setProducts([]);
        setNewsArticles([]);
      }
      return next;
    });
  };

  const scrollToSection = (sectionId: string) => {
    onNavigateToMain();
    setTimeout(() => {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }, 100);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 flex justify-between items-center">
        <button
          onClick={onNavigateToMain}
          className="text-lg sm:text-xl md:text-2xl flex items-center font-black cursor-pointer"
          style={{ fontFamily: "Fraunces, serif" }}
        >
          <Flower className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mr-1.5 sm:mr-2 text-primary stroke-[2.5]" />
          Sen Việt
        </button>

        {/* Desktop Navigation – ĐÃ SỬA TIẾNG VIỆT */}
        <div className="hidden md:flex space-x-8">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`relative py-2 transition-colors duration-200 font-semibold ${
                activeSection === item.id
                  ? "text-primary"
                  : "text-foreground/80 hover:text-primary"
              }`}
            >
              <span className="font-bold">{item.label}</span>
              {activeSection === item.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 md:space-x-3">
          {/* Desktop Search */}
          <div className="hidden md:flex items-center relative">
            <motion.div
              initial={false}
              animate={{ width: showSearchInput ? "280px" : "0px" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <Popover
                open={
                  !isMobile &&
                  (isLoading || products.length > 0 || newsArticles.length > 0)
                }
                onOpenChange={setShowSearchResults}
              >
                <PopoverTrigger asChild>
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Tìm kiếm sản phẩm, tin tức..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSearchResults(e.target.value.length > 0);
                    }}
                    onBlur={() => {
                      setTimeout(() => {
                        if (!searchQuery.trim()) setShowSearchInput(false);
                      }, 200);
                    }}
                    className="w-full h-9"
                    autoComplete="off"
                  />
                </PopoverTrigger>
                {!isMobile && (
                  <PopoverContent
                    className="w-[280px] p-0 max-h-[400px] overflow-y-auto"
                    align="end"
                  >
                    {isLoading ? (
                      <div className="p-4 text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                      </div>
                    ) : products.length === 0 && newsArticles.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        Không tìm thấy kết quả
                      </div>
                    ) : (
                      <div className="py-2">
                        {products.length > 0 && (
                          <div className="mb-2">
                            <div className="px-3 py-2 text-xs text-muted-foreground">
                              Sản phẩm
                            </div>
                            {products.map((product) => (
                              <button
                                key={product.id}
                                onClick={() => {
                                  onProductClick(product);
                                  setShowSearchInput(false);
                                  setSearchQuery("");
                                  setProducts([]);
                                  setNewsArticles([]);
                                }}
                                className="w-full px-3 py-2 hover:bg-muted transition-colors text-left flex items-center gap-3"
                              >
                                <div className="w-10 h-10 bg-muted rounded overflow-hidden flex-shrink-0">
                                  <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm truncate">
                                    {product.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {product.description}
                                  </p>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {product.price}
                                </Badge>
                              </button>
                            ))}
                          </div>
                        )}
                        {newsArticles.length > 0 && (
                          <div>
                            <div className="px-3 py-2 text-xs text-muted-foreground">
                              Tin tức
                            </div>
                            {newsArticles.map((news) => (
                              <button
                                key={news.id}
                                onClick={() => {
                                  onNewsClick(news.id);
                                  setShowSearchInput(false);
                                  setSearchQuery("");
                                  setProducts([]);
                                  setNewsArticles([]);
                                }}
                                className="w-full px-3 py-2 hover:bg-muted transition-colors text-left flex items-center gap-3"
                              >
                                <div className="w-10 h-10 bg-muted rounded overflow-hidden flex-shrink-0">
                                  <img
                                    src={news.image}
                                    alt={news.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm truncate">
                                    {news.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {news.date}
                                  </p>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </PopoverContent>
                )}
              </Popover>
            </motion.div>
            <Button
              variant="ghost"
              size="sm"
              className="ml-2"
              onClick={handleSearchIconClick}
            >
              <Search className="w-5 h-5" />
            </Button>
          </div>

          {/* Mobile Search */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSearchIconClick}
            className="md:hidden"
          >
            <Search className="w-5 h-5" />
          </Button>

          {/* Call Button */}
          <Button
            size="sm"
            className="hidden sm:flex bg-gradient-to-r from-[#FF7BBF] to-[#FF4D91] text-white"
            onClick={onPhoneCall}
          >
            <Phone className="w-4 h-4 mr-2" /> Gọi ngay
          </Button>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {showSearchInput && isMobile && (
        <motion.div
          className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b shadow-lg z-50"
          initial={{ y: -10 }}
          animate={{ y: 0 }}
        >
          <div className="px-4 py-4">
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(e.target.value.length > 0);
              }}
              className="w-full"
            />
            {(isLoading || products.length > 0 || newsArticles.length > 0) && (
              <div className="mt-2 bg-background border rounded-lg shadow-lg max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : products.length === 0 && newsArticles.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Không tìm thấy
                  </div>
                ) : (
                  <div className="py-2">
                    {products.length > 0 && (
                      <div className="mb-2">
                        <div className="px-3 py-2 text-xs font-semibold text-muted-foreground bg-muted/50">
                          SẢN PHẨM ({products.length})
                        </div>
                        {products.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => {
                              onProductClick(product);
                              setShowSearchInput(false);
                              setSearchQuery("");
                              setProducts([]);
                              setNewsArticles([]);
                            }}
                            className="w-full px-3 py-2 hover:bg-muted transition-colors text-left flex items-center gap-3 border-b last:border-b-0"
                          >
                            <div className="w-10 h-10 bg-muted rounded overflow-hidden flex-shrink-0">
                              <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm truncate">
                                {product.title}
                              </p>
                              <p className="text-xs text-primary">
                                {product.price}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    {newsArticles.length > 0 && (
                      <div>
                        <div className="px-3 py-2 text-xs font-semibold text-muted-foreground bg-muted/50">
                          TIN TỨC ({newsArticles.length})
                        </div>
                        {newsArticles.map((news) => (
                          <button
                            key={news.id}
                            onClick={() => {
                              onNewsClick(news.id);
                              setShowSearchInput(false);
                              setSearchQuery("");
                              setProducts([]);
                              setNewsArticles([]);
                            }}
                            className="w-full px-3 py-2 hover:bg-muted transition-colors text-left flex items-center gap-3 border-b last:border-b-0"
                          >
                            <div className="w-10 h-10 bg-muted rounded overflow-hidden flex-shrink-0">
                              <img
                                src={news.image}
                                alt={news.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm truncate">{news.title}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {news.excerpt}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {news.category}
                            </Badge>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Mobile Menu – ĐÃ SỬA TIẾNG VIỆT */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 py-4 space-y-3">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-muted-foreground hover:text-foreground font-bold"
              >
                {item.label}
              </button>
            ))}
            <Button
              size="sm"
              className="w-full bg-gradient-to-r from-[#FF7BBF] to-[#FF4D91] text-white"
              onClick={() => {
                onPhoneCall();
                setIsMobileMenuOpen(false);
              }}
            >
              <Phone className="w-4 h-4 mr-2" /> Gọi ngay
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

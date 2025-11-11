import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Badge } from "./ui/badge";
import { Flower, Phone, Search, Menu, X } from "lucide-react";
import { motion } from 'motion/react';
import { useRef, useState } from "react";
import { useIsMobile } from "./ui/use-mobile";
import logoImage from "../assets/logo.png";

interface SharedHeaderProps {
  onNavigateToMain: () => void;
  onPhoneCall: () => void;
  activeSection?: string;
  setActiveSection?: (section: string) => void;
  products?: any[];
  newsArticles?: any[];
  onProductClick?: (product: any) => void;
  onNewsClick?: (newsId: number | any) => void;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
}

export function SharedHeader({
  onNavigateToMain,
  onPhoneCall,
  activeSection = '',
  setActiveSection = () => {},
  products = [],
  newsArticles = [],
  onProductClick = () => {},
  onNewsClick = () => {},
  isMobileMenuOpen: externalMobileMenuOpen,
  setIsMobileMenuOpen: externalSetMobileMenuOpen
}: SharedHeaderProps) {
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [internalMobileMenuOpen, internalSetMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  // Use external state if provided, otherwise use internal state
  const isMobileMenuOpen = externalMobileMenuOpen !== undefined ? externalMobileMenuOpen : internalMobileMenuOpen;
  const setIsMobileMenuOpen = externalSetMobileMenuOpen || internalSetMobileMenuOpen;

  // Filter products and news based on search query
  const filteredProducts = (Array.isArray(products) ? products : []).filter(p => 
    p && searchQuery && (
      (p.title && p.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.category && Array.isArray(p.category) && p.category.some((cat: any) => typeof cat === 'string' && cat.toLowerCase().includes(searchQuery.toLowerCase())))
    )
  ).slice(0, 5);

  const filteredNews = (Array.isArray(newsArticles) ? newsArticles : []).filter(n =>
    n && searchQuery && (
      (n.title && n.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (n.excerpt && n.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  ).slice(0, 3);

  const handleSearchIconClick = () => {
    setShowSearchInput(!showSearchInput);
    if (!showSearchInput) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery('');
      setShowSearchResults(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    onNavigateToMain();
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }, 100);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 flex justify-between items-center">
        <button 
          onClick={onNavigateToMain}
          className="text-lg sm:text-xl md:text-2xl flex items-center font-black cursor-pointer" 
          style={{ fontFamily: 'Fraunces, serif' }}
        >
          <img 
            src={logoImage} 
            alt="Sen Việt Logo" 
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mr-2 sm:mr-3 object-contain"
          />
          Sen Việt
        </button>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          <button 
            onClick={() => scrollToSection('home')}
            className={`relative py-2 transition-colors duration-200 font-semibold ${
              activeSection === 'home' 
                ? 'text-primary' 
                : 'text-foreground/80 hover:text-primary'
            }`}
          >
            <span className="font-bold">Trang chủ</span>
            {activeSection === 'home' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
            )}
          </button>
          <button 
            onClick={() => scrollToSection('products')}
            className={`relative py-2 transition-colors duration-200 font-semibold ${
              activeSection === 'products' 
                ? 'text-primary' 
                : 'text-foreground/80 hover:text-primary'
            }`}
          >
            <span className="font-bold">Sản phẩm</span>
            {activeSection === 'products' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
            )}
          </button>
          <button 
            onClick={() => scrollToSection('delivery')}
            className={`relative py-2 transition-colors duration-200 font-semibold ${
              activeSection === 'delivery' 
                ? 'text-primary' 
                : 'text-foreground/80 hover:text-primary'
            }`}
          >
            <span className="font-bold">Giao hàng</span>
            {activeSection === 'delivery' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
            )}
          </button>
          <button 
            onClick={() => scrollToSection('news')}
            className={`relative py-2 transition-colors duration-200 font-semibold ${
              activeSection === 'news' 
                ? 'text-primary' 
                : 'text-foreground/80 hover:text-primary'
            }`}
          >
            <span className="font-bold">Tin tức</span>
            {activeSection === 'news' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
            )}
          </button>
          <button 
            onClick={() => scrollToSection('contact')}
            className={`relative py-2 transition-colors duration-200 font-semibold ${
              activeSection === 'contact' 
                ? 'text-primary' 
                : 'text-foreground/80 hover:text-primary'
            }`}
          >
            <span className="font-bold">Liên hệ</span>
            {activeSection === 'contact' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
            )}
          </button>
        </div>

        {/* Mobile & Desktop Actions */}
        <div className="flex items-center space-x-2 md:space-x-3">
          {/* Search - Desktop */}
          <div className="hidden md:flex items-center relative">
            <motion.div
              initial={false}
              animate={{ width: showSearchInput ? '280px' : '0px' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <Popover open={!isMobile && showSearchResults} onOpenChange={setShowSearchResults}>
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
                        if (!searchQuery.trim()) {
                          setShowSearchInput(false);
                        }
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
                    onOpenAutoFocus={(e) => e.preventDefault()}
                  >
                    {filteredProducts.length === 0 && filteredNews.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        Không tìm thấy kết quả
                      </div>
                    ) : (
                      <div className="py-2">
                        {filteredProducts.length > 0 && (
                          <div className="mb-2">
                            <div className="px-3 py-2 text-xs text-muted-foreground">Sản phẩm</div>
                            {filteredProducts.map((product: any) => (
                              <button
                                key={product.id}
                                onClick={() => {
                                  onProductClick(product);
                                  setShowSearchInput(false);
                                  setSearchQuery('');
                                  setShowSearchResults(false);
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
                                  <p className="text-sm truncate">{product.title}</p>
                                  <p className="text-xs text-muted-foreground truncate">{product.description}</p>
                                </div>
                                <Badge variant="secondary" className="flex-shrink-0 text-xs">{product.price}</Badge>
                              </button>
                            ))}
                          </div>
                        )}
                        
                        {filteredNews.length > 0 && (
                          <div>
                            <div className="px-3 py-2 text-xs text-muted-foreground">Tin tức</div>
                            {filteredNews.map((news: any) => (
                              <button
                                key={news.id}
                                onClick={() => {
                                  onNewsClick(news.id);
                                  setShowSearchInput(false);
                                  setSearchQuery('');
                                  setShowSearchResults(false);
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
                                  <p className="text-sm truncate">{news.title}</p>
                                  <p className="text-xs text-muted-foreground">{news.date}</p>
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
              className="ml-2 hover:bg-primary/10"
              onClick={handleSearchIconClick}
            >
              <Search className="w-5 h-5" />
            </Button>
          </div>

          {/* Search - Mobile */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSearchIconClick}
            title="Tìm kiếm"
            className="md:hidden relative"
          >
            <Search className="w-5 h-5" />
          </Button>

          {/* Call Button - Desktop Only */}
          <Button 
            size="sm" 
            className="hidden sm:flex bg-gradient-to-r from-[#FF7BBF] to-[#FF4D91] text-white shadow-md hover:shadow-lg transition-shadow"
            onClick={onPhoneCall}
          >
            <Phone className="w-4 h-4 mr-2" />
            Gọi ngay
          </Button>

          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {showSearchInput && (
        <motion.div 
          className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b shadow-lg z-50"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="px-4 py-4">
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Tìm kiếm sản phẩm, tin tức..."
              className="w-full"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(e.target.value.length > 0);
              }}
              autoComplete="off"
            />
            {showSearchResults && searchQuery && (
              <div className="mt-2 bg-background border rounded-lg shadow-lg max-h-96 overflow-y-auto">
                {filteredProducts.length === 0 && filteredNews.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Không tìm thấy kết quả
                  </div>
                ) : (
                  <div className="py-2">
                    {/* Products Section */}
                    {filteredProducts.length > 0 && (
                      <div className="mb-2">
                        <div className="px-3 py-2 text-xs font-semibold text-muted-foreground bg-muted/50">
                          SẢN PHẨM ({filteredProducts.length})
                        </div>
                        {filteredProducts.map((product: any) => (
                          <button
                            key={product.id}
                            onClick={() => {
                              onProductClick(product);
                              setShowSearchInput(false);
                              setSearchQuery('');
                              setShowSearchResults(false);
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
                              <p className="text-sm truncate">{product.title}</p>
                              <p className="text-xs text-muted-foreground">{product.price}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* News Section */}
                    {filteredNews.length > 0 && (
                      <div>
                        <div className="px-3 py-2 text-xs font-semibold text-muted-foreground bg-muted/50">
                          TIN TỨC ({filteredNews.length})
                        </div>
                        {filteredNews.map((news: any) => (
                          <button
                            key={news.id}
                            onClick={() => {
                              onNewsClick(news.id);
                              setShowSearchInput(false);
                              setSearchQuery('');
                              setShowSearchResults(false);
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
                              <p className="text-xs text-muted-foreground truncate">{news.excerpt}</p>
                            </div>
                            <Badge variant="outline" className="flex-shrink-0 text-xs">{news.category}</Badge>
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 py-4 space-y-3">
            <button 
              onClick={() => {
                scrollToSection('home');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-muted-foreground hover:text-foreground transition-colors font-bold"
            >
              Trang chủ
            </button>
            <button 
              onClick={() => {
                scrollToSection('products');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-muted-foreground hover:text-foreground transition-colors font-bold"
            >
              Sản phẩm
            </button>
            <button 
              onClick={() => {
                scrollToSection('delivery');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-muted-foreground hover:text-foreground transition-colors font-bold"
            >
              Giao hàng
            </button>
            <button 
              onClick={() => {
                scrollToSection('news');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-muted-foreground hover:text-foreground transition-colors font-bold"
            >
              Tin tức
            </button>
            <button 
              onClick={() => {
                scrollToSection('contact');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-muted-foreground hover:text-foreground transition-colors font-bold"
            >
              Liên hệ
            </button>
            
            {/* Call Button in Mobile Menu */}
            <Button 
              size="sm" 
              className="w-full bg-gradient-to-r from-[#FF7BBF] to-[#FF4D91] text-white shadow-md hover:shadow-lg transition-shadow mt-4"
              onClick={() => {
                onPhoneCall();
                setIsMobileMenuOpen(false);
              }}
            >
              <Phone className="w-4 h-4 mr-2" />
              Gọi ngay
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

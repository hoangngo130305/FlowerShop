import { Flower, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import facebookLogo from "../assets/logofb.png";
import zaloLogo from "../assets/logozalo.png";
import logoImage from "../assets/logo.png";


interface SharedFooterProps {
  onNavigateToMain: () => void;
  onNavigateToSection?: (sectionId: string) => void;
}

export function SharedFooter({
  onNavigateToMain,
  onNavigateToSection,
}: SharedFooterProps) {
  const handlePhoneCall = () => {
    window.location.href = "tel:0822774784";
  };

  const handleNavigateToSection = (sectionId: string) => {
    if (onNavigateToSection) {
      // Use callback if provided (for detail pages)
      onNavigateToSection(sectionId);
    } else {
      // Direct scroll if on main page
      if (sectionId === "hero") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6 border-t bg-muted/50 relative">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-6 md:mb-8">
          <div className="sm:col-span-2 md:col-span-1 space-y-2 sm:space-y-3 md:space-y-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <img
                src={logoImage}
                alt="Sen Việt Logo"
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain flex-shrink-0"
              />
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-black">
                  Sen Việt
                </h3>
                <p className="text-xs sm:text-xs md:text-sm font-bold text-muted-foreground">
                  Hoa sen tươi chất lượng cao
                </p>
              </div>
            </div>
            <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center flex-shrink-0">
                  <div className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-accent/10 rounded-full flex items-center justify-center">
                    <Phone className="w-2.5 h-2.5 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-primary" />
                  </div>
                </div>
                <span className="text-xs sm:text-xs md:text-sm">
                  0822774784
                </span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center flex-shrink-0">
                  <div className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-secondary/20 rounded-full flex items-center justify-center">
                    <MapPin className="w-2.5 h-2.5 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-primary" />
                  </div>
                </div>
                <span className="text-xs sm:text-xs md:text-sm">
                  525/9/42 Đ. Quang Trung, Phường 10, Thành phố Hồ Chí Minh
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 md:space-y-4">
            <h4 className="text-base md:text-lg font-bold">Liên kết nhanh</h4>
            <div className="space-y-1.5 md:space-y-2">
              <a
                href="#hero"
                className="block text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigateToSection("hero");
                }}
              >
                Trang chủ
              </a>
              <a
                href="#products"
                className="block text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigateToSection("products");
                }}
              >
                Sản phẩm
              </a>
              <a
                href="#news"
                className="block text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigateToSection("news");
                }}
              >
                Tin tức
              </a>
              <a
                href="#contact"
                className="block text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigateToSection("contact");
                }}
              >
                Liên hệ
              </a>
            </div>
          </div>

          <div className="space-y-3 md:space-y-4">
            <h4 className="text-base md:text-lg font-bold">
              Kết nối với chúng tôi
            </h4>
            <p className="text-xs md:text-sm text-muted-foreground">
              Theo dõi để cập nhật sản phẩm mới và ưu đãi đặc biệt.
            </p>

            <div className="flex space-x-3">
              <a
                href="https://www.facebook.com/profile.php?id=61583197017146"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 md:w-10 md:h-10 rounded-lg overflow-hidden flex items-center justify-center hover:opacity-80 transition-opacity group"
                aria-label="Facebook"
              >
                <img
                  src={facebookLogo}
                  alt="Facebook"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              </a>

              <a
                href="https://zalo.me/0822774784"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 md:w-10 md:h-10 rounded-lg overflow-hidden flex items-center justify-center hover:opacity-80 transition-opacity group"
                aria-label="Zalo"
              >
                <img
                  src={zaloLogo}
                  alt="Zalo"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              </a>
            </div>

            <div className="mt-3 md:mt-4">
              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-[#FF7BBF] to-[#FF4D91] text-white text-xs md:text-sm hover:shadow-md transition-shadow"
                onClick={handlePhoneCall}
              >
                <Phone className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                Liên hệ ngay
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-4 md:pt-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <img
                src={logoImage}
                alt="Sen Việt Logo"
                className="w-6 h-6 md:w-8 md:h-8 object-contain"
              />
              <p className="text-xs md:text-sm text-muted-foreground">
                © 2025 Sen Việt. Tất cả quyền được bảo lưu.
              </p>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">
              Mang vẻ đẹp sen Việt đến mọi gia đình
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

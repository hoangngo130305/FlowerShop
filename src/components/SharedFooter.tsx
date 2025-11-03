import { Flower, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "./ui/button";

interface SharedFooterProps {
  onNavigateToMain: () => void;
  onNavigateToPrivacy?: () => void;
  onNavigateToTerms?: () => void;
}

export function SharedFooter({
  onNavigateToMain,
  onNavigateToPrivacy,
  onNavigateToTerms,
}: SharedFooterProps) {
  const handlePhoneCall = () => {
    window.location.href = "tel:+84123456789";
  };

  return (
    <footer className="py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6 border-t bg-muted/50 relative">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-6 md:mb-8">
          <div className="space-y-2 sm:space-y-3 md:space-y-4 sm:col-span-2 md:col-span-1">
            <div className="flex items-center mb-2 sm:mb-3 md:mb-4">
              <Flower className="w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 mr-1.5 sm:mr-2 md:mr-3 text-primary stroke-[2.5]" />
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-black">
                  Sen Việt
                </h3>
                <p className="text-xs sm:text-xs md:text-sm font-bold">
                  Hoa sen tươi chất lượng cao
                </p>
              </div>
            </div>
            <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-2.5 h-2.5 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-primary" />
                </div>
                <span className="text-xs sm:text-xs md:text-sm">
                  info@senviet.vn
                </span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-2.5 h-2.5 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-primary" />
                </div>
                <span className="text-xs sm:text-xs md:text-sm">
                  0822 774 784
                </span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-2.5 h-2.5 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-primary" />
                </div>
                <span className="text-xs sm:text-xs md:text-sm">
                  Hà Nội, Việt Nam
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
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Trang chủ
              </a>
              <a
                href="#products"
                className="block text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById("products");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Sản phẩm
              </a>
              <a
                href="#news"
                className="block text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById("news");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Tin tức
              </a>
              <a
                href="#contact"
                className="block text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById("contact");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Liên hệ
              </a>
              <a
                href="#privacy"
                className="block text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigateToPrivacy) {
                    onNavigateToPrivacy();
                  } else {
                    alert("Chính sách bảo mật sẽ được cập nhật sớm.");
                  }
                }}
              >
                Chính sách bảo mật
              </a>
              <a
                href="#terms"
                className="block text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigateToTerms) {
                    onNavigateToTerms();
                  } else {
                    alert("Điều khoản dịch vụ sẽ được cập nhật sớm.");
                  }
                }}
              >
                Điều khoản dịch vụ
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
                href="https://facebook.com/senviet"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors group"
                aria-label="Facebook"
              >
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 text-primary group-hover:scale-110 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              <a
                href="https://zalo.me/84123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 md:w-10 md:h-10 bg-accent/10 rounded-lg flex items-center justify-center hover:bg-accent/20 transition-colors group"
                aria-label="Zalo"
              >
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 text-primary group-hover:scale-110 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c-.169-.331-.468-.599-.859-.767a.896.896 0 00-.717-.033c-.294.099-.538.312-.688.598-.13.25-.169.535-.11.808.058.272.196.52.395.71.398.379.934.569 1.478.525.544-.044 1.058-.29 1.421-.679.177-.19.316-.417.408-.665.092-.248.135-.513.126-.777-.009-.264-.067-.522-.172-.755-.105-.233-.256-.442-.282-.965zM12 18.5c-1.658 0-3.25-.484-4.618-1.332l4.618-3.668 4.618 3.668A6.47 6.47 0 0112 18.5z" />
                </svg>
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
              <Flower className="w-3 h-3 md:w-4 md:h-4 text-primary" />
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

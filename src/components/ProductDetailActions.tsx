import { Button } from "./ui/button";
import { Phone } from "lucide-react";

interface ProductDetailActionsProps {
  handlePhoneCall: () => void;
  onContactClick?: () => void;
}

export function ProductDetailActions({ 
  handlePhoneCall,
  onContactClick
}: ProductDetailActionsProps) {
  
  const handleOrderNow = () => {
    // Scroll to contact form
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    if (onContactClick) {
      onContactClick();
    }
  };

  return (
    <div className="space-y-3">
      {/* Row 1: Đặt hàng ngay */}
      <Button 
        size="lg" 
        className="w-full bg-gradient-to-r from-[#FF7BBF] to-[#FF4D91] text-white text-base md:text-lg h-12 hover:shadow-lg transition-all"
        onClick={handleOrderNow}
      >
        <Phone className="w-5 h-5 mr-2" />
        Đặt hàng ngay
      </Button>
      
      {/* Row 2: Gọi tư vấn */}
      <Button 
        variant="outline" 
        size="lg" 
        className="w-full h-12 text-base md:text-lg hover:bg-primary/5 transition-all"
        onClick={handlePhoneCall}
      >
        <Phone className="w-5 h-5 mr-2" />
        Gọi tư vấn: 0822 774 784
      </Button>
    </div>
  );
}

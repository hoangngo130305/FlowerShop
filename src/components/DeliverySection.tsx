import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Plane, Truck, Ship, MapPin, Clock, CheckCircle2 } from "lucide-react";

export default function DeliverySection() {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="delivery" className="py-12 md:py-16 px-4 md:px-6 bg-gradient-to-b from-primary/5 to-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
            Hình thức lấy và giao hàng
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-3xl mx-auto">
            Quý khách giao nhận tại năng, đảm bảo hoa sen đến tay khách hàng nhanh nhất và luôn tươi mới.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12">
          {/* 1. Lấy hàng */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-primary">
                <span className="text-sm">1</span>
              </div>
              <h3 className="text-base md:text-lg font-bold">Lấy hàng</h3>
            </div>
            
            <p className="text-muted-foreground mb-6 text-sm">
              Lấy hàng tại nhà vườn gọi bán theo lộc hành lẻn, giao đồ nhanh đi lấy.
            </p>

            {/* Truck Image */}
            <div className="rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1701637657912-9e23e32155d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
                alt="Xe giao hàng"
                className="w-full h-48 object-cover"
              />
            </div>
          </div>

          {/* 2. Giao hàng */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-primary">
                <span className="text-sm">2</span>
              </div>
              <h3 className="text-base md:text-lg font-bold">Giao hàng</h3>
            </div>

            {/* Priority Box - Yellow */}
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-yellow-600">⭐</span>
                  <span className="text-gray-700">Ưu tiên giao hàng trong ngày</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-yellow-600">⏰</span>
                  <span>TP.HCM: 1-2 tiếng</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-yellow-600">⏰</span>
                  <span>Ngoài tỉnh: 1-2 ngày</span>
                </div>
              </div>
            </div>

            {/* Delivery Methods */}
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-3">
                Có 2 hình thức giao hàng chính họ theo thứ tự:
              </p>
              
              {/* Xe tốc hành */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">1</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm mb-1">Xe tốc hành</div>
                  <div className="text-xs text-muted-foreground">
                    Các tỉnh gần Cà Mau đến Phạm Thiết. Riêng các đây giao hàng nhanh các lúc hoặc sau này.
                  </div>
                </div>
              </div>

              {/* Máy bay */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">2</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm mb-1">Máy bay</div>
                  <div className="text-xs text-muted-foreground">
                    Các tỉnh xa Phạm Thiết và ngoài Bắc. Phí các tỉnh cụ thời gian giao hàng.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thời gian giao hàng chi tiết */}
        <div className="mb-10">
          <h3 className="text-lg md:text-xl font-bold text-center mb-8">
            Thời gian giao hàng chi tiết
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Bằng máy bay */}
            <Card className="border-primary/20 bg-cyan-50">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-cyan-100 flex items-center justify-center mb-4">
                    <Plane className="w-8 h-8 text-cyan-600" />
                  </div>
                  <h4 className="text-base mb-3">Bằng máy bay</h4>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-primary">1-2 ngày</span> tùy theo cự chuyến bay không, và thời gian gì hàng - thời gian giao hàng tự bán hay dịp đã chủ nhật hàng (thứ người nhận hàng nói không nhanh này).
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Bằng xe tốc hành */}
            <Card className="border-primary/20 bg-emerald-50">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                    <Truck className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h4 className="text-base mb-3">Bằng xe tốc hành</h4>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-primary">1-2 ngày</span> tùy theo cự chuyến bay không, và thời gian gì hàng - thời gian giao hàng tự bán hay dịp đã chủ nhật hàng (thứ người nhận hàng nói không nhanh này).
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Bằng tàu cao tốc */}
            <Card className="border-primary/20 bg-purple-50">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                    <Ship className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="text-base mb-3">Bằng tàu cao tốc</h4>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-primary">1-2 ngày</span> tùy theo cự chuyến bay không, và thời gian gì hàng - thời gian giao hàng tự bán hay dịp đã chủ nhật hàng (thứ người nhận hàng nói không nhanh này).
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Image */}
        <div className="rounded-lg overflow-hidden mb-8">
          <img
            src="https://images.unsplash.com/photo-1761590542271-27a3518ab957?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
            alt="Giao hàng chuyên nghiệp"
            className="w-full h-64 md:h-80 object-cover"
          />
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white rounded-full px-8"
            onClick={scrollToContact}
          >
            Tư vấn giao hàng
          </Button>
        </div>
      </div>
    </section>
  );
}
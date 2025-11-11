import { Button } from "./ui/button";
import { Check } from "lucide-react";

export default function WhyChooseUs() {
  return (
    <section className="py-12 md:py-16 px-4 md:px-6 bg-gradient-to-b from-white to-primary/5">
      <div className="max-w-6xl mx-auto">
        {/* Main Grid: Text Left, Stats Right */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Left Column: Text Content */}
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              Tại sao chọn Sen Việt?
            </h2>
            
            <p className="text-muted-foreground text-base md:text-lg mb-3 leading-relaxed">
              Sen Việt luôn cam kết cung cấp hoa sen chất lượng cao, đặc biệt là{" "}
              <span className="text-primary font-medium">Sen Đồng Tháp Mười</span> – đặc sản vùng đất nổi tiếng.
            </p>
            
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Cam kết{" "}
              <span className="text-primary font-medium">giao nhanh</span>, đóng gói cẩn thận,{" "}
              <span className="text-green-600 font-semibold">100% tự nhiên</span>. Tuyển chọn kỹ lưỡng, mang về đẹp{" "}
              <span className="text-primary font-medium">sáng trong, thanh khôi</span> cho không gian thiêng liêng.
            </p>
          </div>

          {/* Right Column: Stats Grid 2x2 */}
          <div className="grid grid-cols-2 gap-4">
            {/* Stat 1 */}
            <div className="bg-primary/5 rounded-lg p-6 border border-primary/10">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">1000+</div>
              <div className="text-sm md:text-base text-muted-foreground">Khách hàng hài lòng</div>
            </div>

            {/* Stat 2 */}
            <div className="bg-primary/5 rounded-lg p-6 border border-primary/10">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">10+</div>
              <div className="text-sm md:text-base text-muted-foreground">Năm kinh nghiệm</div>
            </div>

            {/* Stat 3 */}
            <div className="bg-primary/5 rounded-lg p-6 border border-primary/10">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">5.0</div>
              <div className="text-sm md:text-base text-muted-foreground">Tỉnh thành phục vụ</div>
            </div>

            {/* Stat 4 */}
            <div className="bg-primary/5 rounded-lg p-6 border border-primary/10">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm md:text-base text-muted-foreground">Hỗ trợ khách hàng</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
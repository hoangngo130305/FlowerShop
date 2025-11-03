"use client";

import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const API_BASE_URL = "http://localhost:8000/api"; // Cùng với ProductsSection

export default function ContactSection() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    product: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/contacts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          FirstName: formData.firstName.trim(),
          LastName: formData.lastName.trim(),
          Phone: formData.phone.trim(),
          InterestedProduct: formData.product.trim(),
          Message: formData.message.trim(),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Gửi thất bại. Vui lòng thử lại.");
      }

      // SUCCESS
      toast.success("Cảm ơn bạn! Yêu cầu đã được gửi. Chúng tôi sẽ liên hệ ngay.");
      
      // RESET FORM
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        product: "",
        message: "",
      });

    } catch (err: any) {
      console.error("Lỗi gửi liên hệ:", err);
      toast.error(err.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneCall = () => {
    window.location.href = "tel:0822774784";
  };

  return (
    <section id="contact" className="py-12 md:py-16 px-4 md:px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* LEFT: INFO */}
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">
              Liên hệ đặt hàng
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-6 md:mb-8 leading-relaxed">
              Liên hệ để được <span className="font-bold text-primary">tư vấn và báo giá tốt nhất</span>. Hỗ trợ <span className="font-bold text-primary">24/7</span> chuyên nghiệp.
            </p>

            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 md:w-8 md:h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                </div>
                <span className="text-base md:text-lg">info@senviet.vn</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 md:w-8 md:h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                </div>
                <span className="text-base md:text-lg">0822 774 784</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 md:w-8 md:h-8 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                </div>
                <span className="text-base md:text-lg">Hà Nội, Việt Nam</span>
              </div>
            </div>

            <div className="mt-6 md:mt-8 p-4 md:p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
              <h3 className="text-lg md:text-xl mb-2 font-bold">Đặt hàng nhanh</h3>
              <p className="text-base md:text-lg text-muted-foreground mb-3 md:mb-4">
                Gọi hotline tư vấn và đặt hàng trong <span className="font-bold text-primary">5 phút</span>
              </p>
              <Button
                size="lg"
                className="w-full md:w-auto bg-gradient-to-r from-[#FF7BBF] to-[#FF4D91] text-white text-base md:text-lg hover:shadow-lg transition-shadow"
                onClick={handlePhoneCall}
              >
                <Phone className="w-5 h-5 mr-2" />
                Gọi ngay: 0822 774 784
              </Button>
            </div>
          </div>

          {/* RIGHT: FORM */}
          <div>
            <Card className="relative overflow-hidden">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-lg md:text-xl font-bold">Gửi yêu cầu tư vấn</CardTitle>
                <CardDescription className="text-sm md:text-base font-bold">
                  Phản hồi trong 30 phút.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleFormSubmit}>
                <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6 pt-0">
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div className="space-y-1.5 md:space-y-2">
                      <label htmlFor="first-name" className="text-sm md:text-base">Họ *</label>
                      <Input
                        id="first-name"
                        name="firstName"
                        placeholder="Nguyễn"
                        className="text-sm md:text-base"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-1.5 md:space-y-2">
                      <label htmlFor="last-name" className="text-sm md:text-base">Tên *</label>
                      <Input
                        id="last-name"
                        name="lastName"
                        placeholder="Văn A"
                        className="text-sm md:text-base"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 md:space-y-2">
                    <label htmlFor="phone" className="text-sm md:text-base">Số điện thoại *</label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="0822 774 784"
                      className="text-sm md:text-base"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-1.5 md:space-y-2">
                    <label htmlFor="product" className="text-sm md:text-base">Sản phẩm quan tâm</label>
                    <Input
                      id="product"
                      name="product"
                      placeholder="Bông sen Thái, Lá sen..."
                      className="text-sm md:text-base"
                      value={formData.product}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-1.5 md:space-y-2">
                    <label htmlFor="message" className="text-sm md:text-base">Ghi chú thêm</label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Số lượng, thời gian giao hàng, địa chỉ..."
                      className="min-h-[100px] md:min-h-[120px] text-sm md:text-base"
                      value={formData.message}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full relative overflow-hidden bg-gradient-to-r from-[#FF7BBF] to-[#FF4D91] text-white text-sm md:text-base hover:shadow-lg transition-shadow"
                    disabled={isSubmitting}
                  >
                    <span className="relative z-10">
                      {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu tư vấn"}
                    </span>
                  </Button>
                </CardContent>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
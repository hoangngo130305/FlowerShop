import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Heart, Phone, Package } from "lucide-react";
import { motion } from "motion/react";

interface ProductCardProps {
  product: {
    id: number;
    title: string;
    description: string;
    price: string;
    image: string;
    tags: string[];
    featured?: boolean;
  };
  onViewDetail: (productTitle: string) => void;
  onOrderNow: (product: any) => void;
  onContactWholesale: (productTitle: string) => void;
}

export function ProductCard({ 
  product, 
  onViewDetail, 
  onOrderNow,
  onContactWholesale 
}: ProductCardProps) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className={`group overflow-hidden transition-all duration-500 hover:shadow-2xl ${product.featured ? 'ring-2 ring-primary/50 shadow-xl' : 'hover:shadow-lg'} relative bg-gradient-to-br from-background to-background hover:from-background hover:to-primary/5`}>
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-accent/0 to-primary/0 group-hover:from-primary/5 group-hover:via-accent/5 group-hover:to-primary/5 transition-all duration-500 pointer-events-none z-10" />
        
        <div className="aspect-[4/3] overflow-hidden relative">
          <ImageWithFallback
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {product.featured && (
            <div className="absolute top-1.5 left-1.5 right-1.5 flex justify-between items-start gap-1">
              <Badge className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg text-[9px] sm:text-[10px] py-0.5 px-1.5">
                ⭐ Đặc sản Đồng Tháp
              </Badge>
              <Badge className="bg-green-600 text-white shadow-lg text-[9px] sm:text-[10px] py-0.5 px-1.5">
                Tự nhiên 100%
              </Badge>
            </div>
          )}
        </div>
      
      <CardHeader className="p-2 sm:p-2.5 md:p-3">
        <div className="flex items-start justify-between gap-1.5">
          <CardTitle className="text-sm sm:text-sm md:text-base leading-tight line-clamp-2">{product.title}</CardTitle>
          <div className="flex-shrink-0">
            <div className="text-[9px] sm:text-[10px] mb-0.5">Giá lẻ</div>
            <div className="text-xs sm:text-xs md:text-sm text-primary font-bold">{product.price}</div>
          </div>
        </div>
        <CardDescription className="text-xs sm:text-xs md:text-sm leading-snug line-clamp-1">
          {product.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-2 sm:p-2.5 md:p-3 pt-0">
        <div className="flex flex-wrap gap-1 mb-2">
          {product.tags.slice(0, 3).map((tag: string) => (
            <Badge key={tag} variant="secondary" className="text-[9px] sm:text-[10px] py-0.5 px-1">{tag}</Badge>
          ))}
        </div>
        
        <div className="space-y-1.5">
          {/* Row 1: Xem chi tiết + Giá sỉ (icon) */}
          <div className="flex gap-1.5">
            <Button 
              className="flex-1 bg-gradient-to-r from-[#FF7BBF] to-[#FF4D91] text-white hover:shadow-lg hover:from-[#FF6BAF] hover:to-[#FF3D81] transition-all duration-300 text-xs sm:text-xs md:text-sm h-8 sm:h-8 md:h-9 group/btn px-2"
              onClick={() => onViewDetail(product.title)}
            >
              <Heart className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4 mr-1 group-hover/btn:scale-110 transition-transform duration-300" />
              <span>Chi tiết</span>
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className="h-8 sm:h-8 md:h-9 px-2 sm:px-2 md:px-3 hover:bg-amber-50 hover:border-amber-400 hover:shadow-md transition-all duration-300 group/pkg"
              onClick={(e) => {
                e.stopPropagation();
                onContactWholesale(product.title);
              }}
              title="Tư vấn giá sỉ"
            >
              <Package className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4 group-hover/pkg:scale-110 group-hover/pkg:rotate-12 transition-transform duration-300" />
            </Button>
          </div>
          
          {/* Row 2: Đặt hàng ngay */}
          <Button 
            size="sm"
            className="w-full bg-green-600 hover:bg-green-700 text-white h-8 sm:h-8 md:h-9 text-xs sm:text-xs md:text-sm shadow-sm hover:shadow-lg transition-all duration-300 group/order px-2"
            onClick={(e) => {
              e.stopPropagation();
              onOrderNow(product);
            }}
          >
            <Phone className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4 mr-1 group-hover/order:rotate-12 transition-transform duration-300" />
            <span>Đặt hàng ngay</span>
          </Button>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
}

import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'motion/react';

interface HeroSectionProps {
  handleBuyNow: () => void;
}

export default function HeroSection({ handleBuyNow }: HeroSectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Hero images data
  const heroImages = [
    {
      src: "https://images.unsplash.com/photo-1759240096601-5e2cf23b42f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb3R1cyUyMGZsb3dlciUyMGZyZXNoJTIwcGlua3xlbnwxfHx8fDE3NjE5NjAwNDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      alt: "Hoa sen tươi màu hồng"
    },
    {
      src: "https://images.unsplash.com/photo-1620418754247-d7a29225ee48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb3R1cyUyMGJsb3Nzb20lMjBuYXR1cmFsfGVufDF8fHx8MTc2MTk2MDA0N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      alt: "Bông sen nở tự nhiên"
    },
    {
      src: "https://images.unsplash.com/photo-1735974406134-b0aa384ca6fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb3R1cyUyMHBvbmQlMjBwZWFjZWZ1bHxlbnwxfHx8fDE3NjE5NjAwNDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      alt: "Đầm sen yên bình"
    }
  ];

  // Auto-rotate images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section id="home" className="pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 md:pb-16 px-3 sm:px-4 md:px-6 relative z-10 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
          {/* Hero Text */}
          <motion.div 
            className="relative order-2 md:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl mb-3 sm:mb-4 md:mb-6 relative leading-tight font-bold"
              style={{ fontFamily: 'Fraunces, serif' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.span 
                className="text-foreground block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Mang hơi thở thanh khiết của sen
              </motion.span>
              <motion.span 
                className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                vào không gian của bạn
              </motion.span>
              
              {/* Animated glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl -z-10"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.h1>
            
            <motion.p 
              className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 md:mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Đặc sản <span className="font-bold text-amber-600">Sen</span> tự nhiên, sang trọng — phù hợp bàn thờ, chùa, tiệc cưới. Tươi lâu, giao toàn quốc.
            </motion.p>
            
            <motion.div 
              className="flex flex-col gap-2 sm:gap-3 md:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  className="text-base md:text-lg relative bg-gradient-to-r from-[#FF7BBF] to-[#FF4D91] text-white shadow-md hover:shadow-xl transition-all w-fit" 
                  style={{ fontFamily: 'Fraunces, serif' }}
                  onClick={handleBuyNow}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Mua ngay
                    <span>→</span>
                  </span>
                </Button>
              </motion.div>
            </motion.div>

            {/* Decorative elements */}
            <motion.div 
              className="absolute -top-4 -left-4 w-8 h-8 bg-primary/10 rounded-full blur-sm"
              animate={{ 
                y: [0, -10, 0],
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute top-16 -right-6 w-4 h-4 bg-accent/20 rounded-full blur-sm"
              animate={{ 
                y: [0, 8, 0],
                x: [0, 5, 0],
                scale: [1, 1.3, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </motion.div>

          {/* Hero Image Carousel */}
          <motion.div 
            className="relative order-1 md:order-2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <div className="relative group">
              <div className="aspect-square rounded-2xl md:rounded-3xl overflow-hidden shadow-xl relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.7 }}
                    className="w-full h-full"
                  >
                    <ImageWithFallback
                      src={heroImages[currentImageIndex].src}
                      alt={heroImages[currentImageIndex].alt}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Indicators - Hidden on mobile, visible on desktop */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden sm:flex gap-2">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`rounded-full transition-all ${
                        index === currentImageIndex 
                          ? 'bg-white w-6 h-2' 
                          : 'bg-white/50 hover:bg-white/75 w-2 h-2'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Decorative border */}
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl md:rounded-3xl -z-10 blur-xl opacity-60"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

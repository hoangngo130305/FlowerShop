"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { SharedHeader } from "./SharedHeader";
import { SharedFooter } from "./SharedFooter";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Share2,
  Facebook,
  MessageCircle,
  Link2,
} from "lucide-react";
import { toast } from "sonner";

interface NewsArticle {
  id: number;
  title: string;
  content: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
}

interface NewsDetailPageProps {
  selectedNews: any;
  newsArticles?: NewsArticle[];
  handleBackToNews: () => void;
  handleReadMore?: (id: number) => void;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
  onNavigateToMain?: () => void;
}

export default function NewsDetailPage({
  selectedNews,
  newsArticles = [],
  handleBackToNews,
  handleReadMore,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  onNavigateToMain,
}: NewsDetailPageProps) {
  const API_BASE = "http://localhost:8000/api";
  const [news, setNews] = useState<NewsArticle | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  // ===================== FETCH CHI TIẾT TIN =====================
  useEffect(() => {
    if (!selectedNews?.id) return;
    const fetchNewsDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/news/${selectedNews.id}/`);
        if (!res.ok) throw new Error("Không tải được chi tiết tin tức");
        const data = await res.json();

        // Map dữ liệu từ API về định dạng chuẩn
        const mapped: NewsArticle = {
          id: data.NewsID,
          title: data.Title,
          content: data.Content,
          image:
            data.Image ||
            "https://images.unsplash.com/photo-1659532165024-29510c914b04?w=800&q=75",
          category: data.Category || "Tin tức",
          author: data.AuthorName || "Admin",
          date: new Date(data.CreatedAt).toLocaleDateString("vi-VN"),
          readTime: data.ReadingTime || "2 phút đọc",
          tags:
            typeof data.Tags === "string"
              ? data.Tags.split(",").map((t: string) => t.trim())
              : [],
        };

        setNews(mapped);

        // Gọi API tăng view
        fetch(`${API_BASE}/news/${data.NewsID}/view/`, {
          method: "POST",
        }).catch(() => {});

        // Tin liên quan
        const related = newsArticles
          .filter((n) => n.id !== data.NewsID)
          .slice(0, 3);
        setRelatedNews(related);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNewsDetail();
  }, [selectedNews]);

  // ===================== CHIA SẺ MẠNG XÃ HỘI =====================
  const handleShare = (platform: string) => {
    const url = window.location.href;
    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "zalo":
        window.open(`https://zalo.me/share?url=${encodeURIComponent(url)}`);
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        toast.success("Đã sao chép liên kết");
        break;
    }
  };

  // ===================== LOADING STATE =====================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Không tìm thấy bài viết</p>
      </div>
    );
  }

  // ===================== HIỂN THỊ TRANG =====================
  return (
    <div className="min-h-screen bg-background">
      <SharedHeader
        onNavigateToMain={onNavigateToMain || handleBackToNews}
        onPhoneCall={() => (window.location.href = "tel:0822 774 784")}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="pt-20 md:pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          {/* Nút quay lại */}
          <Button
            variant="ghost"
            className="mb-6 hover:bg-primary/10"
            onClick={handleBackToNews}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại tin tức
          </Button>

          {/* Thông tin bài viết */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-3">
              {news.category}
            </Badge>

            <h1 className="text-3xl font-bold mb-4">{news.title}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" /> {news.author}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> {news.date}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> {news.readTime}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6 pb-4 border-b">
              <Share2 className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm mr-2">Chia sẻ:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare("facebook")}
              >
                <Facebook className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare("zalo")}
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare("copy")}
              >
                <Link2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Ảnh đại diện */}
            <div className="aspect-video mb-6 rounded-lg overflow-hidden">
              <ImageWithFallback
                src={news.image}
                alt={news.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Nội dung */}
            <div className="prose prose-lg max-w-none mb-6 whitespace-pre-line">
              {news.content}
            </div>

            {/* Tags */}
            {news.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b">
                <span className="text-sm font-medium">Tags:</span>
                {news.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Tin liên quan */}
            {relatedNews.length > 0 && (
              <div className="mt-10">
                <h3 className="font-bold mb-4 text-lg">Tin liên quan</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {relatedNews.map((item) => (
                    <Card
                      key={item.id}
                      className="cursor-pointer hover:shadow-md transition-all"
                      onClick={() => handleReadMore?.(item.id)}
                    >
                      <div className="aspect-video overflow-hidden">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader className="p-3">
                        <Badge variant="secondary" className="text-xs mb-1">
                          {item.category}
                        </Badge>
                        <CardTitle className="text-sm line-clamp-2">
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-3 pb-3 text-xs text-muted-foreground">
                        {item.date}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <SharedFooter onNavigateToMain={onNavigateToMain || (() => {})} />
    </div>
  );
}

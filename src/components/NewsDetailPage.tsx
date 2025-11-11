import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, User, Clock, Share2, Facebook, MessageCircle, Link2 } from "lucide-react";
import { SharedHeader } from "./SharedHeader";
import { SharedFooter } from "./SharedFooter";
import { toast } from "sonner";
import { useData } from "./DataContext"; // ✅ Import từ DataContextAPI
import { useMemo } from "react";

interface NewsArticle {
  id: number | string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  author: string;
  readTime: string;
  content: string;
  tags: string[];
}

interface NewsDetailPageProps {
  newsId: string | number; // ✅ ID của bài viết cần hiển thị
  onBack?: () => void;
  handleBackToNews?: () => void;
  handleReadMore?: (newsId: number | string) => void;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
  onNavigateToMain?: () => void;
  onNavigateToSection?: (sectionId: string) => void;
  onGoToAdmin?: () => void;
}

export default function NewsDetailPage_API({
  newsId,
  onBack,
  handleBackToNews: propHandleBackToNews,
  handleReadMore,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  onNavigateToMain,
  onNavigateToSection,
  onGoToAdmin
}: NewsDetailPageProps) {
  // ✅ Get news from DataContextAPI
  const { news: contextNews } = useData();

  // ✅ Find selected news by ID
  const selectedNews = useMemo(() => {
    if (!contextNews || !Array.isArray(contextNews)) return null;
    
    const found = contextNews.find(n => String(n.id) === String(newsId));
    if (!found) return null;

    return {
      id: found.id,
      title: found.title || 'Không có tiêu đề',
      excerpt: found.excerpt || '',
      image: found.image || 'https://images.unsplash.com/photo-1659532165024-29510c914b04?w=600&q=75',
      date: found.date || new Date().toLocaleDateString('vi-VN'),
      category: found.category || 'Tin tức',
      author: found.author || 'Sen Việt',
      readTime: found.readingTime || '5 phút đọc',
      content: found.content || '',
      tags: found.tags || []
    } as NewsArticle;
  }, [contextNews, newsId]);

  // ✅ Get related news (same category, different ID)
  const relatedNews = useMemo(() => {
    if (!contextNews || !Array.isArray(contextNews) || !selectedNews) return [];
    
    return contextNews
      .filter(n => 
        n && 
        n.id && 
        String(n.id) !== String(newsId) && 
        n.category === selectedNews.category
      )
      .slice(0, 3)
      .map(n => ({
        id: n.id,
        title: n.title || 'Không có tiêu đề',
        excerpt: n.excerpt || '',
        image: n.image || 'https://images.unsplash.com/photo-1659532165024-29510c914b04?w=600&q=75',
        date: n.date || new Date().toLocaleDateString('vi-VN'),
        category: n.category || 'Tin tức',
        author: n.author || 'Sen Việt',
        readTime: n.readingTime || '5 phút đọc',
        content: n.content || '',
        tags: n.tags || []
      })) as NewsArticle[];
  }, [contextNews, newsId, selectedNews]);

  const handleBackToNews = onBack || propHandleBackToNews || (() => window.history.back());
  
  if (!selectedNews) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy bài viết</h2>
          <Button onClick={handleBackToNews}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại tin tức
          </Button>
        </div>
      </div>
    );
  }

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = selectedNews.title;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'zalo':
        window.open(`https://zalo.me/share?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast.success('Đã sao chép link bài viết');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <SharedHeader 
        onNavigateToMain={onNavigateToMain || handleBackToNews}
        onPhoneCall={() => window.location.href = 'tel:0123456789'}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Content */}
      <main className="pt-20 md:pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-6 hover:bg-primary/10"
            onClick={handleBackToNews}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại tin tức
          </Button>

          {/* Article Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {/* Category and Date */}
            <div className="flex items-center gap-4 mb-4">
              <Badge className="bg-primary text-primary-foreground">
                {selectedNews.category}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{selectedNews.date}</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              {selectedNews.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{selectedNews.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{selectedNews.readTime}</span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="aspect-video w-full overflow-hidden rounded-lg mb-6">
              <ImageWithFallback
                src={selectedNews.image}
                alt={selectedNews.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-3 pb-6 border-b">
              <span className="text-sm font-medium">Chia sẻ:</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('facebook')}
                  className="hover:bg-blue-50"
                >
                  <Facebook className="w-4 h-4 mr-2" />
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('zalo')}
                  className="hover:bg-blue-50"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Zalo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('copy')}
                  className="hover:bg-primary/10"
                >
                  <Link2 className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg max-w-none mb-12"
          >
            <div 
              className="text-foreground leading-relaxed whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: selectedNews.content }}
            />
          </motion.div>

          {/* Tags */}
          {selectedNews.tags && selectedNews.tags.length > 0 && (
            <div className="mb-12 pb-8 border-b">
              <h3 className="text-lg font-semibold mb-3">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedNews.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Related News */}
          {relatedNews.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold mb-6">Bài viết liên quan</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedNews.map((article) => (
                  <Card
                    key={article.id}
                    className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => handleReadMore && handleReadMore(article.id)}
                  >
                    <div className="aspect-video overflow-hidden">
                      <ImageWithFallback
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader className="p-4">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Badge className="text-xs bg-primary text-primary-foreground">
                          {article.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{article.date}</span>
                      </div>
                      <CardTitle className="text-base font-bold leading-tight line-clamp-2">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
<SharedFooter onNavigateToMain={onNavigateToMain || (() => {})} />  
    </div>
  );
}

import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion, AnimatePresence } from 'motion/react';
import { useMemo } from "react";
import { useData } from "./DataContext"; // ✅ Import từ DataContextAPI

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

interface NewsSectionProps {
  newsArticles: NewsArticle[];
  showAllNews: boolean;
  setShowAllNews: (value: boolean) => void;
  handleReadMore: (newsId: number | string) => void;
}

export default function NewsSection_API({
  newsArticles: _newsArticlesProp,
  showAllNews,
  setShowAllNews,
  handleReadMore
}: NewsSectionProps) {
  // ✅ Get news from DataContextAPI
  const { news: contextNews } = useData();
  
  // ✅ Map context news to display format
  const newsArticles = useMemo(() => {
    if (!contextNews || !Array.isArray(contextNews) || contextNews.length === 0) {
      return [];
    }
    try {
      return contextNews
        .filter(n => n && n.id) // Filter out null/undefined news
        .map((n) => {
          try {
            return {
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
            };
          } catch (err) {
            console.error('Error mapping news article:', n, err);
            return null;
          }
        })
        .filter(Boolean) as NewsArticle[];
    } catch (error) {
      console.error('Error mapping news:', error);
      return [];
    }
  }, [contextNews]);
  
  return (
    <section 
      id="news" 
      className="py-12 md:py-16 px-4 md:px-6 bg-muted/50 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-foreground">
            Tin tức & Kiến thức
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Cập nhật thông tin mới nhất về hoa sen, mẹo bảo quản và chia sẻ kiến thức hữu ích.
          </p>
        </div>

        {/* Main News Layout */}
        {newsArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Chưa có bài viết nào. Vui lòng thêm bài viết từ trang Admin.</p>
          </div>
        ) : !showAllNews ? (
          <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
            {/* Featured Article - Left Side */}
            {newsArticles.length > 0 && (
              <div className="lg:col-span-2">
                <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                  <div className="aspect-video overflow-hidden">
                    <ImageWithFallback
                      src={newsArticles[0].image}
                      alt={newsArticles[0].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader className="p-4 md:p-6">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      {newsArticles[0].category && (
                        <Badge 
                          className="text-sm bg-primary text-primary-foreground"
                        >
                          {newsArticles[0].category}
                        </Badge>
                      )}
                      <span className="text-sm text-muted-foreground">{newsArticles[0].date}</span>
                    </div>
                    <CardTitle className="text-xl md:text-2xl font-bold leading-tight mb-3">
                      {newsArticles[0].title}
                    </CardTitle>
                    <CardDescription className="text-sm md:text-base leading-relaxed line-clamp-3">
                      {newsArticles[0].excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0">
                    <Button 
                      variant="outline" 
                      className="w-full md:w-auto text-sm md:text-base h-9 md:h-10 hover:bg-primary/10 transition-colors"
                      onClick={() => handleReadMore(newsArticles[0].id)}
                    >
                      Đọc thêm
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Side Articles - Right Side */}
            {newsArticles.length > 1 && (
              <div className="space-y-4 md:space-y-6">
                {newsArticles.slice(1, 4).map((article) => (
                  <Card key={article.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => handleReadMore(article.id)}
                  >
                    <div className="flex gap-3 md:gap-4 p-3 md:p-4">
                      <div className="w-20 h-16 md:w-24 md:h-20 flex-shrink-0 overflow-hidden rounded-lg">
                        <ImageWithFallback
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {article.category && (
                            <Badge 
                              className="text-xs bg-primary text-primary-foreground"
                            >
                              {article.category}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">{article.date}</span>
                        </div>
                        <h3 className="text-sm md:text-base font-semibold leading-snug line-clamp-2 mb-2">
                          {article.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {article.excerpt}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* All News Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <AnimatePresence>
              {newsArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col cursor-pointer"
                    onClick={() => handleReadMore(article.id)}
                  >
                    <div className="aspect-video overflow-hidden">
                      <ImageWithFallback
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader className="p-3 md:p-4 flex-grow">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        {article.category && (
                          <Badge 
                            className="text-xs bg-primary text-primary-foreground"
                          >
                            {article.category}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">{article.date}</span>
                      </div>
                      <CardTitle className="text-base md:text-lg font-bold leading-tight mb-2 line-clamp-2">
                        {article.title}
                      </CardTitle>
                      <CardDescription className="text-xs md:text-sm leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* View All Button */}
        {newsArticles.length > 4 && (
          <div className="text-center mt-8 md:mt-12">
            <Button
              onClick={() => setShowAllNews(!showAllNews)}
              size="lg"
              className="text-sm md:text-base h-10 md:h-12 px-6 md:px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {showAllNews ? 'Thu gọn' : `Xem tất cả ${newsArticles.length} bài viết`}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

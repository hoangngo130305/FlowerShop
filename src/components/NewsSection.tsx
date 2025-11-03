"use client";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

interface NewsArticle {
  id: number;
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
  handleReadMore: (newsId: number) => void;
}

const API_BASE_URL = "http://localhost:8000/api";

export default function NewsSection({ handleReadMore }: NewsSectionProps) {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [showAllNews, setShowAllNews] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // FETCH TIN TỨC TỪ API
  const fetchNews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/news/`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData.detail || `Lỗi ${res.status}: Không thể tải tin tức`
        );
      }
      const data = await res.json();

      console.log("🔍 RAW API RESPONSE:", data); // DEBUG: Xem cấu trúc data từ API

      const mappedNews: NewsArticle[] = data.map((n: any) => {
        console.log("📰 Processing News Item:", {
          NewsID: n.NewsID,
          Title: n.Title,
          ContentPreview: n.Content
            ? n.Content.substring(0, 100) + "..."
            : "NO CONTENT",
          ContentLength: n.Content?.length || 0,
        });

        // Xử lý ảnh
        const image =
          n.Image ||
          "https://images.unsplash.com/photo-1659532165024-29510c914b04?w=600&q=75";

        // Xử lý tags
        let tags: string[] = [];
        try {
          if (n.Tags) {
            tags = typeof n.Tags === "string" ? JSON.parse(n.Tags) : n.Tags;
          }
        } catch {
          tags =
            n.Tags?.split(",")
              .map((t: string) => t.trim())
              .filter(Boolean) || [];
        }

        // ✅ XỬ LÝ CONTENT - ĐÂY LÀ PHẦN QUAN TRỌNG NHẤT!
        const fullContent = n.Content || "";
        let displayExcerpt = "";

        if (fullContent && fullContent.trim().length > 0) {
          // Nếu content chỉ chứa chữ "Nội dung bài viết" thì coi như chưa có nội dung thật
          if (
            /^nội dung bài viết/i.test(fullContent.trim()) ||
            fullContent.trim().length < 10
          ) {
            console.warn("⚠️ Placeholder content for NewsID:", n.NewsID);
            displayExcerpt =
              "Nội dung bài viết đang được cập nhật. Click 'Đọc thêm' để xem chi tiết.";
          } else {
            // Làm sạch content: bỏ thẻ HTML, ký tự thừa
            const cleanContent = fullContent
              .replace(/<[^>]*>/g, "") // ❌ Bỏ toàn bộ thẻ HTML
              .trim()
              .replace(/\n+/g, " ")
              .replace(/\s+/g, " ");

            console.log(
              "✂️ Clean Content Preview:",
              cleanContent.substring(0, 100)
            );

            // Lấy 250 ký tự đầu
            if (cleanContent.length > 250) {
              const truncated = cleanContent.substring(0, 100);
              const lastSpace = truncated.lastIndexOf(" ");
              if (lastSpace > 150) {
                displayExcerpt = truncated.substring(0, lastSpace) + "...";
              } else {
                displayExcerpt = truncated + "...";
              }
            } else {
              displayExcerpt = cleanContent;
            }
          }
        } else {
          console.warn("⚠️ No content for NewsID:", n.NewsID);
          displayExcerpt =
            "Nội dung bài viết đang được cập nhật. Click 'Đọc thêm' để xem chi tiết.";
        }

        console.log(
          "📝 Final Excerpt:",
          displayExcerpt.substring(0, 100) + "..."
        );

        // Ước lượng thời gian đọc
        const wordCount = fullContent.trim().split(/\s+/).length;
        const readTime =
          fullContent.length > 0
            ? `${Math.max(1, Math.ceil(wordCount / 150))} phút đọc`
            : "1 phút đọc";

        // Xử lý author
        const author = n.AuthorName || "Admin";

        // Format date
        const formattedDate = new Date(n.CreatedAt).toLocaleDateString("vi-VN");

        return {
          id: n.NewsID,
          title: n.Title || "Tiêu đề đang cập nhật",
          excerpt: displayExcerpt, // ← ĐÂY LÀ NỘI DUNG THẬT TỪ CONTENT
          image,
          date: formattedDate,
          category: n.Category || "Tin tức",
          author,
          readTime,
          content: fullContent,
          tags,
        };
      });

      // Sắp xếp theo CreatedAt giảm dần
      const sortedNews = mappedNews.sort((a, b) => b.id - a.id);

      console.log("✅ Total News Loaded:", sortedNews.length);
      if (sortedNews.length > 0) {
        console.log("📋 First Article Example:", {
          id: sortedNews[0].id,
          title: sortedNews[0].title,
          excerpt: sortedNews[0].excerpt.substring(0, 150) + "...",
          contentLength: sortedNews[0].content.length,
        });
      }

      setNewsArticles(sortedNews);
    } catch (err: any) {
      console.error("❌ Fetch Error:", err);
      setError(err.message || "Không thể tải tin tức");
      setNewsArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // LOADING
  if (isLoading) {
    return (
      <section id="news" className="py-12 md:py-16 px-4 md:px-6 bg-muted/50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Đang tải tin tức...</p>
        </div>
      </section>
    );
  }

  // ERROR
  if (error) {
    return (
      <section id="news" className="py-12 md:py-16 px-4 md:px-6 bg-muted/50">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchNews}>Thử lại</Button>
        </div>
      </section>
    );
  }

  // EMPTY
  if (newsArticles.length === 0) {
    return (
      <section id="news" className="py-12 md:py-16 px-4 md:px-6 bg-muted/50">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">Chưa có tin tức nào.</p>
        </div>
      </section>
    );
  }

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
            Cập nhật thông tin mới nhất về hoa sen, mẹo bảo quản và chia sẻ kiến
            thức hữu ích.
          </p>
        </div>

        {!showAllNews ? (
          <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
            {/* Featured Article */}
            <div className="lg:col-span-2">
              <Card
                className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full cursor-pointer"
                onClick={() => handleReadMore(newsArticles[0].id)}
              >
                <div className="aspect-video overflow-hidden">
                  <ImageWithFallback
                    src={newsArticles[0].image}
                    alt={newsArticles[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader className="p-4 md:p-6">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Badge variant="secondary" className="text-sm">
                      {newsArticles[0].category}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {newsArticles[0].date}
                    </span>
                  </div>
                  {/* TIÊU ĐỀ */}
                  <CardTitle className="text-xl md:text-2xl font-bold leading-tight mb-3">
                    {newsArticles[0].title}
                  </CardTitle>
                  {/* NỘI DUNG (EXCERPT) - HIỂN THỊ 5 DÒNG */}
                  <CardDescription className="text-sm md:text-base leading-relaxed line-clamp-5">
                    {newsArticles[0].excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  <Button
                    variant="outline"
                    className="w-full md:w-auto text-sm md:text-base h-9 md:h-10 hover:bg-primary/10 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReadMore(newsArticles[0].id);
                    }}
                  >
                    Đọc thêm
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Side Articles */}
            <div className="space-y-4 md:space-y-6">
              {newsArticles.slice(1, 4).map((article) => (
                <Card
                  key={article.id}
                  className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
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
                        <Badge variant="secondary" className="text-xs">
                          {article.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {article.date}
                        </span>
                      </div>
                      {/* TIÊU ĐỀ */}
                      <CardTitle className="text-sm md:text-base font-bold leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </CardTitle>
                      {/* NỘI DUNG (EXCERPT) - HIỂN THỊ 3 DÒNG */}
                      <CardDescription className="text-xs md:text-sm leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </CardDescription>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          /* All News Grid */
          <div className="border border-border rounded-lg bg-muted/20 p-2 md:p-3">
            <div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-h-96 md:max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent pr-2"
              style={{
                scrollBehavior: "smooth",
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(244, 166, 205, 0.3) transparent",
              }}
            >
              <AnimatePresence>
                {newsArticles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                  >
                    <Card
                      className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full bg-background/80 backdrop-blur-sm"
                      onClick={() => handleReadMore(article.id)}
                    >
                      <div className="aspect-video overflow-hidden">
                        <ImageWithFallback
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardHeader className="p-3 md:p-4">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <Badge
                            variant="secondary"
                            className="text-xs py-0.5 px-2"
                          >
                            {article.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {article.date}
                          </span>
                        </div>
                        {/* TIÊU ĐỀ */}
                        <CardTitle className="text-sm md:text-base font-bold leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {article.title}
                        </CardTitle>
                        {/* NỘI DUNG (EXCERPT) - HIỂN THỊ 4 DÒNG */}
                        <CardDescription className="text-xs md:text-sm leading-relaxed line-clamp-4">
                          {article.excerpt}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-3 md:p-4 pt-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full hover:bg-primary/10 transition-colors text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReadMore(article.id);
                          }}
                        >
                          Đọc thêm
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="text-center mt-8 md:mt-12">
          <Button
            variant="outline"
            className="bg-gradient-to-r from-[#0891b2] to-[#06b6d4] text-white border-0 hover:shadow-md transition-shadow"
            onClick={() => setShowAllNews(!showAllNews)}
          >
            {showAllNews ? (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
                Thu gọn tin tức
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                Xem tất cả tin tức ({newsArticles.length})
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}

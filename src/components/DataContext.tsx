// ===========================================
// 🔹 DATA CONTEXT API - TÍCH HỢP DJANGO BACKEND
// ===========================================

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// ===========================================
// 🔧 API CONFIGURATION
// ===========================================
const API_BASE_URL = "http://14.224.210.210:8000/api"; // ⚠️ Thay đổi URL này nếu cần

// ===========================================
// 📋 TYPES - MAPPING VỚI DJANGO MODELS
// ===========================================

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Product {
  ProductID: number;
  Name: string;
  Slug?: string;
  Description?: string;
  Price: number;
  Origin?: string;
  FreshDuration?: string;
  IsFeatured?: boolean;
  Status?: "Còn hàng" | "Hết hàng";
  CreatedAt?: string;
  media?: Array<{
    MediaID: number;
    MediaType: "image" | "video";
    Url: string;
    IsPrimary: boolean;
  }>;
  Tags?: Array<{
    TagID: number;
    TagName: string;
  }>;
  category?: {
    CategoryID: number;
    Name: string;
  };
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  category?: string;
  tags?: string[];
  viewCount?: number;
  readingTime?: string;
}

export interface Review {
  id: number;
  productId: number;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string; // "01/11/2025"
  image?: string; // chỉ 1 ảnh (backend trả 1 đường dẫn)
  purchased: boolean;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  date: string;
  status: "new" | "read" | "replied";
  firstName?: string;
  lastName?: string;
  interestedProduct?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  productId: string;
  productName: string;
  productPrice: string;
  quantity: number;
  unit: string;
  totalAmount: number;
  note?: string;
  date: string;
  status: "pending" | "confirmed" | "shipping" | "completed" | "cancelled";
}

// ✅ NEW: Transaction & Schedule types for Finance Management
export interface Transaction {
  id: string;
  type: "income" | "expense" | "debt";
  category: string;
  amount: number;
  description: string;
  date: string;
  orderId?: string;
  createdAt?: string;
}

export interface OrderSchedule {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerAddress?: string; // ✅ MAKE OPTIONAL
  productName: string;
  scheduledDate: string;
  scheduledTime?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  note?: string;
  createdAt?: string;
}

interface DataContextType {
  products: Product[];
  setProducts: (products: Product[]) => void;
  news: NewsArticle[];
  setNews: (news: NewsArticle[]) => void;
  reviews: Review[];
  setReviews: (reviews: Review[]) => void;
  contacts: Contact[];
  setContacts: (contacts: Contact[]) => void;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  newsCategories: Category[];
  setNewsCategories: (categories: Category[]) => void;
  
  // ✅ NEW: Finance Management
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  orderSchedules: OrderSchedule[];
  setOrderSchedules: (schedules: OrderSchedule[]) => void;
  
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addNews: (article: NewsArticle) => Promise<void>;
  updateNews: (id: string, article: NewsArticle) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;
  addReview: (review: Review) => Promise<void>;
  updateReview: (id: string, review: Partial<Review>) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  addContact: (contact: Contact) => Promise<void>;
  updateContact: (id: string, contact: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  addOrder: (order: Order) => Promise<void>;
  updateOrder: (id: string, order: Partial<Order>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  addCategory: (category: Category) => Promise<void>;
  updateCategory: (id: string, category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addNewsCategory: (category: Category) => Promise<void>;
  updateNewsCategory: (id: string, category: Category) => Promise<void>;
  deleteNewsCategory: (id: string) => Promise<void>;
  
  // ✅ NEW: Finance Management CRUD
  addTransaction: (transaction: Transaction) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addOrderSchedule: (schedule: OrderSchedule) => Promise<void>;
  updateOrderSchedule: (id: string, schedule: Partial<OrderSchedule>) => Promise<void>;
  deleteOrderSchedule: (id: string) => Promise<void>;
  
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// ===========================================
// 🎯 DATA PROVIDER COMPONENT
// ===========================================

export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProductsState] = useState<Product[]>([]);
  const [news, setNewsState] = useState<NewsArticle[]>([]);
  const [reviews, setReviewsState] = useState<Review[]>([]);
  const [contacts, setContactsState] = useState<Contact[]>([]);
  const [orders, setOrdersState] = useState<Order[]>([]);
  const [categories, setCategoriesState] = useState<Category[]>([]);
  const [newsCategories, setNewsCategoriesState] = useState<Category[]>([]);
  
  // ✅ NEW: Finance Management
  const [transactions, setTransactionsState] = useState<Transaction[]>([]);
  const [orderSchedules, setOrderSchedulesState] = useState<OrderSchedule[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ===========================================
  // 📥 FETCH DATA FROM API
  // ===========================================

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/products/`);
      if (!res.ok) throw new Error(`Lỗi ${res.status}: Không thể tải sản phẩm`);
      const data = await res.json();

      console.log("📦 Raw Products API (first item):", data[0]); // Debug log

      const mappedProducts: Product[] = data.map((p: any, index: number) => {
        try {
          // 🔹 Parse Tags (danh sách thẻ) - Filter null
          const tags = Array.isArray(p.Tags)
            ? p.Tags.filter((t: any) => t != null).map((t: any) => t.TagName || t)
            : [];

          // 🔹 Chuyển backslash trong URL ảnh/video thành slash - Filter null
          const primaryImage =
            p.media?.find((m: any) => m != null && m.IsPrimary)?.Url?.replace(/\\/g, "/") ||
            p.media?.find((m: any) => m != null)?.[0]?.Url?.replace(/\\/g, "/") ||
            "https://images.unsplash.com/photo-1531822119328-162e4eccbf7e?w=400";

          // 🔹 Map toàn bộ media - Filter null
          const media = Array.isArray(p.media)
            ? p.media
                .filter((m: any) => m != null && m.Url)
                .map((m: any) => ({
                  MediaID: m.MediaID,
                  MediaType: m.MediaType,
                  Url: m.Url?.replace(/\\/g, "/"),
                  IsPrimary: m.IsPrimary,
                }))
            : [];

          // 🔹 Xử lý category - FIX NULL POINTER
          let category;
          if (p.category && typeof p.category === "object" && p.category.CategoryID != null) {
            category = { CategoryID: p.category.CategoryID, Name: p.category.Name || "Chưa phân loại" };
          } else if (p.category && typeof p.category === "number") {
            category = { CategoryID: p.category, Name: `Danh mục ${p.category}` };
          } else if (p.category && typeof p.category === "string") {
            category = { CategoryID: 0, Name: p.category };
          } else {
            // Null or undefined
            category = { CategoryID: 0, Name: "Chưa phân loại" };
          }

          return {
            ProductID: p.ProductID,
            Name: p.Name || "Sản phẩm",
            Slug: p.Slug,
            Description: p.Description || "",
            Price: parseFloat(p.Price) || 0,
            Origin: p.Origin || "Việt Nam",
            FreshDuration: p.FreshDuration || "5-7 ngày",
            IsFeatured: p.IsFeatured || false,
            Status: p.Status || "Còn hàng",
            CreatedAt: p.CreatedAt,
            media,
            Tags: tags.map((t: string) => ({ TagID: 0, TagName: t })),
            category,
          };
        } catch (err) {
          console.error(`❌ Error mapping product at index ${index}:`, err, p);
          // Return fallback product
          return {
            ProductID: p.ProductID || index,
            Name: p.Name || "Sản phẩm lỗi",
            Description: "Dữ liệu không hợp lệ",
            Price: 0,
            Origin: "N/A",
            FreshDuration: "N/A",
            IsFeatured: false,
            Status: "Hết hàng",
            CreatedAt: new Date().toISOString(),
            media: [],
            Tags: [],
            category: { CategoryID: 0, Name: "Lỗi" },
          };
        }
      });

      setProductsState(mappedProducts);
      return mappedProducts;
    } catch (err: any) {
      console.error("❌ Fetch Products Error:", err);
      setProductsState([]);
      return [];
    }
  };

  // FETCH NEWS (giống NewsSection.tsx)
  const fetchNews = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/news/`);
      if (!res.ok) throw new Error(`Lỗi ${res.status}: Không thể tải tin tức`);
      const data = await res.json();

      const mappedNews: NewsArticle[] = data.map((n: any) => {
        // Parse tags
        let tags: string[] = [];
        if (n.Tags) {
          try {
            tags = typeof n.Tags === "string" ? JSON.parse(n.Tags) : n.Tags;
          } catch {
            tags = n.Tags.split(",")
              .map((t: string) => t.trim())
              .filter(Boolean);
          }
        }

        // Clean content for excerpt
        const fullContent = n.Content || "";
        let displayExcerpt = "";

        if (fullContent && fullContent.trim().length > 0) {
          const cleanContent = fullContent
            .replace(/<[^>]*>/g, "") // Remove HTML tags
            .trim()
            .replace(/\n+/g, " ")
            .replace(/\s+/g, " ");

          if (cleanContent.length > 250) {
            const truncated = cleanContent.substring(0, 250);
            const lastSpace = truncated.lastIndexOf(" ");
            displayExcerpt =
              (lastSpace > 150
                ? truncated.substring(0, lastSpace)
                : truncated) + "...";
          } else {
            displayExcerpt = cleanContent;
          }
        } else {
          displayExcerpt = "Nội dung bài viết đang được cập nhật.";
        }

        // Calculate reading time
        const wordCount = fullContent.trim().split(/\s+/).length;
        const readingTime =
          fullContent.length > 0
            ? `${Math.max(1, Math.ceil(wordCount / 150))} phút đọc`
            : "1 phút đọc";

        return {
          id: String(n.NewsID),
          title: n.Title || "Tiêu đề đang cập nhật",
          excerpt: displayExcerpt,
          content: fullContent,
          image:
            n.Image ||
            "https://images.unsplash.com/photo-1659532165024-29510c914b04?w=600&q=75",
          date: new Date(n.CreatedAt).toLocaleDateString("vi-VN"),
          author: n.AuthorName || "Admin",
          category: n.Category || "Tin tức",
          tags,
          viewCount: n.ViewCount || 0,
          readingTime: readingTime,
        };
      });

      const sortedNews = mappedNews.sort(
        (a, b) => parseInt(b.id) - parseInt(a.id)
      );
      setNewsState(sortedNews);
      return sortedNews;
    } catch (err: any) {
      console.error("❌ Fetch News Error:", err);
      setNewsState([]);
      return [];
    }
  };

  // FETCH REVIEWS
  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews/`);
      if (!res.ok) throw new Error(`Lỗi ${res.status}: Không thể tải đánh giá`);
      const data = await res.json();

      const mappedReviews: Review[] = data.map((r: any) => ({
        id: r.ReviewID,
        productId: r.ProductID,
        productName: r.product_name || "",
        customerName: r.CustomerName || "Khách hàng",
        rating: r.Rating || 5,
        comment: r.Comment || "",
        date: new Date(r.ReviewDate).toLocaleDateString("vi-VN"),
        image: r.Attachments || undefined, // ✅ SINGULAR - Backend trả 1 URL
        purchased: r.Purchased || false,
      }));

      setReviewsState(mappedReviews);
      return mappedReviews;
    } catch (err: any) {
      console.error("❌ Fetch Reviews Error:", err);
      setReviewsState([]);
      return [];
    }
  };

  // FETCH CONTACTS
  const fetchContacts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/contacts/`);
      if (!res.ok) throw new Error(`Lỗi ${res.status}: Không thể tải liên hệ`);
      const data = await res.json();

      const mappedContacts: Contact[] = data.map((c: any) => ({
        id: String(c.ContactID),
        name: `${c.FirstName || ""} ${c.LastName || ""}`.trim(),
        phone: c.Phone || "",
        email: c.Email || "",
        message: c.Message || "",
        date: new Date(c.CreatedAt).toISOString().split("T")[0],
        status: c.Status || "new",
        firstName: c.FirstName,
        lastName: c.LastName,
        interestedProduct: c.InterestedProduct,
      }));

      setContactsState(mappedContacts);
      return mappedContacts;
    } catch (err: any) {
      console.error("❌ Fetch Contacts Error:", err);
      setContactsState([]);
      return [];
    }
  };

  // FETCH ORDERS
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/`);
      if (!res.ok) throw new Error(`Lỗi ${res.status}: Không thể tải đơn hàng`);
      const data = await res.json();

      const mappedOrders: Order[] = data.map((o: any) => ({
        id: String(o.OrderID),
        orderNumber: `ORD-${String(o.OrderID).padStart(5, "0")}`,
        customerName: o.CustomerName || "",
        customerPhone: o.Phone || "",
        customerEmail: o.Email || "",
        customerAddress: o.CustomerAddress || "",
        productId: String(o.Product?.ProductID || o.ProductID || ""),
        productName: o.Product?.Name || "",
        productPrice: String(o.Product?.Price || 0),
        quantity: o.Quantity || 1,
        unit: o.Unit || "bó",
        totalAmount: parseFloat(o.TotalAmount) || 0,
        note: o.Note || "",
        date: new Date(o.OrderDate).toISOString().split("T")[0],
        status: o.Status || "pending",
      }));

      setOrdersState(mappedOrders);
      return mappedOrders;
    } catch (err: any) {
      console.error("❌ Fetch Orders Error:", err);
      setOrdersState([]);
      return [];
    }
  };

  // FETCH PRODUCT CATEGORIES
  const fetchProductCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/product-categories/`);
      if (!res.ok)
        throw new Error(`Lỗi ${res.status}: Không thể tải danh mục sản phẩm`);
      const data = await res.json();

      const mappedCategories: Category[] = data.map((c: any) => ({
        id: String(c.CategoryID),
        name: c.Name || "",
        description: c.Description || "",
      }));

      setCategoriesState(mappedCategories);
      return mappedCategories;
    } catch (err: any) {
      console.error("❌ Fetch Product Categories Error:", err);
      setCategoriesState([]);
      return [];
    }
  };

  // FETCH NEWS CATEGORIES
  const fetchNewsCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/news-categories/`);
      if (!res.ok)
        throw new Error(`Lỗi ${res.status}: Không thể tải danh mục tin tức`);
      const data = await res.json();

      const mappedCategories: Category[] = data.map((c: any) => ({
        id: String(c.CategoryID),
        name: c.Name || "",
        description: c.Description || "",
      }));

      setNewsCategoriesState(mappedCategories);
      return mappedCategories;
    } catch (err: any) {
      console.error("❌ Fetch News Categories Error:", err);
      setNewsCategoriesState([]);
      return [];
    }
  };
  
  // ✅ NEW: FETCH TRANSACTIONS
  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/transactions/`);
      if (!res.ok)
        throw new Error(`Lỗi ${res.status}: Không thể tải giao dịch`);
      const response = await res.json();
      
      // Handle both array and wrapped response
      const data = Array.isArray(response) ? response : (response.data || []);

      const mappedTransactions: Transaction[] = data.map((t: any) => ({
        id: String(t.TransactionID),
        type: t.Type?.toLowerCase() || "income",
        category: t.Category || "Khác",
        amount: parseFloat(t.Amount) || 0,
        description: t.Description || "",
        date: t.TransactionDate?.split('T')[0] || new Date().toISOString().split("T")[0],
        orderId: t.OrderID ? String(t.OrderID) : undefined,
        createdAt: t.CreatedAt?.split('T')[0],
      }));

      console.log('✅ Fetched Transactions:', mappedTransactions);
      setTransactionsState(mappedTransactions);
      return mappedTransactions;
    } catch (err: any) {
      console.error("❌ Fetch Transactions Error:", err);
      setTransactionsState([]);
      return [];
    }
  };
  
  // ✅ NEW: FETCH ORDER SCHEDULES
  const fetchOrderSchedules = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/order-schedules/`);
      if (!res.ok)
        throw new Error(`Lỗi ${res.status}: Không thể tải lịch trình đơn hàng`);
      const response = await res.json();
      
      // Handle both array and wrapped response
      const data = Array.isArray(response) ? response : (response.data || []);

      // ✅ DEBUG: Log raw API data
      console.log('🔍 RAW API Response (first item):', data[0]);

      const mappedSchedules: OrderSchedule[] = data.map((s: any) => {
        // ✅ DEBUG: Log individual schedule mapping
        if (s.ScheduleID === 12) {
          console.log('🔍 Mapping Schedule 12:', {
            CustomerName: s.CustomerName,
            customer_name: s.customer_name,
            CustomerAddress: s.CustomerAddress,
            customer_address: s.customer_address,
            ProductName: s.ProductName,
            product_name: s.product_name,
          });
        }

        return {
          id: String(s.ScheduleID),
          orderId: s.OrderID ? String(s.OrderID) : "",  // ✅ Handle null OrderID
          orderNumber: s.order_number || (s.OrderID ? `ORD-${String(s.OrderID).padStart(5, "0")}` : ""),
          // ✅ Ưu tiên field độc lập (CustomerName, CustomerAddress, ProductName)
          // Fallback sang computed field (customer_name, customer_address, product_name)
          customerName: s.CustomerName || s.customer_name || "",
          customerAddress: s.CustomerAddress || s.customer_address || "",
          productName: s.ProductName || s.product_name || "",
          scheduledDate: s.ScheduledDate?.split('T')[0] || new Date().toISOString().split("T")[0],
          scheduledTime: s.ScheduledTime,
          status: s.Status?.toLowerCase() || "pending",
          note: s.Note || "",
          createdAt: s.CreatedAt?.split('T')[0],
        };
      });

      console.log('✅ Fetched Order Schedules:', mappedSchedules);
      setOrderSchedulesState(mappedSchedules);
      return mappedSchedules;
    } catch (err: any) {
      console.error("❌ Fetch Order Schedules Error:", err);
      setOrderSchedulesState([]);
      return [];
    }
  };

  // FETCH ALL DATA
  const fetchAllData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetchProducts(),
        fetchNews(),
        fetchReviews(),
        fetchContacts(),
        fetchOrders(),
        fetchProductCategories(),
        fetchNewsCategories(),
        
        // ✅ NEW: Fetch Finance Management Data
        fetchTransactions(),
        fetchOrderSchedules(),
      ]);
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || "Không thể tải dữ liệu");
      setIsLoading(false);
      console.error("❌ Fetch All Data Error:", err);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Refresh data manually
  const refreshData = async () => {
    await fetchAllData();
  };

  // ===========================================
  // 📦 PRODUCTS CRUD
  // ===========================================

  const setProducts = (newProducts: Product[]) => {
    setProductsState(newProducts);
  };

  const addProduct = async (product: Product) => {
    try {
      const res = await fetch(`${API_BASE_URL}/products/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Name: product.Name,
          Description: product.Description,
          Price: product.Price,
          Origin: product.Origin,
          FreshDuration: product.FreshDuration,
          Status: product.Status || "Còn hàng",
        }),
      });
      if (!res.ok) throw new Error("Không thể thêm sản phẩm");
      await fetchProducts(); // Refresh data
    } catch (err: any) {
      console.error("❌ Add Product Error:", err);
      throw err;
    }
  };

  const updateProduct = async (id: string, product: Product) => {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Name: product.Name,
          Description: product.Description,
          Price: product.Price,
          Origin: product.Origin,
          FreshDuration: product.FreshDuration,
          Status: product.Status || "Còn hàng",
        }),
      });
      if (!res.ok) throw new Error("Không thể cập nhật sản phẩm");
      await fetchProducts();
    } catch (err: any) {
      console.error("❌ Update Product Error:", err);
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Không thể xóa sản phẩm");
      await fetchProducts();
    } catch (err: any) {
      console.error("❌ Delete Product Error:", err);
      throw err;
    }
  };

  // ===========================================
  // 📰 NEWS CRUD
  // ===========================================

  const setNews = (newNews: NewsArticle[]) => {
    setNewsState(newNews);
  };

  const addNews = async (article: NewsArticle) => {
    try {
      const res = await fetch(`${API_BASE_URL}/news/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Title: article.title,
          Content: article.content,
          Image: article.image,
          Category: article.category,
          Tags: article.tags?.join(","),
          ReadingTime: article.readingTime,
        }),
      });
      if (!res.ok) throw new Error("Không thể thêm tin tức");
      await fetchNews();
    } catch (err: any) {
      console.error("❌ Add News Error:", err);
      throw err;
    }
  };

  const updateNews = async (id: string, article: NewsArticle) => {
    try {
      const res = await fetch(`${API_BASE_URL}/news/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Title: article.title,
          Content: article.content,
          Image: article.image,
          Category: article.category,
          Tags: article.tags?.join(","),
          ReadingTime: article.readingTime,
        }),
      });
      if (!res.ok) throw new Error("Không thể cập nhật tin tức");
      await fetchNews();
    } catch (err: any) {
      console.error("❌ Update News Error:", err);
      throw err;
    }
  };

  const deleteNews = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/news/${id}/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Không thể xóa tin tức");
      await fetchNews();
    } catch (err: any) {
      console.error("❌ Delete News Error:", err);
      throw err;
    }
  };

  // ===========================================
  // ⭐ REVIEWS CRUD
  // ===========================================

  const setReviews = (newReviews: Review[]) => {
    setReviewsState(newReviews);
  };

  const addReview = async (review: Review) => {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ProductID: review.productId,
          CustomerName: review.customerName,
          Rating: review.rating,
          Comment: review.comment,
          Attachments: review.image, // ✅ SINGULAR
        }),
      });
      if (!res.ok) throw new Error("Không thể thêm đánh giá");
      await fetchReviews();
    } catch (err: any) {
      console.error("❌ Add Review Error:", err);
      throw err;
    }
  };

  const updateReview = async (id: string, review: Partial<Review>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          CustomerName: review.customerName,
          Rating: review.rating,
          Comment: review.comment,
          Attachments: review.image, // ✅ SINGULAR
        }),
      });
      if (!res.ok) throw new Error("Không thể cập nhật đánh giá");
      await fetchReviews();
    } catch (err: any) {
      console.error("❌ Update Review Error:", err);
      throw err;
    }
  };

  const deleteReview = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews/${id}/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Không thể xóa đánh giá");
      await fetchReviews();
    } catch (err: any) {
      console.error("❌ Delete Review Error:", err);
      throw err;
    }
  };

  // ===========================================
  // 📞 CONTACTS CRUD
  // ===========================================

  const setContacts = (newContacts: Contact[]) => {
    setContactsState(newContacts);
  };

  const addContact = async (contact: Contact) => {
    try {
      const names = contact.name?.split(" ") || [];
      const res = await fetch(`${API_BASE_URL}/contacts/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          FirstName: contact.firstName || names[0] || "",
          LastName: contact.lastName || names.slice(1).join(" ") || "",
          Phone: contact.phone,
          Email: contact.email,
          InterestedProduct: contact.interestedProduct,
          Message: contact.message,
          Status: contact.status || "new",
        }),
      });
      if (!res.ok) throw new Error("Không thể thêm liên hệ");
      await fetchContacts();
    } catch (err: any) {
      console.error("❌ Add Contact Error:", err);
      throw err;
    }
  };

  const updateContact = async (id: string, contact: Partial<Contact>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/contacts/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Status: contact.status,
        }),
      });
      if (!res.ok) throw new Error("Không thể cập nhật liên hệ");
      await fetchContacts();
    } catch (err: any) {
      console.error("❌ Update Contact Error:", err);
      throw err;
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/contacts/${id}/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Không thể xóa liên hệ");
      await fetchContacts();
    } catch (err: any) {
      console.error("❌ Delete Contact Error:", err);
      throw err;
    }
  };

  // ===========================================
  // 🛒 ORDERS CRUD
  // ===========================================

  const setOrders = (newOrders: Order[]) => {
    setOrdersState(newOrders);
  };

  const addOrder = async (order: Order) => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          CustomerName: order.customerName,
          Phone: order.customerPhone,
          Email: order.customerEmail,
          CustomerAddress: order.customerAddress,
          ProductID: order.productId,
          Quantity: order.quantity,
          Unit: order.unit,
          TotalAmount: order.totalAmount,
          Note: order.note,
          Status: order.status || "pending",
        }),
      });
      if (!res.ok) throw new Error("Không thể thêm đơn hàng");
      await fetchOrders();
    } catch (err: any) {
      console.error("❌ Add Order Error:", err);
      throw err;
    }
  };

  const updateOrder = async (id: string, order: Partial<Order>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Status: order.status,
          Note: order.note,
        }),
      });
      if (!res.ok) throw new Error("Không thể cập nhật đơn hàng");
      await fetchOrders();
    } catch (err: any) {
      console.error("❌ Update Order Error:", err);
      throw err;
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${id}/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Không thể xóa đơn hàng");
      await fetchOrders();
    } catch (err: any) {
      console.error("❌ Delete Order Error:", err);
      throw err;
    }
  };

  // ===========================================
  // 🏷️ PRODUCT CATEGORIES CRUD
  // ===========================================

  const setCategories = (newCategories: Category[]) => {
    setCategoriesState(newCategories);
  };

  const addCategory = async (category: Category) => {
    try {
      const res = await fetch(`${API_BASE_URL}/product-categories/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Name: category.name,
          Description: category.description,
        }),
      });
      if (!res.ok) throw new Error("Không thể thêm danh mục");
      await fetchProductCategories();
    } catch (err: any) {
      console.error("❌ Add Category Error:", err);
      throw err;
    }
  };

  const updateCategory = async (id: string, category: Category) => {
    try {
      const res = await fetch(`${API_BASE_URL}/product-categories/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Name: category.name,
          Description: category.description,
        }),
      });
      if (!res.ok) throw new Error("Không thể cập nhật danh mục");
      await fetchProductCategories();
    } catch (err: any) {
      console.error("❌ Update Category Error:", err);
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/product-categories/${id}/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Không thể xóa danh mục");
      await fetchProductCategories();
    } catch (err: any) {
      console.error("❌ Delete Category Error:", err);
      throw err;
    }
  };

  // ===========================================
  // 📚 NEWS CATEGORIES CRUD
  // ===========================================

  const setNewsCategories = (newCategories: Category[]) => {
    setNewsCategoriesState(newCategories);
  };

  const addNewsCategory = async (category: Category) => {
    try {
      const res = await fetch(`${API_BASE_URL}/news-categories/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Name: category.name,
          Description: category.description,
        }),
      });
      if (!res.ok) throw new Error("Không thể thêm danh mục tin tức");
      await fetchNewsCategories();
    } catch (err: any) {
      console.error("❌ Add News Category Error:", err);
      throw err;
    }
  };

  const updateNewsCategory = async (id: string, category: Category) => {
    try {
      const res = await fetch(`${API_BASE_URL}/news-categories/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Name: category.name,
          Description: category.description,
        }),
      });
      if (!res.ok) throw new Error("Không thể cập nhật danh mục tin tức");
      await fetchNewsCategories();
    } catch (err: any) {
      console.error("❌ Update News Category Error:", err);
      throw err;
    }
  };

  const deleteNewsCategory = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/news-categories/${id}/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Không thể xóa danh mục tin tức");
      await fetchNewsCategories();
    } catch (err: any) {
      console.error("❌ Delete News Category Error:", err);
      throw err;
    }
  };
  
  // ✅ NEW: FINANCE MANAGEMENT CRUD
  const setTransactions = (newTransactions: Transaction[]) => {
    setTransactionsState(newTransactions);
  };
  
  const addTransaction = async (transaction: Transaction) => {
    try {
      const res = await fetch(`${API_BASE_URL}/transactions/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Type: transaction.type,
          Category: transaction.category,
          Amount: transaction.amount,
          Description: transaction.description,
          TransactionDate: transaction.date,
          OrderID: transaction.orderId,
        }),
      });
      if (!res.ok) throw new Error("Không thể thêm giao dịch");
      await fetchTransactions();
    } catch (err: any) {
      console.error("❌ Add Transaction Error:", err);
      throw err;
    }
  };
  
  const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/transactions/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Type: transaction.type,
          Category: transaction.category,
          Amount: transaction.amount,
          Description: transaction.description,
          TransactionDate: transaction.date,
          OrderID: transaction.orderId,
        }),
      });
      if (!res.ok) throw new Error("Không thể cập nhật giao dịch");
      await fetchTransactions();
    } catch (err: any) {
      console.error("❌ Update Transaction Error:", err);
      throw err;
    }
  };
  
  const deleteTransaction = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/transactions/${id}/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Không thể xóa giao dịch");
      await fetchTransactions();
    } catch (err: any) {
      console.error("❌ Delete Transaction Error:", err);
      throw err;
    }
  };
  
  const setOrderSchedules = (newSchedules: OrderSchedule[]) => {
    setOrderSchedulesState(newSchedules);
  };
  
  const addOrderSchedule = async (schedule: OrderSchedule) => {
    try {
      const bodyData: any = {
        ScheduledDate: schedule.scheduledDate,
        ScheduledTime: schedule.scheduledTime || null,
        Status: schedule.status,
        Note: schedule.note || "",
        CustomerName: schedule.customerName,  // ✅ ADD
        CustomerAddress: schedule.customerAddress || "",
        ProductName: schedule.productName,  // ✅ ADD
      };
      
      // ✅ OPTIONAL: Only send OrderID if it exists and is valid
      if (schedule.orderId && !isNaN(parseInt(schedule.orderId))) {
        bodyData.OrderID = parseInt(schedule.orderId);
      }
      
      const res = await fetch(`${API_BASE_URL}/order-schedules/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      
      // ✅ LOG ERROR RESPONSE
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("❌ API Error Response:", errorData);
        throw new Error(errorData.detail || JSON.stringify(errorData) || "Không thể thêm lịch trình đơn hàng");
      }
      
      await fetchOrderSchedules();
    } catch (err: any) {
      console.error("❌ Add Order Schedule Error:", err);
      throw err;
    }
  };
  
  const updateOrderSchedule = async (id: string, schedule: Partial<OrderSchedule>) => {
    try {
      const bodyData: any = {
        Status: schedule.status,
        Note: schedule.note || "",
      };
      
      // Only include fields that are provided
      if (schedule.orderId) bodyData.OrderID = parseInt(schedule.orderId);
      if (schedule.scheduledDate) bodyData.ScheduledDate = schedule.scheduledDate;
      if (schedule.scheduledTime !== undefined) bodyData.ScheduledTime = schedule.scheduledTime || null;
      if (schedule.customerAddress !== undefined) bodyData.CustomerAddress = schedule.customerAddress || "";  // ✅ ADD THIS
      
      const res = await fetch(`${API_BASE_URL}/order-schedules/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("❌ API Error Response:", errorData);
        throw new Error(errorData.detail || JSON.stringify(errorData) || "Không thể cập nhật lịch trình đơn hàng");
      }
      
      await fetchOrderSchedules();
    } catch (err: any) {
      console.error("❌ Update Order Schedule Error:", err);
      throw err;
    }
  };
  
  const deleteOrderSchedule = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/order-schedules/${id}/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Không thể xóa lịch trình đơn hàng");
      await fetchOrderSchedules();
    } catch (err: any) {
      console.error("❌ Delete Order Schedule Error:", err);
      throw err;
    }
  };

  // ===========================================
  // 🎁 CONTEXT VALUE
  // ===========================================

  const value: DataContextType = {
    products,
    setProducts,
    news,
    setNews,
    reviews,
    setReviews,
    contacts,
    setContacts,
    orders,
    setOrders,
    categories,
    setCategories,
    newsCategories,
    setNewsCategories,
    
    // ✅ NEW: Finance Management
    transactions,
    setTransactions,
    orderSchedules,
    setOrderSchedules,
    
    addProduct,
    updateProduct,
    deleteProduct,
    addNews,
    updateNews,
    deleteNews,
    addReview,
    updateReview,
    deleteReview,
    addContact,
    updateContact,
    deleteContact,
    addOrder,
    updateOrder,
    deleteOrder,
    addCategory,
    updateCategory,
    deleteCategory,
    addNewsCategory,
    updateNewsCategory,
    deleteNewsCategory,
    
    // ✅ NEW: Finance Management CRUD
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addOrderSchedule,
    updateOrderSchedule,
    deleteOrderSchedule,
    
    isLoading,
    error,
    refreshData,
  };

  // Show loading screen
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#FFF5F7",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div
          style={{
            color: "#FF4D91",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          🌸 Sen Đồng Tháp
        </div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4D91]"></div>
        <div style={{ color: "#FF4D91", fontSize: "16px" }}>
          Đang tải dữ liệu từ server...
        </div>
      </div>
    );
  }

  // Show error screen
  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#FFF5F7",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div style={{ color: "#FF4D91", fontSize: "18px" }}>
          ⚠️ Lỗi kết nối server
        </div>
        <div style={{ color: "#666", fontSize: "14px" }}>{error}</div>
        <button
          onClick={refreshData}
          style={{
            padding: "10px 20px",
            background: "#FF4D91",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Thử lại
        </button>
      </div>
    );
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

// ===========================================
// 🎣 CUSTOM HOOK
// ===========================================

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
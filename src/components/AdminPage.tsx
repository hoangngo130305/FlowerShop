import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { toast } from "sonner";
import {
  Package,
  FileText,
  Star,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  LogOut,
  ShoppingCart,
  TrendingUp,
  Camera,
  FolderTree,
} from "lucide-react";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Checkbox } from "./ui/checkbox";
import { useIsMobile } from "./ui/use-mobile";
import { Check, ChevronsUpDown, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "./ui/dropdown-menu";
import { ScrollArea } from "./ui/scroll-area";

const API_BASE = "http://14.224.210.210:8000/api";

// ==================== INTERFACES ====================
interface Product {
  ProductID: number;
  Name: string;
  Slug?: string;
  Description?: string;
  Price: number;
  Origin?: string;
  FreshDuration?: string;
  IsFeatured?: boolean;
  Status: "Còn hàng" | "Hết hàng";
  CreatedAt: string;
  Media?: Array<{
    type: "image" | "video";
    url: string;
  }>;
  Tags?: Array<{
    TagID: number;
    TagName: string;
  }>;
  category?: {
    CategoryID: number;
    Name: string;
  } | null;
}

interface Tag {
  TagID: number;
  TagName: string;
}

interface News {
  NewsID: number;
  Title: string;
  Content?: string;
  Image?: string;
  Category?: string;
  CreatedAt: string;
  ViewCount: number;
  Tags?: string;
  news_category?: {
    CategoryID: number;
    Name: string;
  };
}

interface Review {
  ReviewID: number;
  ProductID?: number;
  CustomerName?: string;
  Rating?: number;
  Comment?: string;
  Purchased: boolean;
  ReviewDate: string;
}

interface Contact {
  ContactID: number;
  FirstName?: string;
  LastName?: string;
  Phone?: string;
  InterestedProduct?: string;
  Message?: string;
  Status: "new" | "read" | "replied";
  CreatedAt: string;
}

interface Order {
  OrderID: number;
  CustomerName: string;
  Phone: string;
  Email?: string;
  CustomerAddress?: string;
  Quantity: number;
  Unit: string;
  TotalAmount: number;
  Note?: string;
  Status: "pending" | "confirmed" | "shipping" | "completed" | "cancelled";
  OrderDate: string;
  Product?: {
    ProductID: number;
    Name: string;
    Price: number;
  };
}

interface Category {
  CategoryID: number;
  Name: string;
  Description?: string;
}

interface AdminPageProps {
  onLogout: () => void;
}

export function AdminPage({ onLogout }: AdminPageProps) {
  const isMobile = useIsMobile();

  // ==================== STATE ====================
  const [products, setProducts] = useState<Product[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newsCategories, setNewsCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isNewsDialogOpen, setIsNewsDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isNewsCategoryDialogOpen, setIsNewsCategoryDialogOpen] =
    useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    type: string;
    id: number;
  } | null>(null);

  // Form states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingNewsCategory, setEditingNewsCategory] =
    useState<Category | null>(null);

  // Product form states
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [productMediaPreviews, setProductMediaPreviews] = useState<string[]>(
    []
  );
  const [productMediaFiles, setProductMediaFiles] = useState<File[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);

  // News form states
  const [selectedNewsCategory, setSelectedNewsCategory] = useState<string>("");
  const [newsImagePreview, setNewsImagePreview] = useState<string>("");
  const [newsImageFile, setNewsImageFile] = useState<File | null>(null); // ← LƯU FILE

  // ==================== FETCH DATA ====================
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [
        productsRes,
        newsRes,
        reviewsRes,
        contactsRes,
        ordersRes,
        categoriesRes,
        newsCategoriesRes,
        tagsRes,
      ] = await Promise.all([
        fetch(`${API_BASE}/products/`),
        fetch(`${API_BASE}/news/`),
        fetch(`${API_BASE}/reviews/`),
        fetch(`${API_BASE}/contacts/`),
        fetch(`${API_BASE}/orders/`),
        fetch(`${API_BASE}/product-categories/`),
        fetch(`${API_BASE}/news-categories/`),
        fetch(`${API_BASE}/tags/`),
      ]);

      if (!productsRes.ok) throw new Error("Failed to fetch products");
      if (!newsRes.ok) throw new Error("Failed to fetch news");
      if (!reviewsRes.ok) throw new Error("Failed to fetch reviews");
      if (!contactsRes.ok) throw new Error("Failed to fetch contacts");
      if (!ordersRes.ok) throw new Error("Failed to fetch orders");

      console.log("🔍 Categories Response Status:", categoriesRes.status);
      if (!categoriesRes.ok) {
        const errorText = await categoriesRes.text();
        console.error("❌ Categories Error:", errorText);
        throw new Error("Failed to fetch categories");
      }

      console.log(
        "🔍 News Categories Response Status:",
        newsCategoriesRes.status
      );
      if (!newsCategoriesRes.ok) {
        const errorText = await newsCategoriesRes.text();
        console.error("❌ News Categories Error:", errorText);
        throw new Error("Failed to fetch news categories");
      }

      const [
        productsData,
        newsData,
        reviewsData,
        contactsData,
        ordersData,
        categoriesData,
        newsCategoriesData,
        tagsData,
      ] = await Promise.all([
        productsRes.json(),
        newsRes.json(),
        reviewsRes.json(),
        contactsRes.json(),
        ordersRes.json(),
        categoriesRes.json(),
        newsCategoriesRes.json(),
        tagsRes.ok ? tagsRes.json() : Promise.resolve([]),
      ]);

      setProducts(productsData);
      setNews(newsData);
      setReviews(reviewsData);
      setContacts(contactsData);
      setOrders(ordersData);
      setCategories(categoriesData);
      setNewsCategories(newsCategoriesData);
      setTags(tagsData);

      console.log("✅ Categories loaded:", categoriesData);
      console.log("✅ News Categories loaded:", newsCategoriesData);
      console.log("✅ Tags loaded:", tagsData);

      toast.success("Tải dữ liệu thành công!");
    } catch (error: any) {
      console.error("Fetch error:", error);
      toast.error(`Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ==================== STATISTICS ====================
  const stats = {
    totalProducts: products.length,
    totalCategories: categories.length,
    totalNews: news.length,
    totalReviews: reviews.length,
    newContacts: contacts.filter((c) => c.Status === "new").length,
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.Status === "pending").length,
    completedOrders: orders.filter((o) => o.Status === "completed").length,
  };

  // ==================== MEDIA HANDLERS ====================
  const handleProductMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    console.log("📸 handleProductMediaChange - New files:", newFiles.map(f => f.name));
    setProductMediaFiles((prev) => {
      const updated = [...prev, ...newFiles];
      console.log("📸 Updated productMediaFiles state:", updated.map(f => f.name));
      return updated;
    });

    const newPreviews: string[] = [];
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === newFiles.length) {
          setProductMediaPreviews((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveMedia = (index: number) => {
    setProductMediaPreviews((prev) => prev.filter((_, i) => i !== index));
    setProductMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNewsImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ Lưu file vào state
    setNewsImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewsImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // ==================== PRODUCT CRUD ====================
  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form); // LẤY TỪ FORM → CÓ Name, Price, ...

    // XÓA media cũ (nếu có)
    formData.delete("media_files");

    // ✅ DEBUG: Kiểm tra state productMediaFiles
    console.log("🔍 productMediaFiles length:", productMediaFiles.length);
    console.log("🔍 productMediaFiles:", productMediaFiles);

    // Append file từ state
    productMediaFiles.forEach((file, index) => {
      console.log(`✅ Appending file ${index}:`, file.name, file.type, file.size);
      formData.append("media_files", file);
    });

    // ✅ DEBUG: Kiểm tra FormData
    const formDataEntries = Array.from(formData.entries());
    console.log("📦 FormData entries:", formDataEntries);
    console.log("📦 media_files in FormData:", formData.getAll("media_files"));

    // Append các field cần thiết (nếu không có trong form)
    if (!formData.has("Name")) {
      const nameElement = form.elements.namedItem("name") as HTMLInputElement | null;
      if (nameElement && nameElement.value) {
        formData.append("Name", nameElement.value);
      }
    }

    // Nếu đang edit → gửi existing_media
    if (editingProduct?.Media?.length) {
      formData.append("existing_media", JSON.stringify(editingProduct.Media));
    }

    try {
      const url = editingProduct
        ? `${API_BASE}/products/${editingProduct.ProductID}/`
        : `${API_BASE}/products/`;

      const res = await fetch(url, {
        method: editingProduct ? "PUT" : "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error:", errorText);
        throw new Error("Failed to save product");
      }

      const data = await res.json();

      if (editingProduct) {
        setProducts((prev) =>
          prev.map((p) => (p.ProductID === data.ProductID ? data : p))
        );
        toast.success("Cập nhật thành công!");
      } else {
        setProducts((prev) => [data, ...prev]);
        toast.success("Thêm sản phẩm thành công!");
      }

      closeProductDialog();
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message}`);
    }
  };

  // Helper để đóng dialog và reset
  const closeProductDialog = () => {
    setIsProductDialogOpen(false);
    setEditingProduct(null);
    setProductMediaFiles([]);
    setProductMediaPreviews([]);
    setSelectedCategory(null);
    setSelectedTags([]);
    setIsFeatured(false);
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/products/${id}/`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete product");

      setProducts((prev) => prev.filter((p) => p.ProductID !== id));
      toast.success("Xóa sản phẩm thành công!");
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message}`);
    }
  };

  // ==================== NEWS CRUD ====================
  const handleSaveNews = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    // ✅ SỬ DỤNG FormData THAY VÌ JSON (giống Product)
    const formData = new FormData();
    
    // Append text fields
    formData.append("Title", (form.elements.namedItem("title") as HTMLInputElement)?.value || "");
    formData.append("Content", (form.elements.namedItem("content") as HTMLTextAreaElement)?.value || "");
    formData.append("Category", (form.elements.namedItem("category") as HTMLInputElement)?.value || "Tin tức");
    formData.append("Tags", (form.elements.namedItem("tags") as HTMLInputElement)?.value || "");
    
    // ✅ Append IMAGE FILE (nếu có)
    if (newsImageFile) {
      formData.append("Image", newsImageFile);
      console.log("📸 News Image File:", newsImageFile.name, newsImageFile.type, newsImageFile.size);
    }

    console.log("📦 News FormData entries:", Array.from(formData.entries()).map(([k, v]) => [k, v instanceof File ? `File: ${v.name}` : v]));

    try {
      if (editingNews) {
        const res = await fetch(`${API_BASE}/news/${editingNews.NewsID}/`, {
          method: "PUT",
          // ❌ KHÔNG SET Content-Type → Browser tự set multipart/form-data
          body: formData,
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("API Error:", errorText);
          throw new Error("Failed to update news");
        }

        const updated = await res.json();
        setNews((prev) =>
          prev.map((n) => (n.NewsID === updated.NewsID ? updated : n))
        );
        toast.success("Cập nhật bài viết thành công!");
      } else {
        const res = await fetch(`${API_BASE}/news/`, {
          method: "POST",
          // ❌ KHÔNG SET Content-Type → Browser tự set multipart/form-data
          body: formData,
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("API Error:", errorText);
          throw new Error("Failed to create news");
        }

        const created = await res.json();
        setNews((prev) => [created, ...prev]);
        toast.success("Thêm bài viết thành công!");
      }

      closeNewsDialog();
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message}`);
    }
  };
  
  // ✅ Helper để đóng dialog và reset News
  const closeNewsDialog = () => {
    setIsNewsDialogOpen(false);
    setEditingNews(null);
    setNewsImageFile(null);
    setNewsImagePreview("");
    setSelectedNewsCategory("");
  };

  const handleDeleteNews = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/news/${id}/`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete news");

      setNews((prev) => prev.filter((n) => n.NewsID !== id));
      toast.success("Xóa bài viết thành công!");
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message}`);
    }
  };

  // ==================== REVIEW CRUD ====================
  const handleDeleteReview = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/reviews/${id}/`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete review");

      setReviews((prev) => prev.filter((r) => r.ReviewID !== id));
      toast.success("Xóa đánh giá thành công!");
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message}`);
    }
  };

  // ==================== CONTACT CRUD ====================
  const handleUpdateContactStatus = async (
    id: number,
    status: Contact["Status"]
  ) => {
    try {
      const res = await fetch(`${API_BASE}/contacts/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Status: status }),
      });

      if (!res.ok) throw new Error("Failed to update contact status");

      const updated = await res.json();
      setContacts((prev) =>
        prev.map((c) => (c.ContactID === id ? updated : c))
      );
      toast.success("Cập nhật trạng thái thành công!");
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message}`);
    }
  };

  const handleDeleteContact = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/contacts/${id}/`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete contact");

      setContacts((prev) => prev.filter((c) => c.ContactID !== id));
      toast.success("Xóa liên hệ thành công!");
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message}`);
    }
  };

  // ==================== ORDER CRUD ====================
  const handleUpdateOrderStatus = async (
    id: number,
    status: Order["Status"]
  ) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Status: status }),
      });

      if (!res.ok) throw new Error("Failed to update order status");

      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o.OrderID === id ? updated : o)));
      toast.success("Cập nhật trạng thái đơn hàng thành công!");
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message}`);
    }
  };

  const handleDeleteOrder = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}/`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete order");

      setOrders((prev) => prev.filter((o) => o.OrderID !== id));
      toast.success("Xóa đơn hàng thành công!");
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message}`);
    }
  };

  // ==================== CATEGORY CRUD ====================
  const handleSaveCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const categoryData = {
      Name: formData.get("name") as string,
      Description: (formData.get("description") as string) || "",
    };

    try {
      if (editingCategory) {
        const res = await fetch(
          `${API_BASE}/product-categories/${editingCategory.CategoryID}/`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(categoryData),
          }
        );

        if (!res.ok) throw new Error("Failed to update category");

        const updated = await res.json();
        setCategories((prev) =>
          prev.map((c) => (c.CategoryID === updated.CategoryID ? updated : c))
        );
        toast.success("Cập nhật danh mục thành công!");
      } else {
        const res = await fetch(`${API_BASE}/product-categories/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryData),
        });

        if (!res.ok) throw new Error("Failed to create category");

        const created = await res.json();
        setCategories((prev) => [created, ...prev]);
        toast.success("Thêm danh mục thành công!");
      }

      setIsCategoryDialogOpen(false);
      setEditingCategory(null);
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message}`);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/product-categories/${id}/`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete category");

      setCategories((prev) => prev.filter((c) => c.CategoryID !== id));
      toast.success("Xóa danh mục thành công!");
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message}`);
    }
  };

  // ==================== NEWS CATEGORY CRUD ====================
  const handleSaveNewsCategory = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const categoryData = {
      Name: formData.get("name") as string,
      Description: (formData.get("description") as string) || "",
    };

    try {
      if (editingNewsCategory) {
        const res = await fetch(
          `${API_BASE}/news-categories/${editingNewsCategory.CategoryID}/`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(categoryData),
          }
        );

        if (!res.ok) throw new Error("Failed to update news category");

        const updated = await res.json();
        setNewsCategories((prev) =>
          prev.map((c) => (c.CategoryID === updated.CategoryID ? updated : c))
        );
        toast.success("Cập nhật danh mục bài viết thành công!");
      } else {
        const res = await fetch(`${API_BASE}/news-categories/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryData),
        });

        if (!res.ok) throw new Error("Failed to create news category");

        const created = await res.json();
        setNewsCategories((prev) => [created, ...prev]);
        toast.success("Thêm danh mục bài viết thành công!");
      }

      setIsNewsCategoryDialogOpen(false);
      setEditingNewsCategory(null);
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message}`);
    }
  };

  const handleDeleteNewsCategory = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/news-categories/${id}/`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete news category");

      setNewsCategories((prev) => prev.filter((c) => c.CategoryID !== id));
      toast.success("Xóa danh mục bài viết thành công!");
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message}`);
    }
  };

  // ==================== DELETE CONFIRMATION ====================
  const confirmDelete = () => {
    if (!itemToDelete) return;

    switch (itemToDelete.type) {
      case "product":
        handleDeleteProduct(itemToDelete.id);
        break;
      case "news":
        handleDeleteNews(itemToDelete.id);
        break;
      case "review":
        handleDeleteReview(itemToDelete.id);
        break;
      case "contact":
        handleDeleteContact(itemToDelete.id);
        break;
      case "order":
        handleDeleteOrder(itemToDelete.id);
        break;
      case "category":
        handleDeleteCategory(itemToDelete.id);
        break;
      case "news-category":
        handleDeleteNewsCategory(itemToDelete.id);
        break;
    }

    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  // ==================== LOADING SCREEN ====================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div
              className={`${
                isMobile ? "w-8 h-8" : "w-10 h-10"
              } bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center`}
            >
              <Package
                className={`${isMobile ? "w-4 h-4" : "w-6 h-6"} text-white`}
              />
            </div>
            <div>
              <h1
                className={`font-black ${isMobile ? "text-base" : "text-xl"}`}
              >
                Sen Việt Admin
              </h1>
              {!isMobile && (
                <p className="text-xs text-muted-foreground">
                  Quản lý hệ thống
                </p>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            onClick={onLogout}
            className="gap-2"
            size={isMobile ? "sm" : "default"}
          >
            <LogOut className="w-4 h-4" />
            {!isMobile && "Đăng xuất"}
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 md:gap-4 mb-4 md:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Sản phẩm</CardTitle>
              <Package className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">Tổng số sản phẩm</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Đơn hàng</CardTitle>
              <ShoppingCart className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black">{stats.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Đơn chờ xử lý</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Hoàn thành</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black">{stats.completedOrders}</div>
              <p className="text-xs text-muted-foreground">Đơn đã giao</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Danh mục</CardTitle>
              <FolderTree className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black">{stats.totalCategories}</div>
              <p className="text-xs text-muted-foreground">Tổng danh mục</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Bài viết</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black">{stats.totalNews}</div>
              <p className="text-xs text-muted-foreground">Tổng số bài viết</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Đánh giá</CardTitle>
              <Star className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black">{stats.totalReviews}</div>
              <p className="text-xs text-muted-foreground">Tổng đánh giá</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Liên hệ</CardTitle>
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black">{stats.newContacts}</div>
              <p className="text-xs text-muted-foreground">Liên hệ mới</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="orders" className="space-y-4">
          <div className="bg-white rounded-lg border p-2">
            <TabsList
              className={`grid h-auto w-full ${
                isMobile ? "grid-cols-4 gap-1" : "grid-cols-8 gap-2"
              }`}
            >
              <TabsTrigger
                value="orders"
                className={isMobile ? "gap-1 px-2 py-2 text-xs" : "gap-2"}
              >
                <ShoppingCart className={isMobile ? "w-3 h-3" : "w-4 h-4"} />
                {!isMobile ? "Đơn hàng" : "ĐH"}
              </TabsTrigger>
              <TabsTrigger
                value="order-history"
                className={isMobile ? "gap-1 px-2 py-2 text-xs" : "gap-2"}
              >
                <TrendingUp className={isMobile ? "w-3 h-3" : "w-4 h-4"} />
                {!isMobile ? "Lịch sử" : "LS"}
              </TabsTrigger>
              <TabsTrigger
                value="products"
                className={isMobile ? "gap-1 px-2 py-2 text-xs" : "gap-2"}
              >
                <Package className={isMobile ? "w-3 h-3" : "w-4 h-4"} />
                {!isMobile ? "Sản phẩm" : "SP"}
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className={isMobile ? "gap-1 px-2 py-2 text-xs" : "gap-2"}
              >
                <FolderTree className={isMobile ? "w-3 h-3" : "w-4 h-4"} />
                {!isMobile ? "Danh mục SP" : "DM"}
              </TabsTrigger>
              <TabsTrigger
                value="news"
                className={isMobile ? "gap-1 px-2 py-2 text-xs" : "gap-2"}
              >
                <FileText className={isMobile ? "w-3 h-3" : "w-4 h-4"} />
                {!isMobile ? "Bài viết" : "BV"}
              </TabsTrigger>
              <TabsTrigger
                value="news-categories"
                className={isMobile ? "gap-1 px-2 py-2 text-xs" : "gap-2"}
              >
                <FolderTree className={isMobile ? "w-3 h-3" : "w-4 h-4"} />
                {!isMobile ? "Danh mục BV" : "DM"}
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className={isMobile ? "gap-1 px-2 py-2 text-xs" : "gap-2"}
              >
                <Star className={isMobile ? "w-3 h-3" : "w-4 h-4"} />
                {!isMobile ? "Đánh giá" : "ĐG"}
              </TabsTrigger>
              <TabsTrigger
                value="contacts"
                className={isMobile ? "gap-1 px-2 py-2 text-xs" : "gap-2"}
              >
                <MessageSquare className={isMobile ? "w-3 h-3" : "w-4 h-4"} />
                {!isMobile ? "Liên hệ" : "LH"}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý đơn hàng</CardTitle>
                <CardDescription>
                  Danh sách đơn hàng chưa hoàn thành
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto rounded-md border max-h-[600px] overflow-y-auto">
                  <Table className="min-w-[1000px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mã đơn</TableHead>
                        <TableHead>Khách hàng</TableHead>
                        <TableHead>SĐT</TableHead>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead>Số lượng</TableHead>
                        <TableHead>Tổng tiền</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Ngày đặt</TableHead>
                        <TableHead>Hành động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.filter((o) => o.Status !== "completed").length ===
                      0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={9}
                            className="text-center text-muted-foreground"
                          >
                            Chưa có đơn hàng nào
                          </TableCell>
                        </TableRow>
                      ) : (
                        orders
                          .filter((o) => o.Status !== "completed")
                          .map((order) => (
                            <TableRow key={order.OrderID}>
                              <TableCell className="font-mono">
                                #{order.OrderID}
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">
                                  {order.CustomerName}
                                </div>
                                {order.Email && (
                                  <div className="text-xs text-muted-foreground">
                                    {order.Email}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>{order.Phone}</TableCell>
                              <TableCell>
                                <div className="font-medium">
                                  {order.Product?.Name || "N/A"}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {(order.Product?.Price || 0).toLocaleString(
                                    "vi-VN"
                                  )}
                                  đ
                                </div>
                              </TableCell>
                              <TableCell>
                                {order.Quantity} {order.Unit}
                              </TableCell>
                              <TableCell className="font-semibold">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(order.TotalAmount || 0)}
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={order.Status}
                                  onValueChange={(value) =>
                                    handleUpdateOrderStatus(
                                      order.OrderID,
                                      value as any
                                    )
                                  }
                                >
                                  <SelectTrigger className="w-[130px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">
                                      <Badge
                                        variant="outline"
                                        className="bg-yellow-100 text-yellow-800"
                                      >
                                        Chờ xử lý
                                      </Badge>
                                    </SelectItem>
                                    <SelectItem value="confirmed">
                                      <Badge
                                        variant="outline"
                                        className="bg-blue-100 text-blue-800"
                                      >
                                        Đã xác nhận
                                      </Badge>
                                    </SelectItem>
                                    <SelectItem value="shipping">
                                      <Badge
                                        variant="outline"
                                        className="bg-purple-100 text-purple-800"
                                      >
                                        Đang giao
                                      </Badge>
                                    </SelectItem>
                                    <SelectItem value="completed">
                                      <Badge
                                        variant="outline"
                                        className="bg-green-100 text-green-800"
                                      >
                                        Hoàn thành
                                      </Badge>
                                    </SelectItem>
                                    <SelectItem value="cancelled">
                                      <Badge
                                        variant="outline"
                                        className="bg-red-100 text-red-800"
                                      >
                                        Đã hủy
                                      </Badge>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell className="text-sm">
                                {new Date(order.OrderDate).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    setItemToDelete({
                                      type: "order",
                                      id: order.OrderID,
                                    });
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Order History Tab */}
          <TabsContent value="order-history">
            <Card>
              <CardHeader>
                <CardTitle>Lịch sử đơn hàng</CardTitle>
                <CardDescription>Các đơn hàng đã hoàn thành</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto rounded-md border max-h-[600px] overflow-y-auto">
                  <Table className="min-w-[1000px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mã đơn</TableHead>
                        <TableHead>Khách hàng</TableHead>
                        <TableHead>SĐT</TableHead>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead>Số lượng</TableHead>
                        <TableHead>Tổng tiền</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Ngày đặt</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.filter((o) => o.Status === "completed").length ===
                      0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={8}
                            className="text-center text-muted-foreground"
                          >
                            Chưa có đơn hàng hoàn thành
                          </TableCell>
                        </TableRow>
                      ) : (
                        orders
                          .filter((o) => o.Status === "completed")
                          .map((order) => (
                            <TableRow key={order.OrderID}>
                              <TableCell className="font-mono">
                                #{order.OrderID}
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">
                                  {order.CustomerName}
                                </div>
                                {order.Email && (
                                  <div className="text-xs text-muted-foreground">
                                    {order.Email}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>{order.Phone}</TableCell>
                              <TableCell>
                                <div className="font-medium">
                                  {order.Product?.Name || "N/A"}
                                </div>
                              </TableCell>
                              <TableCell>
                                {order.Quantity} {order.Unit}
                              </TableCell>
                              <TableCell className="font-semibold">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(order.TotalAmount || 0)}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="bg-green-100 text-green-800"
                                >
                                  Hoàn thành
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm">
                                {new Date(order.OrderDate).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Quản lý sản phẩm</CardTitle>
                    <CardDescription>Danh sách tất cả sản phẩm</CardDescription>
                  </div>
                  <Dialog
                    open={isProductDialogOpen}
                    onOpenChange={setIsProductDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700"
                        onClick={() => {
                          console.log("🔍 Opening Add Product Dialog");
                          console.log("🔍 Categories available:", categories);
                          console.log("🔍 Tags available:", tags);
                          setEditingProduct(null);
                          setProductMediaPreviews([]);
                          setProductMediaFiles([]);
                          setSelectedCategory(null);
                          setSelectedTags([]);
                          setIsFeatured(false);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm sản phẩm
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col p-0">
                      <div className="flex-shrink-0 p-6 pb-2">
                        <DialogHeader>
                          <DialogTitle>
                            {editingProduct
                              ? "Sửa sản phẩm"
                              : "Thêm sản phẩm mới"}
                          </DialogTitle>
                          <DialogDescription>
                            Điền thông tin sản phẩm vào form bên dưới
                          </DialogDescription>
                        </DialogHeader>
                      </div>
                      <form
                        onSubmit={handleSaveProduct}
                        className="flex flex-col flex-1 min-h-0"
                      >
                        <div className="flex-1 overflow-y-auto px-6">
                          <div className="space-y-4 pb-4">
                            <div className="space-y-2 min-w-0">
                              <Label htmlFor="name">Tên sản phẩm *</Label>
                              <Input
                                id="name"
                                name="Name"
                                defaultValue={editingProduct?.Name || ""}
                                required
                                className="w-full max-w-full"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4 items-start min-w-0">
                              <div className="space-y-2 min-w-0">
                                <Label htmlFor="category">Danh mục</Label>
                                <Select
                                  value={selectedCategory?.toString()}
                                  onValueChange={(value) =>
                                    setSelectedCategory(
                                      value ? Number(value) : null
                                    )
                                  }
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn danh mục" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {categories.map((cat) => (
                                      <SelectItem
                                        key={cat.CategoryID}
                                        value={cat.CategoryID.toString()}
                                      >
                                        {cat.Name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2 min-w-0">
                                <Label>Tags</Label>
                                <div className="border rounded-md p-3 max-h-[150px] overflow-y-auto bg-muted/30">
                                  {tags.length === 0 ? (
                                    <div className="text-sm text-muted-foreground text-center py-2">
                                      Chưa có tag nào
                                    </div>
                                  ) : (
                                    <div className="space-y-2">
                                      {tags.map((tag) => (
                                        <label
                                          key={tag.TagID}
                                          className="flex items-center gap-2 p-1 hover:bg-background rounded cursor-pointer"
                                        >
                                          <Checkbox
                                            checked={selectedTags.includes(
                                              tag.TagID
                                            )}
                                            onCheckedChange={(checked) => {
                                              setSelectedTags((prev) => {
                                                if (checked) {
                                                  return [...prev, tag.TagID];
                                                }
                                                return prev.filter(
                                                  (t) => t !== tag.TagID
                                                );
                                              });
                                            }}
                                          />
                                          <span className="text-sm">
                                            {tag.TagName}
                                          </span>
                                        </label>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 items-start min-w-0">
                              <div className="space-y-2 min-w-0">
                                <Label htmlFor="price">Giá (VNĐ) *</Label>
                                <Input
                                  id="price"
                                  name="Price"
                                  type="number"
                                  min="0"
                                  step="1000"
                                  defaultValue={editingProduct?.Price || 0}
                                  required
                                  className="w-full max-w-full"
                                />
                              </div>
                              <div className="space-y-2 min-w-0">
                                <Label htmlFor="stock">Tồn kho *</Label>
                                <Input
                                  id="stock"
                                  name="Stock"
                                  type="number"
                                  min="0"
                                  defaultValue="100"
                                  required
                                  className="w-full max-w-full"
                                />
                              </div>
                            </div>
                            <div className="space-y-2 min-w-0">
                              <Label htmlFor="productMedia">
                                Hình ảnh & Video sản phẩm *
                              </Label>
                              <Input
                                id="productMedia"
                                name="media_files" // ← ĐÚNG TÊN FIELD
                                type="file"
                                accept="image/*,video/*"
                                multiple
                                onChange={handleProductMediaChange}
                                className="w-full max-w-full"
                              />
                              <p className="text-xs text-muted-foreground">
                                Chọn nhiều ảnh hoặc video (Ctrl/Cmd + Click).
                                Ảnh đầu tiên sẽ là ảnh đại diện.
                              </p>

                              {productMediaPreviews.length > 0 && (
                                <div className="mt-3">
                                  <p className="text-sm font-medium mb-2">
                                    Đã chọn {productMediaPreviews.length} file
                                  </p>
                                  <div className="grid grid-cols-4 gap-2">
                                    {productMediaPreviews.map((src, index) => {
                                      const isVideo =
                                        src.startsWith("data:video");
                                      return (
                                        <div
                                          key={`media-preview-${index}`}
                                          className="relative group"
                                        >
                                          <div className="aspect-square bg-muted rounded border overflow-hidden">
                                            {isVideo ? (
                                              <video
                                                src={src}
                                                className="w-full h-full object-cover"
                                                muted
                                              />
                                            ) : (
                                              <img
                                                src={src}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-full object-cover"
                                              />
                                            )}
                                          </div>
                                          {index === 0 && (
                                            <Badge
                                              className="absolute top-1 left-1 text-xs"
                                              variant="secondary"
                                            >
                                              Chính
                                            </Badge>
                                          )}
                                          {isVideo && (
                                            <Badge className="absolute bottom-1 left-1 text-xs bg-red-600">
                                              Video
                                            </Badge>
                                          )}
                                          <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() =>
                                              handleRemoveMedia(index)
                                            }
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </Button>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="space-y-2 min-w-0">
                              <Label htmlFor="description">
                                Mô tả chi tiết
                              </Label>
                              <Textarea
                                id="description"
                                name="description"
                                rows={4}
                                defaultValue={editingProduct?.Description || ""}
                                className="w-full max-w-full"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4 items-start min-w-0">
                              <div className="space-y-2 min-w-0">
                                <Label htmlFor="origin">Xuất xứ</Label>
                                <Input
                                  id="origin"
                                  name="Origin"
                                  defaultValue={
                                    editingProduct?.Origin || "Việt Nam"
                                  }
                                  className="w-full max-w-full"
                                />
                              </div>
                              <div className="space-y-2 min-w-0">
                                <Label htmlFor="freshDuration">
                                  Thời gian tươi
                                </Label>
                                <Input
                                  id="freshDuration"
                                  name="FreshDuration"
                                  defaultValue={
                                    editingProduct?.FreshDuration || "5-7 ngày"
                                  }
                                  className="w-full max-w-full"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 items-start min-w-0">
                              <div className="space-y-2 min-w-0">
                                <Label htmlFor="status">Trạng thái</Label>
                                <Select
                                  name="status"
                                  defaultValue={
                                    editingProduct?.Status || "Còn hàng"
                                  }
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Còn hàng">
                                      Còn hàng
                                    </SelectItem>
                                    <SelectItem value="Hết hàng">
                                      Hết hàng
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2 min-w-0">
                                <Label className="block mb-3">Tùy chọn</Label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <Checkbox
                                    checked={isFeatured}
                                    onCheckedChange={(checked) =>
                                      setIsFeatured(!!checked)
                                    }
                                  />
                                  <span className="text-sm">
                                    Sản phẩm nổi bật
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 p-6 pt-4 border-t bg-muted/30">
                          <div className="flex gap-2 justify-end">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsProductDialogOpen(false)}
                            >
                              Hủy
                            </Button>
                            <Button type="submit">
                              {editingProduct ? "Cập nhật" : "Thêm mới"}
                            </Button>
                          </div>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto rounded-md border max-h-[600px] overflow-y-auto">
                  <Table className="min-w-[800px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tên sản ph���m</TableHead>
                        <TableHead>Giá</TableHead>
                        <TableHead>Xuất xứ</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Ngày tạo</TableHead>
                        <TableHead>Hành động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center text-muted-foreground"
                          >
                            Chưa có sản phẩm nào
                          </TableCell>
                        </TableRow>
                      ) : (
                        products.map((product) => (
                          <TableRow key={product.ProductID}>
                            <TableCell className="font-medium">
                              {product.Name}
                            </TableCell>
                            <TableCell>
                              {product.Price.toLocaleString("vi-VN")}đ
                            </TableCell>
                            <TableCell>
                              {product.Origin || "Việt Nam"}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  product.Status === "Còn hàng"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {product.Status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                              {new Date(product.CreatedAt).toLocaleDateString(
                                "vi-VN"
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingProduct(product);
                                    setSelectedCategory(
                                      product.category?.CategoryID || null
                                    );
                                    setSelectedTags(
                                      product.Tags?.map((t) => t.TagID) || []
                                    );
                                    setIsFeatured(product.IsFeatured || false);

                                    // Load media cũ làm preview (không cần file, chỉ URL)
                                    if (
                                      product.Media &&
                                      product.Media.length > 0
                                    ) {
                                      setProductMediaPreviews(
                                        product.Media.map((m) => m.url)
                                      );
                                    } else {
                                      setProductMediaPreviews([]);
                                    }
                                    setProductMediaFiles([]); // File mới = rỗng
                                    setIsProductDialogOpen(true);
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    setItemToDelete({
                                      type: "product",
                                      id: product.ProductID,
                                    });
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Danh mục sản phẩm</CardTitle>
                    <CardDescription>Quản lý danh mục sản phẩm</CardDescription>
                  </div>
                  <Dialog
                    open={isCategoryDialogOpen}
                    onOpenChange={setIsCategoryDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button onClick={() => setEditingCategory(null)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm danh mục
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingCategory
                            ? "Chỉnh sửa danh mục"
                            : "Thêm danh mục mới"}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSaveCategory} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cat-name">Tên danh mục *</Label>
                          <Input
                            id="cat-name"
                            name="Name"
                            defaultValue={editingCategory?.Name || ""}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cat-description">Mô tả</Label>
                          <Textarea
                            id="cat-description"
                            name="description"
                            rows={3}
                            defaultValue={editingCategory?.Description || ""}
                          />
                        </div>
                        <DialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsCategoryDialogOpen(false)}
                          >
                            Hủy
                          </Button>
                          <Button type="submit">
                            {editingCategory ? "Cập nhật" : "Thêm mới"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto rounded-md border max-h-[600px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tên danh mục</TableHead>
                        <TableHead>Mô tả</TableHead>
                        <TableHead>Hành động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-center text-muted-foreground"
                          >
                            Chưa có danh mục nào
                          </TableCell>
                        </TableRow>
                      ) : (
                        categories.map((category) => (
                          <TableRow key={category.CategoryID}>
                            <TableCell className="font-medium">
                              {category.Name}
                            </TableCell>
                            <TableCell>{category.Description}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingCategory(category);
                                    setIsCategoryDialogOpen(true);
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    setItemToDelete({
                                      type: "category",
                                      id: category.CategoryID,
                                    });
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* News Tab - Simplified version */}
          <TabsContent value="news">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Quản lý bài viết</CardTitle>
                    <CardDescription>Danh sách tất cả bài viết</CardDescription>
                  </div>
                  <Button
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700"
                    onClick={() => {
                      setEditingNews(null);
                      setNewsImagePreview("");
                      setNewsImageFile(null);
                      setSelectedNewsCategory("");
                      setIsNewsDialogOpen(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm bài viết
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto rounded-md border max-h-[600px] overflow-y-auto">
                  <Table className="min-w-[600px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tiêu đề</TableHead>
                        <TableHead>Danh mục</TableHead>
                        <TableHead>Lượt xem</TableHead>
                        <TableHead>Ngày tạo</TableHead>
                        <TableHead>Hành động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {news.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center text-muted-foreground"
                          >
                            Chưa có bài viết nào
                          </TableCell>
                        </TableRow>
                      ) : (
                        news.map((article) => (
                          <TableRow key={article.NewsID}>
                            <TableCell className="font-medium">
                              {article.Title}
                            </TableCell>
                            <TableCell>
                              {article.Category || "Chưa phân loại"}
                            </TableCell>
                            <TableCell>{article.ViewCount}</TableCell>
                            <TableCell className="text-sm">
                              {new Date(article.CreatedAt).toLocaleDateString(
                                "vi-VN"
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingNews(article);
                                    setNewsImagePreview(article.Image || "");
                                    setNewsImageFile(null); // Reset file khi edit
                                    setIsNewsDialogOpen(true);
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    setItemToDelete({
                                      type: "news",
                                      id: article.NewsID,
                                    });
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* News Categories Tab */}
          <TabsContent value="news-categories">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Danh mục bài viết</CardTitle>
                    <CardDescription>Quản lý danh mục bài viết</CardDescription>
                  </div>
                  <Button
                    onClick={() => {
                      setEditingNewsCategory(null);
                      setIsNewsCategoryDialogOpen(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm danh mục
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto rounded-md border max-h-[600px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tên danh mục</TableHead>
                        <TableHead>Mô tả</TableHead>
                        <TableHead>Hành động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {newsCategories.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-center text-muted-foreground"
                          >
                            Chưa có danh mục nào
                          </TableCell>
                        </TableRow>
                      ) : (
                        newsCategories.map((category) => (
                          <TableRow key={category.CategoryID}>
                            <TableCell className="font-medium">
                              {category.Name}
                            </TableCell>
                            <TableCell>{category.Description}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingNewsCategory(category);
                                    setIsNewsCategoryDialogOpen(true);
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    setItemToDelete({
                                      type: "news-category",
                                      id: category.CategoryID,
                                    });
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý đánh giá</CardTitle>
                <CardDescription>
                  Danh sách tất cả đánh giá từ khách hàng
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto rounded-md border max-h-[600px] overflow-y-auto">
                  <Table className="min-w-[600px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Khách hàng</TableHead>
                        <TableHead>Đánh giá</TableHead>
                        <TableHead>Nội dung</TableHead>
                        <TableHead>Ngày</TableHead>
                        <TableHead>Hành động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviews.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center text-muted-foreground"
                          >
                            Chưa có đánh giá nào
                          </TableCell>
                        </TableRow>
                      ) : (
                        reviews.map((review) => (
                          <TableRow key={review.ReviewID}>
                            <TableCell>
                              <div className="font-medium">
                                {review.CustomerName}
                              </div>
                              {review.Purchased && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs mt-1"
                                >
                                  Đã mua
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < (review.Rating || 0)
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {review.Comment}
                            </TableCell>
                            <TableCell className="text-sm">
                              {new Date(review.ReviewDate).toLocaleDateString(
                                "vi-VN"
                              )}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setItemToDelete({
                                    type: "review",
                                    id: review.ReviewID,
                                  });
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý liên hệ</CardTitle>
                <CardDescription>
                  Danh sách liên hệ từ khách hàng
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto rounded-md border max-h-[600px] overflow-y-auto">
                  <Table className="min-w-[800px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Họ tên</TableHead>
                        <TableHead>SĐT</TableHead>
                        <TableHead>Sản phẩm quan tâm</TableHead>
                        <TableHead>Tin nhắn</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Ngày</TableHead>
                        <TableHead>Hành động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contacts.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center text-muted-foreground"
                          >
                            Chưa có liên hệ nào
                          </TableCell>
                        </TableRow>
                      ) : (
                        contacts.map((contact) => (
                          <TableRow key={contact.ContactID}>
                            <TableCell className="font-medium">
                              {contact.FirstName} {contact.LastName}
                            </TableCell>
                            <TableCell>{contact.Phone}</TableCell>
                            <TableCell>{contact.InterestedProduct}</TableCell>
                            <TableCell className="max-w-xs truncate">
                              {contact.Message}
                            </TableCell>
                            <TableCell>
                              <Select
                                value={contact.Status}
                                onValueChange={(value) =>
                                  handleUpdateContactStatus(
                                    contact.ContactID,
                                    value as any
                                  )
                                }
                              >
                                <SelectTrigger className="w-[120px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="new">
                                    <Badge
                                      variant="outline"
                                      className="bg-blue-100 text-blue-800"
                                    >
                                      Mới
                                    </Badge>
                                  </SelectItem>
                                  <SelectItem value="read">
                                    <Badge
                                      variant="outline"
                                      className="bg-yellow-100 text-yellow-800"
                                    >
                                      Đã đọc
                                    </Badge>
                                  </SelectItem>
                                  <SelectItem value="replied">
                                    <Badge
                                      variant="outline"
                                      className="bg-green-100 text-green-800"
                                    >
                                      Đã phản hồi
                                    </Badge>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-sm">
                              {new Date(contact.CreatedAt).toLocaleDateString(
                                "vi-VN"
                              )}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setItemToDelete({
                                    type: "contact",
                                    id: contact.ContactID,
                                  });
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa mục này? Hành động này không thể hoàn
              tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* News Dialog */}
      <Dialog open={isNewsDialogOpen} onOpenChange={setIsNewsDialogOpen}>
        <DialogContent className="w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col p-0">
          <div className="flex-shrink-0 p-6 pb-2">
            <DialogHeader>
              <DialogTitle>
                {editingNews ? "Sửa bài viết" : "Thêm bài viết mới"}
              </DialogTitle>
              <DialogDescription>
                Điền thông tin bài viết vào form bên dưới
              </DialogDescription>
            </DialogHeader>
          </div>
          <form
            onSubmit={handleSaveNews}
            className="flex flex-col flex-1 min-h-0"
          >
            <div className="flex-1 overflow-y-auto px-6">
              <div className="space-y-4 pb-4">
                <div className="space-y-2 min-w-0">
                  <Label htmlFor="title">Tiêu đề *</Label>
                  <Input
                    id="title"
                    name="Title"
                    defaultValue={editingNews?.Title || ""}
                    required
                    className="w-full max-w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 items-start min-w-0">
                  <div className="space-y-2 min-w-0">
                    <Label htmlFor="author">Tác giả *</Label>
                    <Input
                      id="author"
                      name="Author"
                      defaultValue="Sen Việt"
                      required
                      className="w-full max-w-full"
                    />
                  </div>
                  <div className="space-y-2 min-w-0">
                    <Label htmlFor="newsCategory">Danh mục</Label>
                    <select
                      id="newsCategory"
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={
                        selectedNewsCategory || editingNews?.Category || ""
                      }
                      onChange={(e) => setSelectedNewsCategory(e.target.value)}
                    >
                      <option value="">Chọn danh mục</option>
                      {newsCategories.map((cat) => (
                        <option key={cat.CategoryID} value={cat.Name}>
                          {cat.Name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2 min-w-0">
                  <Label htmlFor="newsImage">Hình ảnh bài viết *</Label>
                  <Input
                    id="newsImage"
                    type="file"
                    accept="image/*"
                    onChange={handleNewsImageChange}
                    required={!editingNews}
                    className="w-full max-w-full"
                  />
                  {(newsImagePreview || editingNews?.Image) && (
                    <div className="mt-2">
                      <img
                        src={newsImagePreview || editingNews?.Image}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-2 min-w-0">
                  <Label htmlFor="excerpt">Mô tả ngắn *</Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    rows={2}
                    defaultValue=""
                    required
                    className="w-full max-w-full"
                  />
                </div>
                <div className="space-y-2 min-w-0">
                  <Label htmlFor="content">Nội dung chi tiết *</Label>
                  <Textarea
                    id="content"
                    name="content"
                    rows={8}
                    defaultValue={editingNews?.Content || ""}
                    required
                    className="w-full max-w-full"
                  />
                </div>
                <div className="space-y-2 min-w-0">
                  <Label htmlFor="tags">Tags (phân cách bởi dấu phẩy)</Label>
                  <Input
                    id="tags"
                    name="tags"
                    defaultValue={editingNews?.Tags || ""}
                    placeholder="sen, hoa sen, tươi mát"
                    className="w-full max-w-full"
                  />
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 p-6 pt-4 border-t bg-muted/30">
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeNewsDialog}
                >
                  Hủy
                </Button>
                <Button type="submit">
                  {editingNews ? "Cập nhật" : "Thêm mới"}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* News Category Dialog */}
      <Dialog
        open={isNewsCategoryDialogOpen}
        onOpenChange={setIsNewsCategoryDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingNewsCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
            </DialogTitle>
            <DialogDescription>
              Quản lý danh mục bài viết tin tức
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveNewsCategory} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="news-cat-name">Tên danh mục *</Label>
              <Input
                id="news-cat-name"
                name="name"
                defaultValue={editingNewsCategory?.Name || ""}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="news-cat-description">Mô tả</Label>
              <Textarea
                id="news-cat-description"
                name="description"
                rows={3}
                defaultValue={editingNewsCategory?.Description || ""}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsNewsCategoryDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button type="submit">
                {editingNewsCategory ? "Cập nhật" : "Thêm mới"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

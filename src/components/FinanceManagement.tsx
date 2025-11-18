import { useState } from "react";
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
  DialogFooter,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { toast } from "sonner";
import {
  Calendar as CalendarIcon,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  RefreshCw,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { useData, Transaction, OrderSchedule } from "./DataContext";
import { useIsMobile } from "./ui/use-mobile";

interface FinanceManagementAPIProps {
  orders: any[];
}

export function FinanceManagement({ orders }: FinanceManagementAPIProps) {
  const isMobile = useIsMobile();

  // ============================================
  // DATA CONTEXT & API
  // ============================================
  const {
    transactions,
    orderSchedules,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addOrderSchedule,
    updateOrderSchedule,
    deleteOrderSchedule,
  } = useData();

  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<OrderSchedule | null>(
    null
  );

  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  // Filter states
  const [scheduleFilter, setScheduleFilter] = useState<"day" | "week">("week"); // ✅ Changed from 'day' to 'week'
  const [transactionFilter, setTransactionFilter] = useState<
    "day" | "week" | "all"
  >("all"); // ✅ Default to 'all'
  const [statsFilter, setStatsFilter] = useState<
    "day" | "week" | "month" | "all"
  >("all"); // ✅ Add 'all' and default to it

  // Loading states
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ============================================
  // CONTROLLED FORM STATE
  // ============================================
  const [scheduleFormData, setScheduleFormData] = useState<{
    orderId: string;
    orderNumber: string;
    customerName: string;
    productName: string;
    scheduledDate: string;
    scheduledTime: string;
    status: "pending" | "confirmed" | "completed" | "cancelled";
    note: string;
  }>({
    orderId: "",
    orderNumber: "",
    customerName: "",
    productName: "",
    scheduledDate: "",
    scheduledTime: "",
    status: "pending",
    note: "",
  });

  const [transactionFormData, setTransactionFormData] = useState({
    type: "income" as const,
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "cash" as const,
  });

  // ============================================
  // SCHEDULE MANAGEMENT
  // ============================================

  const handleSaveSchedule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // ✅ Use state instead of FormData
      const scheduleData: OrderSchedule = {
        id: editingSchedule?.id || "",
        orderId: scheduleFormData.orderId,
        orderNumber: scheduleFormData.orderNumber,
        customerName: scheduleFormData.customerName,
        productName: scheduleFormData.productName,
        scheduledDate: scheduleFormData.scheduledDate,
        scheduledTime: scheduleFormData.scheduledTime || undefined,
        status: scheduleFormData.status,
        note: scheduleFormData.note || undefined,
      };

      if (editingSchedule) {
        // Update existing schedule
        await updateOrderSchedule(editingSchedule.id, scheduleData);
        toast.success("Cập nhật lịch thành công!");
      } else {
        // Create new schedule
        await addOrderSchedule(scheduleData);
        toast.success("Thêm lịch thành công!");
      }

      setIsScheduleDialogOpen(false);
      setEditingSchedule(null);
      // ✅ Reset form after save
      setScheduleFormData({
        orderId: "",
        orderNumber: "",
        customerName: "",
        productName: "",
        scheduledDate: "",
        scheduledTime: "",
        status: "pending",
        note: "",
      });
    } catch (error: any) {
      console.error("Error saving schedule:", error);
      toast.error(error.message || "Có lỗi xảy ra khi lưu lịch");
    }
  };

  const handleEditSchedule = (schedule: OrderSchedule) => {
    setEditingSchedule(schedule);
    // ✅ Fill form data when editing
    setScheduleFormData({
      orderId: schedule.orderId,
      orderNumber: schedule.orderNumber,
      customerName: schedule.customerName,
      productName: schedule.productName,
      scheduledDate: schedule.scheduledDate,
      scheduledTime: schedule.scheduledTime || "",
      status: schedule.status,
      note: schedule.note || "",
    });
    setIsScheduleDialogOpen(true);
  };

  const handleDeleteSchedule = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa lịch này?")) return;

    try {
      await deleteOrderSchedule(id);
      toast.success("Xóa lịch thành công!");
    } catch (error: any) {
      console.error("Error deleting schedule:", error);
      toast.error(error.message || "Có lỗi xảy ra khi xóa lịch");
    }
  };

  // Filter schedules by day/week
  const getFilteredSchedules = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return orderSchedules.filter((schedule) => {
      const scheduleDate = new Date(schedule.scheduledDate);

      if (scheduleFilter === "day") {
        return scheduleDate.toDateString() === today.toDateString();
      } else {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        return scheduleDate >= weekStart && scheduleDate <= weekEnd;
      }
    });
  };

  // ============================================
  // TRANSACTION MANAGEMENT
  // ============================================

  const handleSaveTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const transactionData: Transaction = {
        id: editingTransaction?.id || "",
        type: formData.get("type") as "income" | "expense",
        category: formData.get("category") as string,
        amount: parseFloat(formData.get("amount") as string),
        description: (formData.get("description") as string) || "",
        date: formData.get("date") as string,
        orderId: (formData.get("orderId") as string) || undefined,
      };

      if (editingTransaction) {
        // Update existing transaction
        await updateTransaction(editingTransaction.id, transactionData);
        toast.success("Cập nhật giao dịch thành công!");
      } else {
        // Create new transaction
        await addTransaction(transactionData);
        toast.success("Thêm giao dịch thành công!");
      }

      setIsTransactionDialogOpen(false);
      setEditingTransaction(null);
    } catch (error: any) {
      console.error("Error saving transaction:", error);
      toast.error(error.message || "Có lỗi xảy ra khi lưu giao dịch");
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsTransactionDialogOpen(true);
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa giao dịch này?")) return;

    try {
      await deleteTransaction(id);
      toast.success("Xóa giao dịch thành công!");
    } catch (error: any) {
      console.error("Error deleting transaction:", error);
      toast.error(error.message || "Có lỗi xảy ra khi xóa giao dịch");
    }
  };

  // Filter transactions by day/week
  const getFilteredTransactions = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);

      if (transactionFilter === "day") {
        return transactionDate.toDateString() === today.toDateString();
      } else if (transactionFilter === "week") {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        return transactionDate >= weekStart && transactionDate <= weekEnd;
      } else {
        return true; // 'all' - show all transactions
      }
    });
  };

  // ============================================
  // STATISTICS CALCULATIONS
  // ============================================

  const getStatistics = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let filteredTransactions = transactions;

    if (statsFilter === "day") {
      filteredTransactions = transactions.filter((t) => {
        const tDate = new Date(t.date);
        return tDate.toDateString() === today.toDateString();
      });
    } else if (statsFilter === "week") {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      filteredTransactions = transactions.filter((t) => {
        const tDate = new Date(t.date);
        return tDate >= weekStart && tDate <= weekEnd;
      });
    } else if (statsFilter === "month") {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      filteredTransactions = transactions.filter((t) => {
        const tDate = new Date(t.date);
        return tDate >= monthStart && tDate <= monthEnd;
      });
    } else {
      // 'all' - show all transactions
    }

    const income = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const profit = income - expense;

    // Category breakdown
    const categoryStats: Record<string, number> = {};
    filteredTransactions.forEach((t) => {
      if (!categoryStats[t.category]) {
        categoryStats[t.category] = 0;
      }
      categoryStats[t.category] += t.type === "income" ? t.amount : -t.amount;
    });

    return {
      income,
      expense,
      profit,
      transactionCount: filteredTransactions.length,
      categories: categoryStats,
    };
  };

  const stats = getStatistics();

  // ============================================
  // DEBUG: Console log transactions and stats
  // ============================================
  console.log("🔍 [FinanceManagement] Transactions:", transactions);
  console.log("🔍 [FinanceManagement] Stats Filter:", statsFilter);
  console.log("🔍 [FinanceManagement] Calculated Stats:", stats);

  // ============================================
  // REFRESH DATA
  // ============================================

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Data sẽ tự động refresh qua DataContext
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("Đã làm mới dữ liệu!");
    } catch (error) {
      toast.error("Không thể làm mới dữ liệu");
    } finally {
      setIsRefreshing(false);
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-4">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              Thu nhập
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.income.toLocaleString("vi-VN")}đ
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {statsFilter === "day"
                ? "Hôm nay"
                : statsFilter === "week"
                ? "Tuần này"
                : statsFilter === "month"
                ? "Tháng này"
                : "Tất cả"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              Chi phí
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.expense.toLocaleString("vi-VN")}đ
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {statsFilter === "day"
                ? "Hôm nay"
                : statsFilter === "week"
                ? "Tuần này"
                : statsFilter === "month"
                ? "Tháng này"
                : "Tất cả"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              Lợi nhuận
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                stats.profit >= 0 ? "text-primary" : "text-red-600"
              }`}
            >
              {stats.profit.toLocaleString("vi-VN")}đ
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {statsFilter === "day"
                ? "Hôm nay"
                : statsFilter === "week"
                ? "Tuần này"
                : statsFilter === "month"
                ? "Tháng này"
                : "Tất cả"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Giao dịch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.transactionCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {statsFilter === "day"
                ? "Hôm nay"
                : statsFilter === "week"
                ? "Tuần này"
                : statsFilter === "month"
                ? "Tháng này"
                : "Tất cả"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="schedule" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList
            className={`grid ${
              isMobile ? "grid-cols-3 gap-1" : "grid-cols-3 gap-2"
            }`}
          >
            <TabsTrigger
              value="schedule"
              className={isMobile ? "gap-1 px-2 py-2 text-xs" : "gap-2"}
            >
              <CalendarIcon className={isMobile ? "w-3 h-3" : "w-4 h-4"} />
              {!isMobile ? "Lịch đơn hàng" : "Lịch"}
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className={isMobile ? "gap-1 px-2 py-2 text-xs" : "gap-2"}
            >
              <DollarSign className={isMobile ? "w-3 h-3" : "w-4 h-4"} />
              {!isMobile ? "Thu/Chi" : "T/C"}
            </TabsTrigger>
            <TabsTrigger
              value="statistics"
              className={isMobile ? "gap-1 px-2 py-2 text-xs" : "gap-2"}
            >
              <PieChart className={isMobile ? "w-3 h-3" : "w-4 h-4"} />
              {!isMobile ? "Thống kê" : "TK"}
            </TabsTrigger>
          </TabsList>

          <Button
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {!isMobile && <span className="ml-2">Làm mới</span>}
          </Button>
        </div>

        {/* ============================================ */}
        {/* TAB 1: SCHEDULE (LỊCH ĐƠN HÀNG) */}
        {/* ============================================ */}
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle>Lịch đơn hàng</CardTitle>
                  <CardDescription>
                    Lên lịch giao hàng cho các đơn hàng ({orderSchedules.length}{" "}
                    lịch)
                  </CardDescription>
                </div>
                <div className="flex gap-2 items-center">
                  <Select
                    value={scheduleFilter}
                    onValueChange={(v: any) => setScheduleFilter(v)}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Hôm nay</SelectItem>
                      <SelectItem value="week">Tuần này</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingSchedule(null);
                      // ✅ Reset form when adding new schedule
                      setScheduleFormData({
                        orderId: "",
                        orderNumber: "",
                        customerName: "",
                        productName: "",
                        scheduledDate: "",
                        scheduledTime: "",
                        status: "pending",
                        note: "",
                      });
                      setIsScheduleDialogOpen(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm lịch
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto rounded-md border max-h-[500px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã đơn</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead>Ngày</TableHead>
                      <TableHead>Giờ</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ghi chú</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredSchedules().length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center py-8 text-muted-foreground"
                        >
                          Không có lịch nào{" "}
                          {scheduleFilter === "day" ? "hôm nay" : "tuần này"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      getFilteredSchedules().map((schedule) => (
                        <TableRow key={schedule.id}>
                          <TableCell className="font-medium">
                            {schedule.orderNumber}
                          </TableCell>
                          <TableCell>{schedule.customerName}</TableCell>
                          <TableCell>{schedule.productName}</TableCell>
                          <TableCell>
                            {new Date(
                              schedule.scheduledDate
                            ).toLocaleDateString("vi-VN")}
                          </TableCell>
                          <TableCell>
                            {schedule.scheduledTime || "--:--"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                schedule.status === "completed"
                                  ? "default"
                                  : schedule.status === "cancelled"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {schedule.status === "pending" && "⏳ Chờ"}
                              {schedule.status === "confirmed" && "✓ Xác nhận"}
                              {schedule.status === "completed" &&
                                "✓ Hoàn thành"}
                              {schedule.status === "cancelled" && "✗ Hủy"}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {schedule.note || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditSchedule(schedule)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  handleDeleteSchedule(schedule.id)
                                }
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
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

        {/* ============================================ */}
        {/* TAB 2: TRANSACTIONS (THU/CHI) */}
        {/* ============================================ */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle>Thu/Chi</CardTitle>
                  <CardDescription>
                    Quản lý các giao dịch thu chi ({transactions.length} giao
                    dịch)
                  </CardDescription>
                </div>
                <div className="flex gap-2 items-center">
                  <Select
                    value={transactionFilter}
                    onValueChange={(v: any) => setTransactionFilter(v)}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Hôm nay</SelectItem>
                      <SelectItem value="week">Tuần này</SelectItem>
                      <SelectItem value="all">Tất cả</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingTransaction(null);
                      setIsTransactionDialogOpen(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm giao dịch
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto rounded-md border max-h-[500px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Loại</TableHead>
                      <TableHead>Danh mục</TableHead>
                      <TableHead>Số tiền</TableHead>
                      <TableHead>Mô tả</TableHead>
                      <TableHead>Ngày</TableHead>
                      <TableHead>Mã đơn</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredTransactions().length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-8 text-muted-foreground"
                        >
                          Không có giao dịch nào{" "}
                          {transactionFilter === "day" ? "hôm nay" : "tuần này"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      getFilteredTransactions().map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            <Badge
                              variant={
                                transaction.type === "income"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {transaction.type === "income" ? (
                                <>
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                  Thu
                                </>
                              ) : (
                                <>
                                  <TrendingDown className="w-3 h-3 mr-1" />
                                  Chi
                                </>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>{transaction.category}</TableCell>
                          <TableCell
                            className={
                              transaction.type === "income"
                                ? "text-green-600 font-semibold"
                                : "text-red-600 font-semibold"
                            }
                          >
                            {transaction.type === "income" ? "+" : "-"}
                            {transaction.amount.toLocaleString("vi-VN")}đ
                          </TableCell>
                          <TableCell className="max-w-[250px] truncate">
                            {transaction.description || "-"}
                          </TableCell>
                          <TableCell>
                            {new Date(transaction.date).toLocaleDateString(
                              "vi-VN"
                            )}
                          </TableCell>
                          <TableCell>{transaction.orderId || "-"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  handleEditTransaction(transaction)
                                }
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  handleDeleteTransaction(transaction.id)
                                }
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
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

        {/* ============================================ */}
        {/* TAB 3: STATISTICS (THỐNG KÊ) */}
        {/* ============================================ */}
        <TabsContent value="statistics">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle>Thống kê chi tiêu</CardTitle>
                  <CardDescription>
                    Tổng quan về thu chi và lợi nhuận
                  </CardDescription>
                </div>
                <Select
                  value={statsFilter}
                  onValueChange={(v: any) => setStatsFilter(v)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Hôm nay</SelectItem>
                    <SelectItem value="week">Tuần này</SelectItem>
                    <SelectItem value="month">Tháng này</SelectItem>
                    <SelectItem value="all">Tất cả</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Tổng thu
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          {stats.income.toLocaleString("vi-VN")}đ
                        </p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Tổng chi
                        </p>
                        <p className="text-2xl font-bold text-red-600">
                          {stats.expense.toLocaleString("vi-VN")}đ
                        </p>
                      </div>
                      <TrendingDown className="w-8 h-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`border-primary/20 ${
                    stats.profit >= 0 ? "bg-primary/5" : "bg-red-50"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Lợi nhuận
                        </p>
                        <p
                          className={`text-2xl font-bold ${
                            stats.profit >= 0 ? "text-primary" : "text-red-600"
                          }`}
                        >
                          {stats.profit.toLocaleString("vi-VN")}đ
                        </p>
                      </div>
                      <DollarSign
                        className={`w-8 h-8 ${
                          stats.profit >= 0 ? "text-primary" : "text-red-600"
                        }`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Category Breakdown */}
              <div>
                <h3 className="font-semibold mb-4">Phân tích theo danh mục</h3>
                <div className="space-y-3">
                  {Object.entries(stats.categories).length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Chưa có dữ liệu thống kê
                    </p>
                  ) : (
                    Object.entries(stats.categories)
                      .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
                      .map(([category, amount]) => (
                        <div
                          key={category}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                amount >= 0 ? "bg-green-100" : "bg-red-100"
                              }`}
                            >
                              {amount >= 0 ? (
                                <TrendingUp className="w-5 h-5 text-green-600" />
                              ) : (
                                <TrendingDown className="w-5 h-5 text-red-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{category}</p>
                              <p className="text-sm text-muted-foreground">
                                {statsFilter === "day"
                                  ? "Hôm nay"
                                  : statsFilter === "week"
                                  ? "Tuần này"
                                  : statsFilter === "month"
                                  ? "Tháng này"
                                  : "Tất cả"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`text-lg font-bold ${
                                amount >= 0 ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {amount >= 0 ? "+" : ""}
                              {amount.toLocaleString("vi-VN")}đ
                            </p>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ============================================ */}
      {/* DIALOG: ADD/EDIT SCHEDULE */}
      {/* ============================================ */}
      <Dialog
        open={isScheduleDialogOpen}
        onOpenChange={setIsScheduleDialogOpen}
      >
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSchedule ? "Sửa lịch" : "Thêm lịch mới"}
            </DialogTitle>
            <DialogDescription>
              {editingSchedule
                ? "Cập nhật thông tin lịch giao h��ng"
                : "Tạo lịch giao hàng cho đơn hàng"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveSchedule}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orderId">ID Đơn hàng *</Label>
                  <Select
                    value={scheduleFormData.orderId}
                    onValueChange={(value) => {
                      // Find order to auto-fill
                      const order = orders.find(
                        (o) => String(o.OrderID || o.id) === value
                      );
                      if (order) {
                        setScheduleFormData({
                          ...scheduleFormData,
                          orderId: value,
                          orderNumber: `ORD-${String(
                            order.OrderID || order.id
                          ).padStart(5, "0")}`,
                          customerName:
                            order.CustomerName || order.customerName || "",
                          productName:
                            order.Product?.Name || order.productName || "",
                        });
                      } else {
                        setScheduleFormData({
                          ...scheduleFormData,
                          orderId: value,
                        });
                      }
                    }}
                  >
                    <SelectTrigger id="orderId">
                      <SelectValue placeholder="Chọn đơn hàng" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {orders && orders.length > 0 ? (
                        orders.map((order) => (
                          <SelectItem
                            key={order.OrderID || order.id}
                            value={String(order.OrderID || order.id)}
                            className="max-w-[400px]"
                          >
                            <div className="truncate">
                              ORD-
                              {String(order.OrderID || order.id).padStart(
                                5,
                                "0"
                              )}{" "}
                              - {order.CustomerName || order.customerName}
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="manual" disabled>
                          Không có đơn hàng
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orderNumber">Số đơn</Label>
                  <Input
                    id="orderNumber"
                    value={scheduleFormData.orderNumber}
                    onChange={(e) =>
                      setScheduleFormData({
                        ...scheduleFormData,
                        orderNumber: e.target.value,
                      })
                    }
                    placeholder="ORD-00001"
                    readOnly
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerName">Tên khách hàng</Label>
                <Input
                  id="customerName"
                  value={scheduleFormData.customerName}
                  onChange={(e) =>
                    setScheduleFormData({
                      ...scheduleFormData,
                      customerName: e.target.value,
                    })
                  }
                  placeholder="Tự động điền khi chọn đơn hàng"
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productName">Sản phẩm</Label>
                <Input
                  id="productName"
                  value={scheduleFormData.productName}
                  onChange={(e) =>
                    setScheduleFormData({
                      ...scheduleFormData,
                      productName: e.target.value,
                    })
                  }
                  placeholder="Tự động điền khi chọn đơn hàng"
                  readOnly
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduledDate">Ngày giao *</Label>
                  <Input
                    id="scheduledDate"
                    type="date"
                    value={scheduleFormData.scheduledDate}
                    onChange={(e) =>
                      setScheduleFormData({
                        ...scheduleFormData,
                        scheduledDate: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduledTime">Giờ giao</Label>
                  <Input
                    id="scheduledTime"
                    type="time"
                    value={scheduleFormData.scheduledTime}
                    onChange={(e) =>
                      setScheduleFormData({
                        ...scheduleFormData,
                        scheduledTime: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select
                  value={scheduleFormData.status}
                  onValueChange={(value: any) =>
                    setScheduleFormData({ ...scheduleFormData, status: value })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="pending">⏳ Chờ xác nhận</SelectItem>
                    <SelectItem value="confirmed">✓ Đã xác nhận</SelectItem>
                    <SelectItem value="completed">✓ Hoàn thành</SelectItem>
                    <SelectItem value="cancelled">✗ Hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Ghi chú</Label>
                <Textarea
                  id="note"
                  rows={3}
                  value={scheduleFormData.note}
                  onChange={(e) =>
                    setScheduleFormData({
                      ...scheduleFormData,
                      note: e.target.value,
                    })
                  }
                  placeholder="Ghi chú thêm..."
                />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsScheduleDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button type="submit">
                {editingSchedule ? "Cập nhật" : "Thêm mới"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ============================================ */}
      {/* DIALOG: ADD/EDIT TRANSACTION */}
      {/* ============================================ */}
      <Dialog
        open={isTransactionDialogOpen}
        onOpenChange={setIsTransactionDialogOpen}
      >
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTransaction ? "Sửa giao dịch" : "Thêm giao dịch mới"}
            </DialogTitle>
            <DialogDescription>
              {editingTransaction
                ? "Cập nhật thông tin giao dịch"
                : "Tạo giao dịch thu/chi mới"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveTransaction}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Loại giao dịch *</Label>
                <Select
                  name="type"
                  defaultValue={editingTransaction?.type || "income"}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        Thu nhập
                      </div>
                    </SelectItem>
                    <SelectItem value="expense">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-red-600" />
                        Chi phí
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Danh mục *</Label>
                <Input
                  id="category"
                  name="category"
                  defaultValue={editingTransaction?.category}
                  placeholder="Vd: Bán hàng, Vận chuyển, Lương nhân viên..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Số tiền (VNĐ) *</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="1000"
                  defaultValue={editingTransaction?.amount}
                  placeholder="500000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={2}
                  defaultValue={editingTransaction?.description}
                  placeholder="Mô tả chi tiết giao dịch..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Ngày giao dịch *</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  defaultValue={editingTransaction?.date}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="orderId">ID Đơn hàng (tùy chọn)</Label>
                <Input
                  id="orderId"
                  name="orderId"
                  defaultValue={editingTransaction?.orderId}
                  placeholder="Nhập ID đơn hàng nếu có liên quan"
                />
                <p className="text-xs text-muted-foreground">
                  Để trống nếu giao dịch không liên quan đến đơn hàng
                </p>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsTransactionDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button type="submit">
                {editingTransaction ? "Cập nhật" : "Thêm mới"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

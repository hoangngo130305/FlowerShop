import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import {
  Calendar as CalendarIcon,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Transaction, OrderSchedule, useData } from './DataContext';
import { useIsMobile } from './ui/use-mobile';

// ============================================
// INTERNAL STATS COMPONENT
// ============================================
interface StatsProps {
  stats: {
    income: number;
    expense: number;
    debt: number;
    profit: number;
    transactionCount: number;
  };
  statsFilter: 'day' | 'week' | 'month';
  setStatsFilter: (value: 'day' | 'week' | 'month') => void;
}

function FinanceManagementStats({ stats, statsFilter, setStatsFilter }: StatsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle>Thống kê tài chính</CardTitle>
            <CardDescription>
              {statsFilter === 'day' ? 'Hôm nay' : statsFilter === 'week' ? 'Tuần này' : 'Tháng này'}
            </CardDescription>
          </div>
          <Select value={statsFilter} onValueChange={(v: any) => setStatsFilter(v)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Hôm nay</SelectItem>
              <SelectItem value="week">Tuần này</SelectItem>
              <SelectItem value="month">Tháng này</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Đơn hàng */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <PieChart className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Đơn hàng</p>
              <p className="text-3xl font-bold">{stats.transactionCount}</p>
            </CardContent>
          </Card>

          {/* Tổng thu */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Tổng thu</p>
              <p className="text-3xl font-bold text-green-600">
                {stats.income.toLocaleString('vi-VN')}
              </p>
            </CardContent>
          </Card>

          {/* Tổng chi */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Tổng chi</p>
              <p className="text-3xl font-bold text-red-600">
                {stats.expense.toLocaleString('vi-VN')}
              </p>
            </CardContent>
          </Card>

          {/* Tổng nợ */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Tổng nợ</p>
              <p className="text-3xl font-bold text-orange-600">
                {stats.debt.toLocaleString('vi-VN')}
              </p>
            </CardContent>
          </Card>

          {/* Lợi nhuận */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className={`w-5 h-5 ${stats.profit >= 0 ? 'text-primary' : 'text-red-600'}`} />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Lợi nhuận</p>
              <p className={`text-3xl font-bold ${stats.profit >= 0 ? 'text-primary' : 'text-red-600'}`}>
                {stats.profit.toLocaleString('vi-VN')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Summary Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Trung bình / đơn hàng</p>
            <p className="text-2xl font-bold">
              {stats.transactionCount > 0 ? (stats.income / stats.transactionCount).toLocaleString('vi-VN', { maximumFractionDigits: 0 }) : 0}đ
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Tỷ lệ lợi nhuận</p>
            <p className={`text-2xl font-bold ${stats.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {((stats.profit / (stats.income || 1)) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
interface FinanceManagementProps {
  orders: any[];
}

export function FinanceManagement({ orders }: FinanceManagementProps) {
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
  
  // ✅ DEBUG: Log data
  console.log('🔹 Finance Management - Transactions:', transactions);
  console.log('🔹 Finance Management - Order Schedules:', orderSchedules);
  
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  // Schedule states
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<OrderSchedule | null>(null);
  
  // Transaction states
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  
  // Filter states
  const [scheduleFilter, setScheduleFilter] = useState<'day' | 'tomorrow' | 'week'>('day');
  const [transactionFilter, setTransactionFilter] = useState<'day' | 'week' | 'month'>('day');
  const [statsFilter, setStatsFilter] = useState<'day' | 'week' | 'month'>('week');
  
  // Pagination states
  const [schedulePage, setSchedulePage] = useState(1);
  const [transactionPage, setTransactionPage] = useState(1);
  const itemsPerPage = 5;
  
  // ============================================
  // SCHEDULE MANAGEMENT
  // ============================================
  
  const handleSaveSchedule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const schedule: OrderSchedule = {
        id: editingSchedule?.id || Date.now().toString(),
        orderId: formData.get('orderId') as string || '',
        orderNumber: formData.get('orderNumber') as string || '',
        customerName: formData.get('customerName') as string,
        customerAddress: formData.get('customerAddress') as string,
        productName: formData.get('productName') as string,
        scheduledDate: formData.get('scheduledDate') as string,
        scheduledTime: formData.get('scheduledTime') as string,
        status: (formData.get('status') as any) || 'pending',
        note: formData.get('note') as string,
        createdAt: editingSchedule?.createdAt || new Date().toISOString(),
      };
      
      if (editingSchedule) {
        await updateOrderSchedule(editingSchedule.id, schedule);
        toast.success('Cập nhật lịch thành công!');
      } else {
        await addOrderSchedule(schedule);
        toast.success('Thêm lịch thành công!');
      }
      
      setIsScheduleDialogOpen(false);
      setEditingSchedule(null);
    } catch (error: any) {
      console.error('Error saving schedule:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi lưu lịch');
    }
  };
  
  const handleEditSchedule = (schedule: OrderSchedule) => {
    setEditingSchedule(schedule);
    setIsScheduleDialogOpen(true);
  };
  
  const handleDeleteSchedule = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa lịch này?')) return;
    
    try {
      await deleteOrderSchedule(id);
      toast.success('Xóa lịch thành công!');
    } catch (error: any) {
      console.error('Error deleting schedule:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi xóa lịch');
    }
  };
  
  // Filter schedules by day/week
  const getFilteredSchedules = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return orderSchedules.filter(schedule => {
      const scheduleDate = new Date(schedule.scheduledDate);
      
      if (scheduleFilter === 'day') {
        return scheduleDate.toDateString() === today.toDateString();
      } else if (scheduleFilter === 'tomorrow') {
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        return scheduleDate.toDateString() === tomorrow.toDateString();
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
      const transaction: Transaction = {
        id: editingTransaction?.id || Date.now().toString(),
        type: formData.get('type') as 'income' | 'expense' | 'debt',
        category: formData.get('category') as string,
        amount: parseFloat(formData.get('amount') as string),
        description: formData.get('description') as string,
        date: formData.get('date') as string,
        orderId: formData.get('orderId') as string || undefined,
        createdAt: editingTransaction?.createdAt || new Date().toISOString(),
      };
      
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, transaction);
        toast.success('Cập nhật giao dịch thành công!');
      } else {
        await addTransaction(transaction);
        toast.success('Thêm giao dịch thành công!');
      }
      
      setIsTransactionDialogOpen(false);
      setEditingTransaction(null);
    } catch (error: any) {
      console.error('Error saving transaction:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi lưu giao dịch');
    }
  };
  
  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsTransactionDialogOpen(true);
  };
  
  const handleDeleteTransaction = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa giao dịch này?')) return;
    
    try {
      await deleteTransaction(id);
      toast.success('Xóa giao dịch thành công!');
    } catch (error: any) {
      console.error('Error deleting transaction:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi xóa giao dịch');
    }
  };
  
  // Filter transactions by day/week
  const getFilteredTransactions = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      
      if (transactionFilter === 'day') {
        return transactionDate.toDateString() === today.toDateString();
      } else if (transactionFilter === 'week') {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        return transactionDate >= weekStart && transactionDate <= weekEnd;
      } else {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        
        return transactionDate >= monthStart && transactionDate <= monthEnd;
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
    
    if (statsFilter === 'day') {
      filteredTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.toDateString() === today.toDateString();
      });
    } else if (statsFilter === 'week') {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      filteredTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate >= weekStart && tDate <= weekEnd;
      });
    } else {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      filteredTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate >= monthStart && tDate <= monthEnd;
      });
    }
    
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const debt = filteredTransactions
      .filter(t => t.type === 'debt')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const profit = income - expense;
    
    return {
      income,
      expense,
      debt,
      profit,
      transactionCount: filteredTransactions.length,
    };
  };
  
  const stats = getStatistics();
  
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
              {stats.income.toLocaleString('vi-VN')}đ
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {statsFilter === 'day' ? 'Hôm nay' : statsFilter === 'week' ? 'Tuần này' : 'Tháng này'}
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
              {stats.expense.toLocaleString('vi-VN')}đ
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {statsFilter === 'day' ? 'Hôm nay' : statsFilter === 'week' ? 'Tuần này' : 'Tháng này'}
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
            <div className={`text-2xl font-bold ${stats.profit >= 0 ? 'text-primary' : 'text-red-600'}`}>
              {stats.profit.toLocaleString('vi-VN')}đ
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {statsFilter === 'day' ? 'Hôm nay' : statsFilter === 'week' ? 'Tuần này' : 'Tháng này'}
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
            <div className="text-2xl font-bold">
              {stats.transactionCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {statsFilter === 'day' ? 'Hôm nay' : statsFilter === 'week' ? 'Tuần này' : 'Tháng này'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Tabs */}
      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList className={`grid w-full ${isMobile ? 'grid-cols-3 gap-1' : 'grid-cols-3 gap-2'}`}>
          <TabsTrigger value="schedule" className={isMobile ? 'gap-1 px-2 py-2 text-xs' : 'gap-2'}>
            <CalendarIcon className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
            {!isMobile ? 'Lịch đơn hàng' : 'Lịch'}
          </TabsTrigger>
          <TabsTrigger value="transactions" className={isMobile ? 'gap-1 px-2 py-2 text-xs' : 'gap-2'}>
            <DollarSign className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
            {!isMobile ? 'Thu/Chi' : 'T/C'}
          </TabsTrigger>
          <TabsTrigger value="statistics" className={isMobile ? 'gap-1 px-2 py-2 text-xs' : 'gap-2'}>
            <PieChart className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
            {!isMobile ? 'Thống kê' : 'TK'}
          </TabsTrigger>
        </TabsList>
        
        {/* ============================================ */}
        {/* TAB 1: SCHEDULE (LỊCH ĐƠN HÀNG) */}
        {/* ============================================ */}
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle>Lịch đơn hàng</CardTitle>
                  <CardDescription>Lên lịch giao hàng cho các đơn hàng</CardDescription>
                </div>
                <div className="flex gap-2 items-center">
                  <Select value={scheduleFilter} onValueChange={(v: any) => setScheduleFilter(v)}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Hôm nay</SelectItem>
                      <SelectItem value="tomorrow">Ngày mai</SelectItem>
                      <SelectItem value="week">Tuần này</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingSchedule(null);
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
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Địa chỉ</TableHead>
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
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          Không có lịch nào {scheduleFilter === 'day' ? 'hôm nay' : scheduleFilter === 'tomorrow' ? 'ngày mai' : 'tuần này'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      getFilteredSchedules().slice((schedulePage - 1) * itemsPerPage, schedulePage * itemsPerPage).map((schedule) => (
                        <TableRow key={schedule.id}>
                          <TableCell className="font-medium">{schedule.customerName}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{schedule.customerAddress || '-'}</TableCell>
                          <TableCell>{schedule.productName}</TableCell>
                          <TableCell>{new Date(schedule.scheduledDate).toLocaleDateString('vi-VN')}</TableCell>
                          <TableCell>{schedule.scheduledTime || '--:--'}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                schedule.status === 'completed'
                                  ? 'default'
                                  : schedule.status === 'cancelled'
                                  ? 'destructive'
                                  : 'secondary'
                              }
                            >
                              {schedule.status === 'pending' && '⏳ Chờ'}
                              {schedule.status === 'confirmed' && '✓ Xác nhận'}
                              {schedule.status === 'completed' && '✓ Hoàn thành'}
                              {schedule.status === 'cancelled' && '✗ Hủy'}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">{schedule.note || '-'}</TableCell>
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
                                onClick={() => handleDeleteSchedule(schedule.id)}
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
                <div className="flex justify-between items-center px-4 py-2 bg-gray-100">
                  <p className="text-sm text-gray-500">
                    Hiển thị {Math.min((schedulePage - 1) * itemsPerPage + 1, getFilteredSchedules().length)} đến {Math.min(schedulePage * itemsPerPage, getFilteredSchedules().length)} của {getFilteredSchedules().length} lịch
                  </p>
                  <div className="space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSchedulePage(prev => Math.max(prev - 1, 1))}
                      disabled={schedulePage === 1}
                    >
                      Trước
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSchedulePage(prev => Math.min(prev + 1, Math.ceil(getFilteredSchedules().length / itemsPerPage)))}
                      disabled={schedulePage === Math.ceil(getFilteredSchedules().length / itemsPerPage)}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
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
                  <CardDescription>Quản lý các giao dịch thu chi</CardDescription>
                </div>
                <div className="flex gap-2 items-center">
                  <Select value={transactionFilter} onValueChange={(v: any) => setTransactionFilter(v)}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Hôm nay</SelectItem>
                      <SelectItem value="week">Tuần này</SelectItem>
                      <SelectItem value="month">Tháng này</SelectItem>
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
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredTransactions().length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Không có giao dịch nào {transactionFilter === 'day' ? 'hôm nay' : transactionFilter === 'week' ? 'tuần này' : 'tháng này'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      getFilteredTransactions().slice((transactionPage - 1) * itemsPerPage, transactionPage * itemsPerPage).map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            <Badge variant={
                              transaction.type === 'income' 
                                ? 'default' 
                                : transaction.type === 'debt'
                                ? 'outline'
                                : 'destructive'
                            }>
                              {transaction.type === 'income' ? (
                                <>
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                  Thu
                                </>
                              ) : transaction.type === 'debt' ? (
                                <>
                                  <AlertCircle className="w-3 h-3 mr-1 text-orange-600" />
                                  Nợ
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
                          <TableCell className={
                            transaction.type === 'income' 
                              ? 'text-green-600 font-semibold' 
                              : transaction.type === 'debt'
                              ? 'text-orange-600 font-semibold'
                              : 'text-red-600 font-semibold'
                          }>
                            {transaction.type === 'income' ? '+' : transaction.type === 'debt' ? '~' : '-'}
                            {transaction.amount.toLocaleString('vi-VN')}đ
                          </TableCell>
                          <TableCell className="max-w-[250px] truncate">{transaction.description}</TableCell>
                          <TableCell>{new Date(transaction.date).toLocaleDateString('vi-VN')}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditTransaction(transaction)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteTransaction(transaction.id)}
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
                <div className="flex justify-between items-center px-4 py-2 bg-gray-100">
                  <p className="text-sm text-gray-500">
                    Hiển thị {Math.min((transactionPage - 1) * itemsPerPage + 1, getFilteredTransactions().length)} đến {Math.min(transactionPage * itemsPerPage, getFilteredTransactions().length)} của {getFilteredTransactions().length} giao dịch
                  </p>
                  <div className="space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setTransactionPage(prev => Math.max(prev - 1, 1))}
                      disabled={transactionPage === 1}
                    >
                      Trước
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setTransactionPage(prev => Math.min(prev + 1, Math.ceil(getFilteredTransactions().length / itemsPerPage)))}
                      disabled={transactionPage === Math.ceil(getFilteredTransactions().length / itemsPerPage)}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* ============================================ */}
        {/* TAB 3: STATISTICS (THỐNG KÊ) */}
        {/* ============================================ */}
        <TabsContent value="statistics">
          <FinanceManagementStats 
            stats={stats} 
            statsFilter={statsFilter} 
            setStatsFilter={setStatsFilter} 
          />
        </TabsContent>
      </Tabs>
      
      {/* ============================================ */}
      {/* DIALOG: ADD/EDIT SCHEDULE */}
      {/* ============================================ */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent 
          className="max-w-lg overflow-y-auto"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxHeight: '85vh',
            margin: '0',
          }}
        >
          <DialogHeader>
            <DialogTitle>{editingSchedule ? 'Sửa lịch' : 'Thêm lịch mới'}</DialogTitle>
            <DialogDescription>
              {editingSchedule ? 'Cập nhật thông tin lịch giao hàng' : 'Tạo lịch giao hàng cho đơn hàng'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveSchedule}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Tên khách hàng *</Label>
                <Input
                  id="customerName"
                  name="customerName"
                  defaultValue={editingSchedule?.customerName}
                  placeholder="Nhập tên khách hàng"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customerAddress">Địa chỉ khách hàng</Label>
                <Input
                  id="customerAddress"
                  name="customerAddress"
                  defaultValue={editingSchedule?.customerAddress}
                  placeholder="Nhập địa chỉ khách hàng"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="productName">Sản phẩm *</Label>
                <Input
                  id="productName"
                  name="productName"
                  defaultValue={editingSchedule?.productName}
                  placeholder="Nhập tên sản phẩm"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduledDate">Ngày giao *</Label>
                  <Input
                    id="scheduledDate"
                    name="scheduledDate"
                    type="date"
                    defaultValue={editingSchedule?.scheduledDate}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduledTime">Giờ giao</Label>
                  <Input
                    id="scheduledTime"
                    name="scheduledTime"
                    type="time"
                    defaultValue={editingSchedule?.scheduledTime}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select name="status" defaultValue={editingSchedule?.status || 'pending'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
                  name="note"
                  rows={3}
                  defaultValue={editingSchedule?.note}
                  placeholder="Ghi chú thêm..."
                />
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit">
                {editingSchedule ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* ============================================ */}
      {/* DIALOG: ADD/EDIT TRANSACTION */}
      {/* ============================================ */}
      <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
        <DialogContent 
          className="max-w-lg overflow-y-auto"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxHeight: '85vh',
            margin: '0',
          }}
        >
          <DialogHeader>
            <DialogTitle>{editingTransaction ? 'Sửa giao dịch' : 'Thêm giao dịch mới'}</DialogTitle>
            <DialogDescription>
              {editingTransaction ? 'Cập nhật thông tin giao dịch' : 'Tạo giao dịch thu/chi mới'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveTransaction}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Loại giao dịch</Label>
                <Select name="type" defaultValue={editingTransaction?.type || 'income'}>
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
                    <SelectItem value="debt">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-600" />
                        Nợ
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Danh mục</Label>
                <Input
                  id="category"
                  name="category"
                  defaultValue={editingTransaction?.category}
                  placeholder="Vd: Bán hàng, Vận chuyển, Nguyên vật liệu..."
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Số tiền (VNĐ)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  min="0"
                  step="1000"
                  defaultValue={editingTransaction?.amount}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={3}
                  defaultValue={editingTransaction?.description}
                  placeholder="Mô tả chi tiết giao dịch..."
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Ngày giao dịch</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  defaultValue={editingTransaction?.date}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="orderId">Mã đơn hàng (nếu có)</Label>
                <Input
                  id="orderId"
                  name="orderId"
                  defaultValue={editingTransaction?.orderId}
                  placeholder="Nhập mã đơn hàng liên quan"
                />
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsTransactionDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit">
                {editingTransaction ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { MessageCircle, X, Send, Bot, User, Flower } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Xin chào! Tôi là trợ lý ảo Sen Việt. Tôi có thể giúp bạn tìm hiểu về các sản phẩm hoa sen, bảng giá và dịch vụ giao hàng. Bạn cần hỗ trợ gì?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  useEffect(() => {
    // Small delay to ensure DOM is updated
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isTyping]);

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Giá cả
    if (lowerMessage.includes('giá') || lowerMessage.includes('bao nhiêu') || lowerMessage.includes('tiền')) {
      return 'Giá các sản phẩm hoa sen của chúng tôi:\n\n🌸 Sen Thái Cao Cấp: 150.000đ/bó\n🌸 Sen Việt Truyền Thống: 80.000đ/bó\n🌸 Lá Sen Tươi: 20.000đ/lá\n🌸 Bó Sen Cưới: 120.000đ/bó\n🌸 Sen Đơn Thanh Lịch: 65.000đ/cành\n\nBạn muốn đặt sản phẩm nào?';
    }

    // Giao hàng
    if (lowerMessage.includes('giao') || lowerMessage.includes('ship') || lowerMessage.includes('vận chuyển')) {
      return 'Chúng tôi có 3 hình thức giao hàng:\n\n✈️ Giao nhanh trong ngày: 50.000đ (nội thành)\n🚢 Giao tiêu chuẩn: 30.000đ (1-2 ngày)\n📦 Giao hàng toàn quốc: 80.000đ (2-5 ngày)\n\nHoa sen được đóng gói cẩn thận, đảm bảo tươi mới khi đến tay bạn!';
    }

    // Sản phẩm
    if (lowerMessage.includes('sản phẩm') || lowerMessage.includes('loại') || lowerMessage.includes('có gì')) {
      return 'Chúng tôi có các sản phẩm hoa sen:\n\n🌸 Sen Thái Cao Cấp - Sang trọng, thơm nhẹ\n🌸 Sen Việt Truyền Thống - Đẹp tự nhiên\n🌸 Lá Sen Tươi - Dùng để gói bánh, nấu nướng\n🌸 Bó Sen Cưới - Dành cho ngày trọng đại\n🌸 Sen Đơn Thanh Lịch - Trang trí bàn làm việc\n🌸 Combo Sen Mix - Kết hợp nhiều loại\n\nBạn thích loại nào?';
    }

    // Đặt hàng
    if (lowerMessage.includes('đặt') || lowerMessage.includes('mua') || lowerMessage.includes('order')) {
      return 'Để đặt hàng, bạn có thể:\n\n📱 Gọi điện: 0123 456 789\n💬 Nhắn tin Zalo: 0123 456 789\n📧 Email: info@senviet.vn\n📝 Điền form đặt hàng ở mục "Liên hệ" trên website\n\nChúng tôi sẽ phản hồi trong vòng 15 phút!';
    }

    // Liên hệ
    if (lowerMessage.includes('liên hệ') || lowerMessage.includes('số') || lowerMessage.includes('phone') || lowerMessage.includes('hotline')) {
      return 'Thông tin liên hệ Sen Việt:\n\n📞 Hotline: 0123 456 789\n📧 Email: info@senviet.vn\n📍 Địa chỉ: Hà Nội, Việt Nam\n⏰ Giờ làm việc: 8:00 - 20:00 (hàng ngày)\n\nChúng tôi luôn sẵn sàng hỗ trợ bạn!';
    }

    // Chất lượng
    if (lowerMessage.includes('chất lượng') || lowerMessage.includes('tươi') || lowerMessage.includes('đảm bảo')) {
      return 'Sen Việt cam kết:\n\n✅ Hoa sen 100% tươi mới, nhập mỗi ngày\n✅ Đóng gói cẩn thận với kỹ thuật chuyên nghiệp\n✅ Đổi trả miễn phí nếu không hài lòng\n✅ Bảo quản hoa tươi 5-7 ngày\n✅ Tư vấn cách chăm sóc hoa miễn phí\n\nSự hài lòng của bạn là ưu tiên của chúng tôi!';
    }

    // Ưu đãi
    if (lowerMessage.includes('ưu đãi') || lowerMessage.includes('giảm giá') || lowerMessage.includes('khuyến mãi') || lowerMessage.includes('sale')) {
      return '🎉 Ưu đãi đặc biệt:\n\n💝 Giảm 10% cho đơn hàng đầu tiên\n💝 Giảm 15% cho đơn từ 500.000đ\n💝 Tặng thiệp chúc mừng miễn phí\n💝 Freeship cho đơn từ 300.000đ\n💝 Tích điểm đổi quà hấp dẫn\n\nNhập mã "SENVIET10" khi đặt hàng nhé!';
    }

    // Lời chào
    if (lowerMessage.includes('xin chào') || lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('chào')) {
      return 'Xin chào! Rất vui được hỗ trợ bạn. Bạn muốn tìm hiểu về:\n\n🌸 Sản phẩm hoa sen\n💰 Bảng giá\n🚚 Giao hàng\n📞 Liên hệ\n🎁 Ưu đãi\n\nHãy cho tôi biết bạn cần gì nhé!';
    }

    // Cảm ơn
    if (lowerMessage.includes('cảm ơn') || lowerMessage.includes('thanks') || lowerMessage.includes('thank')) {
      return 'Rất vui được hỗ trợ bạn! 🌸\n\nNếu còn thắc mắc gì, đừng ngại liên hệ:\n📞 0123 456 789\n\nChúc bạn một ngày tốt lạnh!';
    }

    // Default response
    return 'Cảm ơn bạn đã nhắn tin! Tôi có thể giúp bạn về:\n\n🌸 Thông tin sản phẩm hoa sen\n💰 Bảng giá chi tiết\n🚚 Chính sách giao hàng\n📞 Thông tin liên hệ\n🎁 Ưu đãi đặc biệt\n\nBạn muốn biết thêm về vấn đề nào?';
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue);
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl bg-gradient-to-r from-pink-300 to-rose-400 hover:from-pink-400 hover:to-rose-500 text-white transition-all hover:scale-110"
              aria-label="Open chat"
            >
              <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] md:w-96 h-[500px] md:h-[600px] flex flex-col"
          >
            <Card className="flex flex-col h-full shadow-2xl border-2 border-primary/20 overflow-hidden bg-white">
              {/* Header */}
              <div className="bg-gradient-to-r from-pink-300 to-rose-400 p-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <Flower className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold">Sen Việt AI Assistant</h3>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span>Đang hoạt động</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 rounded-full"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-hidden bg-gradient-to-br from-pink-50/80 to-rose-50/60 relative">
                <ScrollArea className="h-full w-full">
                  <div className="p-4 space-y-4 min-h-full">
                    {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-2 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === 'bot' 
                          ? 'bg-gradient-to-br from-pink-300 to-rose-400' 
                          : 'bg-gradient-to-br from-rose-400 to-pink-400'
                      }`}>
                        {message.sender === 'bot' ? (
                          <Bot className="w-5 h-5 text-white" />
                        ) : (
                          <User className="w-5 h-5 text-white" />
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                          message.sender === 'bot'
                            ? 'bg-white shadow-sm border border-pink-100'
                            : 'bg-gradient-to-r from-pink-300 to-rose-400 text-white'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line break-words">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'bot' ? 'text-gray-400' : 'text-white/70'
                        }`}>
                          {message.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-2"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-300 to-rose-400 flex items-center justify-center">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-white shadow-sm border border-pink-100 rounded-2xl px-4 py-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div ref={messagesEndRef} className="h-4" />
                  </div>
                  <ScrollBar className="w-2" />
                </ScrollArea>
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-pink-100">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 rounded-full border-pink-200 focus-visible:ring-pink-300"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="rounded-full w-10 h-10 p-0 bg-gradient-to-r from-pink-300 to-rose-400 hover:from-pink-400 hover:to-rose-500 disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Powered by Sen Việt AI
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

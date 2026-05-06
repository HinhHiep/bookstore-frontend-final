import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  MessageCircle,
  Star,
  TrendingUp,
  Heart,
  Brain,
  Lightbulb,
  User,
  ShoppingCart,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

interface Message {
  id: number | string;
  type: 'user' | 'ai';
  text: string;
  books?: Array<{
    id: string;
    bookId?: string;
    title: string;
    author: string;
    price: string;
    image: string;
    rating: number;
    reason: string;
  }>;
}

export function AIAdvisorPage() {
  const [chatId, setChatId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      text: 'Xin chào! Tôi là AI Assistant của Trạm Sách. Tôi có thể giúp bạn tìm những cuốn sách phù hợp nhất với sở thích và nhu cầu của bạn. Hãy cho tôi biết bạn đang tìm kiếm thể loại sách gì nhé! 📚',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickQuestions = [
    {
      icon: TrendingUp,
      text: 'Sách bán chạy nhất hiện nay',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      icon: Brain,
      text: 'Sách phát triển bản thân',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: Heart,
      text: 'Tiểu thuyết lãng mạn',
      color: 'bg-pink-100 text-pink-600',
    },
    {
      icon: Lightbulb,
      text: 'Sách kinh doanh khởi nghiệp',
      color: 'bg-blue-100 text-blue-600',
    },
  ];

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      text: messageText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await api.post('/chatbot', {
        message: messageText,
        chatId,
      });

      const result = response.data?.data;
      const books = Array.isArray(result?.books) ? result.books : [];

      const aiMessage: Message = {
        id: `${Date.now()}-ai`,
        type: 'ai',
        text: result?.answer || 'Xin lỗi, tôi chưa thể trả lời.',
        books: books.map((book: any, index: number) => ({
          id: book._id || `book-${index}`,
          bookId: book._id,
          title: book.title || 'Tên sách không xác định',
          author: book.author || 'Không rõ tác giả',
          price: book.price ? `${book.price}đ` : book.price || 'Liên hệ',
          image: book.coverImage || book.image || 'https://via.placeholder.com/150',
          rating: Number(book.rating || 0),
          reason: book.description ? book.description.slice(0, 120) : 'Sách hay, đáng đọc.',
        })),
      };

      setChatId(result?.chatId || chatId);
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-error`,
          type: 'ai',
          text: 'Có lỗi khi kết nối đến AI. Vui lòng thử lại sau ít phút.',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Bot className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-bold">Tư Vấn Sách Với AI</h1>
              </div>
              <p className="text-lg opacity-90 mb-4">
                Trợ lý AI thông minh giúp bạn tìm cuốn sách hoàn hảo
              </p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Gợi ý thông minh</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>1000+ đầu sách</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Tư vấn miễn phí</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1767716134877-82b74809e431?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMHJvYm90JTIwYXNzaXN0YW50JTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzM3MzA4Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="AI Assistant"
                className="w-48 h-48 object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Chat Container */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Bot className="w-7 h-7" />
              </div>
              <div>
                <h2 className="font-bold text-lg">AI Book Advisor</h2>
                <p className="text-sm opacity-90">Luôn sẵn sàng hỗ trợ bạn</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white'
                    }`}
                  >
                    {message.type === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <div>
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-800'
                      }`}
                    >
                      <p className="whitespace-pre-line">{message.text}</p>
                    </div>

                    {/* Book Recommendations */}
                    {message.books && (
                      <div className="mt-4 space-y-3">
                        {message.books.map((book) => (
                          <div
                            key={book.id}
                            className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow"
                          >
                            <div className="flex gap-4">
                              <img
                                src={book.image}
                                alt={book.title}
                                className="w-20 h-28 object-cover rounded-lg flex-shrink-0"
                              />
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-800 mb-1">{book.title}</h4>
                                <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                                <div className="flex items-center gap-1 mb-2">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < Math.floor(book.rating)
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                  <span className="text-sm text-gray-600 ml-1">{book.rating}</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-3 italic">
                                  💡 {book.reason}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-lg font-bold text-blue-600">{book.price}</span>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => navigate(`/book/${book.id}`)}
                                      className="px-3 py-1 text-sm border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                    >
                                      Xem chi tiết
                                    </button>
                                    <button
                                      onClick={() => addToCart({
                                        id: book.id,
                                        title: book.title,
                                        author: book.author,
                                        price: book.price,
                                        image: book.image,
                                        quantity: 1
                                      })}
                                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                                    >
                                      <ShoppingCart className="w-4 h-4" />
                                      Thêm vào giỏ
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Questions */}
          {messages.length <= 2 && (
            <div className="px-6 py-4 bg-white border-t">
              <p className="text-sm text-gray-600 mb-3">Câu hỏi gợi ý:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickQuestions.map((question, index) => {
                  const Icon = question.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(question.text)}
                      className={`${question.color} px-4 py-3 rounded-lg text-sm font-medium hover:shadow-md transition-all text-left flex items-center gap-2`}
                    >
                      <Icon className="w-4 h-4" />
                      {question.text}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-6 bg-white border-t">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập câu hỏi của bạn..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim()}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                <span className="font-medium">Gửi</span>
              </button>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Gợi ý thông minh</h3>
            <p className="text-sm text-gray-600">
              AI phân tích sở thích và đề xuất sách phù hợp nhất
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Kho sách đa dạng</h3>
            <p className="text-sm text-gray-600">
              Hơn 1000+ đầu sách từ nhiều thể loại khác nhau
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Hỗ trợ 24/7</h3>
            <p className="text-sm text-gray-600">
              Luôn sẵn sàng tư vấn mọi lúc, mọi nơi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

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

interface Message {
  id: number;
  type: 'user' | 'ai';
  text: string;
  books?: Array<{
    id: number;
    title: string;
    author: string;
    price: string;
    image: string;
    rating: number;
    reason: string;
  }>;
}

export function AIAdvisorPage() {
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

  const getAIResponse = (userMessage: string): Message => {
    // Simulate AI response with book recommendations
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('bán chạy') || lowerMessage.includes('phổ biến')) {
      return {
        id: Date.now(),
        type: 'ai',
        text: 'Dựa trên yêu cầu của bạn về sách bán chạy, tôi gợi ý những cuốn sách sau đây đang được độc giả yêu thích nhất:',
        books: [
          {
            id: 1,
            title: 'Atomic Habits',
            author: 'James Clear',
            price: '129.000đ',
            image: 'https://images.unsplash.com/photo-1546913760-e23d946dd386?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWxmJTIwaGVscCUyMGJvb2t8ZW58MXx8fHwxNzczODQ3MDAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
            rating: 4.8,
            reason: 'Cuốn sách #1 về xây dựng thói quen tích cực, đã bán hơn 15,000 cuốn',
          },
          {
            id: 2,
            title: 'The Psychology of Money',
            author: 'Morgan Housel',
            price: '149.000đ',
            image: 'https://images.unsplash.com/photo-1768991732235-ac3e1bc9259c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGJvb2slMjBoYXJkY292ZXJ8ZW58MXx8fHwxNzczODIyMjA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
            rating: 4.9,
            reason: 'Hiểu về tâm lý và cách quản lý tài chính cá nhân hiệu quả',
          },
          {
            id: 3,
            title: 'Sapiens',
            author: 'Yuval Noah Harari',
            price: '189.000đ',
            image: 'https://images.unsplash.com/photo-1768224946689-b599f1d406f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3B1bGFyJTIwYm9va3MlMjBzdGFja3xlbnwxfHx8fDE3NzM4NDkzMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
            rating: 4.7,
            reason: 'Khám phá lịch sử loài người từ góc nhìn độc đáo và sâu sắc',
          },
        ],
      };
    } else if (lowerMessage.includes('phát triển') || lowerMessage.includes('bản thân')) {
      return {
        id: Date.now(),
        type: 'ai',
        text: 'Tuyệt vời! Đây là những cuốn sách phát triển bản thân mà tôi đề xuất cho bạn:',
        books: [
          {
            id: 4,
            title: 'Thinking, Fast and Slow',
            author: 'Daniel Kahneman',
            price: '169.000đ',
            image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXJ8ZW58MXx8fHwxNzczODQ3MDAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
            rating: 4.6,
            reason: 'Hiểu về cách bộ não hoạt động và đưa ra quyết định tốt hơn',
          },
          {
            id: 5,
            title: 'The 7 Habits',
            author: 'Stephen Covey',
            price: '139.000đ',
            image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwcmVhZGluZ3xlbnwxfHx8fDE3NzM4NDcwMDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
            rating: 4.7,
            reason: '7 thói quen giúp bạn trở nên hiệu quả hơn trong cuộc sống',
          },
        ],
      };
    } else if (lowerMessage.includes('lãng mạn') || lowerMessage.includes('tình yêu') || lowerMessage.includes('tiểu thuyết')) {
      return {
        id: Date.now(),
        type: 'ai',
        text: 'Tôi hiểu bạn đang tìm kiếm những câu chuyện lãng mạn cảm động. Đây là gợi ý của tôi:',
        books: [
          {
            id: 6,
            title: 'Tomorrow, and Tomorrow, and Tomorrow',
            author: 'Gabrielle Zevin',
            price: '189.000đ',
            image: 'https://images.unsplash.com/photo-1765375382583-1344a5273849?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjBib29rcyUyMHJlbGVhc2UlMjBkaXNwbGF5fGVufDF8fHx8MTc3Mzg1MDYzM3ww&ixlib=rb-4.1.0&q=80&w=1080',
            rating: 4.9,
            reason: 'Câu chuyện tình bạn và tình yêu đan xen trong thế giới game',
          },
          {
            id: 7,
            title: 'The Heaven & Earth Grocery Store',
            author: 'James McBride',
            price: '169.000đ',
            image: 'https://images.unsplash.com/photo-1764923753986-c3f564e295d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rc3RvcmUlMjBuZXclMjBhcnJpdmFsc3xlbnwxfHx8fDE3NzM4NTA2MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
            rating: 4.7,
            reason: 'Khám phá tình yêu và sự hy sinh qua những nhân vật đầy cảm xúc',
          },
        ],
      };
    } else if (lowerMessage.includes('kinh doanh') || lowerMessage.includes('khởi nghiệp') || lowerMessage.includes('startup')) {
      return {
        id: Date.now(),
        type: 'ai',
        text: 'Hoàn hảo! Đây là những cuốn sách kinh doanh và khởi nghiệp bạn nên đọc:',
        books: [
          {
            id: 8,
            title: 'Rich Dad Poor Dad',
            author: 'Robert Kiyosaki',
            price: '119.000đ',
            image: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNlJTIwYm9va3xlbnwxfHx8fDE3NzM4NDcwMDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
            rating: 4.5,
            reason: 'Nền tảng tư duy tài chính cho mọi doanh nhân',
          },
          {
            id: 9,
            title: 'The Psychology of Money',
            author: 'Morgan Housel',
            price: '149.000đ',
            image: 'https://images.unsplash.com/photo-1768991732235-ac3e1bc9259c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGJvb2slMjBoYXJkY292ZXJ8ZW58MXx8fHwxNzczODIyMjA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
            rating: 4.9,
            reason: 'Hiểu rõ tâm lý để quản lý tiền bạc thông minh',
          },
        ],
      };
    } else {
      return {
        id: Date.now(),
        type: 'ai',
        text: 'Cảm ơn bạn đã chia sẻ! Để tôi có thể gợi ý chính xác hơn, bạn có thể cho tôi biết thêm về:\n\n• Thể loại sách bạn yêu thích (văn học, kinh tế, kỹ năng, thiếu nhi...)\n• Mục đích đọc sách (giải trí, học hỏi, phát triển bản thân...)\n• Tác giả hoặc cuốn sách nào bạn từng đọc và thích\n\nHoặc bạn có thể chọn một trong các câu hỏi gợi ý bên dưới! 😊',
      };
    }
  };

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      text: messageText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI typing delay
    setTimeout(() => {
      const aiResponse = getAIResponse(messageText);
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
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

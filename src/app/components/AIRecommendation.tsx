import { useState } from 'react';
import { Bot, Sparkles, Search, TrendingUp, Heart, BookOpen, Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function AIRecommendation() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { addToCart } = useCart();

  const quickPrompts = [
    { icon: Heart, text: 'Sách hay về tình yêu', color: 'from-pink-500 to-rose-500' },
    { icon: TrendingUp, text: 'Sách kinh doanh bán chạy', color: 'from-blue-500 to-cyan-500' },
    { icon: BookOpen, text: 'Tiểu thuyết trinh thám', color: 'from-purple-500 to-indigo-500' },
    { icon: Sparkles, text: 'Phát triển bản thân', color: 'from-orange-500 to-amber-500' },
  ];

  const recommendedBooks = [
    {
      id: 1,
      title: 'AI và Tương Lai',
      author: 'Kai-Fu Lee',
      category: 'Công nghệ',
      price: '189.000đ',
      originalPrice: '245.000đ',
      rating: 4.8,
      matchScore: 95,
      reason: 'Phù hợp với sở thích công nghệ của bạn',
      image: 'https://images.unsplash.com/photo-1625314887424-9f190599bd56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwcm9ib3R8ZW58MXx8fHwxNzczODQ2NDgxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 2,
      title: 'Nghệ Thuật Đọc Sách',
      author: 'Mortimer J. Adler',
      category: 'Kỹ năng',
      price: '129.000đ',
      originalPrice: '170.000đ',
      rating: 4.9,
      matchScore: 92,
      reason: 'Người đọc như bạn thường thích cuốn này',
      image: 'https://images.unsplash.com/photo-1569251703679-fad917f9409e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwcmVjb21tZW5kYXRpb24lMjByZWFkaW5nfGVufDF8fHx8MTc3Mzg0NzI2MXww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 3,
      title: 'Kinh Tế Học Vui',
      author: 'Steven Levitt',
      category: 'Kinh tế',
      price: '145.000đ',
      originalPrice: '195.000đ',
      rating: 4.7,
      matchScore: 88,
      reason: 'Dựa trên lịch sử đọc của bạn',
      image: 'https://images.unsplash.com/photo-1692742593570-ca989f1febd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2xhc3NpYyUyMGJvb2t8ZW58MXx8fHwxNzczODQ3MjYxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 4,
      title: 'Vũ Trụ Trong Vỏ Hạt Dẻ',
      author: 'Stephen Hawking',
      category: 'Khoa học',
      price: '165.000đ',
      originalPrice: '210.000đ',
      rating: 4.9,
      matchScore: 90,
      reason: 'Xu hướng đọc của bạn',
      image: 'https://images.unsplash.com/photo-1554357395-dbdc356ca5da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwZmljdGlvbiUyMGJvb2t8ZW58MXx8fHwxNzczODIwNzIzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  const handleSearch = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowResults(true);
    }, 1500);
  };

  const handleQuickPrompt = (text: string) => {
    setPrompt(text);
    handleSearch();
  };

  return (
    <section className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Bot className="w-9 h-9 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Trợ lý AI gợi ý sách
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Để AI tìm cuốn sách hoàn hảo cho bạn dựa trên sở thích, tâm trạng và mục tiêu đọc
          </p>
        </div>

        {/* Search Box */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex gap-3 mb-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ví dụ: Tôi muốn đọc sách về khởi nghiệp, dễ hiểu và thực tế..."
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-base"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
              </div>
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang tìm...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Tìm sách</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600 py-2">Gợi ý nhanh:</span>
              {quickPrompts.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleQuickPrompt(item.text)}
                    className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-indigo-50 hover:to-purple-50 rounded-full text-sm font-medium text-gray-700 hover:text-indigo-700 transition-all border border-gray-200 hover:border-indigo-300 flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {item.text}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results */}
        {showResults && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  AI đã tìm thấy {recommendedBooks.length} cuốn sách phù hợp
                </h3>
              </div>

              <div className="grid grid-cols-4 gap-6">
                {recommendedBooks.map((book) => (
                  <div
                    key={book.id}
                    className="bg-gradient-to-br from-gray-50 to-white rounded-xl overflow-hidden border-2 border-gray-100 hover:border-indigo-300 transition-all hover:shadow-xl group"
                  >
                    {/* Image */}
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Match Score Badge */}
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {book.matchScore}% phù hợp
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <div className="text-xs text-indigo-600 font-semibold mb-1">
                        {book.category}
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">
                        {book.title}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">{book.author}</p>

                      {/* AI Reason */}
                      <div className="bg-indigo-50 rounded-lg p-2 mb-3">
                        <p className="text-xs text-indigo-700 flex items-start gap-1">
                          <Bot className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span>{book.reason}</span>
                        </p>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < Math.floor(book.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-xs text-gray-600 ml-1">
                          ({book.rating})
                        </span>
                      </div>

                      {/* Price & Cart */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-red-600 font-bold">
                            {book.price}
                          </div>
                          {book.originalPrice && (
                            <div className="text-gray-400 line-through text-xs">
                              {book.originalPrice}
                            </div>
                          )}
                        </div>
                        <button 
                          onClick={() => {
                            addToCart({
                              id: book.id,
                              title: book.title,
                              author: book.author,
                              price: book.price,
                              image: book.image,
                            });
                          }}
                          className="w-9 h-9 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all hover:scale-110"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Stats */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <Bot className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">500K+</div>
                      <div className="text-sm text-gray-600">Lượt gợi ý</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Heart className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">98%</div>
                      <div className="text-sm text-gray-600">Độ hài lòng</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">10K+</div>
                      <div className="text-sm text-gray-600">Sách trong kho</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feature Cards */}
        {!showResults && (
          <div className="grid grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Gợi ý thông minh</h3>
              <p className="text-sm text-gray-600">
                AI phân tích sở thích và tìm sách phù hợp nhất với bạn
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Cá nhân hóa</h3>
              <p className="text-sm text-gray-600">
                Học từ lịch sử đọc để đưa ra gợi ý ngày càng chính xác
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Xu hướng mới</h3>
              <p className="text-sm text-gray-600">
                Cập nhật liên tục các đầu sách thịnh hành và được yêu thích
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
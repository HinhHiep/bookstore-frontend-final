import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Sparkles,
  Filter,
  SlidersHorizontal,
  Star,
  Calendar,
  TrendingUp,
  ChevronDown,
  X,
  Grid3x3,
  List,
  Heart,
  ShoppingCart,
  Eye,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export function NewBooksPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for new books
  const books = [
    {
      id: 1,
      title: 'Tomorrow, and Tomorrow, and Tomorrow',
      author: 'Gabrielle Zevin',
      price: '189.000đ',
      originalPrice: '249.000đ',
      discount: 24,
      rating: 4.9,
      reviews: 1234,
      releaseDate: '2024-03-15',
      image: 'https://images.unsplash.com/photo-1765375382583-1344a5273849?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjBib29rcyUyMHJlbGVhc2UlMjBkaXNwbGF5fGVufDF8fHx8MTc3Mzg1MDYzM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'fiction',
      badge: 'MỚI',
    },
    {
      id: 2,
      title: 'The Wager',
      author: 'David Grann',
      price: '169.000đ',
      originalPrice: '219.000đ',
      discount: 23,
      rating: 4.8,
      reviews: 876,
      releaseDate: '2024-03-10',
      image: 'https://images.unsplash.com/photo-1755545730104-3cb4545282b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGJvb2slMjBjb3ZlciUyMG1vZGVybnxlbnwxfHx8fDE3NzM4NTA2MzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'history',
      badge: 'MỚI',
    },
    {
      id: 3,
      title: 'Holly',
      author: 'Stephen King',
      price: '199.000đ',
      originalPrice: '259.000đ',
      discount: 23,
      rating: 4.7,
      reviews: 2341,
      releaseDate: '2024-03-08',
      image: 'https://images.unsplash.com/photo-1610882648335-ced8fc8fa6b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBub3ZlbCUyMGhhcmRjb3ZlcnxlbnwxfHx8fDE3NzM4NTA2MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'fiction',
      badge: 'MỚI',
    },
    {
      id: 4,
      title: 'The Woman in Me',
      author: 'Britney Spears',
      price: '179.000đ',
      originalPrice: '229.000đ',
      discount: 22,
      rating: 4.6,
      reviews: 1543,
      releaseDate: '2024-03-05',
      image: 'https://images.unsplash.com/photo-1596194807861-58bff2495a7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjBwdWJsaXNoZWQlMjBib29rJTIwc2hlbGZ8ZW58MXx8fHwxNzczODUwNjM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'biography',
      badge: 'MỚI',
    },
    {
      id: 5,
      title: 'The Creative Act',
      author: 'Rick Rubin',
      price: '159.000đ',
      originalPrice: '209.000đ',
      discount: 24,
      rating: 4.9,
      reviews: 987,
      releaseDate: '2024-03-01',
      image: 'https://images.unsplash.com/photo-1633477189729-9290b3261d0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXRlc3QlMjBib29rJTIwZWRpdGlvbiUyMGNvdmVyfGVufDF8fHx8MTc3Mzg1MDYzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'self-help',
      badge: 'MỚI',
    },
    {
      id: 6,
      title: 'Fourth Wing',
      author: 'Rebecca Yarros',
      price: '149.000đ',
      originalPrice: '199.000đ',
      discount: 25,
      rating: 4.8,
      reviews: 3421,
      releaseDate: '2024-02-28',
      image: 'https://images.unsplash.com/photo-1656513314387-f83183e4ebc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWNlbnQlMjBiZXN0c2VsbGVyJTIwZGlzcGxheXxlbnwxfHx8fDE3NzM4NTA2MzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'fantasy',
      badge: 'MỚI',
    },
    {
      id: 7,
      title: 'The Heaven & Earth Grocery Store',
      author: 'James McBride',
      price: '169.000đ',
      originalPrice: '219.000đ',
      discount: 23,
      rating: 4.7,
      reviews: 765,
      releaseDate: '2024-02-25',
      image: 'https://images.unsplash.com/photo-1764923753986-c3f564e295d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rc3RvcmUlMjBuZXclMjBhcnJpdmFsc3xlbnwxfHx8fDE3NzM4NTA2MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'fiction',
      badge: 'MỚI',
    },
    {
      id: 8,
      title: 'The Fraud',
      author: 'Zadie Smith',
      price: '179.000đ',
      originalPrice: '239.000đ',
      discount: 25,
      rating: 4.6,
      reviews: 654,
      releaseDate: '2024-02-20',
      image: 'https://images.unsplash.com/photo-1759977064094-840dfc694bee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmaWN0aW9uJTIwYm9va3xlbnwxfHx8fDE3NzM3ODkzMTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'fiction',
      badge: 'MỚI',
    },
  ];

  const categories = [
    { id: 'all', name: 'Tất cả', count: books.length },
    { id: 'fiction', name: 'Tiểu thuyết', count: 4 },
    { id: 'self-help', name: 'Phát triển bản thân', count: 1 },
    { id: 'biography', name: 'Tiểu sử', count: 1 },
    { id: 'history', name: 'Lịch sử', count: 1 },
    { id: 'fantasy', name: 'Kỳ ảo', count: 1 },
  ];

  const priceRanges = [
    { id: 'all', name: 'Tất cả mức giá' },
    { id: '0-150', name: 'Dưới 150.000đ' },
    { id: '150-180', name: '150.000đ - 180.000đ' },
    { id: '180-200', name: '180.000đ - 200.000đ' },
    { id: '200+', name: 'Trên 200.000đ' },
  ];

  const sortOptions = [
    { id: 'newest', name: 'Mới nhất' },
    { id: 'rating', name: 'Đánh giá cao' },
    { id: 'price-low', name: 'Giá thấp đến cao' },
    { id: 'price-high', name: 'Giá cao đến thấp' },
    { id: 'popular', name: 'Phổ biến nhất' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-bold">Sách Mới Phát Hành</h1>
              </div>
              <p className="text-lg opacity-90 mb-4">
                Khám phá những cuốn sách mới nhất vừa được xuất bản
              </p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>Cập nhật hàng ngày</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  <span>100% sách mới</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  <span>Giảm giá lên đến 25%</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1765375382583-1344a5273849?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjBib29rcyUyMHJlbGVhc2UlMjBkaXNwbGF5fGVufDF8fHx8MTc3Mzg1MDYzM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="New Books"
                className="w-48 h-48 object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {books.length}+
              </div>
              <div className="text-sm text-gray-600">Sách mới</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                Mới
              </div>
              <div className="text-sm text-gray-600">Tuần này</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">4.7</div>
              <div className="text-sm text-gray-600">Đánh giá trung bình</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">-25%</div>
              <div className="text-sm text-gray-600">Giảm giá đến</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Filter className="w-5 h-5" />
                <span>Bộ lọc</span>
              </button>

              <div className="relative">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <SlidersHorizontal className="w-5 h-5" />
                  <span>Sắp xếp: {sortOptions.find(s => s.id === sortBy)?.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-purple-100 text-purple-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-purple-100 text-purple-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Danh mục
                </label>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat.id}
                        onChange={() => setSelectedCategory(cat.id)}
                        className="text-purple-600"
                      />
                      <span className="text-sm">
                        {cat.name} ({cat.count})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Khoảng giá
                </label>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label key={range.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="price"
                        checked={selectedPriceRange === range.id}
                        onChange={() => setSelectedPriceRange(range.id)}
                        className="text-purple-600"
                      />
                      <span className="text-sm">{range.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đánh giá
                </label>
                <div className="space-y-2">
                  {['all', '4.5', '4.0', '3.5'].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={selectedRating === rating}
                        onChange={() => setSelectedRating(rating)}
                        className="text-purple-600"
                      />
                      <span className="text-sm flex items-center gap-1">
                        {rating === 'all' ? (
                          'Tất cả'
                        ) : (
                          <>
                            {rating} <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> trở lên
                          </>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Books Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-4 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all group overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {book.badge && (
                    <div className="absolute top-2 left-2 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {book.badge}
                    </div>
                  )}
                  {book.discount && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
                      -{book.discount}%
                    </div>
                  )}
                  <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white">
                      <Eye
                        className="w-6 h-6 text-gray-800"
                        onClick={() => navigate(`/book/${book.id}`)}
                      />
                    </div>
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-1 line-clamp-2 min-h-[3rem]">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{book.author}</p>

                  <div className="flex items-center gap-1 mb-3">
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
                    <span className="text-sm text-gray-600 ml-1">
                      {book.rating} ({book.reviews})
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-xl font-bold text-purple-600">
                      {book.price}
                    </span>
                    {book.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        {book.originalPrice}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart({
                        id: book.id,
                        title: book.title,
                        author: book.author,
                        price: book.price,
                        image: book.image,
                        quantity: 1
                      })}
                      className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span className="text-sm font-medium">Thêm vào giỏ</span>
                    </button>
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Heart className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all p-4 flex gap-4"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-32 h-48 object-cover rounded-lg"
                  />
                  {book.badge && (
                    <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold">
                      {book.badge}
                    </div>
                  )}
                  {book.discount && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                      -{book.discount}%
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800 mb-1">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 mb-2">{book.author}</p>

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
                    <span className="text-sm text-gray-600 ml-1">
                      {book.rating} ({book.reviews} đánh giá)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>Phát hành: {new Date(book.releaseDate).toLocaleDateString('vi-VN')}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-purple-600">
                        {book.price}
                      </span>
                      {book.originalPrice && (
                        <span className="text-gray-400 line-through">
                          {book.originalPrice}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/book/${book.id}`)}
                        className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
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
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Thêm vào giỏ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

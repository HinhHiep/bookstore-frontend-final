import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  TrendingUp,
  Filter,
  SlidersHorizontal,
  Star,
  Flame,
  Award,
  ChevronDown,
  X,
  Grid3x3,
  List,
  Heart,
  ShoppingCart,
  Eye,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export function BestSellersPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [sortBy, setSortBy] = useState('bestseller');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for bestseller books
  const books = [
    {
      id: 1,
      title: 'Atomic Habits',
      author: 'James Clear',
      price: '129.000đ',
      originalPrice: '179.000đ',
      discount: 28,
      rating: 4.8,
      reviews: 2543,
      sold: 15234,
      image: 'https://images.unsplash.com/photo-1546913760-e23d946dd386?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWxmJTIwaGVscCUyMGJvb2t8ZW58MXx8fHwxNzczODQ3MDAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'self-help',
      badge: 'TOP 1',
    },
    {
      id: 2,
      title: 'The Psychology of Money',
      author: 'Morgan Housel',
      price: '149.000đ',
      originalPrice: '199.000đ',
      discount: 25,
      rating: 4.9,
      reviews: 1876,
      sold: 12456,
      image: 'https://images.unsplash.com/photo-1768991732235-ac3e1bc9259c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGJvb2slMjBoYXJkY292ZXJ8ZW58MXx8fHwxNzczODIyMjA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'business',
      badge: 'TOP 2',
    },
    {
      id: 3,
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      price: '189.000đ',
      originalPrice: '249.000đ',
      discount: 24,
      rating: 4.7,
      reviews: 3421,
      sold: 10234,
      image: 'https://images.unsplash.com/photo-1768224946689-b599f1d406f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3B1bGFyJTIwYm9va3MlMjBzdGFja3xlbnwxfHx8fDE3NzM4NDkzMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'history',
      badge: 'TOP 3',
    },
    {
      id: 4,
      title: 'Thinking, Fast and Slow',
      author: 'Daniel Kahneman',
      price: '169.000đ',
      originalPrice: '229.000đ',
      discount: 26,
      rating: 4.6,
      reviews: 1234,
      sold: 8765,
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXJ8ZW58MXx8fHwxNzczODQ3MDAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'psychology',
      badge: 'HOT',
    },
    {
      id: 5,
      title: 'Rich Dad Poor Dad',
      author: 'Robert Kiyosaki',
      price: '119.000đ',
      originalPrice: '159.000đ',
      discount: 25,
      rating: 4.5,
      reviews: 2876,
      sold: 9876,
      image: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNlJTIwYm9va3xlbnwxfHx8fDE3NzM4NDcwMDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'business',
      badge: 'HOT',
    },
    {
      id: 6,
      title: 'The 7 Habits',
      author: 'Stephen Covey',
      price: '139.000đ',
      originalPrice: '189.000đ',
      discount: 26,
      rating: 4.7,
      reviews: 1543,
      sold: 7654,
      image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwcmVhZGluZ3xlbnwxfHx8fDE3NzM4NDcwMDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'self-help',
      badge: 'NEW',
    },
    {
      id: 7,
      title: '1984',
      author: 'George Orwell',
      price: '99.000đ',
      originalPrice: '139.000đ',
      discount: 29,
      rating: 4.8,
      reviews: 4321,
      sold: 11234,
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWN0aW9uJTIwYm9va3xlbnwxfHx8fDE3NzM4NDcwMDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'fiction',
      badge: 'TOP 10',
    },
    {
      id: 8,
      title: 'Deep Work',
      author: 'Cal Newport',
      price: '129.000đ',
      originalPrice: '169.000đ',
      discount: 24,
      rating: 4.6,
      reviews: 987,
      sold: 6543,
      image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0aXZpdHklMjBib29rfGVufDF8fHx8MTc3Mzg0NzAwMXww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'self-help',
      badge: 'NEW',
    },
  ];

  const categories = [
    { id: 'all', name: 'Tất cả', count: books.length },
    { id: 'self-help', name: 'Phát triển bản thân', count: 3 },
    { id: 'business', name: 'Kinh doanh', count: 2 },
    { id: 'psychology', name: 'Tâm lý học', count: 1 },
    { id: 'history', name: 'Lịch sử', count: 1 },
    { id: 'fiction', name: 'Tiểu thuyết', count: 1 },
  ];

  const priceRanges = [
    { id: 'all', name: 'Tất cả mức giá' },
    { id: '0-100', name: 'Dưới 100.000đ' },
    { id: '100-150', name: '100.000đ - 150.000đ' },
    { id: '150-200', name: '150.000đ - 200.000đ' },
    { id: '200+', name: 'Trên 200.000đ' },
  ];

  const sortOptions = [
    { id: 'bestseller', name: 'Bán chạy nhất' },
    { id: 'rating', name: 'Đánh giá cao' },
    { id: 'price-low', name: 'Giá thấp đến cao' },
    { id: 'price-high', name: 'Giá cao đến thấp' },
    { id: 'newest', name: 'Mới nhất' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-bold">Sách Bán Chạy</h1>
              </div>
              <p className="text-lg opacity-90 mb-4">
                Khám phá những cuốn sách được yêu thích nhất tại Trạm Sách
              </p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <span>Top 100 sách bán chạy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5" />
                  <span>Cập nhật hàng tuần</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  <span>Đánh giá cao</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1768224946689-b599f1d406f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3B1bGFyJTIwYm9va3MlMjBzdGFja3xlbnwxfHx8fDE3NzM4NDkzMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Bestsellers"
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
              <div className="text-3xl font-bold text-orange-600 mb-1">
                {books.length}+
              </div>
              <div className="text-sm text-gray-600">Sách bán chạy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">
                15K+
              </div>
              <div className="text-sm text-gray-600">Lượt bán</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">4.7</div>
              <div className="text-sm text-gray-600">Đánh giá trung bình</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">-30%</div>
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
                <span className="font-medium">Bộ lọc</span>
              </button>

              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none outline-none font-medium text-gray-900 cursor-pointer"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCategory !== 'all' ||
            selectedPriceRange !== 'all' ||
            selectedRating !== 'all') && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-gray-600">Đang lọc:</span>
              {selectedCategory !== 'all' && (
                <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                  <span>
                    {categories.find((c) => c.id === selectedCategory)?.name}
                  </span>
                  <button onClick={() => setSelectedCategory('all')}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              {selectedPriceRange !== 'all' && (
                <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                  <span>
                    {priceRanges.find((p) => p.id === selectedPriceRange)?.name}
                  </span>
                  <button onClick={() => setSelectedPriceRange('all')}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedPriceRange('all');
                  setSelectedRating('all');
                }}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium ml-2"
              >
                Xóa tất cả
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar Filters */}
          {showFilters && (
            <div className="col-span-3 space-y-6">
              {/* Category Filter */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-bold text-gray-900 mb-4">Thể loại</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="category"
                          value={category.id}
                          checked={selectedCategory === category.id}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-4 h-4 text-orange-500"
                        />
                        <span className="text-gray-900">{category.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        ({category.count})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-bold text-gray-900 mb-4">Khoảng giá</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label
                      key={range.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="radio"
                        name="price"
                        value={range.id}
                        checked={selectedPriceRange === range.id}
                        onChange={(e) => setSelectedPriceRange(e.target.value)}
                        className="w-4 h-4 text-orange-500"
                      />
                      <span className="text-gray-900">{range.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-bold text-gray-900 mb-4">Đánh giá</h3>
                <div className="space-y-2">
                  {[
                    { id: 'all', stars: 0, label: 'Tất cả' },
                    { id: '4+', stars: 4, label: '4 sao trở lên' },
                    { id: '4.5+', stars: 4.5, label: '4.5 sao trở lên' },
                  ].map((rating) => (
                    <label
                      key={rating.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="radio"
                        name="rating"
                        value={rating.id}
                        checked={selectedRating === rating.id}
                        onChange={(e) => setSelectedRating(e.target.value)}
                        className="w-4 h-4 text-orange-500"
                      />
                      <div className="flex items-center gap-2">
                        {rating.stars > 0 && (
                          <>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(rating.stars)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </>
                        )}
                        <span className="text-gray-900">{rating.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Promotion Banner */}
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                  <Flame className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">Ưu đãi đặc biệt!</h3>
                <p className="text-sm opacity-90 mb-4">
                  Giảm đến 30% cho tất cả sách bán chạy
                </p>
                <div className="text-xs opacity-75">Áp dụng đến 31/03/2026</div>
              </div>
            </div>
          )}

          {/* Books Grid/List */}
          <div className={showFilters ? 'col-span-9' : 'col-span-12'}>
            <div className="mb-4 text-sm text-gray-600">
              Hiển thị <span className="font-bold text-gray-900">{books.length}</span>{' '}
              sản phẩm
            </div>

            {viewMode === 'grid' ? (
              <div
                className={`grid gap-6 ${
                  showFilters ? 'grid-cols-3' : 'grid-cols-4'
                }`}
              >
                {books.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white rounded-xl shadow-sm border hover:shadow-xl transition-all group overflow-hidden"
                  >
                    {/* Book Image */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />

                      {/* Badge */}
                      {book.badge && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          {book.badge}
                        </div>
                      )}

                      {/* Discount Badge */}
                      {book.discount && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                          -{book.discount}%
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/book/${book.id}`)}
                          className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all transform hover:scale-110"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all transform hover:scale-110">
                          <Heart className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Book Info */}
                    <div className="p-4">
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
                          ({book.reviews})
                        </span>
                      </div>

                      <h3
                        className="font-bold text-gray-900 mb-1 line-clamp-2 cursor-pointer hover:text-orange-600 transition-colors"
                        onClick={() => navigate(`/book/${book.id}`)}
                      >
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">{book.author}</p>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl font-bold text-orange-600">
                          {book.price}
                        </span>
                        {book.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            {book.originalPrice}
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-gray-500 mb-3">
                        <Flame className="w-3 h-3 inline mr-1" />
                        Đã bán {book.sold.toLocaleString()}
                      </div>

                      <button
                        onClick={() =>
                          addToCart({
                            id: book.id,
                            title: book.title,
                            author: book.author,
                            price: book.price,
                            image: book.image,
                            quantity: 1,
                          })
                        }
                        className="w-full bg-orange-500 text-white py-2.5 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Thêm vào giỏ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {books.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all p-4 flex gap-4"
                  >
                    {/* Book Image */}
                    <div className="w-32 h-44 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 relative">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                      {book.badge && (
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          {book.badge}
                        </div>
                      )}
                      {book.discount && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold">
                          -{book.discount}%
                        </div>
                      )}
                    </div>

                    {/* Book Info */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3
                            className="text-xl font-bold text-gray-900 mb-1 cursor-pointer hover:text-orange-600 transition-colors"
                            onClick={() => navigate(`/book/${book.id}`)}
                          >
                            {book.title}
                          </h3>
                          <p className="text-gray-600 mb-2">{book.author}</p>

                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-1">
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
                            </div>
                            <span className="text-sm text-gray-600">
                              {book.rating} ({book.reviews} đánh giá)
                            </span>
                          </div>

                          <div className="text-sm text-gray-500">
                            <Flame className="w-4 h-4 inline mr-1" />
                            Đã bán {book.sold.toLocaleString()} sản phẩm
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-orange-600 mb-1">
                            {book.price}
                          </div>
                          {book.originalPrice && (
                            <div className="text-sm text-gray-400 line-through mb-2">
                              {book.originalPrice}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-auto flex items-center gap-3">
                        <button
                          onClick={() =>
                            addToCart({
                              id: book.id,
                              title: book.title,
                              author: book.author,
                              price: book.price,
                              image: book.image,
                              quantity: 1,
                            })
                          }
                          className="flex-1 bg-orange-500 text-white py-2.5 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Thêm vào giỏ
                        </button>
                        <button
                          onClick={() => navigate(`/book/${book.id}`)}
                          className="px-6 py-2.5 border-2 border-orange-500 text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors"
                        >
                          Xem chi tiết
                        </button>
                        <button className="w-10 h-10 border-2 border-gray-200 rounded-lg flex items-center justify-center hover:border-red-500 hover:text-red-500 transition-colors">
                          <Heart className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-center gap-2">
              <button className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:text-orange-600 transition-colors font-medium">
                Trước
              </button>
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    page === 1
                      ? 'bg-orange-500 text-white'
                      : 'border-2 border-gray-200 hover:border-orange-500 hover:text-orange-600'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:text-orange-600 transition-colors font-medium">
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

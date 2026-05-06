import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ChevronRight,
  Home,
  Filter,
  SlidersHorizontal,
  Star,
  Grid3x3,
  List,
  Heart,
  ShoppingCart,
  Eye,
  X,
  Sparkles,
  Tag,
  BookOpen,
  TrendingUp,
  Award,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  image: string;
  bookCount: number;
}

export function CategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Categories data
  const categories: Record<string, Category> = {
    'van-hoc': {
      id: 'van-hoc',
      name: 'Văn học',
      description: 'Khám phá thế giới văn chương phong phú với những tác phẩm kinh điển và đương đại',
      icon: BookOpen,
      color: 'from-purple-500 to-pink-500',
      image: 'https://images.unsplash.com/photo-1761319115156-d758b22ed57b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXRlcmF0dXJlJTIwY2xhc3NpYyUyMGJvb2tzfGVufDF8fHx8MTc3Mzg0OTU1MXww&ixlib=rb-4.1.0&q=80&w=1080',
      bookCount: 1234,
    },
    'kinh-te': {
      id: 'kinh-te',
      name: 'Kinh tế - Kinh doanh',
      description: 'Nâng cao kiến thức về kinh tế, tài chính và kỹ năng quản trị doanh nghiệp',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500',
      image: 'https://images.unsplash.com/photo-1747037632512-3bea94e6e618?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGVjb25vbWljcyUyMGJvb2tzfGVufDF8fHx8MTc3Mzg0OTU1MXww&ixlib=rb-4.1.0&q=80&w=1080',
      bookCount: 876,
    },
    'phat-trien-ban-than': {
      id: 'phat-trien-ban-than',
      name: 'Phát triển bản thân',
      description: 'Rèn luyện kỹ năng sống, tư duy tích cực và phát triển toàn diện bản thân',
      icon: Sparkles,
      color: 'from-orange-500 to-yellow-500',
      image: 'https://images.unsplash.com/photo-1546913760-e23d946dd386?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWxmJTIwaGVscCUyMGJvb2t8ZW58MXx8fHwxNzczODQ3MDAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      bookCount: 654,
    },
    'thieu-nhi': {
      id: 'thieu-nhi',
      name: 'Thiếu nhi',
      description: 'Sách thiếu nhi đầy màu sắc, bổ ích cho sự phát triển của trẻ em',
      icon: Award,
      color: 'from-green-500 to-emerald-500',
      image: 'https://images.unsplash.com/photo-1705660800046-2113f479369a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGJvb2tzJTIwY29sb3JmdWx8ZW58MXx8fHwxNzczODQzNjIzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      bookCount: 432,
    },
  };

  const currentCategory = categories[category || 'van-hoc'] || categories['van-hoc'];

  // Subcategories based on main category
  const subCategories: Record<string, Array<{ id: string; name: string; count: number }>> = {
    'van-hoc': [
      { id: 'all', name: 'Tất cả', count: 1234 },
      { id: 'tieu-thuyet', name: 'Tiểu thuyết', count: 456 },
      { id: 'tho-ca', name: 'Thơ ca', count: 234 },
      { id: 'truyen-ngan', name: 'Truyện ngắn', count: 345 },
      { id: 'ky-su', name: 'Ký sự', count: 199 },
    ],
    'kinh-te': [
      { id: 'all', name: 'Tất cả', count: 876 },
      { id: 'tai-chinh', name: 'Tài chính cá nhân', count: 234 },
      { id: 'quan-tri', name: 'Quản trị kinh doanh', count: 345 },
      { id: 'marketing', name: 'Marketing', count: 198 },
      { id: 'khoi-nghiep', name: 'Khởi nghiệp', count: 99 },
    ],
    'phat-trien-ban-than': [
      { id: 'all', name: 'Tất cả', count: 654 },
      { id: 'ky-nang-song', name: 'Kỹ năng sống', count: 234 },
      { id: 'tam-ly', name: 'Tâm lý học', count: 189 },
      { id: 'thanh-cong', name: 'Bí quyết thành công', count: 156 },
      { id: 'giao-tiep', name: 'Giao tiếp', count: 75 },
    ],
    'thieu-nhi': [
      { id: 'all', name: 'Tất cả', count: 432 },
      { id: 'truyen-tranh', name: 'Truyện tranh', count: 156 },
      { id: 'co-tich', name: 'Cổ tích', count: 123 },
      { id: 'giao-duc', name: 'Giáo dục', count: 98 },
      { id: 'tu-dien', name: 'Từ điển', count: 55 },
    ],
  };

  const currentSubCategories = subCategories[category || 'van-hoc'] || subCategories['van-hoc'];

  // Mock books data
  const books = [
    {
      id: 1,
      title: 'Nhà Giả Kim',
      author: 'Paulo Coelho',
      price: '89.000đ',
      originalPrice: '129.000đ',
      discount: 31,
      rating: 4.8,
      reviews: 2543,
      sold: 5234,
      image: 'https://images.unsplash.com/photo-1761319115156-d758b22ed57b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXRlcmF0dXJlJTIwY2xhc3NpYyUyMGJvb2tzfGVufDF8fHx8MTc3Mzg0OTU1MXww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'van-hoc',
      badge: 'BEST SELLER',
      isNew: false,
    },
    {
      id: 2,
      title: 'Đắc Nhân Tâm',
      author: 'Dale Carnegie',
      price: '79.000đ',
      originalPrice: '109.000đ',
      discount: 27,
      rating: 4.9,
      reviews: 3421,
      sold: 8765,
      image: 'https://images.unsplash.com/photo-1546913760-e23d946dd386?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWxmJTIwaGVscCUyMGJvb2t8ZW58MXx8fHwxNzczODQ3MDAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'phat-trien-ban-than',
      badge: 'HOT',
      isNew: false,
    },
    {
      id: 3,
      title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
      author: 'Rosie Nguyễn',
      price: '69.000đ',
      originalPrice: '99.000đ',
      discount: 30,
      rating: 4.7,
      reviews: 1876,
      sold: 4321,
      image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwcmVhZGluZ3xlbnwxfHx8fDE3NzM4NDcwMDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'phat-trien-ban-than',
      badge: 'NEW',
      isNew: true,
    },
    {
      id: 4,
      title: 'Sapiens: Lược Sử Loài Người',
      author: 'Yuval Noah Harari',
      price: '189.000đ',
      originalPrice: '249.000đ',
      discount: 24,
      rating: 4.8,
      reviews: 2134,
      sold: 3456,
      image: 'https://images.unsplash.com/photo-1768224946689-b599f1d406f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3B1bGFyJTIwYm9va3MlMjBzdGFja3xlbnwxfHx8fDE3NzM4NDkzMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'van-hoc',
      badge: null,
      isNew: false,
    },
    {
      id: 5,
      title: 'Think and Grow Rich',
      author: 'Napoleon Hill',
      price: '129.000đ',
      originalPrice: '169.000đ',
      discount: 24,
      rating: 4.6,
      reviews: 1543,
      sold: 2876,
      image: 'https://images.unsplash.com/photo-1747037632512-3bea94e6e618?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGVjb25vbWljcyUyMGJvb2tzfGVufDF8fHx8MTc3Mzg0OTU1MXww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'kinh-te',
      badge: null,
      isNew: false,
    },
    {
      id: 6,
      title: 'Doraemon Tập 1',
      author: 'Fujiko F. Fujio',
      price: '25.000đ',
      originalPrice: '35.000đ',
      discount: 29,
      rating: 4.9,
      reviews: 5432,
      sold: 9876,
      image: 'https://images.unsplash.com/photo-1705660800046-2113f479369a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGJvb2tzJTIwY29sb3JmdWx8ZW58MXx8fHwxNzczODQzNjIzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'thieu-nhi',
      badge: 'BEST SELLER',
      isNew: false,
    },
    {
      id: 7,
      title: 'The 4-Hour Workweek',
      author: 'Tim Ferriss',
      price: '149.000đ',
      originalPrice: '199.000đ',
      discount: 25,
      rating: 4.5,
      reviews: 987,
      sold: 1234,
      image: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNlJTIwYm9va3xlbnwxfHx8fDE3NzM4NDcwMDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'kinh-te',
      badge: 'NEW',
      isNew: true,
    },
    {
      id: 8,
      title: 'Mắt Biếc',
      author: 'Nguyễn Nhật Ánh',
      price: '69.000đ',
      originalPrice: '89.000đ',
      discount: 22,
      rating: 4.8,
      reviews: 4321,
      sold: 7654,
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWN0aW9uJTIwYm9va3xlbnwxfHx8fDE3NzM4NDcwMDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'van-hoc',
      badge: 'HOT',
      isNew: false,
    },
  ];

  const priceRanges = [
    { id: 'all', name: 'Tất cả mức giá' },
    { id: '0-50', name: 'Dưới 50.000đ' },
    { id: '50-100', name: '50.000đ - 100.000đ' },
    { id: '100-150', name: '100.000đ - 150.000đ' },
    { id: '150-200', name: '150.000đ - 200.000đ' },
    { id: '200+', name: 'Trên 200.000đ' },
  ];

  const sortOptions = [
    { id: 'popular', name: 'Phổ biến nhất' },
    { id: 'bestseller', name: 'Bán chạy' },
    { id: 'rating', name: 'Đánh giá cao' },
    { id: 'price-low', name: 'Giá thấp đến cao' },
    { id: 'price-high', name: 'Giá cao đến thấp' },
    { id: 'newest', name: 'Mới nhất' },
  ];

  const CategoryIcon = currentCategory.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-orange-600 transition-colors"
            >
              <Home className="w-4 h-4" />
            </button>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-orange-600 transition-colors"
            >
              Danh mục
            </button>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-orange-600 font-medium">
              {currentCategory.name}
            </span>
          </div>
        </div>
      </div>

      {/* Category Hero */}
      <div className={`bg-gradient-to-r ${currentCategory.color} text-white`}>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-12 gap-8 items-center">
            <div className="col-span-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <CategoryIcon className="w-9 h-9" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">{currentCategory.name}</h1>
                  <p className="text-lg opacity-90">{currentCategory.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>{currentCategory.bookCount.toLocaleString()} sách</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  <span>Giảm đến 35%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                  <span>Đánh giá cao</span>
                </div>
              </div>
            </div>
            <div className="col-span-4">
              <div className="relative">
                <img
                  src={currentCategory.image}
                  alt={currentCategory.name}
                  className="w-full h-64 object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Other Categories */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 overflow-x-auto">
            {Object.values(categories).map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/category/${cat.id}`)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl border-2 transition-all whitespace-nowrap ${
                    cat.id === currentCategory.id
                      ? 'border-orange-500 bg-orange-50 text-orange-600'
                      : 'border-gray-200 hover:border-orange-300 text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors lg:hidden"
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

            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-bold text-gray-900">{books.length}</span> sản phẩm
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
          </div>

          {/* Active Filters */}
          {(selectedSubCategory !== 'all' ||
            selectedPriceRange !== 'all' ||
            selectedRating !== 'all') && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-gray-600">Đang lọc:</span>
              {selectedSubCategory !== 'all' && (
                <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                  <span>
                    {currentSubCategories.find((c) => c.id === selectedSubCategory)?.name}
                  </span>
                  <button onClick={() => setSelectedSubCategory('all')}>
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
                  setSelectedSubCategory('all');
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
          {/* Sidebar */}
          <div className="col-span-3 space-y-6">
            {/* Subcategory Filter */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-orange-600" />
                Danh mục con
              </h3>
              <div className="space-y-2">
                {currentSubCategories.map((subCat) => (
                  <label
                    key={subCat.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="subcategory"
                        value={subCat.id}
                        checked={selectedSubCategory === subCat.id}
                        onChange={(e) => setSelectedSubCategory(e.target.value)}
                        className="w-4 h-4 text-orange-500"
                      />
                      <span className="text-gray-900">{subCat.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">({subCat.count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-orange-600" />
                Khoảng giá
              </h3>
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
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-orange-600 fill-orange-600" />
                Đánh giá
              </h3>
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

            {/* Featured Banner */}
            <div className={`bg-gradient-to-br ${currentCategory.color} rounded-xl p-6 text-white`}>
              <CategoryIcon className="w-12 h-12 mb-4 opacity-80" />
              <h3 className="font-bold text-lg mb-2">Khuyến mãi đặc biệt!</h3>
              <p className="text-sm opacity-90 mb-4">
                Giảm giá đến 35% cho tất cả sách trong danh mục {currentCategory.name}
              </p>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm">
                <Tag className="w-4 h-4" />
                <span>Áp dụng đến 31/03/2026</span>
              </div>
            </div>
          </div>

          {/* Books Grid/List */}
          <div className="col-span-9">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-3 gap-6">
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

                      {/* Badges */}
                      {book.badge && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          {book.badge}
                        </div>
                      )}

                      {book.isNew && (
                        <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          MỚI
                        </div>
                      )}

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

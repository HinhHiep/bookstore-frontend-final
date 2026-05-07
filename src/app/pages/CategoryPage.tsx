import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ChevronRight,
  Home,
  Filter,
  SlidersHorizontal,
  Star,
  Grid3x3,
  List,
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
import api from '../utils/api';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  image: string;
  bookCount: number;
}

interface BackendCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  bookCount?: number;
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
  const [currentPage, setCurrentPage] = useState(1);

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
  const currentFallbackCategory = categories[category || 'van-hoc'] || categories['van-hoc'];

  interface CategoryBook {
    _id: string;
    title: string;
    author: string;
    price: number;
    discountPrice?: number | null;
    rating?: number;
    reviewCount?: number;
    sold?: number;
    coverImage?: string;
    images?: string[];
    isNewArrival?: boolean;
    isDiscount?: boolean;
  }

  const [books, setBooks] = useState<CategoryBook[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [categoryData, setCategoryData] = useState<BackendCategory | null>(null);
  const [rootCategories, setRootCategories] = useState<BackendCategory[]>([]);
  const [childrenCategories, setChildrenCategories] = useState<BackendCategory[]>([]);
  const [categoryNotFound, setCategoryNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [subCategoryCounts, setSubCategoryCounts] = useState<Record<string, number>>({});

  const iconBySlug: Record<string, any> = {
    'van-hoc': BookOpen,
    'kinh-te': TrendingUp,
    'phat-trien-ban-than': Sparkles,
    'thieu-nhi': Award,
  };

  const currentCategoryWithDisplay: Category = {
    ...currentFallbackCategory,
    id: categoryData?.slug || currentFallbackCategory.id,
    name: categoryData?.name || currentFallbackCategory.name,
    description: categoryData?.description || currentFallbackCategory.description,
    image: categoryData?.image || currentFallbackCategory.image,
    icon: iconBySlug[categoryData?.slug || ''] || currentFallbackCategory.icon,
    bookCount:
      Object.values(subCategoryCounts).reduce((sum, value) => sum + value, 0) ||
      categoryData?.bookCount ||
      books.length ||
      currentFallbackCategory.bookCount,
  };

  const totalBooksCount = Object.values(subCategoryCounts).reduce((sum, value) => sum + value, 0);

  const currentSubCategories = [
    { id: 'all', name: 'Tất cả', count: totalBooksCount },
    ...childrenCategories.map((sub) => ({
      id: sub._id,
      name: sub.name,
      count: subCategoryCounts[sub._id] ?? 0,
    })),
  ];

  
  const getSortParams = () => {
    switch (sortBy) {
      case 'price-low':
        return { sortBy: 'price', sortOrder: 1 };
      case 'price-high':
        return { sortBy: 'price', sortOrder: -1 };
      case 'rating':
        return { sortBy: 'rating', sortOrder: -1 };
      case 'bestseller':
      case 'popular':
        return { sortBy: 'sold', sortOrder: -1 };
      case 'newest':
      default:
        return { sortBy: 'createdAt', sortOrder: -1 };
    }
  };

  const getApiFilterParams = () => {
    const params: Record<string, number> = {};

    if (selectedPriceRange === '0-50') {
      params.maxPrice = 50000;
    } else if (selectedPriceRange === '50-100') {
      params.minPrice = 50000;
      params.maxPrice = 100000;
    } else if (selectedPriceRange === '100-150') {
      params.minPrice = 100000;
      params.maxPrice = 150000;
    } else if (selectedPriceRange === '150-200') {
      params.minPrice = 150000;
      params.maxPrice = 200000;
    } else if (selectedPriceRange === '200+') {
      params.minPrice = 200000;
    }

    if (selectedRating === '4+') {
      params.minRating = 4;
    } else if (selectedRating === '4.5+') {
      params.minRating = 4.5;
    }

    return params;
  };

  function formatCurrency(value: number) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  }

  useEffect(() => {
    setSelectedSubCategory('all');
    setCurrentPage(1);
  }, [category]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSubCategory, selectedPriceRange, selectedRating, sortBy]);

  useEffect(() => {
    const nextTotalPages = Math.max(1, Math.ceil(books.length / 12));
    if (currentPage > nextTotalPages) {
      setCurrentPage(nextTotalPages);
    }
  }, [books, currentPage]);

  useEffect(() => {
    const loadCategoryBooks = async () => {
      if (!category) {
        setBooks([]);
        setLoadingBooks(false);
        return;
      }

      setLoadingBooks(true);
      setCategoryNotFound(false);
      setErrorMessage('');

      try {
        const rootResponse = await api.get('/categories', {
          params: { parentId: 'null', limit: 100 },
        });
        setRootCategories(rootResponse.data.data || []);

        const categoryResponse = await api.get(`/categories/slug/${category}`);
        const categoryInfo = categoryResponse.data.data;
        setCategoryData(categoryInfo);

        const childResponse = await api.get(`/categories/${categoryInfo._id}/children`);
        const children = childResponse.data.data || [];
        setChildrenCategories(children);

        const sortParams = getSortParams();
        const filterParams = getApiFilterParams();
        const categoryIds = [categoryInfo._id, ...children.map((c: BackendCategory) => c._id)];

        const countResults = await Promise.all(
          categoryIds.map((id: string) =>
            api.get('/books', {
              params: {
                categoryId: id,
                page: 1,
                limit: 1,
                ...filterParams,
              },
            }),
          ),
        );

        const nextCounts: Record<string, number> = {};
        countResults.forEach((res, idx) => {
          const id = categoryIds[idx];
          nextCounts[id] = res.data?.pagination?.total ?? 0;
        });
        setSubCategoryCounts(nextCounts);

        if (selectedSubCategory !== 'all') {
          const booksResponse = await api.get('/books', {
            params: {
              categoryId: selectedSubCategory,
              page: 1,
              limit: 200,
              ...sortParams,
              ...filterParams,
            },
          });
          setBooks(booksResponse.data.data || booksResponse.data || []);
        } else {
          const bookResults = await Promise.all(
            categoryIds.map((id: string) =>
              api.get('/books', {
                params: {
                  categoryId: id,
                  page: 1,
                  limit: 200,
                  ...sortParams,
                  ...filterParams,
                },
              }),
            ),
          );

          const merged: CategoryBook[] = bookResults
            .flatMap((res) => res.data.data || res.data || [])
            .filter((book: CategoryBook, index: number, arr: CategoryBook[]) => (
              arr.findIndex((item) => item._id === book._id) === index
            ));

          const sortedMerged = [...merged].sort((a, b) => {
            const priceA = a.discountPrice ?? a.price;
            const priceB = b.discountPrice ?? b.price;
            const ratingA = a.rating ?? 0;
            const ratingB = b.rating ?? 0;
            const soldA = a.sold ?? 0;
            const soldB = b.sold ?? 0;

            if (sortBy === 'price-low') return priceA - priceB;
            if (sortBy === 'price-high') return priceB - priceA;
            if (sortBy === 'rating') return ratingB - ratingA;
            if (sortBy === 'bestseller' || sortBy === 'popular') return soldB - soldA;
            return 0;
          });

          setBooks(sortedMerged);
        }
      } catch (error) {
        console.error('Failed to load category books', error);
        const status = (error as any)?.response?.status;
        if (status === 404) {
          setCategoryNotFound(true);
        } else {
          setErrorMessage('Dang co su co khi tai du lieu. Ban vui long thu lai sau it phut.');
        }
        setBooks([]);
      } finally {
        setLoadingBooks(false);
      }
    };

    loadCategoryBooks();
  }, [category, selectedSubCategory, selectedPriceRange, selectedRating, sortBy]);

  const booksLoaded = !loadingBooks && !categoryNotFound && !errorMessage;
  const pageSize = 12;
  const totalPages = Math.max(1, Math.ceil(books.length / pageSize));
  const paginatedBooks = books.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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

  const displayCategories = rootCategories.length
    ? rootCategories.map((cat) => ({
        id: cat.slug,
        name: cat.name,
        icon: iconBySlug[cat.slug] || BookOpen,
      }))
    : Object.values(categories).map((cat) => ({
        id: cat.id,
        name: cat.name,
        icon: cat.icon,
      }));

  const CategoryIcon = currentCategoryWithDisplay.icon;

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
              {currentCategoryWithDisplay.name}
            </span>
              
              
          </div>
        </div>
      </div>

      {/* Category Hero */}
      <div className={`bg-gradient-to-r ${currentCategoryWithDisplay.color} text-white`}>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-12 gap-8 items-center">
            <div className="col-span-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <CategoryIcon className="w-9 h-9" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">{currentCategoryWithDisplay.name}</h1>
                  <p className="text-lg opacity-90">{currentCategoryWithDisplay.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>{currentCategoryWithDisplay.bookCount.toLocaleString()} sách</span>
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
                  src={currentCategoryWithDisplay.image}
                  alt={currentCategoryWithDisplay.name}
                  className="w-full h-64 object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Other Categories */}
      {/* <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 overflow-x-auto">
            {displayCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/category/${cat.id}`)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl border-2 transition-all whitespace-nowrap ${
                    cat.id === (category || 'van-hoc')
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
      </div> */}

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
            <div className={`bg-gradient-to-br ${currentCategoryWithDisplay.color} rounded-xl p-6 text-white`}>
              <CategoryIcon className="w-12 h-12 mb-4 opacity-80" />
              <h3 className="font-bold text-lg mb-2">Khuyến mãi đặc biệt!</h3>
              <p className="text-sm opacity-90 mb-4">
                Giảm giá đến 35% cho tất cả sách trong danh mục {currentCategoryWithDisplay.name}
              </p>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm">
                <Tag className="w-4 h-4" />
                <span>Áp dụng đến 31/03/2026</span>
              </div>
            </div>
          </div>

          {/* Books Grid/List */}
          <div className="col-span-9">
            {loadingBooks ? (
              <div className="bg-white border rounded-xl p-8 text-center text-gray-600">
                Dang tai danh sach sach...
              </div>
            ) : paginatedBooks.length === 0 ? (
              <div className="bg-white border rounded-xl p-8 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Chua tim thay sach phu hop
                </h3>
                <p className="text-gray-600 mb-4">
                  Ban thu dieu chinh bo loc hoac quay lai tat ca danh muc con nhe.
                </p>
                <button
                  onClick={() => {
                    setSelectedSubCategory('all');
                    setSelectedPriceRange('all');
                    setSelectedRating('all');
                    setSortBy('popular');
                  }}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Dat lai bo loc
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-3 gap-6">
                {paginatedBooks.map((book) => {
                  const imageSrc = book.coverImage || book.images?.[0] || `https://picsum.photos/seed/${book._id}/360/480`;
                  const displayPrice = book.discountPrice ?? book.price;
                  const originalPrice = book.discountPrice ? book.price : null;
                  const discountPercent = originalPrice ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : 0;
                  const reviews = book.reviewCount ?? 0;
                  const ratingValue = book.rating ?? 0;

                  return (
                    <div
                      key={book._id}
                      className="bg-white rounded-xl shadow-sm border hover:shadow-xl transition-all group overflow-hidden"
                    >
                    {/* Book Image */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                      <img
                        src={imageSrc}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />

                      {/* Badges */}
                      {book.isNewArrival && (
                        <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          MỚI
                        </div>
                      )}

                      {discountPercent > 0 && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                          -{discountPercent}%
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/book/${book._id}`)}
                          className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all transform hover:scale-110"
                        >
                          <Eye className="w-5 h-5" />
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
                              i < Math.floor(ratingValue)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">
                          ({reviews})
                        </span>
                      </div>

                      <h3
                        className="font-bold text-gray-900 mb-1 line-clamp-2 cursor-pointer hover:text-orange-600 transition-colors"
                        onClick={() => navigate(`/book/${book._id}`)}
                      >
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">{book.author}</p>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl font-bold text-orange-600">
                          {formatCurrency(displayPrice)}
                        </span>
                        {originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            {formatCurrency(originalPrice)}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() =>
                          addToCart({
                            id: book._id,
                            title: book.title,
                            author: book.author,
                            price: formatCurrency(displayPrice),
                            image: imageSrc,
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
                );
              })}
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedBooks.map((book) => {
                  const imageSrc = book.coverImage || book.images?.[0] || `https://picsum.photos/seed/${book._id}/360/480`;
                  const displayPrice = book.discountPrice ?? book.price;
                  const originalPrice = book.discountPrice ? book.price : null;
                  const discountPercent = originalPrice ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : 0;
                  const reviews = book.reviewCount ?? 0;
                  const ratingValue = book.rating ?? 0;
                  const soldCount = book.sold ?? 0;

                  return (
                  <div
                    key={book._id}
                    className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all p-4 flex gap-4"
                  >
                    <div className="w-32 h-44 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 relative">
                      <img
                        src={imageSrc}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                      {book.isNewArrival && (
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          MỚI
                        </div>
                      )}
                      {discountPercent > 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold">
                          -{discountPercent}%
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3
                            className="text-xl font-bold text-gray-900 mb-1 cursor-pointer hover:text-orange-600 transition-colors"
                            onClick={() => navigate(`/book/${book._id}`)}
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
                                    i < ratingValue
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">
                              {ratingValue.toFixed(1)} ({reviews} đánh giá)
                            </span>
                          </div>

                          <div className="text-sm text-gray-500">
                            Đã bán {soldCount.toLocaleString()} sản phẩm
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-orange-600 mb-1">
                            {formatCurrency(displayPrice)}
                          </div>
                          {originalPrice && (
                            <div className="text-sm text-gray-400 line-through mb-2">
                              {formatCurrency(originalPrice)}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-auto flex items-center gap-3">
                        <button
                          onClick={() =>
                            addToCart({
                              id: book._id,
                              title: book.title,
                              author: book.author,
                              price: formatCurrency(displayPrice),
                              image: imageSrc,
                              quantity: 1,
                            })
                          }
                          className="flex-1 bg-orange-500 text-white py-2.5 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Thêm vào giỏ
                        </button>
                        <button
                          onClick={() => navigate(`/book/${book._id}`)}
                          className="px-6 py-2.5 border-2 border-orange-500 text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors"
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:text-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Truoc
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      page === currentPage
                        ? 'bg-orange-500 text-white'
                        : 'border-2 border-gray-200 hover:border-orange-500 hover:text-orange-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:text-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            )}
            </div>
          </div>
        </div>
    </div>
  );
}








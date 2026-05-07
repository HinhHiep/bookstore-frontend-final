import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  TrendingUp,
  Filter,
  SlidersHorizontal,
  Star,
  Flame,
  Award,
  Grid3x3,
  List,
  ShoppingCart,
  Eye,
  X,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

interface BackendCategory {
  _id: string;
  name: string;
  slug: string;
}

interface BookItem {
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
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
}

export function BestSellersPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [sortBy, setSortBy] = useState('bestseller');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rootCategories, setRootCategories] = useState<BackendCategory[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  const getSortParams = () => {
    switch (sortBy) {
      case 'rating':
        return { sortBy: 'rating', sortOrder: -1 };
      case 'price-low':
        return { sortBy: 'price', sortOrder: 1 };
      case 'price-high':
        return { sortBy: 'price', sortOrder: -1 };
      case 'newest':
        return { sortBy: 'createdAt', sortOrder: -1 };
      case 'bestseller':
      default:
        return { sortBy: 'sold', sortOrder: -1 };
    }
  };

  const getFilterParams = () => {
    const params: Record<string, number> = {};

    if (selectedPriceRange === '0-100') {
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

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get('/categories', { params: { parentId: 'null', limit: 100 } });
        setRootCategories(res.data.data || []);
      } catch (e) {
        console.error('Failed to load root categories', e);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedPriceRange, selectedRating, sortBy]);

  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      setError('');

      try {
        const sortParams = getSortParams();
        const filterParams = getFilterParams();

        const params: Record<string, any> = {
          page: 1,
          limit: 200,
          ...sortParams,
          ...filterParams,
        };

        if (selectedCategory !== 'all') {
          params.categoryId = selectedCategory;
        }

        const booksRes = await api.get('/books', { params });
        setBooks(booksRes.data.data || []);

        if (rootCategories.length > 0) {
          const countsRes = await Promise.all(
            rootCategories.map((cat) =>
              api.get('/books', {
                params: {
                  page: 1,
                  limit: 1,
                  categoryId: cat._id,
                  ...filterParams,
                },
              }),
            ),
          );

          const nextCounts: Record<string, number> = {};
          countsRes.forEach((res, idx) => {
            nextCounts[rootCategories[idx]._id] = res.data?.pagination?.total ?? 0;
          });
          setCategoryCounts(nextCounts);
        }
      } catch (e) {
        console.error('Failed to load bestseller books', e);
        setBooks([]);
        setError('Đang tải sách bán chạy thất bại. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [selectedCategory, selectedPriceRange, selectedRating, sortBy, rootCategories]);

  const categories = useMemo(() => {
    const total = Object.values(categoryCounts).reduce((sum, value) => sum + value, 0);
    return [
      { id: 'all', name: 'Tất cả', count: total || books.length },
      ...rootCategories.map((cat) => ({
        id: cat._id,
        name: cat.name,
        count: categoryCounts[cat._id] ?? 0,
      })),
    ];
  }, [rootCategories, categoryCounts, books.length]);

  const priceRanges = [
    { id: 'all', name: 'ất cả mức giá' },
    { id: '0-100', name: 'Dưới 100.000d' },
    { id: '100-150', name: '100.000d - 150.000d' },
    { id: '150-200', name: '150.000d - 200.000d' },
    { id: '200+', name: 'Trên 200.000d' },
  ];

  const sortOptions = [
    { id: 'bestseller', name: 'Bán chạy nhất' },
    { id: 'rating', name: 'Đánh giá cao' },
    { id: 'price-low', name: 'Giá thấp đến cao' },
    { id: 'price-high', name: 'Giá cao đến thấp' },
    { id: 'newest', name: 'Mới nhất' },
  ];

  const pageSize = 12;
  const totalPages = Math.max(1, Math.ceil(books.length / pageSize));
  const paginatedBooks = books.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const totalSold = books.reduce((sum, b) => sum + (b.sold || 0), 0);
  const avgRating = books.length
    ? books.reduce((sum, b) => sum + (b.rating || 0), 0) / books.length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
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
              <p className="text-lg opacity-90 mb-4">Danh sách sách có lượt bán cao nhất từ hệ thống thực.</p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <span>Top sách bán chạy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5" />
                  <span>ập nhật từ API</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  <span>Lọc theo đánh giá</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-orange-600 mb-1">{books.length}</div>
            <div className="text-sm text-gray-600">Sách bán chạy</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-600 mb-1">{totalSold.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Lượt bán</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-600 mb-1">{avgRating.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Đánh giá TB</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-600 mb-1">-{Math.max(...books.map((b) => (b.discountPrice && b.price ? Math.round(((b.price - b.discountPrice) / b.price) * 100) : 0)), 0)}%</div>
            <div className="text-sm text-gray-600">Giảm giá tối đa</div>
          </div>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Filter className="w-5 h-5" />
                <span className="font-medium">Bộ lọc</span>
              </button>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent border-none outline-none font-medium text-gray-900 cursor-pointer">
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>{option.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}><Grid3x3 className="w-5 h-5" /></button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}><List className="w-5 h-5" /></button>
            </div>
          </div>

          {(selectedCategory !== 'all' || selectedPriceRange !== 'all' || selectedRating !== 'all') && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-gray-600">Đang áp dụng bộ lọc:</span>
              {selectedCategory !== 'all' && (
                <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                  <span>{categories.find((c) => c.id === selectedCategory)?.name}</span>
                  <button onClick={() => setSelectedCategory('all')}><X className="w-4 h-4" /></button>
                </div>
              )}
              {selectedPriceRange !== 'all' && (
                <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                  <span>{priceRanges.find((p) => p.id === selectedPriceRange)?.name}</span>
                  <button onClick={() => setSelectedPriceRange('all')}><X className="w-4 h-4" /></button>
                </div>
              )}
              {selectedRating !== 'all' && (
                <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                  <span>{selectedRating}</span>
                  <button onClick={() => setSelectedRating('all')}><X className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-12 gap-6">
          {showFilters && (
            <div className="col-span-3 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-bold text-gray-900 mb-4">Thể loại</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="category" value={category.id} checked={selectedCategory === category.id} onChange={(e) => setSelectedCategory(e.target.value)} className="w-4 h-4 text-orange-500" />
                        <span className="text-gray-900">{category.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">({category.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-bold text-gray-900 mb-4">Khoảng giá</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label key={range.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <input type="radio" name="price" value={range.id} checked={selectedPriceRange === range.id} onChange={(e) => setSelectedPriceRange(e.target.value)} className="w-4 h-4 text-orange-500" />
                      <span className="text-gray-900">{range.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-bold text-gray-900 mb-4">Đánh giá</h3>
                <div className="space-y-2">
                  {[
                    { id: 'all', label: 'Tất cả' },
                    { id: '4+', label: '4 sao trở lên' },
                    { id: '4.5+', label: '4.5 sao trở lên' },
                  ].map((rating) => (
                    <label key={rating.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <input type="radio" name="rating" value={rating.id} checked={selectedRating === rating.id} onChange={(e) => setSelectedRating(e.target.value)} className="w-4 h-4 text-orange-500" />
                      <span className="text-gray-900">{rating.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className={showFilters ? 'col-span-9' : 'col-span-12'}>
            <div className="mb-4 text-sm text-gray-600">Hiển thị <span className="font-bold text-gray-900">{books.length}</span> sản phẩm</div>

            {loading ? (
              <div className="bg-white rounded-xl border p-8 text-center text-gray-600">Đang tải sách bán chạy...</div>
            ) : error ? (
              <div className="bg-white rounded-xl border p-8 text-center text-red-600">{error}</div>
            ) : paginatedBooks.length === 0 ? (
              <div className="bg-white rounded-xl border p-8 text-center text-gray-600">Không có sách phù hợp với bộ lọc hiện tại.</div>
            ) : viewMode === 'grid' ? (
              <div className={`grid gap-6 ${showFilters ? 'grid-cols-3' : 'grid-cols-4'}`}>
                {paginatedBooks.map((book, idx) => {
                  const imageSrc = book.coverImage || book.images?.[0] || `https://picsum.photos/seed/${book._id}/360/480`;
                  const displayPrice = book.discountPrice ?? book.price;
                  const originalPrice = book.discountPrice ? book.price : null;
                  const discount = originalPrice ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : 0;
                  const badge = currentPage === 1 && idx < 3 ? `TOP ${idx + 1}` : '';

                  return (
                    <div key={book._id} className="bg-white rounded-xl shadow-sm border hover:shadow-xl transition-all group overflow-hidden">
                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                        <img src={imageSrc} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        {badge && <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">{badge}</div>}
                        {discount > 0 && <div className="absolute top-3 right-3 bg-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold shadow-lg">-{discount}%</div>}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button onClick={() => navigate(`/book/${book._id}`)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all transform hover:scale-110"><Eye className="w-5 h-5" /></button>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < Math.floor(book.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                          <span className="text-sm text-gray-600 ml-1">({book.reviewCount || 0})</span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 cursor-pointer hover:text-orange-600 transition-colors" onClick={() => navigate(`/book/${book._id}`)}>{book.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{book.author}</p>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xl font-bold text-orange-600">{formatCurrency(displayPrice)}</span>
                          {originalPrice && <span className="text-sm text-gray-400 line-through">{formatCurrency(originalPrice)}</span>}
                        </div>
                        <div className="text-xs text-gray-500 mb-3"><Flame className="w-3 h-3 inline mr-1" />Da ban {(book.sold || 0).toLocaleString()}</div>
                        <button
                          onClick={() => addToCart({ id: book._id, title: book.title, author: book.author, price: formatCurrency(displayPrice), image: imageSrc, quantity: 1 })}
                          className="w-full bg-orange-500 text-white py-2.5 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="w-4 h-4" />Thêm vào giỏ hàng
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
                  const discount = originalPrice ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : 0;

                  return (
                    <div key={book._id} className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all p-4 flex gap-4">
                      <div className="w-32 h-44 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 relative">
                        <img src={imageSrc} alt={book.title} className="w-full h-full object-cover" />
                        {discount > 0 && <div className="absolute top-2 right-2 bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold">-{discount}%</div>}
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1 cursor-pointer hover:text-orange-600 transition-colors" onClick={() => navigate(`/book/${book._id}`)}>{book.title}</h3>
                            <p className="text-gray-600 mb-2">{book.author}</p>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(book.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">{(book.rating || 0).toFixed(1)} ({book.reviewCount || 0} danh gia)</span>
                            </div>
                            <div className="text-sm text-gray-500"><Flame className="w-4 h-4 inline mr-1" />Da ban {(book.sold || 0).toLocaleString()} san pham</div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-orange-600 mb-1">{formatCurrency(displayPrice)}</div>
                            {originalPrice && <div className="text-sm text-gray-400 line-through mb-2">{formatCurrency(originalPrice)}</div>}
                          </div>
                        </div>
                        <div className="mt-auto flex items-center gap-3">
                          <button
                            onClick={() => addToCart({ id: book._id, title: book.title, author: book.author, price: formatCurrency(displayPrice), image: imageSrc, quantity: 1 })}
                            className="flex-1 bg-orange-500 text-white py-2.5 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                          >
                            <ShoppingCart className="w-4 h-4" />Thêm vào giỏ hàng
                          </button>
                          <button onClick={() => navigate(`/book/${book._id}`)} className="px-6 py-2.5 border-2 border-orange-500 text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors">Xem chi tiet</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1} className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:text-orange-600 transition-colors font-medium disabled:opacity-50">Truoc</button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-lg font-medium transition-colors ${page === currentPage ? 'bg-orange-500 text-white' : 'border-2 border-gray-200 hover:border-orange-500 hover:text-orange-600'}`}>{page}</button>
                ))}
                <button onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:text-orange-600 transition-colors font-medium disabled:opacity-50">Sau</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

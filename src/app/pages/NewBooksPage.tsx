import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Sparkles,
  Filter,
  Star,
  Grid3x3,
  List,
  ShoppingCart,
  Eye,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import { toast } from 'sonner';

interface BackendBook {
  _id: string;
  title: string;
  author: string;
  price: number;
  finalPrice?: number;
  stock?: number;
  sold?: number;
  averageRating?: number;
  reviewCount?: number;
  coverImage?: string;
  images?: string[];
  categoryId?: string;
  createdAt?: string;
}

interface BackendCategory {
  _id: string;
  name: string;
}

const priceRanges = [
  { id: 'all', name: 'Tat ca muc gia' },
  { id: '0-150000', name: 'Duoi 150.000d' },
  { id: '150000-300000', name: '150.000d - 300.000d' },
  { id: '300000-500000', name: '300.000d - 500.000d' },
  { id: '500000+', name: 'Tren 500.000d' },
];

const sortOptions = [
  { id: 'newest', name: 'Moi nhat' },
  { id: 'rating', name: 'Danh gia cao' },
  { id: 'price-low', name: 'Gia thap den cao' },
  { id: 'price-high', name: 'Gia cao den thap' },
  { id: 'popular', name: 'Ban chay nhat' },
];

const formatPrice = (value: number) => `${value.toLocaleString('vi-VN')}d`;

const getImage = (book: BackendBook) => {
  if (book.coverImage && !book.coverImage.includes('example.com')) return book.coverImage;
  if (book.images?.[0] && !book.images[0].includes('example.com')) return book.images[0];
  return `https://picsum.photos/seed/${book._id}/360/480`;
};

export function NewBooksPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [books, setBooks] = useState<BackendBook[]>([]);
  const [categories, setCategories] = useState<BackendCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [booksRes, categoriesRes] = await Promise.all([
          api.get('/books/new', { params: { page: 1, limit: 48, days: 3650 } }),
          api.get('/categories'),
        ]);

        setBooks(booksRes.data?.data?.books || booksRes.data?.data || []);
        setCategories(categoriesRes.data?.data || []);
      } catch (error) {
        console.error('Failed to load new books', error);
        toast.error('Khong the tai danh sach sach moi');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categoryOptions = useMemo(() => {
    const base = [{ id: 'all', name: 'Tat ca', count: books.length }];
    const dynamic = categories
      .map((cat) => ({
        id: cat._id,
        name: cat.name,
        count: books.filter((b) => b.categoryId === cat._id).length,
      }))
      .filter((x) => x.count > 0);
    return [...base, ...dynamic];
  }, [books, categories]);

  const filteredBooks = useMemo(() => {
    let result = [...books];

    if (selectedCategory !== 'all') {
      result = result.filter((b) => b.categoryId === selectedCategory);
    }

    if (selectedPriceRange !== 'all') {
      result = result.filter((b) => {
        const price = b.finalPrice ?? b.price;
        if (selectedPriceRange === '500000+') return price >= 500000;
        const [min, max] = selectedPriceRange.split('-').map(Number);
        return price >= min && price <= max;
      });
    }

    if (selectedRating !== 'all') {
      const minRating = Number(selectedRating);
      result = result.filter((b) => (b.averageRating || 0) >= minRating);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'price-low':
          return (a.finalPrice ?? a.price) - (b.finalPrice ?? b.price);
        case 'price-high':
          return (b.finalPrice ?? b.price) - (a.finalPrice ?? a.price);
        case 'popular':
          return (b.sold || 0) - (a.sold || 0);
        default:
          return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
      }
    });

    return result;
  }, [books, selectedCategory, selectedPriceRange, selectedRating, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Sach Moi Phat Hanh</h1>
          </div>
          <p className="opacity-90">Du lieu duoc lay truc tiep tu backend.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <Filter className="w-4 h-4" /> Bo loc
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              {sortOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.name}</option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-indigo-100' : 'bg-gray-100'}`}><Grid3x3 className="w-4 h-4" /></button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-indigo-100' : 'bg-gray-100'}`}><List className="w-4 h-4" /></button>
            </div>
          </div>

          {showFilters && (
            <div className="grid md:grid-cols-3 gap-4 pt-4 mt-4 border-t">
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-3 py-2 border rounded-lg">
                {categoryOptions.map((cat) => <option key={cat.id} value={cat.id}>{cat.name} ({cat.count})</option>)}
              </select>

              <select value={selectedPriceRange} onChange={(e) => setSelectedPriceRange(e.target.value)} className="px-3 py-2 border rounded-lg">
                {priceRanges.map((range) => <option key={range.id} value={range.id}>{range.name}</option>)}
              </select>

              <select value={selectedRating} onChange={(e) => setSelectedRating(e.target.value)} className="px-3 py-2 border rounded-lg">
                <option value="all">Tat ca danh gia</option>
                <option value="4.5">Tu 4.5 sao</option>
                <option value="4">Tu 4 sao</option>
                <option value="3.5">Tu 3.5 sao</option>
              </select>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-500">Dang tai du lieu...</div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-16 text-gray-500">Khong co sach phu hop bo loc.</div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => {
              const image = getImage(book);
              const price = book.price;
              const finalPrice = book.finalPrice ?? book.price;
              const discount = price > finalPrice ? Math.round(((price - finalPrice) / price) * 100) : 0;
              return (
                <div key={book._id} className="bg-white rounded-xl shadow-sm hover:shadow-lg overflow-hidden">
                  <div className="relative">
                    <img src={image} alt={book.title} className="w-full h-72 object-cover" />
                    {discount > 0 && <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">-{discount}%</span>}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-2 min-h-[3rem]">{book.title}</h3>
                    <p className="text-sm text-gray-600">{book.author}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-600 my-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {(book.averageRating || 0).toFixed(1)} ({book.reviewCount || 0})
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-bold text-indigo-600">{formatPrice(finalPrice)}</span>
                      {discount > 0 && <span className="text-sm text-gray-400 line-through">{formatPrice(price)}</span>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/book/${book._id}`)} className="flex-1 border border-indigo-500 text-indigo-600 rounded-lg py-2 text-sm flex items-center justify-center gap-1"><Eye className="w-4 h-4" />Xem</button>
                      <button
                        onClick={() => addToCart({ id: book._id, title: book.title, author: book.author, price: formatPrice(finalPrice), image, quantity: 1 })}
                        className="flex-1 bg-indigo-600 text-white rounded-lg py-2 text-sm flex items-center justify-center gap-1"
                      >
                        <ShoppingCart className="w-4 h-4" />Gio
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBooks.map((book) => {
              const image = getImage(book);
              const price = book.price;
              const finalPrice = book.finalPrice ?? book.price;
              return (
                <div key={book._id} className="bg-white rounded-xl p-4 flex gap-4 shadow-sm">
                  <img src={image} alt={book.title} className="w-24 h-36 rounded object-cover" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{book.title}</h3>
                    <p className="text-sm text-gray-600">{book.author}</p>
                    <p className="text-sm text-gray-600 my-1">Danh gia: {(book.averageRating || 0).toFixed(1)} ({book.reviewCount || 0})</p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-bold text-indigo-600">{formatPrice(finalPrice)}</span>
                      {price > finalPrice && <span className="text-sm text-gray-400 line-through">{formatPrice(price)}</span>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/book/${book._id}`)} className="px-4 py-2 border rounded-lg">Xem chi tiet</button>
                      <button onClick={() => addToCart({ id: book._id, title: book.title, author: book.author, price: formatPrice(finalPrice), image, quantity: 1 })} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Them vao gio</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

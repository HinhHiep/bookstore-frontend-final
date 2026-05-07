import { useEffect, useMemo, useState } from 'react';
import { Eye, ShoppingCart, Star } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

interface Book {
  _id: string;
  title: string;
  author: string;
  description?: string;
  price: number;
  discountPrice?: number | null;
  rating?: number;
  reviewCount?: number;
  coverImage?: string;
  isNewArrival?: boolean;
}

type TabConfig = {
  id: string;
  label: string;
  endpoint?: string;
  params?: Record<string, string | number>;
};

const tabs: TabConfig[] = [
  {
    id: 'trending',
    label: 'BÁN CHẠY',
    endpoint: '/books/top',
    params: { limit: 5, sortBy: 'sold' },
  },
  {
    id: 'sale',
    label: 'GIẢM GIÁ',
    endpoint: '/books/discount',
    params: { page: 1, limit: 5, minDiscount: 10 },
  },
  {
    id: 'fiction',
    label: 'TIỂU THUYẾT',
    endpoint: '/books/search',
    params: { keyword: 'tieu thuyet', limit: 5 },
  },
  {
    id: 'business',
    label: 'KINH DOANH',
    endpoint: '/books/search',
    params: { keyword: 'kinh doanh', limit: 5 },
  },
  {
    id: 'startup',
    label: 'KHỞI NGHIỆP',
    endpoint: '/books/search',
    params: { keyword: 'startup', limit: 5 },
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
}

function getBooksFromResponse(responseData: any): Book[] {
  return responseData?.data || responseData || [];
}

function getImageSrc(book: Book) {
  if (book.coverImage && !book.coverImage.includes('example.com')) {
    return book.coverImage;
  }

  return `https://picsum.photos/seed/${book._id}/360/450`;
}

export function BookFinder() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const activeTabConfig = useMemo(
    () => tabs.find((tab) => tab.id === activeTab) || tabs[0],
    [activeTab]
  );

  useEffect(() => {
    let ignore = false;

    const fetchBooks = async () => {
      setLoading(true);

      try {
        const endpoint = activeTabConfig.endpoint || '/books/top';
        const params = activeTabConfig.params || { limit: 5, sortBy: 'sold' };

        const response = await api.get(endpoint, { params });

        if (!ignore) {
          setBooks(getBooksFromResponse(response.data).slice(0, 5));
        }
      } catch (error) {
        console.error('Failed to load book finder books', error);
        if (!ignore) {
          setBooks([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchBooks();

    return () => {
      ignore = true;
    };
  }, [activeTabConfig]);

  return (
    <section className="bg-gradient-to-br from-orange-50 to-pink-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col gap-4 mb-8 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-2xl font-bold text-red-600 uppercase">
            Bạn đang tìm sách gì?
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:justify-end">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 rounded-full border-2 px-4 py-2 text-sm font-medium transition-all sm:px-6 ${
                  activeTab === tab.id
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-red-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-[390px] rounded-2xl bg-white/70 shadow-sm animate-pulse"
              />
            ))
          ) : books.length > 0 ? (
            books.map((book) => {
              const imageSrc = getImageSrc(book);
              const displayPrice = book.discountPrice || book.price;
              const originalPrice = book.discountPrice ? book.price : null;
              const rating = Math.max(0, Math.min(5, Math.round(book.rating || 0)));

              return (
                <div
                  key={book._id}
                  onClick={() => navigate(`/book/${book._id}`)}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-2 group cursor-pointer"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                    <img
                      src={imageSrc}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {book.isNewArrival && (
                      <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-white rounded-full" />
                        Mới
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          navigate(`/book/${book._id}`);
                        }}
                        className="w-full bg-white text-gray-900 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors mb-2"
                      >
                        <Eye className="w-4 h-4" />
                        Xem nhanh
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">
                      {book.title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2 h-8">
                      {book.description || book.author}
                    </p>

                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-xs text-gray-600 ml-1">
                        ({(book.rating || 0).toFixed(1)})
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-red-600 font-bold text-lg">
                          {formatCurrency(displayPrice)}
                        </div>
                        {originalPrice && (
                          <div className="text-gray-400 line-through text-xs">
                            {formatCurrency(originalPrice)}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        className="w-10 h-10 shrink-0 bg-orange-500 rounded-full flex items-center justify-center text-white hover:bg-orange-600 transition-colors shadow-md"
                        onClick={(event) => {
                          event.stopPropagation();
                          addToCart({
                            id: book._id,
                            title: book.title,
                            author: book.author,
                            price: formatCurrency(displayPrice),
                            image: imageSrc,
                          });
                        }}
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full rounded-2xl bg-white p-8 text-center text-gray-600 shadow-sm">
              Chưa có sách phù hợp để hiển thị.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

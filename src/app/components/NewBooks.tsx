import { useEffect, useState } from 'react';
import { Heart, ShoppingCart, Sparkles, Star } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

interface Book {
  _id: string;
  title: string;
  author: string;
  price: number;
  discountPrice?: number | null;
  rating?: number;
  coverImage?: string;
  publishedDate?: string;
  createdAt?: string;
  categoryId?: {
    name?: string;
    slug?: string;
  };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
}

function formatDate(value?: string) {
  if (!value) {
    return 'Đang cập nhật';
  }

  return new Intl.DateTimeFormat('vi-VN').format(new Date(value));
}

function getImageSrc(book: Book) {
  if (book.coverImage && !book.coverImage.includes('example.com')) {
    return book.coverImage;
  }

  return `https://picsum.photos/seed/${book._id}/360/480`;
}

export function NewBooks() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get('/books/new', {
          params: {
            page: 1,
            limit: 6,
            days: 3650,
          },
        });

        setBooks(response.data.data || response.data || []);
      } catch (error) {
        console.error('Failed to load new books', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Sách mới phát hành</h2>
        </div>
        <button
          type="button"
          onClick={() => navigate('/new-books')}
          className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1"
        >
          Xem tất cả →
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-[360px] rounded-xl bg-gray-100 shadow-sm animate-pulse"
            />
          ))
        ) : books.length > 0 ? (
          books.map((book) => {
            const imageSrc = getImageSrc(book);
            const displayPrice = book.discountPrice || book.price;
            const originalPrice = book.discountPrice ? book.price : null;
            const discount = book.discountPrice
              ? `${Math.round(((book.price - book.discountPrice) / book.price) * 100)}%`
              : null;
            const category = book.categoryId?.name || 'Sách mới';
            const releaseDate = formatDate(book.publishedDate || book.createdAt);
            const rating = Math.max(0, Math.min(5, Math.floor(book.rating || 0)));

            return (
              <div
                key={book._id}
                onClick={() => navigate(`/book/${book._id}`)}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer group relative"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                  <img
                    src={imageSrc}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    MỚI
                  </div>

                  {discount && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                      -{discount}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={(event) => event.stopPropagation()}
                    className="absolute top-12 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md hover:bg-red-50"
                  >
                    <Heart className="w-4 h-4 text-red-500" />
                  </button>

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
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
                      className="w-full bg-orange-500 text-white py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Thêm giỏ hàng
                    </button>
                  </div>
                </div>

                <div className="p-3">
                  <div className="text-xs text-purple-600 font-medium mb-1 line-clamp-1">
                    {category}
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                    {book.author}
                  </p>

                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
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

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-red-600 font-bold">
                      {formatCurrency(displayPrice)}
                    </span>
                    {originalPrice && (
                      <span className="text-gray-400 line-through text-xs">
                        {formatCurrency(originalPrice)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span className="w-1 h-1 bg-green-500 rounded-full" />
                    <span>Phát hành: {releaseDate}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full rounded-xl bg-white p-8 text-center text-gray-600 shadow-sm">
            Chưa có sách mới để hiển thị.
          </div>
        )}
      </div>

      <div className="mt-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Đón đọc những cuốn sách mới nhất!
            </h3>
            <p className="text-gray-600">
              Cập nhật liên tục các đầu sách mới phát hành từ dữ liệu kho sách.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate('/new-books')}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all hover:-translate-y-1"
        >
          Xem thêm sách mới
        </button>
      </div>
    </section>
  );
}

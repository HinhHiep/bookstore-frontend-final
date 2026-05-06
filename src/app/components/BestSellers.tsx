import { Star, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

interface Book {
  _id: string;
  title: string;
  author: string;
  price: number;
  discountPrice?: number | null;
  rating: number;
  coverImage?: string;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
}

export function BestSellers() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get('/books/top', {
          params: {
            limit: 4,
            sortBy: 'sold',
          },
        });

        setBooks(response.data.data || response.data || []);
      } catch (error) {
        console.error('Failed to load bestseller books', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Sách bán chạy</h2>
        <button
          type="button"
          onClick={() => navigate('/books')}
          className="text-orange-500 hover:text-orange-600 font-medium"
        >
          Xem tất cả →
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-[420px] rounded-xl bg-gray-100 animate-pulse"
            />
          ))
        ) : books.length > 0 ? (
          books.map((book) => {
            // const imageSrc = book.coverImage || 'https://via.placeholder.com/360x480?text=No+Image'; --- IGNORE ---
            // Tạo ảnh ngẫu nhiên từ Unsplash dựa trên ID của sách để có hình ảnh khác nhau
            const imageSrc = `https://picsum.photos/seed/${book._id}/360/480`;            
            const originalPrice = book.discountPrice ? book.price : null;
            const discountLabel = book.discountPrice
              ? `${Math.round(((book.price - book.discountPrice) / book.price) * 100)}%`
              : null;
            const displayPrice = book.discountPrice || book.price;

            return (
              <div
                key={book._id}
                onClick={() => navigate(`/book/${book._id}`)}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={imageSrc}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                  {discountLabel && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      -{discountLabel}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
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
                    <span className="text-sm text-gray-600 ml-1">({book.rating?.toFixed(1)})</span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-orange-500 font-bold text-lg">{formatCurrency(displayPrice)}</div>
                      {originalPrice && (
                        <div className="text-gray-400 line-through text-sm">
                          {formatCurrency(originalPrice)}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          id: book._id,
                          title: book.title,
                          author: book.author,
                          price: formatCurrency(displayPrice),
                          image: imageSrc,
                        });
                      }}
                      className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white hover:bg-orange-600 transition-colors hover:scale-110"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-xl bg-white p-8 text-center text-gray-600 shadow-sm">
            Không có sách bán chạy để hiển thị.
          </div>
        )}
      </div>
    </section>
  );
}

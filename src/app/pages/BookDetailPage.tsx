import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Award,
  BookOpen,
  ChevronLeft,
  Heart,
  MessageCircle,
  Minus,
  Plus,
  RotateCcw,
  Share2,
  Shield,
  ShoppingCart,
  Star,
  TrendingUp,
  Truck,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

interface Book {
  _id: string;
  title: string;
  slug?: string;
  description?: string;
  author: string;
  isbn?: string;
  categoryId?: {
    _id: string;
    name: string;
    slug: string;
  };
  price: number;
  discountPrice?: number | null;
  quantity?: number;
  sold?: number;
  coverImage?: string;
  images?: string[];
  rating?: number;
  reviewCount?: number;
  publisher?: string;
  publishedDate?: string;
  pages?: number | null;
  language?: string;
  edition?: string;
  format?: string;
  keywords?: string[];
  tags?: string[];
  discountPercentage?: number;
  savingAmount?: number;
}

interface Review {
  _id: string;
  rating: number;
  comment?: string;
  createdAt?: string;
  userId?: {
    _id?: string;
    name?: string;
    email?: string;
  };
}

const languageLabels: Record<string, string> = {
  VI: 'Tiếng Việt',
  EN: 'Tiếng Anh',
  FR: 'Tiếng Pháp',
  DE: 'Tiếng Đức',
  ES: 'Tiếng Tây Ban Nha',
  JA: 'Tiếng Nhật',
  KO: 'Tiếng Hàn',
  ZH: 'Tiếng Trung',
};

const formatLabels: Record<string, string> = {
  paperback: 'Bìa mềm',
  hardcover: 'Bìa cứng',
  ebook: 'Ebook',
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
}

function formatYear(value?: string) {
  if (!value) {
    return 'Đang cập nhật';
  }

  return new Date(value).getFullYear().toString();
}

function getImageSrc(bookId: string, url?: string, suffix = 'cover') {
  if (url && !url.includes('example.com')) {
    return url;
  }

  return `https://picsum.photos/seed/${bookId}-${suffix}/720/960`;
}

function formatDate(value?: string) {
  if (!value) {
    return 'Đang cập nhật';
  }

  return new Intl.DateTimeFormat('vi-VN').format(new Date(value));
}

function getUserInitial(name?: string, email?: string) {
  const source = name || email || 'U';
  return source.trim().charAt(0).toUpperCase();
}

function buildImages(book: Book) {
  const rawImages = [book.coverImage, ...(book.images || [])].filter(Boolean) as string[];
  const validImages = rawImages
    .filter((image) => !image.includes('example.com'))
    .filter((image, index, all) => all.indexOf(image) === index);

  if (validImages.length > 0) {
    return validImages;
  }

  return [
    getImageSrc(book._id, undefined, 'cover'),
    getImageSrc(book._id, undefined, 'inside'),
    getImageSrc(book._id, undefined, 'detail'),
  ];
}

export function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [book, setBook] = useState<Book | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState('description');
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      return;
    }

    let ignore = false;

    const fetchBook = async () => {
      setLoading(true);
      setError('');
      setQuantity(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      try {
        const [bookResponse, relatedResponse] = await Promise.all([
          api.get(`/books/${id}`),
          api.get(`/books/${id}/related`, { params: { limit: 4 } }),
        ]);

        const reviewsResponse = await api.get('/reviews', {
          params: {
            bookId: id,
            limit: 10,
            status: 'active',
          },
        });

        if (ignore) {
          return;
        }

        const nextBook = bookResponse.data.data;
        setBook(nextBook);
        setRelatedBooks(relatedResponse.data.data || []);
        setReviews(reviewsResponse.data.data?.items || []);
        setMainImage(buildImages(nextBook)[0]);
      } catch (fetchError) {
        console.error('Failed to load book detail', fetchError);
        if (!ignore) {
          setError('Không thể tải thông tin sách.');
          setBook(null);
          setRelatedBooks([]);
          setReviews([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchBook();

    return () => {
      ignore = true;
    };
  }, [id]);

  const bookImages = useMemo(() => (book ? buildImages(book) : []), [book]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-5 h-[650px] rounded-2xl bg-white shadow-sm animate-pulse" />
            <div className="col-span-7 h-[650px] rounded-2xl bg-white shadow-sm animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Không tìm thấy sách</h1>
            <p className="text-gray-600 mb-6">{error || 'Sách này không còn khả dụng.'}</p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="rounded-xl bg-orange-500 px-6 py-3 font-bold text-white hover:bg-orange-600"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayPrice = book.discountPrice || book.price;
  const originalPrice = book.discountPrice ? book.price : null;
  const discount = book.discountPercentage || (
    book.discountPrice ? Math.round(((book.price - book.discountPrice) / book.price) * 100) : 0
  );
  const rating = Math.max(0, Math.min(5, Math.floor(book.rating || 0)));
  const categoryName = book.categoryId?.name || 'Sách';
  const description = book.description || 'Thông tin mô tả đang được cập nhật.';
  const highlights = [
    book.categoryId?.name ? `Thuộc danh mục ${book.categoryId.name}` : null,
    book.publisher ? `Phát hành bởi ${book.publisher}` : null,
    book.pages ? `${book.pages} trang nội dung` : null,
    book.isbn ? `ISBN ${book.isbn}` : null,
    ...(book.keywords || []).slice(0, 3).map((keyword) => `Chủ đề: ${keyword}`),
  ].filter(Boolean) as string[];

  const handleAddToCart = () => {
    for (let index = 0; index < quantity; index += 1) {
      addToCart({
        id: book._id,
        title: book.title,
        author: book.author,
        price: formatCurrency(displayPrice),
        image: mainImage || bookImages[0],
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Trang chủ / {categoryName} / {book.title}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 shadow-lg lg:sticky lg:top-4">
              <div className="relative aspect-[3/4] mb-4 rounded-xl overflow-hidden bg-gray-100">
                <img src={mainImage || bookImages[0]} alt={book.title} className="w-full h-full object-cover" />
                {discount > 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg">
                    -{discount}%
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {bookImages.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setMainImage(image)}
                    className={`aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all ${
                      mainImage === image
                        ? 'border-orange-500 scale-95'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <img src={image} alt={`${book.title} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                    isFavorite
                      ? 'bg-red-50 border-red-500 text-red-600'
                      : 'border-gray-200 text-gray-700 hover:border-red-300 hover:bg-red-50'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-600' : ''}`} />
                  <span className="font-medium">Yêu thích</span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50 transition-all"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="font-medium">Chia sẻ</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="text-gray-600">
                  Tác giả: <span className="text-orange-600 font-medium">{book.author}</span>
                </span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">NXB: {book.publisher || 'Đang cập nhật'}</span>
              </div>

              <div className="flex flex-wrap items-center gap-6 pb-6 border-b">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xl font-bold text-gray-900">{(book.rating || 0).toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <MessageCircle className="w-5 h-5" />
                  <span>{(book.reviewCount || 0).toLocaleString()} đánh giá</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <TrendingUp className="w-5 h-5" />
                  <span>Đã bán {(book.sold || 0).toLocaleString()}</span>
                </div>
              </div>

              <div className="py-6 border-b">
                <div className="flex flex-wrap items-baseline gap-4 mb-2">
                  <span className="text-4xl font-bold text-red-600">{formatCurrency(displayPrice)}</span>
                  {originalPrice && (
                    <span className="text-2xl text-gray-400 line-through">{formatCurrency(originalPrice)}</span>
                  )}
                  {discount > 0 && (
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-bold">
                      Tiết kiệm {discount}%
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  Giá đã bao gồm VAT. Miễn phí vận chuyển cho đơn hàng từ 200.000đ.
                </p>
              </div>

              <div className="py-6 border-b">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className="text-gray-700 font-medium">Số lượng:</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-orange-500 hover:bg-orange-50 transition-all"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(book.quantity || 999, quantity + 1))}
                      className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-orange-500 hover:bg-orange-50 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">{book.quantity || 0} sản phẩm có sẵn</span>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={(book.quantity || 0) <= 0}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all hover:-translate-y-1 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    Thêm vào giỏ hàng
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleAddToCart();
                      navigate('/checkout');
                    }}
                    disabled={(book.quantity || 0) <= 0}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Mua ngay
                  </button>
                </div>
              </div>

              <div className="py-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Truck className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">Giao hàng nhanh</div>
                      <div className="text-xs text-gray-600">2-3 ngày</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">Hàng chính hãng</div>
                      <div className="text-xs text-gray-600">100% cam kết</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <RotateCcw className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">Đổi trả dễ dàng</div>
                      <div className="text-xs text-gray-600">Trong 7 ngày</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="flex border-b">
                {[
                  ['description', 'Mô tả sản phẩm'],
                  ['specifications', 'Thông tin chi tiết'],
                  ['reviews', `Đánh giá (${book.reviewCount || 0})`],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedTab(key)}
                    className={`flex-1 py-4 font-medium transition-all ${
                      selectedTab === key
                        ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="p-8">
                {selectedTab === 'description' && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <BookOpen className="w-6 h-6 text-orange-600" />
                      Giới thiệu sách
                    </h3>
                    <div className="prose prose-lg max-w-none mb-6">
                      {description.split('\n\n').map((para, index) => (
                        <p key={index} className="text-gray-700 mb-4">{para}</p>
                      ))}
                    </div>

                    {highlights.length > 0 && (
                      <>
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Award className="w-5 h-5 text-orange-600" />
                          Điểm nổi bật
                        </h4>
                        <ul className="space-y-2">
                          {highlights.map((highlight) => (
                            <li key={highlight} className="flex items-start gap-2 text-gray-700">
                              <span className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                )}

                {selectedTab === 'specifications' && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Thông tin chi tiết</h3>
                    <table className="w-full">
                      <tbody>
                        {[
                          ['Tác giả', book.author],
                          ['Danh mục', categoryName],
                          ['Nhà xuất bản', book.publisher || 'Đang cập nhật'],
                          ['Năm xuất bản', formatYear(book.publishedDate)],
                          ['Số trang', book.pages || 'Đang cập nhật'],
                          ['Phiên bản', book.edition || 'Đang cập nhật'],
                          ['Hình thức', formatLabels[book.format || ''] || book.format || 'Đang cập nhật'],
                          ['Ngôn ngữ', languageLabels[book.language || ''] || book.language || 'Đang cập nhật'],
                          ['ISBN', book.isbn || 'Đang cập nhật'],
                        ].map(([label, value], index) => (
                          <tr key={label} className={`border-b ${index % 2 ? 'bg-gray-50' : ''}`}>
                            <td className="py-3 text-gray-600 font-medium w-1/3">{label}</td>
                            <td className="py-3 text-gray-900">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {selectedTab === 'reviews' && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Đánh giá từ khách hàng</h3>
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 mb-6">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-lg font-bold text-gray-900">{(book.rating || 0).toFixed(1)}/5</span>
                        <span className="text-gray-600">
                          từ {(book.reviewCount || reviews.length).toLocaleString()} lượt đánh giá
                        </span>
                      </div>
                    </div>

                    {reviews.length > 0 ? (
                      <div className="space-y-5">
                        {reviews.map((review) => {
                          const reviewerName = review.userId?.name || review.userId?.email || 'Khách hàng';

                          return (
                            <div key={review._id} className="border-b border-gray-200 pb-5 last:border-b-0">
                              <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-600">
                                  {getUserInitial(review.userId?.name, review.userId?.email)}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="mb-2 flex flex-wrap items-center gap-2">
                                    <span className="font-medium text-gray-900">{reviewerName}</span>
                                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                                      Đã đánh giá
                                    </span>
                                  </div>
                                  <div className="mb-3 flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`w-4 h-4 ${
                                            i < review.rating
                                              ? 'fill-yellow-400 text-yellow-400'
                                              : 'text-gray-300'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                                  </div>
                                  <p className="text-gray-700">
                                    {review.comment || 'Khách hàng chưa để lại nhận xét chi tiết.'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-600">
                        Chưa có nhận xét chi tiết cho sách này.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sách liên quan</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedBooks.map((relatedBook) => {
              const relatedPrice = relatedBook.discountPrice || relatedBook.price;
              const relatedOriginalPrice = relatedBook.discountPrice ? relatedBook.price : null;
              const relatedImage = getImageSrc(relatedBook._id, relatedBook.coverImage);

              return (
                <div
                  key={relatedBook._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
                  onClick={() => navigate(`/book/${relatedBook._id}`)}
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img src={relatedImage} alt={relatedBook.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{relatedBook.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{relatedBook.author}</p>
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(relatedBook.rating || 0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-orange-500 font-bold">{formatCurrency(relatedPrice)}</span>
                      {relatedOriginalPrice && (
                        <span className="text-gray-400 line-through text-sm">
                          {formatCurrency(relatedOriginalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

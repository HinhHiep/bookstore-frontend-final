import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Tag,
  Percent,
  Gift,
  Clock,
  Zap,
  Copy,
  Check,
  Star,
  ShoppingCart,
  Heart,
  Eye,
  Flame,
  Sparkles,
  TrendingUp,
  Package,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export function PromotionsPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [flashSaleTime, setFlashSaleTime] = useState({
    hours: 2,
    minutes: 34,
    seconds: 56,
  });

  // Countdown timer for flash sale
  useEffect(() => {
    const timer = setInterval(() => {
      setFlashSaleTime((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Vouchers data
  const vouchers = [
    {
      id: 1,
      code: 'WELCOME30',
      title: 'Giảm 30% đơn đầu tiên',
      description: 'Dành cho khách hàng mới, giảm tối đa 50.000đ',
      discount: '30%',
      minOrder: '0đ',
      expiry: '31/03/2026',
      color: 'from-orange-500 to-red-500',
      icon: Gift,
      stock: 50,
      used: 234,
    },
    {
      id: 2,
      code: 'BOOK100K',
      title: 'Giảm 100K cho đơn từ 500K',
      description: 'Áp dụng cho tất cả sách',
      discount: '100.000đ',
      minOrder: '500.000đ',
      expiry: '25/03/2026',
      color: 'from-blue-500 to-cyan-500',
      icon: Tag,
      stock: 100,
      used: 456,
    },
    {
      id: 3,
      code: 'FREESHIP',
      title: 'Miễn phí vận chuyển',
      description: 'Không giới hạn khoảng cách',
      discount: 'FREE SHIP',
      minOrder: '200.000đ',
      expiry: '30/03/2026',
      color: 'from-green-500 to-emerald-500',
      icon: Package,
      stock: 200,
      used: 789,
    },
    {
      id: 4,
      code: 'VIP50',
      title: 'Giảm 50% khách VIP',
      description: 'Dành cho khách hàng thân thiết',
      discount: '50%',
      minOrder: '300.000đ',
      expiry: '28/03/2026',
      color: 'from-purple-500 to-pink-500',
      icon: Sparkles,
      stock: 30,
      used: 123,
    },
  ];

  // Flash sale products
  const flashSaleBooks = [
    {
      id: 1,
      title: 'Atomic Habits',
      author: 'James Clear',
      price: '89.000đ',
      originalPrice: '179.000đ',
      discount: 50,
      image: 'https://images.unsplash.com/photo-1546913760-e23d946dd386?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWxmJTIwaGVscCUyMGJvb2t8ZW58MXx8fHwxNzczODQ3MDAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.8,
      sold: 234,
      stock: 50,
    },
    {
      id: 2,
      title: 'The Psychology of Money',
      author: 'Morgan Housel',
      price: '99.000đ',
      originalPrice: '199.000đ',
      discount: 50,
      image: 'https://images.unsplash.com/photo-1768991732235-ac3e1bc9259c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGJvb2slMjBoYXJkY292ZXJ8ZW58MXx8fHwxNzczODIyMjA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.9,
      sold: 189,
      stock: 30,
    },
    {
      id: 3,
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      price: '124.000đ',
      originalPrice: '249.000đ',
      discount: 50,
      image: 'https://images.unsplash.com/photo-1768224946689-b599f1d406f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3B1bGFyJTIwYm9va3MlMjBzdGFja3xlbnwxfHx8fDE3NzM4NDkzMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.7,
      sold: 156,
      stock: 40,
    },
    {
      id: 4,
      title: 'Rich Dad Poor Dad',
      author: 'Robert Kiyosaki',
      price: '79.000đ',
      originalPrice: '159.000đ',
      discount: 50,
      image: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNlJTIwYm9va3xlbnwxfHx8fDE3NzM4NDcwMDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.6,
      sold: 267,
      stock: 25,
    },
  ];

  // Discount tiers
  const discountTiers = [
    {
      id: 1,
      percent: 30,
      title: 'Giảm 30%',
      count: 156,
      color: 'from-orange-400 to-orange-500',
    },
    {
      id: 2,
      percent: 40,
      title: 'Giảm 40%',
      count: 89,
      color: 'from-pink-400 to-pink-500',
    },
    {
      id: 3,
      percent: 50,
      title: 'Giảm 50%',
      count: 45,
      color: 'from-red-400 to-red-500',
    },
  ];

  // Combo deals
  const combos = [
    {
      id: 1,
      title: 'Combo Phát triển bản thân',
      books: 3,
      price: '199.000đ',
      originalPrice: '399.000đ',
      saving: '200.000đ',
      image: 'https://images.unsplash.com/photo-1546913760-e23d946dd386?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWxmJTIwaGVscCUyMGJvb2t8ZW58MXx8fHwxNzczODQ3MDAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 2,
      title: 'Combo Kinh tế - Tài chính',
      books: 4,
      price: '299.000đ',
      originalPrice: '599.000đ',
      saving: '300.000đ',
      image: 'https://images.unsplash.com/photo-1768991732235-ac3e1bc9259c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGJvb2slMjBoYXJkY292ZXJ8ZW58MXx8fHwxNzczODIyMjA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 3,
      title: 'Combo Văn học Việt Nam',
      books: 5,
      price: '249.000đ',
      originalPrice: '499.000đ',
      saving: '250.000đ',
      image: 'https://images.unsplash.com/photo-1761319115156-d758b22ed57b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXRlcmF0dXJlJTIwY2xhc3NpYyUyMGJvb2tzfGVufDF8fHx8MTc3Mzg0OTU1MXww&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
                  <Tag className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-bold">Khuyến Mãi Hấp Dẫn</h1>
              </div>
              <p className="text-lg opacity-90 mb-4">
                Săn sale cực đã - Giảm giá sốc đến 50% cho hàng ngàn đầu sách
              </p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Percent className="w-5 h-5" />
                  <span>Giảm đến 50%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  <span>Freeship toàn quốc</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  <span>Flash sale mỗi ngày</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1768839721483-c4501b5d6eb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxlJTIwZGlzY291bnQlMjBwcm9tb3Rpb258ZW58MXx8fHwxNzczODUwMDE1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Promotions"
                className="w-48 h-48 object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Vouchers Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Mã giảm giá</h2>
            </div>
            <p className="text-sm text-gray-600">Nhấn để sao chép mã</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {vouchers.map((voucher) => {
              const VoucherIcon = voucher.icon;
              return (
                <div
                  key={voucher.id}
                  className="bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-200 overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className={`bg-gradient-to-r ${voucher.color} p-6 text-white`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <VoucherIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-xl">{voucher.title}</h3>
                            <p className="text-sm opacity-90">{voucher.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm opacity-90">
                          <span>Đơn tối thiểu: {voucher.minOrder}</span>
                          <span>•</span>
                          <span>HSD: {voucher.expiry}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold mb-1">{voucher.discount}</div>
                        <div className="text-xs opacity-75">Giảm tối đa</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => copyCode(voucher.code)}
                          className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-dashed border-orange-400 rounded-lg font-mono font-bold text-orange-600 hover:bg-orange-50 transition-colors"
                        >
                          {voucher.code}
                          {copiedCode === voucher.code ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <div className="text-sm text-gray-600">
                          Đã dùng: <span className="font-bold text-gray-900">{voucher.used}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        Còn lại: <span className="font-bold text-orange-600">{voucher.stock}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Flash Sale Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="text-white">
                  <h2 className="text-3xl font-bold mb-1">Flash Sale 50%</h2>
                  <p className="opacity-90">Ưu đãi có thời hạn - Nhanh tay kẻo lỡ!</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-white text-center">
                  <div className="text-xs opacity-75 mb-1">Kết thúc sau</div>
                  <div className="flex items-center gap-2">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[60px]">
                      <div className="text-2xl font-bold">
                        {String(flashSaleTime.hours).padStart(2, '0')}
                      </div>
                      <div className="text-xs opacity-75">Giờ</div>
                    </div>
                    <span className="text-2xl font-bold">:</span>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[60px]">
                      <div className="text-2xl font-bold">
                        {String(flashSaleTime.minutes).padStart(2, '0')}
                      </div>
                      <div className="text-xs opacity-75">Phút</div>
                    </div>
                    <span className="text-2xl font-bold">:</span>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[60px]">
                      <div className="text-2xl font-bold">
                        {String(flashSaleTime.seconds).padStart(2, '0')}
                      </div>
                      <div className="text-xs opacity-75">Giây</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {flashSaleBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-xl shadow-sm border hover:shadow-xl transition-all group overflow-hidden"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                    <Zap className="w-3 h-3 inline mr-1" />
                    FLASH SALE
                  </div>

                  <div className="absolute top-3 right-3 bg-red-500 text-white w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                    -{book.discount}%
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Đã bán {book.sold}</span>
                      <span className="text-red-600 font-bold">
                        Còn {book.stock} sản phẩm
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full"
                        style={{
                          width: `${(book.sold / (book.sold + book.stock)) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

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
                  </div>

                  <h3
                    className="font-bold text-gray-900 mb-1 line-clamp-2 cursor-pointer hover:text-orange-600 transition-colors"
                    onClick={() => navigate(`/book/${book.id}`)}
                  >
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{book.author}</p>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl font-bold text-red-600">{book.price}</span>
                    <span className="text-sm text-gray-400 line-through">
                      {book.originalPrice}
                    </span>
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
                    className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-2.5 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Mua ngay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Discount Tiers */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Percent className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Giảm giá theo mức</h2>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {discountTiers.map((tier) => (
              <button
                key={tier.id}
                onClick={() => navigate('/bestsellers')}
                className="group"
              >
                <div
                  className={`bg-gradient-to-br ${tier.color} text-white rounded-2xl p-8 hover:shadow-2xl transition-all transform hover:scale-105`}
                >
                  <div className="text-center">
                    <div className="text-6xl font-bold mb-2">{tier.percent}%</div>
                    <div className="text-xl font-bold mb-4">GIẢM GIÁ</div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg py-3 px-4 mb-4">
                      <div className="text-2xl font-bold">{tier.count}+</div>
                      <div className="text-sm opacity-90">Sản phẩm</div>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-white text-orange-600 px-4 py-2 rounded-lg font-medium">
                      <span>Xem ngay</span>
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Combo Deals */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Combo tiết kiệm</h2>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {combos.map((combo) => (
              <div
                key={combo.id}
                className="bg-white rounded-2xl shadow-lg border hover:shadow-xl transition-all overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={combo.image}
                    alt={combo.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                    {combo.books} cuốn sách
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-bold text-lg">{combo.title}</h3>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold text-orange-600">
                        {combo.price}
                      </div>
                      <div className="text-sm text-gray-400 line-through">
                        {combo.originalPrice}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-600">Tiết kiệm</div>
                      <div className="text-lg font-bold text-green-600">
                        {combo.saving}
                      </div>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Mua combo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Promotion Banner */}
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl p-8 text-white text-center">
          <Flame className="w-16 h-16 mx-auto mb-4 animate-pulse" />
          <h3 className="text-3xl font-bold mb-3">Săn sale ngay - Lỡ là tiếc!</h3>
          <p className="text-lg opacity-90 mb-6">
            Hàng ngàn đầu sách giảm giá đến 50%. Cập nhật mỗi ngày.
          </p>
          <button
            onClick={() => navigate('/bestsellers')}
            className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-3 rounded-xl font-bold hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <span>Khám phá ngay</span>
            <TrendingUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

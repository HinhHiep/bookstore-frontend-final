import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ChevronLeft,
  Tag,
  Truck,
  Shield,
  CreditCard,
  Clock,
  Star,
  Gift,
  ArrowRight,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

interface SuggestedBook {
  _id: string;
  title: string;
  author: string;
  price: number;
  discountPrice?: number | null;
  rating?: number;
  coverImage?: string;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
}

function getImageSrc(book: SuggestedBook) {
  if (book.coverImage && !book.coverImage.includes('example.com')) {
    return book.coverImage;
  }

  return `https://picsum.photos/seed/${book._id}/360/480`;
}

export function CartPage() {
  const navigate = useNavigate();
  const { items, addToCart, removeFromCart, updateQuantity, totalItems, loading } = useCart();
  const hasInitializedSelection = useRef(false);
  const [selectedItemIds, setSelectedItemIds] = useState<Array<string | number>>([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);

  const selectedItems = items.filter((item) => selectedItemIds.includes(item.id));
  const selectedTotalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const selectedTotalPrice = selectedItems.reduce((sum, item) => {
    const itemPrice = parseFloat(item.price.replace(/[^\d]/g, '')) || 0;
    return sum + itemPrice * item.quantity;
  }, 0);
  const allItemsSelected = items.length > 0 && selectedItemIds.length === items.length;
  const shippingFee = selectedTotalPrice >= 200000 ? 0 : 30000;
  const discount = appliedCoupon ? Math.min(appliedCoupon.discount, selectedTotalPrice + shippingFee) : 0;
  const finalTotal = Math.max(selectedTotalPrice + shippingFee - discount, 0);
  const [suggestedBooksApi, setSuggestedBooksApi] = useState<SuggestedBook[]>([]);
  const [suggestedLoading, setSuggestedLoading] = useState(true);

  useEffect(() => {
    setSelectedItemIds((currentSelectedIds) => {
      const currentItemIds = items.map((item) => item.id);
      const remainingSelectedIds = currentSelectedIds.filter((id) => currentItemIds.includes(id));

      if (!hasInitializedSelection.current && currentItemIds.length > 0) {
        hasInitializedSelection.current = true;
        return currentItemIds;
      }

      return remainingSelectedIds;
    });
  }, [items]);

  useEffect(() => {
    const fetchSuggestedBooks = async () => {
      try {
        const response = await api.get('/books/top', {
          params: {
            limit: 4,
            sortBy: 'rating',
          },
        });

        setSuggestedBooksApi(response.data.data || response.data || []);
      } catch (error) {
        console.error('Failed to load suggested books', error);
        setSuggestedBooksApi([]);
      } finally {
        setSuggestedLoading(false);
      }
    };

    fetchSuggestedBooks();
  }, []);

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'TRAMSACH2024') {
      setAppliedCoupon({ code: couponCode, discount: 50000 });
    } else if (couponCode.toUpperCase() === 'FREESHIP') {
      setAppliedCoupon({ code: couponCode, discount: shippingFee });
    } else {
      alert('Mã giảm giá không hợp lệ!');
    }
  };

  const toggleSelectAll = () => {
    setSelectedItemIds(allItemsSelected ? [] : items.map((item) => item.id));
  };

  const toggleSelectItem = (id: string | number) => {
    setSelectedItemIds((currentSelectedIds) =>
      currentSelectedIds.includes(id)
        ? currentSelectedIds.filter((selectedId) => selectedId !== id)
        : [...currentSelectedIds, id]
    );
  };

  const goToCheckout = () => {
    if (selectedItemIds.length === 0) {
      return;
    }

    navigate('/checkout', {
      state: {
        selectedCartItemIds: selectedItemIds,
      },
    });
  };

  const suggestedBooks = [
    {
      id: 101,
      title: 'Atomic Habits',
      author: 'James Clear',
      price: '129.000đ',
      originalPrice: '180.000đ',
      rating: 4.9,
      image:
        'https://images.unsplash.com/photo-1546913760-e23d946dd386?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWxmJTIwaGVscCUyMGJvb2t8ZW58MXx8fHwxNzczODQ3MDAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 102,
      title: 'The Psychology of Money',
      author: 'Morgan Housel',
      price: '149.000đ',
      originalPrice: '195.000đ',
      rating: 4.8,
      image:
        'https://images.unsplash.com/photo-1768991732235-ac3e1bc9259c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGJvb2slMjBoYXJkY292ZXJ8ZW58MXx8fHwxNzczODIyMjA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 103,
      title: 'Deep Work',
      author: 'Cal Newport',
      price: '139.000đ',
      originalPrice: '175.000đ',
      rating: 4.7,
      image:
        'https://images.unsplash.com/photo-1707586234446-a1338e496161?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2FkZW1pYyUyMHRleHRib29rfGVufDF8fHx8MTc3Mzg0NzE0OXww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 104,
      title: 'Thinking, Fast and Slow',
      author: 'Daniel Kahneman',
      price: '169.000đ',
      originalPrice: '220.000đ',
      rating: 4.8,
      image:
        'https://images.unsplash.com/photo-1605263995534-995965cb88e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RpdmF0aW9uYWwlMjBib29rJTIwaW5zcGlyZXxlbnwxfHx8fDE3NzM4NDcxNDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  const renderSuggestedBooks = (showAddButton = false) => {
    if (suggestedLoading) {
      return Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-[360px] rounded-xl bg-white shadow-sm animate-pulse" />
      ));
    }

    return suggestedBooksApi.map((book) => {
      const imageSrc = getImageSrc(book);
      const displayPrice = book.discountPrice || book.price;
      const originalPrice = book.discountPrice ? book.price : null;

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
          </div>
          <div className="p-4">
            <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">
              {book.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3">{book.author}</p>
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(book.rating || 0)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-orange-500 font-bold">
                  {formatCurrency(displayPrice)}
                </div>
                {originalPrice && (
                  <div className="text-gray-400 line-through text-sm">
                    {formatCurrency(originalPrice)}
                  </div>
                )}
              </div>
              {showAddButton && (
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
                  className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white hover:bg-orange-600 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="h-8 w-48 rounded bg-gray-200 animate-pulse mb-8" />
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-8 h-[420px] rounded-2xl bg-white shadow-sm animate-pulse" />
            <div className="col-span-4 h-[360px] rounded-2xl bg-white shadow-sm animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Trang chủ / Giỏ hàng</span>
            </button>
          </div>
        </div>

        {/* Empty State */}
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Giỏ hàng trống
            </h2>
            <p className="text-gray-600 mb-8">
              Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá và chọn những
              cuốn sách yêu thích của bạn!
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all hover:-translate-y-1 inline-flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Tiếp tục mua sắm
            </button>
          </div>

          {/* Suggested Books */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Có thể bạn sẽ thích
            </h3>
            <div className="grid grid-cols-4 gap-6">
              {renderSuggestedBooks()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Trang chủ / Giỏ hàng</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Giỏ hàng của bạn
          </h1>
          <p className="text-gray-600">
            Bạn có {totalItems} sản phẩm trong giỏ hàng, đã chọn {selectedTotalItems} sản phẩm
          </p>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Left Column - Cart Items */}
          <div className="col-span-8">
            {/* Benefits Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Miễn phí vận chuyển</div>
                    <div className="text-sm text-gray-600">Đơn từ 200.000đ</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Hàng chính hãng</div>
                    <div className="text-sm text-gray-600">100% cam kết</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Giao hàng nhanh</div>
                    <div className="text-sm text-gray-600">2-3 ngày</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b bg-gray-50">
                <div className="grid grid-cols-12 gap-4 font-bold text-gray-700 text-sm">
                  <label className="col-span-6 flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allItemsSelected}
                      onChange={toggleSelectAll}
                      className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                    />
                    <span>SẢN PHẨM</span>
                  </label>
                  <div className="col-span-2 text-center">ĐƠN GIÁ</div>
                  <div className="col-span-2 text-center">SỐ LƯỢNG</div>
                  <div className="col-span-2 text-right">THÀNH TIỀN</div>
                </div>
              </div>

              <div className="divide-y">
                {items.map((item) => {
                  const itemPrice = parseFloat(
                    item.price.replace(/[^\d]/g, '')
                  );
                  const itemTotal = itemPrice * item.quantity;

                  return (
                    <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Product Info */}
                        <div className="col-span-6 flex gap-4">
                          <div className="flex items-start pt-12">
                            <input
                              type="checkbox"
                              checked={selectedItemIds.includes(item.id)}
                              onChange={() => toggleSelectItem(item.id)}
                              aria-label={`Chọn ${item.title}`}
                              className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                            />
                          </div>
                          <div className="w-24 h-32 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">
                              {item.author}
                            </p>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Xóa
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="col-span-2 text-center">
                          <span className="font-bold text-gray-900">
                            {item.price}
                          </span>
                        </div>

                        {/* Quantity */}
                        <div className="col-span-2 flex justify-center">
                          <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-8 h-8 rounded-md bg-white border border-gray-300 flex items-center justify-center hover:border-orange-500 hover:bg-orange-50 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-bold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-8 h-8 rounded-md bg-white border border-gray-300 flex items-center justify-center hover:border-orange-500 hover:bg-orange-50 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Total */}
                        <div className="col-span-2 text-right">
                          <span className="font-bold text-orange-600 text-lg">
                            {itemTotal.toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Continue Shopping */}
            <button
              onClick={() => navigate('/')}
              className="mt-6 flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Tiếp tục mua sắm
            </button>
          </div>

          {/* Right Column - Order Summary */}
          <div className="col-span-4">
            <div className="sticky top-4">
              {/* Coupon Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Tag className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="font-bold text-gray-900">Mã giảm giá</h3>
                </div>

                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Nhập mã giảm giá"
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                  />
                  <button
                    onClick={applyCoupon}
                    className="bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors"
                  >
                    Áp dụng
                  </button>
                </div>

                {appliedCoupon && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-green-700 font-medium">
                        Mã "{appliedCoupon.code}" đã được áp dụng
                      </span>
                    </div>
                    <button
                      onClick={() => setAppliedCoupon(null)}
                      className="text-green-700 hover:text-green-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Tag className="w-4 h-4" />
                    <span>Mã khả dụng: TRAMSACH2024, FREESHIP</span>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-6 text-lg">
                  Thông tin đơn hàng
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Tạm tính ({selectedTotalItems} sản phẩm)</span>
                    <span className="font-medium">
                      {selectedTotalPrice.toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    {shippingFee === 0 ? (
                      <span className="font-medium text-green-600">Miễn phí</span>
                    ) : (
                      <span className="font-medium">
                        {shippingFee.toLocaleString('vi-VN')}đ
                      </span>
                    )}
                  </div>

                  {discount > 0 && (
                    <div className="flex items-center justify-between text-green-600">
                      <span>Giảm giá</span>
                      <span className="font-medium">
                        -{discount.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  )}

                  {selectedTotalPrice > 0 && selectedTotalPrice < 200000 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-700">
                        Mua thêm{' '}
                        <span className="font-bold">
                          {(200000 - selectedTotalPrice).toLocaleString('vi-VN')}đ
                        </span>{' '}
                        để được miễn phí vận chuyển!
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t pt-6 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-gray-900">
                      Tổng cộng
                    </span>
                    <span className="text-3xl font-bold text-orange-600">
                      {finalTotal.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 text-right">
                    (Đã bao gồm VAT)
                  </p>
                </div>

                <button
                  onClick={goToCheckout}
                  disabled={selectedItemIds.length === 0}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all hover:-translate-y-1 flex items-center justify-center gap-2 mb-3 disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-400 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  <CreditCard className="w-5 h-5" />
                  Thanh toán ngay
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={() => navigate('/')}
                  className="w-full border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:border-orange-300 hover:bg-orange-50 transition-all"
                >
                  Tiếp tục mua sắm
                </button>

                {/* Payment Methods */}
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-gray-600 mb-3 font-medium">
                    Phương thức thanh toán
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="border-2 border-gray-200 rounded-lg p-2 hover:border-orange-500 transition-colors cursor-pointer">
                      <img
                        src="https://images.unsplash.com/photo-1726137570589-4461351d1180?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9wcGluZyUyMGNoZWNrb3V0JTIwcGF5bWVudHxlbnwxfHx8fDE3NzM4NDgxMTB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                        alt="Payment"
                        className="w-full h-8 object-contain"
                      />
                    </div>
                    <div className="border-2 border-gray-200 rounded-lg p-2 hover:border-orange-500 transition-colors cursor-pointer">
                      <img
                        src="https://images.unsplash.com/photo-1665521032636-e8d2f6927053?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHRydWNrJTIwZmFzdCUyMHNoaXBwaW5nfGVufDF8fHx8MTc3Mzc2NDk4OXww&ixlib=rb-4.1.0&q=80&w=1080"
                        alt="COD"
                        className="w-full h-8 object-contain"
                      />
                    </div>
                    <div className="border-2 border-gray-200 rounded-lg p-2 hover:border-orange-500 transition-colors cursor-pointer">
                      <img
                        src="https://images.unsplash.com/photo-1707960190026-e0fb6f03ceae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWN1cmUlMjBwYXltZW50JTIwc2FmZXxlbnwxfHx8fDE3NzM4NDgxMTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                        alt="Secure"
                        className="w-full h-8 object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Có thể bạn cũng thích
          </h2>
          <div className="grid grid-cols-4 gap-6">
            {renderSuggestedBooks(true)}
          </div>
        </div>
      </div>
    </div>
  );
}

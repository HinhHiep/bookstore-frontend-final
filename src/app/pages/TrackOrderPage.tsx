import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  Search,
  Package,
  CheckCircle2,
  Truck,
  Home,
  Clock,
  MapPin,
  Phone,
  CreditCard,
  User,
  MessageCircle,
  Download,
  Star,
  ChevronRight,
  Box,
  ClipboardCheck,
  PackageCheck,
} from 'lucide-react';
import api from '../utils/api';

const statusStepIndex: Record<string, number> = {
  pending: 0,
  confirmed: 2,
  shipping: 3,
  completed: 4,
  cancelled: 0,
};

const statusTextMap: Record<string, string> = {
  pending: 'Ch? x? lý',
  confirmed: 'Ðã xác nh?n',
  shipping: 'Ðang v?n chuy?n',
  completed: 'Giao hàng thành công',
  cancelled: 'Ðã h?y',
};

export function TrackOrderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefilledOrderCode = (location.state as { orderCode?: string; successMessage?: string } | null)?.orderCode || '';
  const successMessage = (location.state as { orderCode?: string; successMessage?: string } | null)?.successMessage || '';
  const [orderCode, setOrderCode] = useState('');
  const [showTracking, setShowTracking] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(0);
  const [orderData, setOrderData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatMoney = (value: number | string | undefined) => {
    const amount = typeof value === 'string'
      ? parseFloat(value.replace(/[^\d.-]/g, ''))
      : typeof value === 'number'
      ? value
      : 0;

    return amount.toLocaleString('vi-VN') + 'd';
  };

  const getStatusText = (status: string) => statusTextMap[status] || 'Ðang c?p nh?t';

  const getStatusIndex = (status: string) => statusStepIndex[status] ?? 0;

  const getFormattedDate = (value?: string | number | Date) => {
    if (!value) return 'Ðang c?p nh?t';
    const date = new Date(value);
    return date.toLocaleDateString('vi-VN');
  };

  const getEstimatedDelivery = (value?: string | number | Date) => {
    if (!value) return 'Ðang c?p nh?t';
    const date = new Date(value).getTime() + 3 * 24 * 60 * 60 * 1000;
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const trackingSteps = [
    {
      id: 0,
      title: 'Ðon hàng dã d?t',
      description: 'Ðon hàng dã du?c t?o thành công',
      time: orderData?.createdAt ? `${getFormattedDate(orderData.createdAt)} - 10:30` : '',
      icon: ClipboardCheck,
      color: 'bg-green-500',
    },
    {
      id: 1,
      title: 'Ðã xác nh?n',
      description: 'Ðon hàng dã du?c xác nh?n và dang ch? dóng gói',
      time: orderData?.status === 'confirmed' ? `${getFormattedDate(orderData.createdAt)} - 11:00` : '',
      icon: CheckCircle2,
      color: 'bg-green-500',
    },
    {
      id: 2,
      title: 'Ðang dóng gói',
      description: 'Ðon hàng dang du?c dóng gói t?i kho',
      time: orderData?.status === 'confirmed' ? `${getFormattedDate(orderData.createdAt)} - 14:30` : '',
      icon: Box,
      color: 'bg-green-500',
    },
    {
      id: 3,
      title: 'Ðang v?n chuy?n',
      description: 'Ðon hàng dang du?c giao d?n b?n',
      time: orderData?.status === 'shipping' ? `${getFormattedDate(orderData.createdAt)} - 08:00` : '',
      icon: Truck,
      color: 'bg-orange-500',
    },
    {
      id: 4,
      title: 'Giao hàng thành công',
      description: 'Ðon hàng dã du?c giao thành công',
      time: orderData?.status === 'completed' ? getEstimatedDelivery(orderData.createdAt) : '',
      icon: PackageCheck,
      color: 'bg-gray-300',
    },
  ];

  const fetchOrderByCode = async (rawCode: string) => {
    const code = rawCode.trim().replace(/^#/, '');
    if (!code) {
      setError('Vui lòng nh?p mã don hàng');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.get(`/orders/code/${encodeURIComponent(code)}`);
      const order = response.data?.data;
      if (!order) {
        throw new Error('Không tìm th?y don hàng');
      }

      setOrderData(order);
      setCurrentStatus(getStatusIndex(order.status));
      setShowTracking(true);
    } catch (err: any) {
      setShowTracking(false);
      setOrderData(null);
      setError(err?.response?.data?.message || err?.message || 'Không tìm th?y don hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!prefilledOrderCode) return;
    setOrderCode(prefilledOrderCode);
    fetchOrderByCode(prefilledOrderCode);
  }, [prefilledOrderCode]);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetchOrderByCode(orderCode);
  };

  if (!showTracking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Package className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Tra c?u don hàng</h1>
            <p className="text-lg text-gray-600">
              Nh?p mã don hàng d? theo dõi tình tr?ng giao hàng c?a b?n
            </p>
          </div>

          <form onSubmit={handleSearch} className="mb-12">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              {successMessage && (
                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {successMessage}
                </div>
              )}
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Mã don hàng
              </label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                  <input
                    type="text"
                    value={orderCode}
                    onChange={(e) => setOrderCode(e.target.value)}
                    placeholder="Nh?p mã don hàng (VD: #DH001235)"
                    className="w-full pl-14 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors text-lg"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all hover:-translate-y-1 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Search className="w-5 h-5" />
                  {loading ? 'Ðang tìm...' : 'Tra c?u'}
                </button>
              </div>
              {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
              <p className="text-sm text-gray-500 mt-3">
                B?n có th? tìm mã don hàng trong email xác nh?n ho?c tin nh?n SMS
              </p>
            </div>
          </form>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Giao hàng nhanh</h3>
              <p className="text-sm text-gray-600">Giao hàng trong 2-3 ngày làm vi?c</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PackageCheck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Theo dõi realtime</h3>
              <p className="text-sm text-gray-600">C?p nh?t tr?ng thái don hàng liên t?c</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">H? tr? 24/7</h3>
              <p className="text-sm text-gray-600">Luôn s?n sàng h? tr? b?n m?i lúc</p>
            </div>
          </div>

          <div className="mt-12 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-gray-900 mb-4">Liên k?t nhanh</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/account')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />
                  <span className="font-medium text-gray-900">Xem t?t c? don hàng</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600" />
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />
                  <span className="font-medium text-gray-900">Ti?p t?c mua s?m</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowTracking(false)}
              className="text-gray-600 hover:text-orange-500 transition-colors"
            >
              <Package className="w-6 h-6" />
            </button>
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={orderCode}
                  onChange={(e) => setOrderCode(e.target.value)}
                  placeholder="Nh?p mã don hàng khác"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-sm opacity-90 mb-2">Mã don hàng</div>
              <div className="text-3xl font-bold">{orderData?.orderCode}</div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90 mb-2">Ngày d?t hàng</div>
              <div className="text-xl font-bold">{getFormattedDate(orderData?.createdAt)}</div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm opacity-90">Tr?ng thái</div>
                <div className="text-xl font-bold">{getStatusText(orderData?.status)}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">D? ki?n giao hàng</div>
              <div className="text-xl font-bold">{getEstimatedDelivery(orderData?.createdAt)}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-8 space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">L? trình v?n chuy?n</h2>

              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-1 bg-gray-200"></div>
                <div
                  className="absolute left-6 top-0 w-1 bg-orange-500 transition-all duration-500"
                  style={{
                    height: `${(currentStatus / (trackingSteps.length - 1)) * 100}%`,
                  }}
                ></div>

                <div className="space-y-8">
                  {trackingSteps.map((step) => {
                    const Icon = step.icon;
                    const isActive = step.id <= currentStatus;
                    const isCurrent = step.id === currentStatus;

                    return (
                      <div key={step.id} className="relative flex gap-6">
                        <div
                          className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
                            isActive ? step.color : 'bg-gray-200'
                          } ${isCurrent ? 'ring-4 ring-orange-200' : ''}`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className={`text-lg font-bold ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                              {step.title}
                            </h3>
                            {step.time && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4" />
                                {step.time}
                              </div>
                            )}
                          </div>
                          <p className={`${isActive ? 'text-gray-600' : 'text-gray-400'}`}>
                            {step.description}
                          </p>
                          {isCurrent && (
                            <div className="mt-3 inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                              Tr?ng thái hi?n t?i
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">S?n ph?m ({orderData?.items?.length ?? 0})</h2>

              <div className="space-y-4">
                {orderData?.items?.map((item: any) => {
                  const itemPrice = item.finalPrice ?? item.price;
                  const itemTotal = item.total ?? itemPrice * item.quantity;

                  return (
                    <div key={item.bookId ?? item.title} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-20 h-28 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.thumbnail || 'https://via.placeholder.com/120?text=Book'}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{formatMoney(itemPrice)} x {item.quantity}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">T?ng: {formatMoney(itemTotal)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center justify-between text-gray-600">
                  <span>T?m tính</span>
                  <span className="font-medium">
                    {formatMoney(
                      orderData?.items?.reduce((sum: number, item: any) => sum + (item.total ?? (item.finalPrice ?? item.price) * item.quantity), 0) ?? 0
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Phí v?n chuy?n</span>
                  <span className="font-medium">{formatMoney(orderData?.shippingFee ?? 0)}</span>
                </div>
                <div className="flex items-center justify-between text-xl font-bold text-gray-900 pt-3 border-t">
                  <span>T?ng c?ng</span>
                  <span className="text-orange-600">{formatMoney(orderData?.finalAmount ?? 0)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900">Thông tin giao hàng</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Ngu?i giao hàng</div>
                    <div className="font-medium text-gray-900">{orderData?.courier?.name ?? 'Ð?i ngu giao hàng'}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Ðon v? v?n chuy?n</div>
                    <div className="font-medium text-gray-900">{orderData?.courier?.company ?? 'Ðon v? v?n chuy?n'}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-600 mb-1">S? di?n tho?i</div>
                    <a href={`tel:${orderData?.courier?.phone ?? '0987654321'}`} className="font-medium text-orange-600 hover:text-orange-700">
                      {orderData?.courier?.phone ?? '0987654321'}
                    </a>
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" />
                G?i ngu?i giao hàng
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Home className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900">Ð?a ch? nh?n hàng</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Ngu?i nh?n</div>
                    <div className="font-medium text-gray-900">{orderData?.customerInfo?.fullName}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-600 mb-1">S? di?n tho?i</div>
                    <div className="font-medium text-gray-900">{orderData?.customerInfo?.phone}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Ð?a ch?</div>
                    <div className="font-medium text-gray-900">
                      {[
                        orderData?.customerInfo?.address?.street,
                        orderData?.customerInfo?.address?.ward,
                        orderData?.customerInfo?.address?.district,
                        orderData?.customerInfo?.address?.city,
                        orderData?.customerInfo?.address?.country,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-900">Thanh toán</h3>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Phuong th?c</span>
                <span className="font-bold text-gray-900">
                  {orderData?.payment?.method === 'cod'
                    ? 'Thanh toán khi nh?n hàng'
                    : orderData?.payment?.method === 'bank'
                    ? 'Chuy?n kho?n ngân hàng'
                    : orderData?.payment?.method === 'momo'
                    ? 'MOMO'
                    : 'Khác'}
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">C?n h? tr??</h3>
              </div>

              <p className="text-sm text-gray-600 mb-4">Liên h? v?i chúng tôi n?u b?n c?n h? tr? v? don hàng</p>

              <div className="space-y-2">
                <button className="w-full bg-white border border-blue-200 text-blue-700 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Chat v?i CSKH
                </button>
                <button className="w-full bg-white border border-blue-200 text-blue-700 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  G?i hotline
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                T?i hóa don
              </button>
              <button className="w-full border-2 border-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:border-orange-300 hover:bg-orange-50 transition-all flex items-center justify-center gap-2">
                <Star className="w-4 h-4" />
                Ðánh giá don hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}








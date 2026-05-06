import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Search,
  Package,
  CheckCircle2,
  Truck,
  Home,
  Clock,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Calendar,
  User,
  MessageCircle,
  Download,
  Star,
  ChevronRight,
  AlertCircle,
  Box,
  ClipboardCheck,
  PackageCheck,
} from 'lucide-react';

export function TrackOrderPage() {
  const navigate = useNavigate();
  const [orderCode, setOrderCode] = useState('');
  const [showTracking, setShowTracking] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(3); // 0-4 for 5 statuses

  // Mock order data
  const orderData = {
    id: '#DH001235',
    date: '12/03/2026',
    status: 'shipping',
    estimatedDelivery: '15/03/2026',
    total: '320.000đ',
    paymentMethod: 'COD',
    customer: {
      name: 'Nguyễn Văn A',
      phone: '0912345678',
      email: 'nguyenvana@email.com',
      address: '123 Đường ABC, Phường 1, Quận 1, TP.HCM',
    },
    items: [
      {
        id: 1,
        title: 'Atomic Habits',
        author: 'James Clear',
        price: '129.000đ',
        quantity: 1,
        image:
          'https://images.unsplash.com/photo-1546913760-e23d946dd386?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWxmJTIwaGVscCUyMGJvb2t8ZW58MXx8fHwxNzczODQ3MDAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      },
      {
        id: 2,
        title: 'The Psychology of Money',
        author: 'Morgan Housel',
        price: '149.000đ',
        quantity: 1,
        image:
          'https://images.unsplash.com/photo-1768991732235-ac3e1bc9259c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGJvb2slMjBoYXJkY292ZXJ8ZW58MXx8fHwxNzczODIyMjA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      },
    ],
    shippingFee: 30000,
    discount: 0,
    courier: {
      name: 'Nguyễn Văn B',
      phone: '0987654321',
      company: 'Giao Hàng Nhanh',
    },
  };

  const trackingSteps = [
    {
      id: 0,
      title: 'Đơn hàng đã đặt',
      description: 'Đơn hàng đã được tạo thành công',
      time: '12/03/2026 - 10:30',
      icon: ClipboardCheck,
      color: 'bg-green-500',
    },
    {
      id: 1,
      title: 'Đã xác nhận',
      description: 'Đơn hàng đã được xác nhận và đang chờ đóng gói',
      time: '12/03/2026 - 11:00',
      icon: CheckCircle2,
      color: 'bg-green-500',
    },
    {
      id: 2,
      title: 'Đang đóng gói',
      description: 'Đơn hàng đang được đóng gói tại kho',
      time: '12/03/2026 - 14:30',
      icon: Box,
      color: 'bg-green-500',
    },
    {
      id: 3,
      title: 'Đang vận chuyển',
      description: 'Đơn hàng đang được giao đến bạn',
      time: '13/03/2026 - 08:00',
      icon: Truck,
      color: 'bg-orange-500',
    },
    {
      id: 4,
      title: 'Giao hàng thành công',
      description: 'Đơn hàng đã được giao thành công',
      time: '',
      icon: PackageCheck,
      color: 'bg-gray-300',
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderCode.trim()) {
      setShowTracking(true);
    }
  };

  if (!showTracking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Package className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Tra cứu đơn hàng
            </h1>
            <p className="text-lg text-gray-600">
              Nhập mã đơn hàng để theo dõi tình trạng giao hàng của bạn
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-12">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Mã đơn hàng
              </label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                  <input
                    type="text"
                    value={orderCode}
                    onChange={(e) => setOrderCode(e.target.value)}
                    placeholder="Nhập mã đơn hàng (VD: #DH001235)"
                    className="w-full pl-14 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors text-lg"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all hover:-translate-y-1 flex items-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Tra cứu
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                Bạn có thể tìm mã đơn hàng trong email xác nhận hoặc tin nhắn SMS
              </p>
            </div>
          </form>

          {/* Info Cards */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Giao hàng nhanh</h3>
              <p className="text-sm text-gray-600">
                Giao hàng trong 2-3 ngày làm việc
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PackageCheck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Theo dõi realtime</h3>
              <p className="text-sm text-gray-600">
                Cập nhật trạng thái đơn hàng liên tục
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Hỗ trợ 24/7</h3>
              <p className="text-sm text-gray-600">
                Luôn sẵn sàng hỗ trợ bạn mọi lúc
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-gray-900 mb-4">Liên kết nhanh</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/account')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />
                  <span className="font-medium text-gray-900">
                    Xem tất cả đơn hàng
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600" />
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />
                  <span className="font-medium text-gray-900">
                    Tiếp tục mua sắm
                  </span>
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
      {/* Header with search */}
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
                  placeholder="Nhập mã đơn hàng khác"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Order Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-sm opacity-90 mb-2">Mã đơn hàng</div>
              <div className="text-3xl font-bold">{orderData.id}</div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90 mb-2">Ngày đặt hàng</div>
              <div className="text-xl font-bold">{orderData.date}</div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm opacity-90">Trạng thái</div>
                <div className="text-xl font-bold">Đang vận chuyển</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Dự kiến giao hàng</div>
              <div className="text-xl font-bold">{orderData.estimatedDelivery}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="col-span-8 space-y-8">
            {/* Tracking Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Lộ trình vận chuyển
              </h2>

              <div className="relative">
                {/* Progress Line */}
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
                            isActive
                              ? step.color
                              : 'bg-gray-200'
                          } ${isCurrent ? 'ring-4 ring-orange-200' : ''}`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3
                              className={`text-lg font-bold ${
                                isActive ? 'text-gray-900' : 'text-gray-400'
                              }`}
                            >
                              {step.title}
                            </h3>
                            {step.time && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4" />
                                {step.time}
                              </div>
                            )}
                          </div>
                          <p
                            className={`${
                              isActive ? 'text-gray-600' : 'text-gray-400'
                            }`}
                          >
                            {step.description}
                          </p>
                          {isCurrent && (
                            <div className="mt-3 inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                              Trạng thái hiện tại
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Sản phẩm ({orderData.items.length})
              </h2>

              <div className="space-y-4">
                {orderData.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="w-20 h-28 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{item.author}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Số lượng: {item.quantity}
                        </span>
                        <span className="font-bold text-orange-600">
                          {item.price}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span className="font-medium">
                    {orderData.items
                      .reduce(
                        (sum, item) =>
                          sum +
                          parseFloat(item.price.replace(/[^\d]/g, '')) *
                            item.quantity,
                        0
                      )
                      .toLocaleString('vi-VN')}
                    đ
                  </span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium">
                    {orderData.shippingFee.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                <div className="flex items-center justify-between text-xl font-bold text-gray-900 pt-3 border-t">
                  <span>Tổng cộng</span>
                  <span className="text-orange-600">{orderData.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-4 space-y-6">
            {/* Courier Info */}
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
                    <div className="text-sm text-gray-600 mb-1">Người giao hàng</div>
                    <div className="font-medium text-gray-900">
                      {orderData.courier.name}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Đơn vị vận chuyển</div>
                    <div className="font-medium text-gray-900">
                      {orderData.courier.company}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Số điện thoại</div>
                    <a
                      href={`tel:${orderData.courier.phone}`}
                      className="font-medium text-orange-600 hover:text-orange-700"
                    >
                      {orderData.courier.phone}
                    </a>
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" />
                Gọi người giao hàng
              </button>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Home className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900">Địa chỉ nhận hàng</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Người nhận</div>
                    <div className="font-medium text-gray-900">
                      {orderData.customer.name}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Số điện thoại</div>
                    <div className="font-medium text-gray-900">
                      {orderData.customer.phone}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Địa chỉ</div>
                    <div className="font-medium text-gray-900">
                      {orderData.customer.address}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-900">Thanh toán</h3>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Phương thức</span>
                <span className="font-bold text-gray-900">
                  {orderData.paymentMethod === 'COD'
                    ? 'Thanh toán khi nhận hàng'
                    : orderData.paymentMethod}
                </span>
              </div>
            </div>

            {/* Support */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">Cần hỗ trợ?</h3>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Liên hệ với chúng tôi nếu bạn cần hỗ trợ về đơn hàng
              </p>

              <div className="space-y-2">
                <button className="w-full bg-white border border-blue-200 text-blue-700 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Chat với CSKH
                </button>
                <button className="w-full bg-white border border-blue-200 text-blue-700 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  Gọi hotline
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Tải hóa đơn
              </button>
              <button className="w-full border-2 border-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:border-orange-300 hover:bg-orange-50 transition-all flex items-center justify-center gap-2">
                <Star className="w-4 h-4" />
                Đánh giá đơn hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

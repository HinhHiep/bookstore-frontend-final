import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import {
  ChevronLeft,
  MapPin,
  User,
  Phone,
  Mail,
  CreditCard,
  Wallet,
  Building2,
  Truck,
  Package,
  Clock,
  Tag,
  Gift,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const selectedCartItemIds = (location.state as { selectedCartItemIds?: Array<string | number> } | null)
    ?.selectedCartItemIds;
  const checkoutItems =
    selectedCartItemIds && selectedCartItemIds.length > 0
      ? items.filter((item) => selectedCartItemIds.includes(item.id))
      : items;
  const checkoutTotalItems = checkoutItems.reduce((sum, item) => sum + item.quantity, 0);
  const checkoutTotalPrice = checkoutItems.reduce((sum, item) => {
    const itemPrice = parseFloat(item.price.replace(/[^\d]/g, '')) || 0;
    return sum + itemPrice * item.quantity;
  }, 0);
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    note: '',
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchAddresses();
    } else {
      setShowAddressForm(true);
      // For guest users, initialize with empty form
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        district: '',
        ward: '',
        note: '',
      });
    }
  }, [isAuthenticated, user]);

  const fetchAddresses = async () => {
    try {
      const response = await api.get('/users/me');
      const userData = response.data.data;
      if (userData.addresses && userData.addresses.length > 0) {
        setAddresses(userData.addresses);
        const defaultAddress = userData.addresses.find((addr: any) => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
          populateFormFromAddress(defaultAddress);
        }
      } else {
        setShowAddressForm(true);
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
      setShowAddressForm(true);
    }
  };

  const populateFormFromAddress = (address: any) => {
    setFormData({
      fullName: address.fullName || '',
      phone: address.phone || '',
      email: user?.email || '',
      address: address.address?.street || '',
      city: address.address?.city || '',
      district: address.address?.district || '',
      ward: address.address?.ward || '',
      note: '',
    });
  };

  const handleAddressSelect = (address: any) => {
    setSelectedAddress(address);
    populateFormFromAddress(address);
    setShowAddressForm(false);
  };

  const handleAddNewAddress = () => {
    setSelectedAddress(null);
    setFormData({
      fullName: user?.name || '',
      phone: '',
      email: user?.email || '',
      address: '',
      city: '',
      district: '',
      ward: '',
      note: '',
    });
    setShowAddressForm(true);
  };

  const handleSaveAddress = async () => {
    if (!isAuthenticated) return;

    // Validate required fields
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.district || !formData.ward) {
      alert('Vui lòng điền đầy đủ thông tin địa chỉ');
      return;
    }

    try {
      const addressData = {
        fullName: formData.fullName,
        phone: formData.phone,
        address: {
          street: formData.address,
          ward: formData.ward,
          district: formData.district,
          city: formData.city,
          country: 'Việt Nam',
        },
        isDefault: addresses.length === 0, // Set as default if first address
      };

      await api.post('/users/addresses', addressData);
      await fetchAddresses(); // Refresh addresses
      setShowAddressForm(false);
      alert('Địa chỉ đã được lưu thành công');
    } catch (error) {
      console.error('Failed to save address:', error);
      alert('Có lỗi xảy ra khi lưu địa chỉ');
    }
  };

  const shippingOptions = [
    {
      id: 'standard',
      name: 'Giao hàng tiêu chuẩn',
      description: '3-5 ngày làm việc',
      price: 30000,
      icon: Package,
    },
    {
      id: 'express',
      name: 'Giao hàng nhanh',
      description: '1-2 ngày làm việc',
      price: 50000,
      icon: Truck,
    },
    {
      id: 'same-day',
      name: 'Giao trong ngày',
      description: 'Đặt trước 10h sáng',
      price: 80000,
      icon: Clock,
    },
  ];

  const paymentMethods = [
    {
      id: 'cod',
      name: 'Thanh toán khi nhận hàng (COD)',
      description: 'Thanh toán bằng tiền mặt khi nhận hàng',
      icon: Wallet,
      image:
        'https://images.unsplash.com/photo-1597253925798-233e0f8077ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YWxsZXQlMjBtb25leSUyMGNhc2h8ZW58MXx8fHwxNzczODQ4NjI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'card',
      name: 'Thẻ tín dụng/Ghi nợ',
      description: 'Visa, Mastercard, JCB',
      icon: CreditCard,
      image:
        'https://images.unsplash.com/photo-1563013544-824ae1b704d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVkaXQlMjBjYXJkJTIwcGF5bWVudCUyMG9ubGluZXxlbnwxfHx8fDE3NzM4NDg2Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'bank',
      name: 'Chuyển khoản ngân hàng',
      description: 'Chuyển khoản qua Internet Banking',
      icon: Building2,
      image:
        'https://images.unsplash.com/photo-1652503698072-175651f77634?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5rJTIwdHJhbnNmZXIlMjBwYXltZW50fGVufDF8fHx8MTc3Mzg0ODYyOXww&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  const shippingFee =
    shippingOptions.find((opt) => opt.id === selectedShipping)?.price || 0;
  const discount = appliedCoupon ? Math.min(appliedCoupon.discount, checkoutTotalPrice + shippingFee) : 0;
  const finalTotal = Math.max(checkoutTotalPrice + shippingFee - discount, 0);

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'TRAMSACH2024') {
      setAppliedCoupon({ code: couponCode, discount: 50000 });
    } else if (couponCode.toUpperCase() === 'FREESHIP') {
      setAppliedCoupon({ code: couponCode, discount: shippingFee });
    } else {
      alert('Mã giảm giá không hợp lệ!');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent double submission

    // Validate form
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.district || !formData.ward) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }

    if (!isAuthenticated && !formData.email) {
      alert('Vui lòng nhập email');
      return;
    }

    if (checkoutItems.length === 0) {
      alert('Giỏ hàng trống');
      return;
    }

    // Show confirmation dialog
    const confirmMessage = `
Thông tin đơn hàng:
- Người nhận: ${formData.fullName}
- SĐT: ${formData.phone}
- Địa chỉ: ${formData.address}, ${formData.ward}, ${formData.district}, ${formData.city}
- Tổng tiền: ${finalTotal.toLocaleString('vi-VN')}đ
- Phương thức thanh toán: ${paymentMethods.find(p => p.id === selectedPayment)?.name}

Bạn có chắc chắn muốn đặt hàng?
    `;

    if (!confirm(confirmMessage)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        items: checkoutItems.map(item => ({
          bookId: item.id,
          quantity: item.quantity
        })),
        customerInfo: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email || (user?.email || ''),
          address: {
            street: formData.address,
            ward: formData.ward,
            district: formData.district,
            city: formData.city,
            country: 'Việt Nam'
          }
        },
        paymentMethod: selectedPayment,
        note: formData.note
      };

      // Create order
      const response = await api.post('/orders', orderData);
      const order = response.data.data;

      // Clear cart after successful order
      await clearCart();

      alert(`Đặt hàng thành công! Mã đơn hàng: ${order.orderCode}`);
      navigate('/');

    } catch (error: any) {
      console.error('Order creation failed:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (checkoutItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Giỏ hàng / Thanh toán</span>
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <span className="font-medium text-gray-900">Giỏ hàng</span>
            </div>
            <div className="w-24 h-1 bg-orange-500"></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                2
              </div>
              <span className="font-medium text-orange-600">Thanh toán</span>
            </div>
            <div className="w-24 h-1 bg-gray-200"></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                3
              </div>
              <span className="font-medium text-gray-500">Hoàn tất</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column - Forms */}
          <div className="col-span-8 space-y-6">
            {/* Shipping Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Thông tin giao hàng
                </h2>
              </div>

              {isAuthenticated && addresses.length > 0 && !showAddressForm ? (
                // Display saved addresses
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Chọn địa chỉ giao hàng</h3>
                    <button
                      type="button"
                      onClick={handleAddNewAddress}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Thêm địa chỉ mới
                    </button>
                  </div>

                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <label
                        key={address._id}
                        className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedAddress?._id === address._id
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="selectedAddress"
                            checked={selectedAddress?._id === address._id}
                            onChange={() => handleAddressSelect(address)}
                            className="mt-1 w-4 h-4 text-orange-500"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">{address.fullName}</span>
                              {address.isDefault && (
                                <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full">
                                  Mặc định
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              <div>{address.phone}</div>
                              <div>{address.address.street}, {address.address.ward}, {address.address.district}, {address.address.city}</div>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                // Address form
                <div className="space-y-4">
                  {isAuthenticated && addresses.length > 0 && (
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Thêm địa chỉ mới</h3>
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="text-orange-500 hover:text-orange-600 transition-colors"
                      >
                        Hủy
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                          placeholder="Nhập họ và tên"
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          placeholder="Nhập số điện thoại"
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Nhập email"
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          placeholder="Số nhà, tên đường"
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tỉnh/Thành phố <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={(e: any) => handleInputChange(e)}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                      >
                        <option value="">Chọn Tỉnh/Thành phố</option>
                        <option value="hcm">TP. Hồ Chí Minh</option>
                        <option value="hanoi">Hà Nội</option>
                        <option value="danang">Đà Nẵng</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quận/Huyện <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="district"
                        value={formData.district}
                        onChange={(e: any) => handleInputChange(e)}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                      >
                        <option value="">Chọn Quận/Huyện</option>
                        <option value="1">Quận 1</option>
                        <option value="3">Quận 3</option>
                        <option value="10">Quận 10</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phường/Xã <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="ward"
                        value={formData.ward}
                        onChange={handleInputChange}
                        required
                        placeholder="Nhập Phường/Xã"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ghi chú đơn hàng
                      </label>
                      <textarea
                        name="note"
                        value={formData.note}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors resize-none"
                      ></textarea>
                    </div>

                    {isAuthenticated && (
                      <div className="col-span-2">
                        <button
                          type="button"
                          onClick={handleSaveAddress}
                          className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                        >
                          Lưu địa chỉ
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Shipping Method */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Phương thức vận chuyển
                </h2>
              </div>

              <div className="space-y-3">
                {shippingOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <label
                      key={option.id}
                      className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        selectedShipping === option.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="shipping"
                          value={option.id}
                          checked={selectedShipping === option.id}
                          onChange={(e) => setSelectedShipping(e.target.value)}
                          className="w-5 h-5 text-orange-500"
                        />
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            selectedShipping === option.id
                              ? 'bg-orange-500'
                              : 'bg-gray-100'
                          }`}
                        >
                          <Icon
                            className={`w-6 h-6 ${
                              selectedShipping === option.id
                                ? 'text-white'
                                : 'text-gray-600'
                            }`}
                          />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">
                            {option.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {option.description}
                          </div>
                        </div>
                      </div>
                      <div className="font-bold text-orange-600">
                        {option.price === 0
                          ? 'Miễn phí'
                          : `${option.price.toLocaleString('vi-VN')}đ`}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Phương thức thanh toán
                </h2>
              </div>

              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <label
                      key={method.id}
                      className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        selectedPayment === method.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={selectedPayment === method.id}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                          className="w-5 h-5 text-orange-500"
                        />
                        <div className="w-16 h-12 rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={method.image}
                            alt={method.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">
                            {method.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {method.description}
                          </div>
                        </div>
                      </div>
                      <Icon
                        className={`w-6 h-6 ${
                          selectedPayment === method.id
                            ? 'text-orange-500'
                            : 'text-gray-400'
                        }`}
                      />
                    </label>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <span className="font-bold">Bảo mật thanh toán:</span> Thông
                  tin thanh toán của bạn được mã hóa và bảo vệ an toàn. Chúng tôi
                  không lưu trữ thông tin thẻ của bạn.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="col-span-4">
            <div className="sticky top-4 space-y-6">
              {/* Order Items */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">
                  Đơn hàng ({checkoutTotalItems} sản phẩm)
                </h3>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {checkoutItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                          {item.title}
                        </h4>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">
                            SL: {item.quantity}
                          </span>
                          <span className="text-sm font-bold text-orange-600">
                            {item.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coupon */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-5 h-5 text-orange-600" />
                  <h3 className="font-bold text-gray-900">Mã giảm giá</h3>
                </div>

                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Nhập mã giảm giá"
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                  >
                    Áp dụng
                  </button>
                </div>

                {appliedCoupon && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700 font-medium">
                        Mã "{appliedCoupon.code}"
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAppliedCoupon(null)}
                      className="text-green-700 hover:text-green-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">
                  Tổng đơn hàng
                </h3>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span className="font-medium">
                      {checkoutTotalPrice.toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span className="font-medium">
                      {shippingFee.toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex items-center justify-between text-green-600">
                      <span>Giảm giá</span>
                      <span className="font-medium">
                        -{discount.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4 mb-6">
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
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Hoàn tất đơn hàng
                    </>
                  )}
                </button>

                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>
                    Bằng việc đặt hàng, bạn đồng ý với{' '}
                    <button
                      type="button"
                      className="text-orange-600 hover:underline"
                    >
                      Điều khoản sử dụng
                    </button>{' '}
                    của chúng tôi
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">
                        Thanh toán an toàn
                      </div>
                      <div className="text-xs text-gray-600">
                        Được mã hóa SSL
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Truck className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">
                        Giao hàng nhanh chóng
                      </div>
                      <div className="text-xs text-gray-600">2-3 ngày</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">
                        Đổi trả dễ dàng
                      </div>
                      <div className="text-xs text-gray-600">Trong 7 ngày</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

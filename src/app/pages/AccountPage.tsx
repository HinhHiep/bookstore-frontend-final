import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
  User,
  Settings,
  Package,
  Heart,
  MapPin,
  Bell,
  LogOut,
  Edit2,
  Camera,
  Mail,
  Phone,
  Calendar,
  Award,
  BookOpen,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Star,
  ChevronRight,
  Gift,
  CreditCard,
  Shield,
} from 'lucide-react';

export function AccountPage() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setEditName(user.name);
    }
  }, [user, navigate]);

  if (!user) return null;

  const tabs = [
    { id: 'profile', label: 'Thông tin cá nhân', icon: User },
    { id: 'orders', label: 'Đơn hàng', icon: Package },
    { id: 'wishlist', label: 'Yêu thích', icon: Heart },
    { id: 'addresses', label: 'Địa chỉ', icon: MapPin },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
  ];

  const stats = [
    { label: 'Đơn hàng', value: '24', icon: Package, color: 'bg-blue-500' },
    { label: 'Sách đã đọc', value: '156', icon: BookOpen, color: 'bg-green-500' },
    { label: 'Điểm tích lũy', value: '2,450', icon: Award, color: 'bg-orange-500' },
    { label: 'Đang theo dõi', value: '8', icon: Heart, color: 'bg-red-500' },
  ];

  const orders = [
    {
      id: '#DH001234',
      date: '15/03/2026',
      status: 'delivered',
      statusText: 'Đã giao hàng',
      total: '450.000đ',
      items: 3,
      image: 'https://images.unsplash.com/photo-1546913760-e23d946dd386?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWxmJTIwaGVscCUyMGJvb2t8ZW58MXx8fHwxNzczODQ3MDAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '#DH001235',
      date: '12/03/2026',
      status: 'shipping',
      statusText: 'Đang giao hàng',
      total: '320.000đ',
      items: 2,
      image: 'https://images.unsplash.com/photo-1648227379047-b57dc1ce11b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHBhY2thZ2UlMjBib3h8ZW58MXx8fHwxNzczNzU0MzQwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '#DH001236',
      date: '10/03/2026',
      status: 'processing',
      statusText: 'Đang xử lý',
      total: '280.000đ',
      items: 2,
      image: 'https://images.unsplash.com/photo-1768991732235-ac3e1bc9259c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGJvb2slMjBoYXJkY292ZXJ8ZW58MXx8fHwxNzczODIyMjA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '#DH001237',
      date: '08/03/2026',
      status: 'cancelled',
      statusText: 'Đã hủy',
      total: '150.000đ',
      items: 1,
      image: 'https://images.unsplash.com/photo-1707586234446-a1338e496161?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2FkZW1pYyUyMHRleHRib29rfGVufDF8fHx8MTc3Mzg0NzE0OXww&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  const wishlistBooks = [
    {
      id: 1,
      title: 'Atomic Habits',
      author: 'James Clear',
      price: '129.000đ',
      originalPrice: '180.000đ',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1546913760-e23d946dd386?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWxmJTIwaGVscCUyMGJvb2t8ZW58MXx8fHwxNzczODQ3MDAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 2,
      title: 'The Psychology of Money',
      author: 'Morgan Housel',
      price: '149.000đ',
      originalPrice: '195.000đ',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1768991732235-ac3e1bc9259c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGJvb2slMjBoYXJkY292ZXJ8ZW58MXx8fHwxNzczODIyMjA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 3,
      title: 'Deep Work',
      author: 'Cal Newport',
      price: '139.000đ',
      originalPrice: '175.000đ',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1707586234446-a1338e496161?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2FkZW1pYyUyMHRleHRib29rfGVufDF8fHx8MTc3Mzg0NzE0OXww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 4,
      title: 'Thinking, Fast and Slow',
      author: 'Daniel Kahneman',
      price: '169.000đ',
      originalPrice: '220.000đ',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1605263995534-995965cb88e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RpdmF0aW9uYWwlMjBib29rJTIwaW5zcGlyZXxlbnwxfHx8fDE3NzM4NDcxNDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  const addresses = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      phone: '0912345678',
      address: '123 Đường ABC, Phường 1, Quận 1, TP.HCM',
      isDefault: true,
    },
    {
      id: 2,
      name: 'Nguyễn Văn A',
      phone: '0912345678',
      address: '456 Đường XYZ, Phường 2, Quận 3, TP.HCM',
      isDefault: false,
    },
  ];

  const achievements = [
    { name: 'Độc giả mới', icon: BookOpen, unlocked: true, color: 'bg-blue-500' },
    { name: 'Mua sắm 10+', icon: Package, unlocked: true, color: 'bg-green-500' },
    { name: 'Đánh giá 5 sao', icon: Star, unlocked: true, color: 'bg-yellow-500' },
    { name: 'Khách hàng VIP', icon: Award, unlocked: false, color: 'bg-purple-500' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'shipping':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'shipping':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'processing':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="col-span-3">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
              <div className="h-24 bg-gradient-to-r from-orange-500 to-orange-600"></div>
              <div className="px-6 pb-6">
                <div className="relative -mt-12 mb-4">
                  <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden mx-auto bg-gray-100">
                    <img
                      src="https://images.unsplash.com/photo-1640960543409-dbe56ccc30e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhciUyMHBlcnNvbnxlbnwxfHx8fDE3NzM4NDg0MDh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button className="absolute bottom-0 right-1/2 translate-x-12 translate-y-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white hover:bg-orange-600 transition-colors shadow-lg">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{user?.name}</h2>
                  <p className="text-sm text-gray-600 mb-1">{user?.email}</p>
                  <div className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium">
                    <Award className="w-3 h-3" />
                    Thành viên Vàng
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
              <nav className="p-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        activeTab === tab.id
                          ? 'bg-orange-500 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Logout */}
            <button 
              onClick={logout}
              className="w-full bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Đăng xuất</span>
            </button>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Tab Content */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Profile Info Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h2>
                    {!isEditing ? (
                      <button 
                        onClick={() => {
                          setEditName(user?.name || '');
                          setIsEditing(true);
                        }}
                        className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        Chỉnh sửa
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Hủy
                        </button>
                        <button
                          onClick={async () => {
                            setIsSaving(true);
                            try {
                              const res = await api.patch('/users/me', { name: editName });
                              updateUser(res.data.data || res.data);
                              setIsEditing(false);
                            } catch (e) {
                              console.error(e);
                              alert('Cập nhật thất bại.');
                            } finally {
                              setIsSaving(false);
                            }
                          }}
                          disabled={isSaving}
                          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                          {isSaving ? 'Đang lưu...' : 'Lưu lại'}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Họ và tên</label>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <User className="w-5 h-5 text-gray-400" />
                        {isEditing ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="bg-transparent border-b border-gray-300 focus:border-orange-500 outline-none w-full"
                          />
                        ) : (
                          <span className="font-medium text-gray-900">{user?.name}</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Email</label>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-900">{user?.email}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Số điện thoại</label>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-900">0912345678</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Ngày sinh</label>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-900">15/08/1990</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Thành tích</h2>
                  <div className="grid grid-cols-4 gap-4">
                    {achievements.map((achievement) => {
                      const Icon = achievement.icon;
                      return (
                        <div
                          key={achievement.name}
                          className={`text-center p-6 rounded-xl border-2 ${
                            achievement.unlocked
                              ? 'border-orange-200 bg-orange-50'
                              : 'border-gray-200 bg-gray-50 opacity-50'
                          }`}
                        >
                          <div
                            className={`w-16 h-16 ${achievement.color} rounded-full flex items-center justify-center mx-auto mb-3 ${
                              !achievement.unlocked && 'grayscale'
                            }`}
                          >
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <div className="font-medium text-sm text-gray-900">{achievement.name}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Reading Stats */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Thống kê đọc sách</h2>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                      <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-blue-700 mb-1">156</div>
                      <div className="text-sm text-blue-600">Sách đã đọc</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                      <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-green-700 mb-1">24</div>
                      <div className="text-sm text-green-600">Sách trong tháng</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                      <Clock className="w-12 h-12 text-orange-600 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-orange-700 mb-1">48h</div>
                      <div className="text-sm text-orange-600">Thời gian đọc</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Đơn hàng của tôi</h2>
                  <div className="flex items-center gap-2">
                    <select className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500">
                      <option>Tất cả đơn hàng</option>
                      <option>Đang xử lý</option>
                      <option>Đang giao</option>
                      <option>Đã giao</option>
                      <option>Đã hủy</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border-2 border-gray-200 rounded-xl p-6 hover:border-orange-300 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-28 rounded-lg overflow-hidden">
                            <img
                              src={order.image}
                              alt="Order"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 mb-1">Đơn hàng {order.id}</div>
                            <div className="text-sm text-gray-600 mb-2">
                              {order.items} sản phẩm • {order.date}
                            </div>
                            <div
                              className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium border ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {getStatusIcon(order.status)}
                              {order.statusText}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600 mb-2">Tổng cộng</div>
                          <div className="text-2xl font-bold text-orange-600 mb-3">
                            {order.total}
                          </div>
                          <button className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium">
                            Xem chi tiết
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Sách yêu thích</h2>
                  <p className="text-gray-600">{wishlistBooks.length} sản phẩm</p>
                </div>

                <div className="grid grid-cols-4 gap-6">
                  {wishlistBooks.map((book) => (
                    <div
                      key={book.id}
                      className="group relative bg-gray-50 rounded-xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <img
                          src={book.image}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                        <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50">
                          <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                        </button>
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
                                i < Math.floor(book.rating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-orange-500 font-bold">{book.price}</div>
                            <div className="text-gray-400 line-through text-sm">
                              {book.originalPrice}
                            </div>
                          </div>
                          <button className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white hover:bg-orange-600 transition-colors">
                            <Package className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Địa chỉ nhận hàng</h2>
                  <button className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                    <MapPin className="w-4 h-4" />
                    Thêm địa chỉ mới
                  </button>
                </div>

                <div className="space-y-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="border-2 border-gray-200 rounded-xl p-6 hover:border-orange-300 transition-colors relative"
                    >
                      {addr.isDefault && (
                        <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          Mặc định
                        </div>
                      )}
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-gray-900 mb-2">{addr.name}</div>
                          <div className="text-gray-600 mb-1">{addr.phone}</div>
                          <div className="text-gray-600">{addr.address}</div>
                        </div>
                        <div className="flex gap-2">
                          <button className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium px-3 py-2 rounded-lg hover:bg-orange-50">
                            <Edit2 className="w-4 h-4" />
                            Sửa
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Account Settings */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Cài đặt tài khoản</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-gray-600" />
                        <div>
                          <div className="font-medium text-gray-900">Thông báo đẩy</div>
                          <div className="text-sm text-gray-600">Nhận thông báo về đơn hàng và khuyến mãi</div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-600" />
                        <div>
                          <div className="font-medium text-gray-900">Email marketing</div>
                          <div className="text-sm text-gray-600">Nhận tin tức và ưu đãi qua email</div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-gray-600" />
                        <div>
                          <div className="font-medium text-gray-900">Xác thực hai yếu tố</div>
                          <div className="text-sm text-gray-600">Bảo mật tài khoản với mã OTP</div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Security */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Bảo mật</h2>
                  
                  <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-900">Đổi mật khẩu</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>

                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-900">Quản lý phương thức thanh toán</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>

                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <Gift className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-900">Quản lý voucher</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

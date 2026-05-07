import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'sonner';
import {
  User,
  Settings,
  Package,
  Heart,
  MapPin,
  Bell,
  LogOut,
  Edit2,
  Mail,
  Phone,
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

type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'completed' | 'cancelled';

interface OrderItem {
  title: string;
  quantity: number;
  thumbnail?: string;
}

interface Order {
  _id: string;
  orderCode: string;
  createdAt: string;
  status: OrderStatus;
  finalAmount: number;
  items: OrderItem[];
}

interface AddressItem {
  _id: string;
  fullName: string;
  phone: string;
  isDefault?: boolean;
  address: {
    street: string;
    ward: string;
    district: string;
    city: string;
  };
}

interface BookItem {
  _id: string;
  title: string;
  author: string;
  price: number;
  finalPrice?: number;
  averageRating?: number;
  reviewCount?: number;
  coverImage?: string;
  images?: string[];
}

const formatMoney = (value: number) => `${(value || 0).toLocaleString('vi-VN')}d`;

const getBookImage = (book: BookItem) => {
  if (book.coverImage && !book.coverImage.includes('example.com')) return book.coverImage;
  if (book.images?.[0] && !book.images[0].includes('example.com')) return book.images[0];
  return `https://picsum.photos/seed/${book._id}/360/480`;
};

const getOrderImage = (order: Order) => {
  const firstItem = order.items?.[0];
  if (firstItem?.thumbnail && !firstItem.thumbnail.includes('example.com')) return firstItem.thumbnail;
  return `https://picsum.photos/seed/${order._id}/240/320`;
};

export function AccountPage() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [recommendedBooks, setRecommendedBooks] = useState<BookItem[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setEditName(user.name);
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoadingData(true);
      try {
        const [ordersRes, profileRes, recRes] = await Promise.all([
          api.get('/orders/my'),
          api.get('/users/me'),
          api.get('/recommendations'),
        ]);

        setOrders(ordersRes.data?.data || []);
        setAddresses(profileRes.data?.data?.addresses || []);
        setRecommendedBooks(recRes.data?.data || []);
      } catch (error) {
        console.error('Failed to fetch account data', error);
        toast.error('Khong tai duoc du lieu tai khoan');
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user) return null;

  const tabs = [
    { id: 'profile', label: 'Thong tin ca nhan', icon: User },
    { id: 'orders', label: 'Don hang', icon: Package },
    { id: 'wishlist', label: 'Goi y cho ban', icon: Heart },
    { id: 'addresses', label: 'Dia chi', icon: MapPin },
    { id: 'settings', label: 'Cai dat', icon: Settings },
  ];

  const completedOrders = orders.filter((o) => o.status === 'completed').length;
  const shippingOrders = orders.filter((o) => o.status === 'shipping').length;
  const totalSpent = orders.reduce((sum, o) => sum + (o.finalAmount || 0), 0);

  const stats = [
    { label: 'Don hang', value: String(orders.length), icon: Package, color: 'bg-blue-500' },
    { label: 'Dang giao', value: String(shippingOrders), icon: Truck, color: 'bg-cyan-500' },
    { label: 'Da giao', value: String(completedOrders), icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Da chi', value: formatMoney(totalSpent), icon: Gift, color: 'bg-orange-500' },
  ];

  const achievements = useMemo(
    () => [
      { name: 'Don dau tien', unlocked: orders.length > 0, color: 'bg-blue-500', icon: Package },
      { name: 'Da nhan hang', unlocked: completedOrders > 0, color: 'bg-green-500', icon: CheckCircle },
      { name: 'Danh gia cao', unlocked: recommendedBooks.length > 0, color: 'bg-yellow-500', icon: Star },
      { name: 'Khach quen', unlocked: orders.length >= 5, color: 'bg-purple-500', icon: Heart },
    ],
    [orders.length, completedOrders, recommendedBooks.length]
  );

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'shipping':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'pending':
      case 'confirmed':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'shipping':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending':
      case 'confirmed':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return '';
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'Cho xu ly';
      case 'confirmed':
        return 'Da xac nhan';
      case 'shipping':
        return 'Dang giao';
      case 'completed':
        return 'Da giao';
      case 'cancelled':
        return 'Da huy';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-3">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
              <div className="h-24 bg-gradient-to-r from-orange-500 to-orange-600"></div>
              <div className="px-6 pb-6">
                <div className="relative -mt-12 mb-4">
                  <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden mx-auto bg-gray-100 flex items-center justify-center">
                    <User className="w-10 h-10 text-gray-500" />
                  </div>
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{user?.name}</h2>
                  <p className="text-sm text-gray-600 mb-1">{user?.email}</p>
                  <div className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium">
                    <Award className="w-3 h-3" />
                    Thanh vien
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
              <nav className="p-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        activeTab === tab.id ? 'bg-orange-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <button
              onClick={logout}
              className="w-full bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Dang xuat</span>
            </button>
          </div>

          <div className="col-span-9">
            <div className="grid grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {loadingData && <div className="mb-4 text-sm text-gray-500">Dang dong bo du lieu...</div>}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Thong tin ca nhan</h2>
                    {!isEditing ? (
                      <button
                        onClick={() => {
                          setEditName(user?.name || '');
                          setIsEditing(true);
                        }}
                        className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                      >
                        <Edit2 className="w-4 h-4" />
                        Chinh sua
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Huy</button>
                        <button
                          onClick={async () => {
                            setIsSaving(true);
                            try {
                              const res = await api.patch('/users/me', { name: editName });
                              updateUser(res.data.data || res.data);
                              setIsEditing(false);
                              toast.success('Cap nhat thanh cong');
                            } catch (e) {
                              console.error(e);
                              toast.error('Cap nhat that bai');
                            } finally {
                              setIsSaving(false);
                            }
                          }}
                          disabled={isSaving}
                          className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
                        >
                          {isSaving ? 'Dang luu...' : 'Luu lai'}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Ho va ten</label>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <User className="w-5 h-5 text-gray-400" />
                        {isEditing ? (
                          <input value={editName} onChange={(e) => setEditName(e.target.value)} className="bg-transparent border-b border-gray-300 outline-none w-full" />
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
                      <label className="text-sm text-gray-600 mb-2 block">Dia chi mac dinh</label>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {addresses.find((a) => a.isDefault)
                            ? `${addresses.find((a) => a.isDefault)?.address.street}, ${addresses.find((a) => a.isDefault)?.address.district}`
                            : 'Chua co dia chi mac dinh'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">So don hoan thanh</label>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-900">{completedOrders}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Thanh tich</h2>
                  <div className="grid grid-cols-4 gap-4">
                    {achievements.map((achievement) => {
                      const Icon = achievement.icon;
                      return (
                        <div key={achievement.name} className={`text-center p-6 rounded-xl border-2 ${achievement.unlocked ? 'border-orange-200 bg-orange-50' : 'border-gray-200 bg-gray-50 opacity-50'}`}>
                          <div className={`w-16 h-16 ${achievement.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <div className="font-medium text-sm text-gray-900">{achievement.name}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Don hang cua toi</h2>
                <div className="space-y-4">
                  {orders.length === 0 && <div className="text-gray-500">Ban chua co don hang nao.</div>}
                  {orders.map((order) => (
                    <div key={order._id} className="border-2 border-gray-200 rounded-xl p-6 hover:border-orange-300 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-28 rounded-lg overflow-hidden">
                            <img src={getOrderImage(order)} alt={order.orderCode} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 mb-1">Don hang {order.orderCode}</div>
                            <div className="text-sm text-gray-600 mb-2">
                              {order.items?.length || 0} san pham • {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                            </div>
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium border ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              {getStatusText(order.status)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600 mb-2">Tong cong</div>
                          <div className="text-2xl font-bold text-orange-600 mb-3">{formatMoney(order.finalAmount)}</div>
                          <button onClick={() => navigate('/track-order', { state: { orderCode: order.orderCode } })} className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium">
                            Theo doi
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
                  <h2 className="text-2xl font-bold text-gray-900">Goi y cho ban</h2>
                  <p className="text-gray-600">{recommendedBooks.length} san pham</p>
                </div>

                <div className="grid grid-cols-4 gap-6">
                  {recommendedBooks.map((book) => (
                    <div key={book._id} className="group relative bg-gray-50 rounded-xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <img src={getBookImage(book)} alt={book.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{book.author}</p>
                        <div className="flex items-center gap-1 mb-3 text-sm text-gray-600">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {(book.averageRating || 0).toFixed(1)} ({book.reviewCount || 0})
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-orange-500 font-bold">{formatMoney(book.finalPrice ?? book.price)}</div>
                            {(book.finalPrice ?? book.price) < book.price && (
                              <div className="text-gray-400 line-through text-sm">{formatMoney(book.price)}</div>
                            )}
                          </div>
                          <button onClick={() => navigate(`/book/${book._id}`)} className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white hover:bg-orange-600 transition-colors">
                            <ChevronRight className="w-5 h-5" />
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
                  <h2 className="text-2xl font-bold text-gray-900">Dia chi nhan hang</h2>
                  <button onClick={() => navigate('/checkout')} className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                    <MapPin className="w-4 h-4" />
                    Them dia chi moi
                  </button>
                </div>

                <div className="space-y-4">
                  {addresses.length === 0 && <div className="text-gray-500">Ban chua luu dia chi nao.</div>}
                  {addresses.map((addr) => (
                    <div key={addr._id} className="border-2 border-gray-200 rounded-xl p-6 hover:border-orange-300 transition-colors relative">
                      {addr.isDefault && (
                        <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">Mac dinh</div>
                      )}
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-gray-900 mb-2">{addr.fullName}</div>
                          <div className="text-gray-600 mb-1">{addr.phone}</div>
                          <div className="text-gray-600">{addr.address.street}, {addr.address.ward}, {addr.address.district}, {addr.address.city}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Cai dat tai khoan</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-gray-600" />
                        <div>
                          <div className="font-medium text-gray-900">Thong bao day</div>
                          <div className="text-sm text-gray-600">Nhan thong bao ve don hang va khuyen mai</div>
                        </div>
                      </div>
                      <input type="checkbox" className="w-5 h-5" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-600" />
                        <div>
                          <div className="font-medium text-gray-900">Email marketing</div>
                          <div className="text-sm text-gray-600">Nhan tin tuc va uu dai qua email</div>
                        </div>
                      </div>
                      <input type="checkbox" className="w-5 h-5" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-gray-600" />
                        <div>
                          <div className="font-medium text-gray-900">Xac thuc hai lop</div>
                          <div className="text-sm text-gray-600">Bao mat tai khoan voi OTP</div>
                        </div>
                      </div>
                      <input type="checkbox" className="w-5 h-5" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Bao mat</h2>
                  <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-900">Doi mat khau</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-900">Quan ly phuong thuc thanh toan</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                      <div className="flex items-center gap-3">
                        <Gift className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-900">Quan ly voucher</span>
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

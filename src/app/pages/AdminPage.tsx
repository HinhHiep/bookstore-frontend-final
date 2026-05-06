import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  LayoutDashboard,
  BookOpen,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  TrendingUp,
  DollarSign,
  Package,
  UserCheck,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  Filter,
  Download,
  BarChart3,
  X,
  Upload,
  AlertTriangle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type AdminView = 'dashboard' | 'books' | 'orders' | 'customers' | 'settings';

export function AdminPage() {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showEditBookModal, setShowEditBookModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [exportOptions, setExportOptions] = useState({
    reportType: 'revenue',
    dateFrom: '',
    dateTo: '',
    format: 'pdf',
  });
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    image: '',
  });

  // Mock data
  const stats = [
    {
      title: 'Tổng doanh thu',
      value: '125.5M',
      change: '+12.5%',
      icon: DollarSign,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgLight: 'bg-green-50',
    },
    {
      title: 'Đơn hàng',
      value: '1,234',
      change: '+8.2%',
      icon: ShoppingCart,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgLight: 'bg-blue-50',
    },
    {
      title: 'Khách hàng',
      value: '856',
      change: '+15.3%',
      icon: Users,
      textColor: 'text-purple-600',
      color: 'bg-purple-500',
      bgLight: 'bg-purple-50',
    },
    {
      title: 'Sản phẩm',
      value: '342',
      change: '+5.1%',
      icon: Package,
      textColor: 'text-orange-600',
      color: 'bg-orange-500',
      bgLight: 'bg-orange-50',
    },
  ];

  const revenueData = [
    { month: 'T1', revenue: 45, orders: 120 },
    { month: 'T2', revenue: 52, orders: 145 },
    { month: 'T3', revenue: 48, orders: 130 },
    { month: 'T4', revenue: 61, orders: 165 },
    { month: 'T5', revenue: 55, orders: 155 },
    { month: 'T6', revenue: 67, orders: 180 },
    { month: 'T7', revenue: 70, orders: 190 },
    { month: 'T8', revenue: 75, orders: 210 },
  ];

  const categoryData = [
    { name: 'Văn học', value: 35, color: '#F97316' },
    { name: 'Kinh tế', value: 28, color: '#3B82F6' },
    { name: 'Phát triển', value: 22, color: '#8B5CF6' },
    { name: 'Thiếu nhi', value: 15, color: '#10B981' },
  ];

  const books = [
    {
      id: 1,
      title: 'Atomic Habits',
      author: 'James Clear',
      category: 'Phát triển bản thân',
      price: '129.000đ',
      stock: 45,
      sold: 234,
      status: 'active',
    },
    {
      id: 2,
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      category: 'Văn học',
      price: '189.000đ',
      stock: 12,
      sold: 189,
      status: 'active',
    },
    {
      id: 3,
      title: 'Rich Dad Poor Dad',
      author: 'Robert Kiyosaki',
      category: 'Kinh tế',
      price: '119.000đ',
      stock: 0,
      sold: 456,
      status: 'out-of-stock',
    },
    {
      id: 4,
      title: 'The Psychology of Money',
      author: 'Morgan Housel',
      category: 'Kinh tế',
      price: '149.000đ',
      stock: 67,
      sold: 312,
      status: 'active',
    },
  ];

  const orders = [
    {
      id: 'ORD-001',
      customer: 'Nguyễn Văn A',
      email: 'nguyenvana@email.com',
      phone: '0901234567',
      date: '18/03/2026',
      total: '458.000đ',
      status: 'delivered',
      items: 3,
      cancelRequest: false,
      address: '123 Đường ABC, Quận 1, TP.HCM',
      products: [
        { name: 'Atomic Habits', quantity: 2, price: '129.000đ' },
        { name: 'Sapiens', quantity: 1, price: '200.000đ' },
      ],
    },
    {
      id: 'ORD-002',
      customer: 'Trần Thị B',
      email: 'tranthib@email.com',
      phone: '0907654321',
      date: '18/03/2026',
      total: '129.000đ',
      status: 'shipping',
      items: 1,
      cancelRequest: true,
      cancelReason: 'Đặt nhầm sản phẩm, muốn đổi sang sách khác',
      address: '456 Đường DEF, Quận 3, TP.HCM',
      products: [
        { name: 'Rich Dad Poor Dad', quantity: 1, price: '129.000đ' },
      ],
    },
    {
      id: 'ORD-003',
      customer: 'Lê Văn C',
      email: 'levanc@email.com',
      phone: '0912345678',
      date: '17/03/2026',
      total: '645.000đ',
      status: 'processing',
      items: 5,
      cancelRequest: true,
      cancelReason: 'Tìm được giá rẻ hơn ở chỗ khác',
      address: '789 Đường GHI, Quận 5, TP.HCM',
      products: [
        { name: 'The Psychology of Money', quantity: 3, price: '149.000đ' },
        { name: 'Sapiens', quantity: 2, price: '198.000đ' },
      ],
    },
    {
      id: 'ORD-004',
      customer: 'Phạm Thị D',
      email: 'phamthid@email.com',
      phone: '0909876543',
      date: '17/03/2026',
      total: '278.000đ',
      status: 'delivered',
      items: 2,
      cancelRequest: false,
      address: '321 Đường JKL, Quận 7, TP.HCM',
      products: [
        { name: 'Atomic Habits', quantity: 2, price: '139.000đ' },
      ],
    },
  ];

  const customers = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@email.com',
      orders: 12,
      total: '3.450.000đ',
      joined: '15/01/2026',
    },
    {
      id: 2,
      name: 'Trần Thị B',
      email: 'tranthib@email.com',
      orders: 8,
      total: '2.130.000đ',
      joined: '22/01/2026',
    },
    {
      id: 3,
      name: 'Lê Văn C',
      email: 'levanc@email.com',
      orders: 15,
      total: '4.890.000đ',
      joined: '10/02/2026',
    },
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'books', label: 'Quản lý sách', icon: BookOpen },
    { id: 'orders', label: 'Đơn hàng', icon: ShoppingCart },
    { id: 'customers', label: 'Khách hàng', icon: Users },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'shipping':
        return 'bg-blue-100 text-blue-700';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'out-of-stock':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Đã giao';
      case 'shipping':
        return 'Đang giao';
      case 'processing':
        return 'Đang xử lý';
      case 'active':
        return 'Còn hàng';
      case 'out-of-stock':
        return 'Hết hàng';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 4C16 4 12 6 12 10V12C12 12 12 16 8 16C8 16 12 16 12 20V22C12 26 16 28 16 28C16 28 20 26 20 22V20C20 16 24 16 24 16C20 16 20 12 20 12V10C20 6 16 4 16 4Z" fill="white"/>
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-orange-500">Trạm Sách</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as AdminView)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-orange-50 text-orange-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <img
              src="https://ui-avatars.com/api/?name=Admin&background=F97316&color=fff"
              alt="Admin"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-800">Admin</p>
              <p className="text-xs text-gray-500">admin@tramsach.com</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {menuItems.find((item) => item.id === currentView)?.label}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Chào mừng đến với trang quản trị Trạm Sách
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                onClick={() => setShowExportModal(true)}
              >
                <Download className="w-4 h-4" />
                Xuất báo cáo
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Dashboard View */}
          {currentView === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 ${stat.bgLight} rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 ${stat.textColor}`} />
                        </div>
                        <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {stat.change}
                        </span>
                      </div>
                      <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
                      <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                  );
                })}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Doanh thu theo tháng</h3>
                    <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500">
                      <Filter className="w-4 h-4" />
                      Bộ lọc
                    </button>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={3} name="Doanh thu (triệu)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Orders Chart */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Đơn hàng theo tháng</h3>
                    <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500">
                      <BarChart3 className="w-4 h-4" />
                      Xem chi tiết
                    </button>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="orders" fill="#3B82F6" name="Đơn hàng" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Distribution */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm col-span-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-6">Phân bổ danh mục</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`pie-cell-${entry.name}-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-4">
                    {categoryData.map((item, index) => (
                      <div key={`category-legend-${item.name}-${index}`} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="text-sm text-gray-600">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-800">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl p-6 shadow-sm col-span-2">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Đơn hàng gần đây</h3>
                  <div className="space-y-3">
                    {orders.slice(0, 4).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{order.id}</p>
                            <p className="text-sm text-gray-500">{order.customer}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-800">{order.total}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Books Management View */}
          {currentView === 'books' && (
            <div className="space-y-6">
              {/* Out of Stock Alert */}
              {books.filter(b => b.stock === 0).length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800 mb-1">Cảnh báo: Có {books.filter(b => b.stock === 0).length} sách đã hết hàng</h4>
                    <p className="text-sm text-red-700">
                      {books.filter(b => b.stock === 0).map(b => b.title).join(', ')}
                    </p>
                  </div>
                </div>
              )}

              {/* Filters & Search */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm sách..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    <option value="all">Tất cả danh mục</option>
                    <option value="van-hoc">Văn học</option>
                    <option value="kinh-te">Kinh tế</option>
                    <option value="phat-trien">Phát triển bản thân</option>
                    <option value="thieu-nhi">Thiếu nhi</option>
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="active">Còn hàng</option>
                    <option value="out-of-stock">Hết hàng</option>
                    <option value="low-stock">Sắp hết ({"<"}20)</option>
                  </select>
                  <button 
                    className="px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 whitespace-nowrap" 
                    onClick={() => setShowAddBookModal(true)}
                  >
                    <Plus className="w-5 h-5" />
                    Thêm sách mới
                  </button>
                </div>
              </div>

              {/* Books Table */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Tên sách</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Tác giả</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Danh mục</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Giá</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Tồn kho</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Đã bán</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Trạng thái</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {books.map((book) => (
                      <tr key={book.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-800">{book.title}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{book.author}</td>
                        <td className="px-6 py-4 text-gray-600">{book.category}</td>
                        <td className="px-6 py-4 text-gray-800 font-medium">{book.price}</td>
                        <td className="px-6 py-4">
                          <span className={`font-medium ${book.stock === 0 ? 'text-red-600' : book.stock < 20 ? 'text-yellow-600' : 'text-green-600'}`}>
                            {book.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{book.sold}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(book.status)}`}>
                            {getStatusText(book.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button 
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              onClick={() => {
                                setSelectedBook(book);
                                setShowEditBookModal(true);
                              }}
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                              onClick={() => {
                                setSelectedBook(book);
                                setShowEditBookModal(true);
                              }}
                              title="Chỉnh sửa"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              onClick={() => {
                                if (confirm(`Bạn có chắc muốn xóa sách "${book.title}"?`)) {
                                  alert('Xóa sách thành công!');
                                }
                              }}
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Orders Management View */}
          {currentView === 'orders' && (
            <div className="space-y-6">
              {/* Cancel Request Alert */}
              {orders.filter(o => o.cancelRequest).length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-1">
                      Cảnh báo: Có {orders.filter(o => o.cancelRequest).length} đơn hàng yêu cầu hủy
                    </h4>
                    <p className="text-sm text-yellow-700">
                      {orders.filter(o => o.cancelRequest).map(o => o.id).join(', ')} - Vui lòng xem xét và xử lý
                    </p>
                  </div>
                </div>
              )}

              {/* Search & Filter */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm đơn hàng..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Bộ lọc
                </button>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Mã đơn</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Khách hàng</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Ngày đặt</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Số sản phẩm</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Tổng tiền</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Trạng thái</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-800">{order.id}</p>
                            {order.cancelRequest && (
                              <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full inline-block mt-1">
                                Yêu cầu hủy
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{order.customer}</td>
                        <td className="px-6 py-4 text-gray-600">{order.date}</td>
                        <td className="px-6 py-4 text-gray-600">{order.items}</td>
                        <td className="px-6 py-4 text-gray-800 font-medium">{order.total}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button 
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowOrderDetailModal(true);
                              }}
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowOrderDetailModal(true);
                              }}
                              title="Chỉnh sửa"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Customers Management View */}
          {currentView === 'customers' && (
            <div className="space-y-6">
              {/* Search */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm khách hàng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Customers Table */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Khách hàng</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Số đơn hàng</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Tổng chi tiêu</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Ngày tham gia</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {customers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}`}
                              alt={customer.name}
                              className="w-10 h-10 rounded-full"
                            />
                            <p className="font-medium text-gray-800">{customer.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{customer.email}</td>
                        <td className="px-6 py-4 text-gray-800 font-medium">{customer.orders}</td>
                        <td className="px-6 py-4 text-gray-800 font-medium">{customer.total}</td>
                        <td className="px-6 py-4 text-gray-600">{customer.joined}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Settings View */}
          {currentView === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Cài đặt hệ thống</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên cửa hàng
                    </label>
                    <input
                      type="text"
                      defaultValue="Trạm Sách"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email liên hệ
                    </label>
                    <input
                      type="email"
                      defaultValue="contact@tramsach.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      defaultValue="1900 1234"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <button className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Book Modal */}
      {showAddBookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Thêm sách mới</h3>
              <button 
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" 
                onClick={() => setShowAddBookModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên sách <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    placeholder="Nhập tên sách"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tác giả <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    placeholder="Nhập tên tác giả"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newBook.category}
                    onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="Văn học">Văn học</option>
                    <option value="Kinh tế">Kinh tế</option>
                    <option value="Phát triển bản thân">Phát triển bản thân</option>
                    <option value="Thiếu nhi">Thiếu nhi</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={newBook.price}
                    onChange={(e) => setNewBook({ ...newBook, price: e.target.value })}
                    placeholder="129000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tồn kho <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={newBook.stock}
                    onChange={(e) => setNewBook({ ...newBook, stock: e.target.value })}
                    placeholder="50"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    rows={4}
                    value={newBook.description}
                    onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                    placeholder="Nhập mô tả về cuốn sách"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Hình ảnh
                  </label>
                  <input
                    type="text"
                    value={newBook.image}
                    onChange={(e) => setNewBook({ ...newBook, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
              <button 
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setShowAddBookModal(false)}
              >
                Hủy
              </button>
              <button className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Thêm sách
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {showEditBookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Chỉnh sửa sách</h3>
              <button 
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" 
                onClick={() => setShowEditBookModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên sách <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={selectedBook?.title}
                    onChange={(e) => setSelectedBook({ ...selectedBook, title: e.target.value })}
                    placeholder="Nhập tên sách"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tác giả <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={selectedBook?.author}
                    onChange={(e) => setSelectedBook({ ...selectedBook, author: e.target.value })}
                    placeholder="Nhập tên tác giả"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedBook?.category}
                    onChange={(e) => setSelectedBook({ ...selectedBook, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="Văn học">Văn học</option>
                    <option value="Kinh tế">Kinh tế</option>
                    <option value="Phát triển bản thân">Phát triển bản thân</option>
                    <option value="Thiếu nhi">Thiếu nhi</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={selectedBook?.price}
                    onChange={(e) => setSelectedBook({ ...selectedBook, price: e.target.value })}
                    placeholder="129000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tồn kho <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={selectedBook?.stock}
                    onChange={(e) => setSelectedBook({ ...selectedBook, stock: e.target.value })}
                    placeholder="50"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    rows={4}
                    value={selectedBook?.description}
                    onChange={(e) => setSelectedBook({ ...selectedBook, description: e.target.value })}
                    placeholder="Nhập mô tả về cuốn sách"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Hình ảnh
                  </label>
                  <input
                    type="text"
                    value={selectedBook?.image}
                    onChange={(e) => setSelectedBook({ ...selectedBook, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
              <button 
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setShowEditBookModal(false)}
              >
                Hủy
              </button>
              <button className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {showOrderDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Chi tiết đơn hàng {selectedOrder.id}</h3>
              <button 
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" 
                onClick={() => setShowOrderDetailModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Cancel Request Warning */}
              {selectedOrder.cancelRequest && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-yellow-800 mb-1">Khách hàng yêu cầu hủy đơn hàng</h4>
                      <p className="text-sm text-yellow-700 mb-3">
                        Lý do: {selectedOrder.cancelReason}
                      </p>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
                          Duyệt hủy đơn
                        </button>
                        <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm">
                          Từ chối
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Thông tin đơn hàng</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mã đơn:</span>
                      <span className="font-medium text-gray-800">{selectedOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày đặt:</span>
                      <span className="font-medium text-gray-800">{selectedOrder.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trạng thái:</span>
                      <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusText(selectedOrder.status)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Thông tin khách hàng</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Họ tên:</span>
                      <span className="font-medium text-gray-800">{selectedOrder.customer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium text-gray-800">{selectedOrder.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">SĐT:</span>
                      <span className="font-medium text-gray-800">{selectedOrder.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Địa chỉ giao hàng</h4>
                <p className="text-gray-800">{selectedOrder.address}</p>
              </div>

              {/* Products */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3">Sản phẩm ({selectedOrder.items})</h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Tên sách</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Số lượng</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Đơn giá</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.products.map((product: any, index: number) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-gray-800">{product.name}</td>
                          <td className="px-4 py-3 text-right text-gray-600">{product.quantity}</td>
                          <td className="px-4 py-3 text-right text-gray-800 font-medium">{product.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-600">Tổng cộng:</span>
                  <span className="text-2xl font-bold text-orange-500">{selectedOrder.total}</span>
                </div>
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
              <button 
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setShowOrderDetailModal(false)}
              >
                Đóng
              </button>
              <button className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                Cập nhật trạng thái
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Report Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Xuất báo cáo</h3>
              <button 
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" 
                onClick={() => setShowExportModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại báo cáo <span className="text-red-500">*</span>
                </label>
                <select
                  value={exportOptions.reportType}
                  onChange={(e) => setExportOptions({ ...exportOptions, reportType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="revenue">Báo cáo doanh thu</option>
                  <option value="orders">Báo cáo đơn hàng</option>
                  <option value="bestsellers">Sách bán chạy</option>
                  <option value="customers">Báo cáo khách hàng</option>
                  <option value="inventory">Báo cáo tồn kho</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Từ ngày
                  </label>
                  <input
                    type="date"
                    value={exportOptions.dateFrom}
                    onChange={(e) => setExportOptions({ ...exportOptions, dateFrom: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đến ngày
                  </label>
                  <input
                    type="date"
                    value={exportOptions.dateTo}
                    onChange={(e) => setExportOptions({ ...exportOptions, dateTo: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Định dạng file <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setExportOptions({ ...exportOptions, format: 'pdf' })}
                    className={`px-4 py-3 border-2 rounded-lg transition-all ${
                      exportOptions.format === 'pdf'
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Download className="w-5 h-5" />
                      <span className="font-medium">PDF</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setExportOptions({ ...exportOptions, format: 'excel' })}
                    className={`px-4 py-3 border-2 rounded-lg transition-all ${
                      exportOptions.format === 'excel'
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Download className="w-5 h-5" />
                      <span className="font-medium">Excel</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Thông tin xuất báo cáo</p>
                    <p>Báo cáo sẽ được tạo dựa trên dữ liệu hiện tại của hệ thống. Vui lòng kiểm tra kỹ các thông tin trước khi xuất.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
              <button 
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setShowExportModal(false)}
              >
                Hủy
              </button>
              <button className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
                <Download className="w-5 h-5" />
                Xuất báo cáo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
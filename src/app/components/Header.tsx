import { type FormEvent, useEffect, useState } from 'react';
import { Bell, ChevronDown, Loader2, LogOut, Search, ShoppingCart, User } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

interface SearchBook {
  _id: string;
  title: string;
  author: string;
  price: number;
  discountPrice?: number | null;
  coverImage?: string;
  categoryId?: {
    name?: string;
  };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
}

function getImageSrc(book: SearchBook) {
  if (book.coverImage && !book.coverImage.includes('example.com')) {
    return book.coverImage;
  }

  return `https://picsum.photos/seed/${book._id}/80/108`;
}

export function Header() {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchBook[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    const keyword = searchQuery.trim();

    if (keyword.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    let ignore = false;
    const timeoutId = window.setTimeout(async () => {
      setSearchLoading(true);

      try {
        const response = await api.get('/books/search', {
          params: {
            keyword,
            limit: 6,
          },
        });

        if (!ignore) {
          setSearchResults(response.data.data || response.data || []);
          setShowSearchResults(true);
        }
      } catch (error) {
        console.error('Failed to search books', error);
        if (!ignore) {
          setSearchResults([]);
          setShowSearchResults(true);
        }
      } finally {
        if (!ignore) {
          setSearchLoading(false);
        }
      }
    }, 300);

    return () => {
      ignore = true;
      window.clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  const openBook = (bookId: string) => {
    setShowSearchResults(false);
    setSearchQuery('');
    navigate(`/book/${bookId}`);
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (searchResults.length > 0) {
      openBook(searchResults[0]._id);
      return;
    }

    if (searchQuery.trim().length >= 2) {
      setShowSearchResults(true);
    }
  };

  const handleAccountClick = () => {
    if (isAuthenticated) {
      navigate('/account');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-6">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-3 border border-dashed border-orange-400 px-6 py-2 rounded-lg min-w-fit hover:bg-orange-50 transition-colors"
          >
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              {/* <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 4C16 4 12 6 12 10V12C12 12 12 16 8 16C8 16 12 16 12 20V22C12 26 16 28 16 28C16 28 20 26 20 22V20C20 16 24 16 24 16C20 16 20 12 20 12V10C20 6 16 4 16 4Z" fill="white" />
              </svg> */}
            </div>
            <h1 className="text-2xl font-bold text-orange-500">Trạm Sách</h1>
          </button>

          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onFocus={() => {
                  if (searchQuery.trim().length >= 2) {
                    setShowSearchResults(true);
                  }
                }}
                onBlur={() => {
                  window.setTimeout(() => setShowSearchResults(false), 150);
                }}
                placeholder="Tìm sách theo tên, tác giả..."
                className="w-full px-4 py-3 pr-12 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
              >
                {searchLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </button>

              {showSearchResults && searchQuery.trim().length >= 2 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                  {searchLoading ? (
                    <div className="px-4 py-5 text-sm text-gray-500">
                      Dang tim sach phu hop cho ban...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="max-h-[420px] overflow-y-auto py-2">
                      {searchResults.map((book) => {
                        const displayPrice = book.discountPrice || book.price;

                        return (
                          <button
                            key={book._id}
                            type="button"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => openBook(book._id)}
                            className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 transition-colors"
                          >
                            <img
                              src={getImageSrc(book)}
                              alt={book.title}
                              className="h-16 w-12 rounded-md object-cover bg-gray-100"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="line-clamp-1 font-semibold text-gray-900">
                                {book.title}
                              </div>
                              <div className="line-clamp-1 text-sm text-gray-600">
                                {book.author}
                              </div>
                              <div className="mt-1 flex items-center justify-between gap-3">
                                <span className="text-xs text-purple-600">
                                  {book.categoryId?.name || 'Sách'}
                                </span>
                                <span className="text-sm font-bold text-orange-500">
                                  {formatCurrency(displayPrice)}
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="px-4 py-5 text-sm text-gray-500">
                      Chua co ket qua phu hop. Thu doi tu khoa ngan gon hon nhe.
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>

          <div className="flex items-center gap-8 border border-blue-300 px-6 py-3 rounded-lg">
            <button
              type="button"
              className="flex flex-col items-center gap-1 text-gray-700 hover:text-orange-500 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="text-xs">Thông báo</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/cart')}
              className="flex flex-col items-center gap-1 text-gray-700 hover:text-orange-500 transition-colors relative"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </div>
              <span className="text-xs">Giỏ hàng</span>
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors"
                >
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-medium">{user?.name}</span>
                    <span className="text-xs text-gray-500">Tài khoản</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <button
                      type="button"
                      onClick={() => {
                        navigate('/account');
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Quản lý tài khoản
                    </button>
                    <div className="border-t border-gray-200" />
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAccountClick}
                className="flex flex-col items-center gap-1 text-gray-700 hover:text-orange-500 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="text-xs">Tài khoản</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}


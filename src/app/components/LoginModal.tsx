import { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, register } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (isLoginMode) {
        if (!email || !password) {
          setError('Vui lòng điền đầy đủ thông tin');
          setIsLoading(false);
          return;
        }
        await login(email, password);
        // Reset form and close modal on success
        setName('');
        setEmail('');
        setPassword('');
        onClose();
      } else {
        if (!name || !email || !password) {
          setError('Vui lòng điền đầy đủ thông tin');
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Mật khẩu phải có ít nhất 6 ký tự');
          setIsLoading(false);
          return;
        }
        await register(name, email, password);
        // Reset form and close modal on success
        setName('');
        setEmail('');
        setPassword('');
        onClose();
      }
    } catch (err) {
      setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (!email) {
        setError('Vui lòng nhập địa chỉ email');
        setIsLoading(false);
        return;
      }

      // Simulate API call for password reset
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setSuccessMessage('Chúng tôi đã gửi link đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư!');
      setEmail('');
    } catch (err) {
      setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLoginMode(!isLoginMode);
    setIsForgotPasswordMode(false);
    setError('');
    setSuccessMessage('');
    setName('');
    setEmail('');
    setPassword('');
  };

  const showForgotPassword = () => {
    setIsForgotPasswordMode(true);
    setIsLoginMode(false);
    setError('');
    setSuccessMessage('');
    setEmail('');
  };

  const backToLogin = () => {
    setIsForgotPasswordMode(false);
    setIsLoginMode(true);
    setError('');
    setSuccessMessage('');
    setEmail('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 relative">
          {isForgotPasswordMode && (
            <button
              onClick={backToLogin}
              className="absolute top-4 left-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold mb-2">
            {isForgotPasswordMode ? 'Quên mật khẩu' : isLoginMode ? 'Đăng nhập' : 'Đăng ký'}
          </h2>
          <p className="text-orange-100">
            {isForgotPasswordMode
              ? 'Nhập email để nhận link đặt lại mật khẩu'
              : isLoginMode
              ? 'Chào mừng bạn quay trở lại Trạm Sách!'
              : 'Tham gia cùng cộng đồng yêu sách!'}
          </p>
        </div>

        {/* Forgot Password Form */}
        {isForgotPasswordMode ? (
          <form onSubmit={handleForgotPassword} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Chúng tôi sẽ gửi link đặt lại mật khẩu đến email này
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu'}
            </button>

            <div className="text-center text-sm text-gray-600 mt-6">
              Đã nhớ mật khẩu?{' '}
              <button
                type="button"
                onClick={backToLogin}
                className="text-orange-500 font-medium hover:text-orange-600"
              >
                Đăng nhập ngay
              </button>
            </div>
          </form>
        ) : (
          /* Login/Register Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                {successMessage}
              </div>
            )}

            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {!isLoginMode && (
                <p className="text-xs text-gray-500 mt-1">
                  Mật khẩu phải có ít nhất 6 ký tự
                </p>
              )}
            </div>

            {isLoginMode && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-orange-500 rounded" />
                  <span className="text-gray-600">Ghi nhớ đăng nhập</span>
                </label>
                <button type="button" className="text-orange-500 hover:text-orange-600" onClick={showForgotPassword}>
                  Quên mật khẩu?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? 'Đang xử lý...'
                : isLoginMode
                ? 'Đăng nhập'
                : 'Đăng ký'}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Hoặc</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="w-5 h-5"
                />
                <span className="font-medium text-gray-700">Tiếp tục v���i Google</span>
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <img
                  src="https://www.facebook.com/favicon.ico"
                  alt="Facebook"
                  className="w-5 h-5"
                />
                <span className="font-medium text-gray-700">Tiếp tục với Facebook</span>
              </button>
            </div>

            <div className="text-center text-sm text-gray-600 mt-6">
              {isLoginMode ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
              <button
                type="button"
                onClick={switchMode}
                className="text-orange-500 font-medium hover:text-orange-600"
              >
                {isLoginMode ? 'Đăng ký ngay' : 'Đăng nhập'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
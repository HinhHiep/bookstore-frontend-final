import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Mail, AlertCircle, CheckCircle } from 'lucide-react';

export function VerifyEmailPage() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from location state (passed from register)
  const email = location.state?.email || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyEmail(email, otp);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Xác thực thất bại. Vui lòng kiểm tra lại mã OTP.');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    // TODO: Implement resend OTP
    alert('Chức năng gửi lại OTP chưa được triển khai.');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-orange-500 mb-6">
          <CheckCircle className="w-16 h-16" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Xác thực Email</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Chúng tôi đã gửi mã OTP đến email của bạn: <strong>{email}</strong>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Mã OTP
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 border"
                  placeholder="123456"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
              >
                {loading ? 'Đang xác thực...' : 'Xác thực'}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={resendOtp}
                className="text-sm text-orange-600 hover:text-orange-500"
              >
                Gửi lại mã OTP
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
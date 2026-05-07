import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router';

export function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Trạm Sách</h3>
            <p className="text-gray-400 text-sm mb-4">
              Nơi cung cấp những cuốn sách hay nhất, đa dạng thể loại, phục vụ mọi đối tượng độc giả. Hãy để chúng tôi đồng hành cùng bạn trên hành trình khám phá tri thức và giải trí qua từng trang sách.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><button onClick={() => navigate('/bestsellers')} className="hover:text-orange-500 transition-colors">Sách bán chạy</button></li>
              <li><button onClick={() => navigate('/new-books')} className="hover:text-orange-500 transition-colors">Sách mới</button></li>
              <li><button onClick={() => navigate('/promotions')} className="hover:text-orange-500 transition-colors">Khuyến mãi</button></li>
              <li><button onClick={() => navigate('/category/van-hoc')} className="hover:text-orange-500 transition-colors">Danh mục văn học</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Hỗ trợ khách hàng
      
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><button onClick={() => navigate('/track-order')} className="hover:text-orange-500 transition-colors">Tra cứu đơn hàng</button></li>
              <li><button onClick={() => navigate('/cart')} className="hover:text-orange-500 transition-colors">Giỏ hàng</button></li>
              <li><button onClick={() => navigate('/account')} className="hover:text-orange-500 transition-colors">Tài khoản của tôi</button></li>
              <li><button onClick={() => navigate('/ai-advisor')} className="hover:text-orange-500 transition-colors">Tư vấn chọn sách</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Liên hệ</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>123 Đường ABC, Quận 1, TP.HCM</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>1900 9999</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>support@tramsach.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2026 Tram Sach. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  const handleViewCart = () => {
    navigate('/cart');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-[450px] bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Giỏ hàng</h2>
              <p className="text-sm text-gray-600">{totalItems} sản phẩm</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Giỏ hàng trống
              </h3>
              <p className="text-gray-600 mb-6">
                Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
              </p>
              <button
                onClick={onClose}
                className="bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                >
                  {/* Image */}
                  <div className="w-20 h-28 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{item.author}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-orange-500 font-bold">
                        {item.price}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-7 h-7 rounded-md border border-gray-300 flex items-center justify-center hover:border-orange-500 hover:bg-orange-50 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-7 h-7 rounded-md border border-gray-300 flex items-center justify-center hover:border-orange-500 hover:bg-orange-50 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-6">
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-gray-600">
                <span>Tạm tính ({totalItems} sản phẩm)</span>
                <span className="font-medium">
                  {totalPrice.toLocaleString('vi-VN')}đ
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span className="font-medium text-green-600">Miễn phí</span>
              </div>
              <div className="border-t pt-3 flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">
                  Tổng cộng
                </span>
                <span className="text-2xl font-bold text-orange-500">
                  {totalPrice.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>

            <button
              onClick={handleViewCart}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              Xem giỏ hàng & Thanh toán
            </button>
            <button
              onClick={onClose}
              className="w-full mt-3 border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:border-orange-300 hover:bg-orange-50 transition-all"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        )}
      </div>
    </>
  );
}
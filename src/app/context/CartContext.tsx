import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import api from '../utils/api';
import { useAuth } from './AuthContext';

interface CartItem {
  id: string | number;
  title: string;
  author: string;
  price: string;
  image: string;
  quantity: number;
}

interface ServerCartItem {
  bookId?: string;
  id?: string;
  title: string;
  author?: string;
  thumbnail?: string;
  image?: string;
  finalPrice?: number;
  price?: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void | Promise<void>;
  removeFromCart: (id: string | number) => void | Promise<void>;
  updateQuantity: (id: string | number, quantity: number) => void | Promise<void>;
  clearCart: () => void | Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const GUEST_CART_KEY = 'guestCart';
const CartContext = createContext<CartContextType | undefined>(undefined);

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
}

function getGuestCart() {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveGuestCart(items: CartItem[]) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

function getNumericPrice(price: string) {
  return parseFloat(price.replace(/[^\d]/g, '')) || 0;
}

function mapServerItem(item: ServerCartItem): CartItem {
  const id = item.bookId || item.id || '';
  const price = item.finalPrice ?? item.price ?? 0;

  return {
    id,
    title: item.title,
    author: item.author || '',
    price: formatCurrency(price),
    image: item.image || item.thumbnail || `https://picsum.photos/seed/${id}/120/160`,
    quantity: item.quantity,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUserCart = useCallback(async () => {
    const response = await api.get('/cart');
    const serverItems = response.data.data?.items || [];
    setItems(serverItems.map(mapServerItem));
  }, []);

  useEffect(() => {
    let ignore = false;

    const loadCart = async () => {
      setLoading(true);

      if (!isAuthenticated) {
        setItems(getGuestCart());
        setLoading(false);
        return;
      }

      try {
        const guestItems = getGuestCart();

        if (guestItems.length > 0) {
          await api.post('/cart/merge', {
            items: guestItems.map((item) => ({
              bookId: String(item.id),
              quantity: item.quantity,
            })),
          });
          localStorage.removeItem(GUEST_CART_KEY);
        }

        if (!ignore) {
          await loadUserCart();
        }
      } catch (error) {
        console.error('Failed to load cart', error);
        if (!ignore) {
          setItems([]);
          toast.error('Không tải được giỏ hàng. Bạn thử tải lại trang nhé.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadCart();

    return () => {
      ignore = true;
    };
  }, [isAuthenticated, loadUserCart]);

  const addToCart = async (item: Omit<CartItem, 'quantity'>) => {
    if (!isAuthenticated) {
      setItems((prevItems) => {
        const existingItem = prevItems.find((i) => i.id === item.id);
        const nextItems = existingItem
          ? prevItems.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            )
          : [...prevItems, { ...item, quantity: 1 }];

        saveGuestCart(nextItems);
        return nextItems;
      });

      toast.success('Đã thêm vào giỏ hàng', { description: item.title });
      return;
    }

    try {
      await api.post('/cart', {
        bookId: String(item.id),
        quantity: 1,
      });
      await loadUserCart();
      toast.success('Đã thêm vào giỏ hàng', { description: item.title });
    } catch (error) {
      console.error('Failed to add item to cart', error);
      toast.error('Thêm vào giỏ hàng chưa thành công', { description: item.title });
    }
  };

  const removeFromCart = async (id: string | number) => {
    if (!isAuthenticated) {
      setItems((prevItems) => {
        const nextItems = prevItems.filter((item) => item.id !== id);
        saveGuestCart(nextItems);
        return nextItems;
      });
      return;
    }

    try {
      await api.delete(`/cart/${id}`);
      await loadUserCart();
    } catch (error) {
      console.error('Failed to remove cart item', error);
      toast.error('Xóa sản phẩm chưa thành công. Bạn thử lại nhé.');
    }
  };

  const updateQuantity = async (id: string | number, quantity: number) => {
    if (!isAuthenticated) {
      setItems((prevItems) => {
        const nextItems =
          quantity <= 0
            ? prevItems.filter((item) => item.id !== id)
            : prevItems.map((item) => (item.id === id ? { ...item, quantity } : item));

        saveGuestCart(nextItems);
        return nextItems;
      });
      return;
    }

    try {
      if (quantity <= 0) {
        await api.delete(`/cart/${id}`);
      } else {
        await api.patch(`/cart/${id}`, { quantity });
      }
      await loadUserCart();
    } catch (error) {
      console.error('Failed to update cart item', error);
      toast.error('Cập nhật giỏ hàng chưa thành công. Bạn thử lại nhé.');
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      localStorage.removeItem(GUEST_CART_KEY);
      setItems([]);
      return;
    }

    try {
      await api.delete('/cart');
      setItems([]);
    } catch (error) {
      console.error('Failed to clear cart', error);
      toast.error('Chưa thể xóa giỏ hàng lúc này. Bạn thử lại sau nhé.');
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + getNumericPrice(item.price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}


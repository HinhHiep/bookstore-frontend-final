import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  Tag,
  Percent,
  Gift,
  Zap,
  Copy,
  Check,
  Star,
  ShoppingCart,
  Flame,
  Sparkles,
  TrendingUp,
  Package,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import { toast } from 'sonner';

interface PromotionItem {
  _id: string;
  name: string;
  description?: string;
  value: number;
  minOrderValue?: number;
  usageLimit?: number;
  usedCount?: number;
  startDate?: string;
  endDate?: string;
  event?: string;
}

interface DiscountBook {
  _id: string;
  title: string;
  author: string;
  price: number;
  finalPrice?: number;
  averageRating?: number;
  sold?: number;
  stock?: number;
  coverImage?: string;
  images?: string[];
}

const formatMoney = (value: number) => `${(value || 0).toLocaleString('vi-VN')}d`;
const formatDate = (date?: string) => (date ? new Date(date).toLocaleDateString('vi-VN') : 'Khong gioi han');
const getBookImage = (book: DiscountBook) =>
  book.coverImage && !book.coverImage.includes('example.com')
    ? book.coverImage
    : book.images?.[0] && !book.images[0].includes('example.com')
    ? book.images[0]
    : `https://picsum.photos/seed/${book._id}/360/480`;

export function PromotionsPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [flashSaleTime, setFlashSaleTime] = useState({ hours: 2, minutes: 0, seconds: 0 });
  const [loading, setLoading] = useState(true);

  const [promotions, setPromotions] = useState<PromotionItem[]>([]);
  const [discountBooks, setDiscountBooks] = useState<DiscountBook[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setFlashSaleTime((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [promoRes, discountRes] = await Promise.all([
          api.get('/promotions/active'),
          api.get('/books/discount', { params: { page: 1, limit: 12, minDiscount: 10 } }),
        ]);

        setPromotions(promoRes.data?.data || []);
        setDiscountBooks(discountRes.data?.data?.books || discountRes.data?.data || []);
      } catch (error) {
        console.error('Failed to load promotions page data', error);
        toast.error('Khong tai duoc du lieu khuyen mai');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const vouchers = useMemo(
    () =>
      promotions.slice(0, 4).map((p, index) => ({
        id: p._id,
        code: (p.event || p.name || `PROMO${index + 1}`).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12) || `PROMO${index + 1}`,
        title: p.name,
        description: p.description || 'Uu dai ap dung theo dieu kien chuong trinh',
        discount: `${p.value}%`,
        minOrder: formatMoney(p.minOrderValue || 0),
        expiry: formatDate(p.endDate),
        stock: Math.max((p.usageLimit || 0) - (p.usedCount || 0), 0),
        used: p.usedCount || 0,
      })),
    [promotions]
  );

  const flashSaleBooks = useMemo(() => discountBooks.slice(0, 8), [discountBooks]);

  const discountTiers = useMemo(() => {
    const buckets = [
      { label: 'Tu 10%', min: 10, max: 29, color: 'from-orange-400 to-orange-500' },
      { label: 'Tu 30%', min: 30, max: 49, color: 'from-pink-400 to-pink-500' },
      { label: 'Tu 50%', min: 50, max: 100, color: 'from-red-400 to-red-500' },
    ];

    return buckets.map((b, idx) => ({
      id: idx + 1,
      percent: b.label,
      count: discountBooks.filter((book) => {
        const discount = Math.round((((book.price || 0) - (book.finalPrice || book.price || 0)) / (book.price || 1)) * 100);
        return discount >= b.min && discount <= b.max;
      }).length,
      color: b.color,
    }));
  }, [discountBooks]);

  const combos = useMemo(() => {
    const source = [...discountBooks].sort((a, b) => (a.finalPrice || a.price) - (b.finalPrice || b.price));
    const groups = [source.slice(0, 3), source.slice(3, 6), source.slice(6, 9)].filter((g) => g.length > 0);
    return groups.map((group, idx) => {
      const original = group.reduce((s, b) => s + (b.price || 0), 0);
      const finalPrice = group.reduce((s, b) => s + (b.finalPrice || b.price || 0), 0);
      return {
        id: idx + 1,
        title: `Combo tiet kiem #${idx + 1}`,
        books: group.length,
        price: formatMoney(finalPrice),
        originalPrice: formatMoney(original),
        saving: formatMoney(original - finalPrice),
        image: getBookImage(group[0]),
      };
    });
  }, [discountBooks]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center animate-pulse"><Tag className="w-8 h-8" /></div>
            <h1 className="text-4xl font-bold">Khuyen Mai Hap Dan</h1>
          </div>
          <p className="text-lg opacity-90">Du lieu uu dai duoc dong bo tu backend theo thoi gian thuc.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading && <div className="mb-6 text-sm text-gray-500">Dang tai du lieu khuyen mai...</div>}

        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3"><Gift className="w-6 h-6 text-pink-600" /><h2 className="text-2xl font-bold text-gray-900">Ma giam gia</h2></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {vouchers.map((voucher) => (
              <div key={voucher.id} className="bg-white rounded-2xl shadow-lg border overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-pink-500 to-orange-500 text-white">
                  <h3 className="font-bold text-xl">{voucher.title}</h3>
                  <p className="text-sm opacity-90">{voucher.description}</p>
                  <div className="mt-2 text-sm">Don toi thieu: {voucher.minOrder} • HSD: {voucher.expiry}</div>
                  <div className="text-3xl font-bold mt-2">{voucher.discount}</div>
                </div>
                <div className="p-4 bg-gray-50 flex items-center justify-between">
                  <button onClick={() => copyCode(voucher.code)} className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg font-mono font-bold text-orange-600">
                    {voucher.code}
                    {copiedCode === voucher.code ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <div className="text-sm text-gray-600">Da dung: <b>{voucher.used}</b></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-6 mb-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3"><Zap className="w-7 h-7" /><h2 className="text-3xl font-bold">Flash Sale</h2></div>
            <div className="font-semibold">{String(flashSaleTime.hours).padStart(2, '0')}:{String(flashSaleTime.minutes).padStart(2, '0')}:{String(flashSaleTime.seconds).padStart(2, '0')}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {flashSaleBooks.map((book) => {
              const finalPrice = book.finalPrice || book.price;
              const discount = Math.round(((book.price - finalPrice) / (book.price || 1)) * 100);
              return (
                <div key={book._id} className="bg-white rounded-xl shadow-sm border hover:shadow-xl transition-all group overflow-hidden">
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    <img src={getBookImage(book)} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">-{discount}%</div>
                  </div>
                  <div className="p-4">
                    <h3 onClick={() => navigate(`/book/${book._id}`)} className="font-bold text-gray-900 mb-1 line-clamp-2 cursor-pointer hover:text-orange-600">{book.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                    <div className="flex items-center gap-1 mb-2 text-sm text-gray-600"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {(book.averageRating || 0).toFixed(1)} ({book.sold || 0} da ban)</div>
                    <div className="flex items-center gap-2 mb-3"><span className="text-xl font-bold text-red-600">{formatMoney(finalPrice)}</span><span className="text-sm text-gray-400 line-through">{formatMoney(book.price)}</span></div>
                    <button onClick={() => addToCart({ id: book._id, title: book.title, author: book.author, price: formatMoney(finalPrice), image: getBookImage(book), quantity: 1 })} className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2"><ShoppingCart className="w-4 h-4" />Mua ngay</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6"><Percent className="w-6 h-6 text-orange-600" /><h2 className="text-2xl font-bold text-gray-900">Giam gia theo muc</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {discountTiers.map((tier) => (
              <button key={tier.id} onClick={() => navigate('/bestsellers')} className={`bg-gradient-to-br ${tier.color} text-white rounded-2xl p-8 text-center hover:shadow-xl`}>
                <div className="text-4xl font-bold mb-2">{tier.percent}</div>
                <div className="text-lg font-bold mb-2">GIAM GIA</div>
                <div>{tier.count} san pham</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6"><Package className="w-6 h-6 text-purple-600" /><h2 className="text-2xl font-bold text-gray-900">Combo tiet kiem</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {combos.map((combo) => (
              <div key={combo.id} className="bg-white rounded-2xl shadow-lg border overflow-hidden">
                <div className="h-44 bg-gray-100 relative"><img src={combo.image} alt={combo.title} className="w-full h-full object-cover" /></div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2">{combo.title}</h3>
                  <div className="text-sm text-gray-600 mb-2">{combo.books} cuon sach</div>
                  <div className="text-2xl font-bold text-orange-600">{combo.price}</div>
                  <div className="text-sm text-gray-400 line-through">{combo.originalPrice}</div>
                  <div className="text-sm text-green-600 font-semibold mb-3">Tiet kiem {combo.saving}</div>
                  <button onClick={() => navigate('/bestsellers')} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2.5 rounded-lg font-medium">Xem combo</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl p-8 text-white text-center">
          <Flame className="w-16 h-16 mx-auto mb-4 animate-pulse" />
          <h3 className="text-3xl font-bold mb-3">San sale ngay - Lo la tiec!</h3>
          <p className="text-lg opacity-90 mb-6">Uu dai tu du lieu that, cap nhat lien tuc theo backend.</p>
          <button onClick={() => navigate('/bestsellers')} className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-3 rounded-xl font-bold"><span>Kham pha ngay</span><TrendingUp className="w-5 h-5" /></button>
        </div>
      </div>
    </div>
  );
}

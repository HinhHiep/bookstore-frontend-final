import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Book, Briefcase, TrendingUp, Cpu, GraduationCap, Baby } from 'lucide-react';
import api from '../utils/api';

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  bookCount?: number;
  status?: string;
}

const iconList = [Book, Briefcase, TrendingUp, Cpu, GraduationCap, Baby];
const colorList = [
  'from-rose-500 to-pink-500',
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-green-500',
  'from-indigo-500 to-violet-500',
  'from-amber-500 to-orange-500',
  'from-fuchsia-500 to-purple-500',
];

export function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await api.get('/categories', {
          params: { parentId: 'null', status: 'active', limit: 12, page: 1 },
        });

        const list: CategoryItem[] = res.data?.data || [];
        const withCounts = await Promise.all(
          list.map(async (cat) => {
            try {
              const booksRes = await api.get('/books', {
                params: { categoryId: cat._id, limit: 1, page: 1, status: 'active' },
              });
              const total = booksRes.data?.pagination?.total ?? cat.bookCount ?? 0;
              return { ...cat, bookCount: total };
            } catch {
              return { ...cat, bookCount: cat.bookCount ?? 0 };
            }
          })
        );

        setCategories(withCounts.filter((c) => (c.bookCount || 0) > 0).slice(0, 6));
      } catch (error) {
        console.error('Failed to load categories', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const categoryCards = useMemo(
    () =>
      categories.map((category, index) => ({
        ...category,
        icon: iconList[index % iconList.length],
        color: colorList[index % colorList.length],
      })),
    [categories]
  );

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Danh muc noi bat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-44 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (categoryCards.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Danh muc noi bat</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryCards.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category._id}
              onClick={() => navigate(`/category/${category.slug}`)}
              className={`text-left bg-gradient-to-br ${category.color} rounded-2xl p-8 text-white hover:shadow-2xl transition-all cursor-pointer hover:-translate-y-2`}
            >
              <Icon className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
              <p className="text-white/90">{(category.bookCount || 0).toLocaleString('vi-VN')} sach</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

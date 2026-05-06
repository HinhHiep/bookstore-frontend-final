import { Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import api from '../utils/api';

interface Category {
  _id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  level?: number;
}

export function Navigation() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories', {
          params: {
            parentId: 'null',
            limit: 6,
          },
        });

        setCategories(response.data.data || response.data);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <nav className="bg-orange-500/95 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* <div>
            <p className="text-xs uppercase tracking-[0.24em] text-white/80">Danh mục sách</p>
            <h2 className="text-white text-xl font-semibold">Khám phá theo thể loại</h2>
          </div> */}

          <div className="min-w-0 overflow-x-auto pb-1">
            <ul className="flex min-w-max gap-3">
              {loading ? (
                <li className="min-w-[140px] rounded-full bg-white/15 px-4 py-3 text-center text-sm text-white/80 animate-pulse">
                  Đang tải...
                </li>
              ) : categories.length > 0 ? (
                categories.map((category) => (
                  <li key={category._id}>
                    <button
                      type="button"
                      onClick={() => navigate(`/category/${category.slug}`)}
                      className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium text-white transition duration-200 hover:border-white/30 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                    >
                      <Bookmark className="w-4 h-4" />
                      <span>{category.name}</span>
                    </button>
                  </li>
                ))
              ) : (
                <li className="min-w-[180px] rounded-full bg-white/10 px-4 py-3 text-sm text-white/80">
                  Không có danh mục.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

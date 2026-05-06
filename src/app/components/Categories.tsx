import { Book, Briefcase, TrendingUp, Cpu, GraduationCap, Baby } from 'lucide-react';

export function Categories() {
  const categories = [
    {
      icon: Book,
      title: 'Văn học',
      count: '1,234 sách',
      color: 'from-purple-400 to-purple-600',
    },
    {
      icon: Briefcase,
      title: 'Kinh tế - Kinh doanh',
      count: '856 sách',
      color: 'from-blue-400 to-blue-600',
    },
    {
      icon: TrendingUp,
      title: 'Phát triển bản thân',
      count: '945 sách',
      color: 'from-green-400 to-green-600',
    },
    {
      icon: Cpu,
      title: 'Công nghệ',
      count: '567 sách',
      color: 'from-cyan-400 to-cyan-600',
    },
    {
      icon: GraduationCap,
      title: 'Giáo khoa',
      count: '1,456 sách',
      color: 'from-orange-400 to-orange-600',
    },
    {
      icon: Baby,
      title: 'Thiếu nhi',
      count: '789 sách',
      color: 'from-pink-400 to-pink-600',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Danh mục nổi bật</h2>

      <div className="grid grid-cols-3 gap-6">
        {categories.map((category, index) => {
          const Icon = category.icon;
          return (
            <div
              key={index}
              className={`bg-gradient-to-br ${category.color} rounded-2xl p-8 text-white hover:shadow-2xl transition-all cursor-pointer hover:-translate-y-2`}
            >
              <Icon className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
              <p className="text-white/90">{category.count}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

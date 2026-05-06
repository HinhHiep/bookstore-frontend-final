import { Flame, Tag, Sparkles, ShoppingBag, Package } from 'lucide-react';
import { useNavigate } from 'react-router';

export function Features() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Flame,
      title: 'Sách bán chạy',
      color: 'bg-orange-100',
      iconColor: 'text-orange-500',
    },
    {
      icon: Tag,
      title: 'Khuyến mãi',
      color: 'bg-pink-100',
      iconColor: 'text-pink-500',
    },
    {
      icon: Sparkles,
      title: 'Sách mới',
      color: 'bg-purple-100',
      iconColor: 'text-purple-500',
    },
    {
      icon: ShoppingBag,
      title: 'Tư vấn với AI',
      color: 'bg-blue-100',
      iconColor: 'text-blue-500',
    },
    {
      icon: Package,
      title: 'Tra cứu đơn hàng',
      color: 'bg-green-100',
      iconColor: 'text-green-500',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-5 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          
          // Determine click handler based on feature title
          const handleClick = () => {
            if (feature.title === 'Khuyến mãi') {
              navigate('/promotions');
            } else if (feature.title === 'Sách bán chạy') {
              navigate('/bestsellers');
            } else if (feature.title === 'Sách mới') {
              navigate('/new-books');
            } else if (feature.title === 'Tư vấn với AI') {
              navigate('/ai-advisor');
            } else if (feature.title === 'Tra cứu đơn hàng') {
              navigate('/track-order');
            }
            // Add more navigation logic for other features as needed
          };

          return (
            <button
              key={index}
              onClick={handleClick}
              className="flex flex-col items-center gap-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center`}>
                <Icon className={`w-8 h-8 ${feature.iconColor}`} />
              </div>
              <span className="text-gray-800 font-medium text-center">{feature.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
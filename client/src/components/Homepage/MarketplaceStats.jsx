import React from 'react';
import { Car, Users, TrendingUp, Clock } from 'lucide-react';

const MarketplaceStats = () => {
  const stats = [
    { icon: Car, value: '12,847', label: 'Cars Available' },
    { icon: Users, value: '2,340', label: 'Verified Sellers' },
    { icon: TrendingUp, value: '487', label: 'Listed Today' },
    { icon: Clock, value: '1,200+', label: 'Sold This Week' }
  ];

  return (
    <div className=" grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white dark:bg-gray-900">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="
              bg-white dark:bg-white/10
              backdrop-blur-sm
              rounded-lg p-4 text-center
              border border-gray-200 dark:border-white/20
              transition-all duration-200
              hover:-translate-y-1
            "
          >
            {/* Icon */}
            <Icon className="w-6 h-6 mx-auto mb-2 text-yellow-500 dark:hover:text-yellow-400" />

            {/* Value */}
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </div>

            {/* Label */}
            <div className="text-sm text-gray-600 dark:text-yellow-400">
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MarketplaceStats;

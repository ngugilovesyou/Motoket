import React from 'react';

const QuickCategories = () => {
  const categories = [
    { name: 'SUVs', count: '3,245', icon: '🚙', bgColor: 'bg-orange-50', textColor: 'text-orange-700', borderColor: 'border-orange-200' },
    { name: 'Sedans', count: '2,890', icon: '🚗', bgColor: 'bg-blue-50', textColor: 'text-blue-700', borderColor: 'border-blue-200' },
    { name: 'Trucks', count: '1,567', icon: '🛻', bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200' },
    { name: 'Electric', count: '892', icon: '⚡', bgColor: 'bg-purple-50', textColor: 'text-purple-700', borderColor: 'border-purple-200' },
    { name: 'Luxury', count: '1,234', icon: '💎', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700', borderColor: 'border-yellow-200' },
    { name: 'Sports', count: '678', icon: '🏎️', bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200' },
    { name: 'Vans', count: '543', icon: '🚐', bgColor: 'bg-indigo-50', textColor: 'text-indigo-700', borderColor: 'border-indigo-200' },
    { name: 'Hybrids', count: '1,098', icon: '🌱', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700', borderColor: 'border-emerald-200' }
  ];

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-yellow-500 dark:hover:text-yellow-400">Browse by Category</h2>
          <button className="text-sm text-yellow-600 dark:hover:text-yellow-400 font-medium">
            View All →
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((category) => (
            <button
              key={category.name}
              className={`${category.bgColor} ${category.borderColor} border-2 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:scale-105 group`}
            >
              <div className="text-3xl mb-2">{category.icon}</div>
              <div className={`font-semibold ${category.textColor} text-sm mb-1`}>
                {category.name}
              </div>
              <div className="text-xs text-gray-600">{category.count} cars</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickCategories;

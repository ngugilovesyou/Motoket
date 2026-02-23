import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchFilter = () => {
  const navigate= useNavigate();

  const [searchData, setSearchData] = useState({
    make: '',
    model: '',
    priceMin: '',
    priceMax: '',
    location: ''
  });

  const makes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes-Benz', 'Audi', 'Nissan', 'Hyundai', 'Kia'];
  const models = ['Camry', 'Accord', 'F-150', 'Silverado', '3 Series', 'C-Class', 'A4', 'Altima', 'Elantra', 'Forte'];

  const handleSearch = (e) => {
    e.preventDefault();
    const params=URLSearchParams();

    if (searchData.make) params.append('make', searchData.make);
    if (searchData.model) params.append('model', searchData.model);
    if (searchData.priceMin) params.append('priceMin', searchData.priceMin);
    if (searchData.priceMax) params.append('priceMax', searchData.priceMax);
    if (searchData.location) params.append('location', searchData.location);
 
    const makePath = searchData.make
      ? `/shopping/${encodeURIComponent(searchData.make)}`
      : '/shopping'


    navigate(`${makePath}?${params.toString()}`)
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg p-4 sm:p-6 mt-17">
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Make */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Make
            </label>
            <select
              value={searchData.make}
              onChange={(e) => setSearchData({ ...searchData, make: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-yellow-500 focus:border-transparent
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">All Makes</option>
              {makes.map(make => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Model
            </label>
            <select
              value={searchData.model}
              onChange={(e) => setSearchData({ ...searchData, model: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-yellow-500 focus:border-transparent
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">All Models</option>
              {models.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Price Range
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={searchData.priceMin}
                onChange={(e) => setSearchData({ ...searchData, priceMin: e.target.value })}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg
                           focus:ring-2 focus:ring-yellow-500 focus:border-transparent
                           text-gray-900 dark:text-white dark:bg-gray-800"
              />
              <input
                type="number"
                placeholder="Max"
                value={searchData.priceMax}
                onChange={(e) => setSearchData({ ...searchData, priceMax: e.target.value })}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg
                           focus:ring-2 focus:ring-yellow-500 focus:border-transparent
                           text-gray-900 dark:text-white dark:bg-gray-800"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-500 dark:hover:text-yellow-400" />
              <input
                type="text"
                placeholder="City or ZIP"
                value={searchData.location}
                onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg
                           focus:ring-2 focus:ring-yellow-500 focus:border-transparent
                           text-gray-900 dark:text-white dark:bg-gray-800"
              />
            </div>
          </div>

          {/* Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-400
                         text-white font-semibold py-3 px-6 rounded-lg
                         transition-all duration-200 flex items-center
                         justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <Search className="w-5 h-5" />
              Search Cars
            </button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Quick filters:
          </span>
          {['Under $15k', 'Under $25k', 'Electric', 'Hybrid', 'Low Mileage'].map(filter => (
            <button
              key={filter}
              type="button"
              className="text-sm px-3 py-1.5 rounded-full
                         bg-yellow-50 text-yellow-600
                         hover:bg-yellow-100
                         dark:bg-yellow-900/30 dark:text-yellow-400
                         transition-colors"
            >
              {filter}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};

export default SearchFilter;

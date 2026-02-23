import React from 'react';
import CarCard from './CarCard';
import { DollarSign, Sparkles } from 'lucide-react';

const BestDeals = () => {
  // Mock data - replace with API call
  const dealCars = [
    {
      id: 9,
      year: 2019,
      make: 'Nissan',
      model: 'Altima 2.5 S',
      price: 18500,
      mileage: 42000,
      location: 'Riverside, CA',
      image: 'https://images.unsplash.com/photo-1623873658614-6a34938aa821?w=800&auto=format&fit=crop',
      seller: {
        name: 'Budget Auto Sales',
        type: 'Dealership',
        verified: true,
        rating: 4.4
      }
    },
    {
      id: 10,
      year: 2020,
      make: 'Kia',
      model: 'Forte LXS',
      price: 16900,
      mileage: 35000,
      location: 'Bakersfield, CA',
      image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&auto=format&fit=crop',
      seller: {
        name: 'Central Valley Auto',
        type: 'Dealership',
        verified: true,
        rating: 4.5
      }
    },
    {
      id: 11,
      year: 2018,
      make: 'Chevrolet',
      model: 'Malibu LT',
      price: 15800,
      mileage: 48000,
      location: 'Stockton, CA',
      image: 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800&auto=format&fit=crop',
      seller: {
        name: 'Mike Davis',
        type: 'Private Seller',
        verified: false,
        rating: 4.2
      }
    },
    {
      id: 12,
      year: 2019,
      make: 'Volkswagen',
      model: 'Jetta S',
      price: 17200,
      mileage: 38000,
      location: 'Modesto, CA',
      image: 'https://images.unsplash.com/photo-1622353219448-46a009f0d44f?w=800&auto=format&fit=crop',
      seller: {
        name: 'Euro Motors',
        type: 'Dealership',
        verified: true,
        rating: 4.6
      }
    }
  ];

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-100 p-2 rounded-lg">
            <Sparkles className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-yellow-500 dark:hover:text-yellow-400">Best Deals Under $20,000</h2>
            <p className="text-sm text-yellow-500">Great value cars at unbeatable prices</p>
          </div>
        </div>
        <button className="text-yellow-600 dark:hover:text-yellow-400 font-semibold text-sm sm:text-base flex items-center gap-1">
          View All
          <span>→</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dealCars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>

    
    </section>
  );
};

export default BestDeals;

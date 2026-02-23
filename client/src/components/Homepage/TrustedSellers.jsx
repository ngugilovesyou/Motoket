import React from 'react';
import { Verified, Star, MapPin, Car } from 'lucide-react';

const TrustedSellers = () => {
  const sellers = [
    {
      id: 1,
      name: 'Premium Auto Group',
      type: 'Multi-Brand Dealership',
      location: 'Los Angeles, CA',
      rating: 4.9,
      reviews: 342,
      inventory: 156,
      verified: true,
      image: 'https://images.unsplash.com/photo-1562519819-019d3d5d1c6a?w=400&auto=format&fit=crop',
      specialties: ['Luxury', 'Sports', 'SUVs']
    },
    {
      id: 2,
      name: 'Valley Motors',
      type: 'Honda Certified Dealer',
      location: 'San Jose, CA',
      rating: 4.8,
      reviews: 218,
      inventory: 89,
      verified: true,
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&auto=format&fit=crop',
      specialties: ['Honda', 'Acura', 'Japanese']
    },
    {
      id: 3,
      name: 'Elite Motors',
      type: 'Electric Vehicle Specialist',
      location: 'San Francisco, CA',
      rating: 4.9,
      reviews: 189,
      inventory: 67,
      verified: true,
      image: 'https://images.unsplash.com/photo-1551966775-a4ddc8df052b?w=400&auto=format&fit=crop',
      specialties: ['Tesla', 'Electric', 'Hybrid']
    },
    {
      id: 4,
      name: 'Truck World',
      type: 'Pickup & Commercial Specialist',
      location: 'Sacramento, CA',
      rating: 4.7,
      reviews: 276,
      inventory: 124,
      verified: true,
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&auto=format&fit=crop',
      specialties: ['Trucks', 'Vans', 'Commercial']
    }
  ];

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-100 p-2 rounded-lg">
            <Verified className="w-6 h-6 text-yellow-600 fill-yellow-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-yellow-500 dark:hover:text-yellow-400">Trusted Sellers</h2>
            <p className="text-sm text-gray-600">Verified dealers with excellent track records</p>
          </div>
        </div>
        <button className="text-yellow-500 dark:hover:text-yellow-400 font-semibold text-sm sm:text-base flex items-center gap-1">
          View All
          <span>→</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sellers.map((seller) => (
          <div
            key={seller.id}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-200"
          >
            {/* Image */}
            <div className="relative h-32 overflow-hidden">
              <img
                src={seller.image}
                alt={seller.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              
              {/* Verified Badge */}
              <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-semibold">
                <Verified className="w-3 h-3 fill-white" />
                Verified
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-1">{seller.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{seller.type}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-gray-900">{seller.rating}</span>
                </div>
                <span className="text-sm text-gray-500">({seller.reviews} reviews)</span>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm mb-3 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{seller.location}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Car className="w-4 h-4" />
                  <span>{seller.inventory} cars</span>
                </div>
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-2 mb-3">
                {seller.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full"
                  >
                    {specialty}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <button className="w-full py-2 bg-yellow-400 dark:hover:text-white text-gray-900 font-semibold rounded-lg transition-colors">
                View Inventory
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Indicators */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Why Trust Motoket Sellers?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-600 rounded-full p-2">
              <Verified className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Verified Identity</h4>
              <p className="text-sm text-gray-600">All dealers verified with business licenses</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-blue-600 rounded-full p-2">
              <Star className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Real Reviews</h4>
              <p className="text-sm text-gray-600">Verified buyer reviews and ratings</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-blue-600 rounded-full p-2">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Quality Listings</h4>
              <p className="text-sm text-gray-600">Detailed vehicle history and inspections</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedSellers;

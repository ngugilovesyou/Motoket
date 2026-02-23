import React from 'react';
import { Upload, Store, ArrowRight, DollarSign, Users } from 'lucide-react';

const ParticipationCTA = () => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white dark:bg-gray-900 p-8 shadow-lg">
      {/* Sell Your Car CTA */}
      <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-shadow">
        <div className="p-8 text-white">
          <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Upload className="w-8 h-8" />
          </div>
          
          <h2 className="text-3xl font-bold mb-3">Sell Your Car</h2>
          <p className="text-blue-100 mb-6 text-lg">
            List your car for free and reach thousands of potential buyers. Get offers within 24 hours.
          </p>

          {/* Features */}
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2 text-blue-50">
              <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
              <span>Free listing - no hidden fees</span>
            </li>
            <li className="flex items-center gap-2 text-blue-50">
              <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
              <span>Reach millions of buyers nationwide</span>
            </li>
            <li className="flex items-center gap-2 text-blue-50">
              <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
              <span>Sell in days, not weeks</span>
            </li>
          </ul>

          <button className="bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 group">
            <span>Start Selling Now</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Stats */}
          <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold">4.8★</div>
              <div className="text-sm text-blue-100">Seller Rating</div>
            </div>
            <div>
              <div className="text-2xl font-bold">$2.4B+</div>
              <div className="text-sm text-blue-100">Cars Sold</div>
            </div>
          </div>
        </div>
      </div>

      {/* List as Dealer CTA */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-shadow">
        <div className="p-8 text-white">
          <div className="bg-white/10 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Store className="w-8 h-8" />
          </div>
          
          <h2 className="text-3xl font-bold mb-3">List as a Dealer</h2>
          <p className="text-gray-300 mb-6 text-lg">
            Join 2,000+ verified dealers and grow your business with our powerful marketplace tools.
          </p>

          {/* Features */}
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2 text-gray-200">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Unlimited inventory listings</span>
            </li>
            <li className="flex items-center gap-2 text-gray-200">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Advanced analytics & lead management</span>
            </li>
            <li className="flex items-center gap-2 text-gray-200">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Verified dealer badge & profile</span>
            </li>
          </ul>

          <button className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 group">
            <span>Become a Dealer</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Stats */}
          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold">2,340+</div>
              <div className="text-sm text-gray-400">Active Dealers</div>
            </div>
            <div>
              <div className="text-2xl font-bold">145K</div>
              <div className="text-sm text-gray-400">Monthly Leads</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParticipationCTA;

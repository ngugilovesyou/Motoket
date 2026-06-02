import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone, Clock, Car, ChevronRight, Building2, Search, Star } from "lucide-react";
import Navbar from "../Homepage/Navbar";

// ─── Empty State ──────────────────────────────────────────────────────────────
function NoDealersFound({ onRegister }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      {/* Animated Icon */}
      <div className="relative mb-8">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/20 flex items-center justify-center shadow-xl">
          <Building2 size={52} className="text-yellow-500 dark:text-yellow-400" />
        </div>
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full border-2 border-yellow-400/40 animate-ping" />
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
        No Dealerships Found
      </h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mb-2 leading-relaxed">
        It looks like there are no dealerships registered in your area yet. Be the first to
        bring verified dealership inventory to Motoket buyers.
      </p>
      <p className="text-sm text-gray-400 dark:text-gray-500 mb-10">
        Dealerships get access to staff posting, featured placements, and a dedicated storefront.
      </p>

      {/* CTA */}
      <button
        onClick={onRegister}
        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 shadow-lg shadow-yellow-500/25 transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <Building2 size={18} />
        Register as a Dealer
      </button>

      <p className="mt-6 text-xs text-gray-400 dark:text-gray-600">
        Already registered?{" "}
        <button className="text-yellow-500 hover:text-yellow-400 font-medium transition-colors">
          Sign in to your dealer portal
        </button>
      </p>
    </div>
  );
}

// ─── Dealer Card ──────────────────────────────────────────────────────────────
function DealerCard({ dealer }) {
  const navigate = useNavigate();

  return (
    <article
      onClick={() => navigate(`/dealers/${dealer.id}`)}
      className="group cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-yellow-400/50 dark:hover:border-yellow-500/40 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Cover image */}
      <div className="relative h-44 bg-gradient-to-br from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-600 overflow-hidden">
        {dealer.cover_image ? (
          <img
            src={dealer.cover_image}
            alt={dealer.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building2 size={48} className="text-gray-300 dark:text-gray-500" />
          </div>
        )}
        {/* Verified badge */}
        {dealer.verified && (
          <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold bg-yellow-500 text-white rounded-full shadow">
            ✓ Verified
          </span>
        )}
        {/* Car count pill */}
        <span className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1 text-xs font-medium bg-black/60 text-white rounded-full backdrop-blur-sm">
          <Car size={12} />
          {dealer.car_count ?? 0} cars
        </span>
      </div>

      {/* Logo + info */}
      <div className="p-5">
        <div className="flex items-start gap-4 mb-4">
          {/* Logo */}
          <div className="w-14 h-14 rounded-xl border-2 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-700 shadow-md flex items-center justify-center overflow-hidden flex-shrink-0 -mt-10 relative">
            {dealer.logo ? (
              <img src={dealer.logo} alt="" className="w-full h-full object-cover" />
            ) : (
              <Building2 size={24} className="text-yellow-500" />
            )}
          </div>

          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base leading-tight truncate group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors">
              {dealer.name}
            </h3>
            {/* Stars */}
            {dealer.rating != null && (
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={
                      i < Math.round(dealer.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }
                  />
                ))}
                <span className="text-xs text-gray-400 ml-1">({dealer.review_count ?? 0})</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
          {dealer.address && (
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-yellow-500 flex-shrink-0" />
              <span className="truncate">{dealer.address}</span>
            </div>
          )}
          {dealer.phone && (
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-yellow-500 flex-shrink-0" />
              <span>{dealer.phone}</span>
            </div>
          )}
          {dealer.hours && (
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-yellow-500 flex-shrink-0" />
              <span>{dealer.hours}</span>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {dealer.staff_count ?? 1} staff
          </span>
          <span className="flex items-center gap-1 text-sm font-medium text-yellow-500 dark:text-yellow-400 group-hover:gap-2 transition-all">
            View Inventory <ChevronRight size={15} />
          </span>
        </div>
      </div>
    </article>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function Dealers() {
  const navigate = useNavigate();
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const API_BASE_URL = "https://motoketapi.onrender.com/api";
  const LOCAL_API_URL = "http://127.0.0.1:8000/api";

  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/dealers/`, {
          credentials: "include",
        });
        const data = await res.json();
        setDealers(Array.isArray(data) ? data : []);
      } catch {
        setDealers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDealers();
  }, []);

  const filtered = dealers.filter(
    (d) =>
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.address?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Dealerships | Motoket</title>
        <meta name="description" content="Browse verified car dealerships on Motoket." />
      </Helmet>

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16 px-4">
        <Navbar />
        <div className="max-w-7xl mx-auto">

          {/* ── Header ── */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold tracking-widest uppercase text-yellow-500">
                Motoket Dealers
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  Verified{" "}
                  <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                    Dealerships
                  </span>
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                  Browse trusted dealerships and explore their full inventory
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-72">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search dealerships..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>
          </div>

          {/* ── States ── */}
          {loading ? (
            // Skeleton grid
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 animate-pulse"
                >
                  <div className="h-44 bg-gray-200 dark:bg-gray-700" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded w-1/2" />
                    <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <NoDealersFound onRegister={() => navigate("/dealers/register")} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((dealer) => (
                <DealerCard key={dealer.id} dealer={dealer} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default Dealers;
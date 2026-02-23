/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Car,
  Shield,
  Award,
  Eye,
  Clock,
  CheckCircle,
  X,
  Maximize2,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../Authentication/Auth";
import ContactSellerChat from "./ContactSeller";
import { ToastContainer, toast } from "react-toastify";
import ShareButton from "./ShareButton";
export default function VehicleDetails() {
  const { slug } = useParams();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://127.0.0.1:8000/api/get_vehicle_details/${slug}/`
        );
        if (!response.ok) {
          throw new Error("Vehicle not found");
        }
        const data = await response.json();
        if (typeof data.features === "string") {
          data.features = JSON.parse(data.features);
        }

        setVehicle(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [slug]);
  useEffect(() => {
    if (!user?.id || !vehicle?.id) return;

    const fetchFavoriteStatus = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/${user.id}/${vehicle.id}/is_favourited/`
        );
        const data = await res.json();
        setIsFavorited(data.is_favorited);
      } catch (err) {
        console.error("Failed to check favorite status", err);
      }
    };

    fetchFavoriteStatus();
  }, [user?.id, vehicle?.id]); 

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % vehicle.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length
    );
  };

  const openImageModal = (index) => {
    setCurrentImageIndex(index);
    setIsImageModalOpen(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage) => {
    return new Intl.NumberFormat().format(mileage);
  };

  const calculateDaysListed = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isImageModalOpen) {
        if (e.key === "ArrowLeft") prevImage();
        if (e.key === "ArrowRight") nextImage();
        if (e.key === "Escape") setIsImageModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isImageModalOpen]);

  if (loading) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        <p className="text-sm text-white/70 tracking-wide">Loading...</p>
      </div>
    </div>
  );
}


if (error) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
          <span className="text-red-500 text-xl">⚠️</span>
        </div>

        <h2 className="text-lg font-semibold text-white">
          Something went wrong
        </h2>

        <p className="text-sm text-white/70">
          {typeof error === "string"
            ? error
            : "An unexpected error occurred. Please try again."}
        </p>

        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90 transition"
        >
          Retry
        </button>
      </div>
    </div>
  );
}


  if (!vehicle) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
          <span className="text-xl">🚗</span>
        </div>

        <h2 className="text-lg font-semibold text-white">
          Vehicle not found
        </h2>

        <p className="text-sm text-white/70">
          The vehicle you’re looking for doesn’t exist or may have been removed.
        </p>

        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90 transition"
        >
          Go back
        </button>
      </div>
    </div>
  );
}


  // Add null checks for images before rendering
  const vehicleImages = vehicle.images.map((image) => ({
    ...image,
    image_url: transformCloudinaryUrl(image.image_url),
  }));

  // Helper function to transform Cloudinary URLs
  function transformCloudinaryUrl(url) {
    // Insert transformations before the filename
    return url.replace(
      /\/upload\//,
      "/upload/c_fill,w_800,h_600,f_auto,q_auto/"
    );
  }
  const mainImage = vehicleImages.length > 0 ? vehicleImages[0].image_url : "";

  const handleFavourite = async (vehicleId) => {
    const token = sessionStorage.getItem("access_token");

    if (!isAuthenticated) {
      toast.error("Please login to favorite a vehicle.");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/${user.id}/${vehicleId}/favourite/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to favorite");
      }

      console.log("Favorited successfully:", data);
      setIsFavorited(true);
    } catch (err) {
      console.error("Error favoriting vehicle:", err);
      toast.error(err.message || "Failed to favorite");
    }
  };

 


  return (
   <>
   <ToastContainer position="top-right" autoClose={3000} />
    <div className="min-h-screen bg-white dark:bg-gray-900 text-white">
      {/* Hero Section with Image Gallery */}
      <div className="relative">
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          {mainImage && (
            <img
              src={vehicleImages[currentImageIndex].image_url}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              className="w-full h-full object-cover transition-all duration-500"
            />
          )}

          {/* Image Navigation */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
            {currentImageIndex + 1} / {vehicle.images.length}
          </div>

          {/* Expand Button */}
          <button
            onClick={() => openImageModal(currentImageIndex)}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
          >
            <Maximize2 className="w-5 h-5" />
          </button>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        {/* Thumbnail Strip */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {vehicleImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  index === currentImageIndex
                    ? "border-white"
                    : "border-transparent opacity-60 hover:opacity-80"
                }`}
              >
                <img
                  // src={transformCloudinaryUrl(mainImage)}
                  src={image.image_url.replace(
                    /\/upload\/c_fill,w_800,h_600/,
                    "/upload/c_fill,w_100,h_75"
                  )}
                  // src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Vehicle Header */}
            <div className="bg-white dark:bg-gray-900  text-gray-900 dark:text-gray-100 rounded-2xl p-6 border border-gray-800">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h1>
                  <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-300">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{vehicle.region}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {calculateDaysListed(vehicle.created_at)} days ago
                      </span>
                    </div>
                    {/* <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{vehicle.viewCount} views</span>
                    </div> */}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onCli1ck={() => {
                      if (!isFavorited) {
                        handleFavourite(vehicle.id);
                      } else {
                        setIsFavorited(false);
                      }
                    }}
                    className="p-3 transition-all duration-200"
                    // className={`p-3 rounded-full c ${
                    //   isFavorited
                    //     ? "bg-red-500 hover:bg-red-600"
                    //     : "bg-gray-800 hover:bg-gray-700"
                    // }`}
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        isFavorited
                          ? "fill-current text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </button>

                  <ShareButton vehicleSlug={vehicle.slug} />
                </div>
              </div>

              <div className="text-4xl font-bold dark:text-gray-100 text-gray-800 mb-4">
                {formatPrice(vehicle.price)}
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center space-x-1 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>{vehicle.condition}</span>
                </div>
                <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                  <Award className="w-4 h-4 inline mr-1" />
                  Verified Listing
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white dark:bg-gray-900 dark:text-gray-100 text-gray-900 rounded-2xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-6">Specifications</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-gray-800 rounded-xl p-4 mb-3">
                    <Gauge className="w-8 h-8 mx-auto text-blue-400" />
                  </div>
                  <div className="text-gray-600 text-sm dark:text-gray-300">Mileage</div>
                  <div className="font-semibold dark:text-gray-100">
                    {formatMileage(vehicle.mileage)} km
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-gray-800 rounded-xl p-4 mb-3">
                    <Fuel className="w-8 h-8 mx-auto text-green-400" />
                  </div>
                  <div className="text-gray-600 text-sm dark:text-gray-300">Fuel Type</div>
                  <div className="font-semibold dark:text-gray-100">{vehicle.fuel_type}</div>
                </div>
                <div className="text-center">
                  <div className="bg-gray-800 rounded-xl p-4 mb-3">
                    <Settings className="w-8 h-8 mx-auto text-purple-400" />
                  </div>
                  <div className="text-gray-600 text-sm dark:text-gray-300">Transmission</div>
                  <div className="font-semibold dark:text-gray-100">{vehicle.transmission}</div>
                </div>
                <div className="text-center">
                  <div className="bg-gray-800 rounded-xl p-4 mb-3">
                    <Car className="w-8 h-8 mx-auto text-yellow-400" />
                  </div>
                  <div className="text-gray-600 text-sm dark:text-gray-300">Body Type</div>
                  <div className="font-semibold dark:text-gray-100">{vehicle.body_type}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-800">
                <div>
                  <span className="text-gray-600 dark:text-gray-300">Year:</span>
                  <span className="ml-2 font-semibold dark:text-gray-100">{vehicle.year}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-300">Color:</span>
                  <span className="ml-2 font-semibold dark:text-gray-100">{vehicle.color}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-300">Condition:</span>
                  <span className="ml-2 font-semibold dark:text-gray-100">
                    {vehicle.condition}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-300">Location:</span>
                  <span className="ml-2 font-semibold dark:text-gray-100">{vehicle.region}</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white dark:bg-gray-900 dark:text-white text-gray-900 rounded-2xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-6">Features & Equipment</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {vehicle.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                  >
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-100">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-900 dark:text-white text-gray-900 rounded-2xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-6">Description</h2>
              <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
                {vehicle.description}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <ContactSellerChat vehicle={vehicle} currentUser={user} />

            {/* Safety Tips */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-400" />
                Safety Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Meet in a public place</li>
                <li>• Bring a friend when viewing</li>
                <li>• Inspect the vehicle thoroughly</li>
                <li>• Verify ownership documents</li>
                <li>• Test drive before purchasing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <button
            onClick={() => setIsImageModalOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
          >
            <ChevronLeft className="w-12 h-12" />
          </button>

          <img
            // src={transformCloudinaryUrl(mainImage)}
            src={vehicleImages[currentImageIndex].image_url}
            alt="Enlarged Vehicle"
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
          />

          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
          >
            <ChevronRight className="w-12 h-12" />
          </button>
        </div>
      )}
    </div>
   </>
  );
}

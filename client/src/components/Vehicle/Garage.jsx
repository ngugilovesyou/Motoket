import React, { useState, useEffect, useContext } from "react";
import {
  Edit,
  Trash2,
  Star,
  DollarSign,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Eye,
  Plus,
  AlertCircle,
  CheckCircle,
  X,
  Upload,
  Save,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Authentication/Auth";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Navbar from "../Homepage/Navbar";

function Garage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [editForm, setEditForm] = useState({
    description: "",
    price: "",
    is_featured: false,
    image_urls: [],
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
  }, [user]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/api/${user.id}/user_vehicles/`
      );
      setVehicles(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load your vehicles. Please try again.");
      console.error("Error fetching vehicles:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (vehicle) => {
    setEditingVehicle(vehicle);
    setEditForm({
      description: vehicle.description || "",
      price: vehicle.price || "",
      is_featured: vehicle.is_featured || false,
      image_urls: [],
    });
    setShowEditModal(true);
  };

  const handleUpdateVehicle = async () => {
    try {
      await axios.patch(
        `http://localhost:8000/api/${user.id}/${editingVehicle.id}/update/`,
        editForm
      );
      setUpdateSuccess(true);
      setTimeout(() => {
        setUpdateSuccess(false);
        setShowEditModal(false);
        fetchVehicles();
      }, 2000);
    } catch (err) {
      console.error("Error updating vehicle:", err);
      toast.error("Failed to update vehicle. Please try again.");
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (
      window.confirm("Are you sure you want to delete this vehicle listing?")
    ) {
      try {
        await axios.delete(
          `http://localhost:8000/api/${user.id}/${vehicleId}/delete-vehicle/`
        );
        fetchVehicles();
      } catch (err) {
        console.error("Error deleting vehicle:", err);
        toast.error("Failed to delete vehicle. Please try again.");
      }
    }
  };

  const toggleFeatured = async (vehicle) => {
    try {
      await axios.patch(
        `http://localhost:8000/api/vehicles/${user.id}/${vehicle.id}/`,
        {
          is_featured: !vehicle.is_featured,
        }
      );
      fetchVehicles();
    } catch (err) {
      console.error("Error toggling featured status:", err);
      alert("Failed to update featured status.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12">
        <Navbar />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-2">
              My Garage
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your vehicle listings
            </p>
          </div>
          <button
            onClick={() => navigate("/sell")}
            className="mt-4 md:mt-0 flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus size={20} className="mr-2" />
            Add New Vehicle
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center">
            <AlertCircle className="text-red-600 dark:text-red-400 mr-3" />
            <p className="text-red-800 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total Listings
                </p>
                <p className="text-3xl font-semibold text-gray-900 dark:text-white">
                  {vehicles.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Settings className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Featured
                </p>
                <p className="text-3xl font-semibold text-gray-900 dark:text-white">
                  {vehicles.filter((v) => v.is_featured).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                <Star className="text-yellow-600 dark:text-yellow-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total Value
                </p>
                <p className="text-3xl font-semibold text-gray-900 dark:text-white">
                  ksh
                  {vehicles
                    .reduce((sum, v) => sum + parseFloat(v.price || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
              
            </div>
          </div>
        </div>

        {/* Vehicle Grid */}
        {vehicles.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No vehicles yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start by adding your first vehicle to your garage
            </p>
            <button
              onClick={() => navigate("/sell")}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300"
            >
              <Plus size={20} className="mr-2" />
              Add Your First Vehicle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  {vehicle.images && vehicle.images.length > 0 ? (
                    <img
                      src={vehicle.images[0].image_url}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Settings className="text-gray-400" size={48} />
                    </div>
                  )}
                  
                  {/* Featured Badge */}
                  {vehicle.is_featured && (
                    <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-semibold flex items-center shadow-lg">
                      <Star size={12} className="mr-1 fill-current" />
                      Featured
                    </div>
                  )}

                  {/* Quick Actions Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                    <button
                      onClick={() => navigate(`/vehicle/${vehicle.id}`)}
                      className="p-3 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
                      title="View Details"
                    >
                      <Eye size={20} className="text-gray-700 dark:text-gray-300" />
                    </button>
                    <button
                      onClick={() => handleEditClick(vehicle)}
                      className="p-3 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
                      title="Edit"
                    >
                      <Edit size={20} className="text-gray-700 dark:text-gray-300" />
                    </button>
                    <button
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                      className="p-3 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={20} className="text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h3>

                  {/* Price */}
                  <div className="flex items-center text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-4">
                    ksh {""}
                    {parseFloat(vehicle.price).toLocaleString()}
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar size={16} className="mr-2" />
                      {vehicle.year}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Gauge size={16} className="mr-2" />
                      {vehicle.mileage?.toLocaleString()} mi
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Settings size={16} className="mr-2" />
                      {vehicle.transmission}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Fuel size={16} className="mr-2" />
                      {vehicle.fuel_type}
                    </div>
                  </div>

                  {/* Description */}
                  {vehicle.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {vehicle.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => toggleFeatured(vehicle)}
                      className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg transition-all duration-300 ${
                        vehicle.is_featured
                          ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      <Star
                        size={16}
                        className={`mr-2 ${
                          vehicle.is_featured ? "fill-current" : ""
                        }`}
                      />
                      <span className="text-sm font-medium">
                        {vehicle.is_featured ? "Featured" : "Feature"}
                      </span>
                    </button>
                    <button
                      onClick={() => handleEditClick(vehicle)}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-300"
                    >
                      <Edit size={16} className="mr-2" />
                      <span className="text-sm font-medium">Edit</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingVehicle && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Edit Vehicle
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {editingVehicle.year} {editingVehicle.make}{" "}
                  {editingVehicle.model}
                </p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Success Message */}
            {updateSuccess && (
              <div className="mx-6 mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center">
                <CheckCircle className="text-green-600 dark:text-green-400 mr-3" />
                <p className="text-green-800 dark:text-green-300">
                  Vehicle updated successfully!
                </p>
              </div>
            )}

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price
                </label>
                <div className="relative">
                  <span
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  >
                    ksh
                  </span>

                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) =>
                      setEditForm({ ...editForm, price: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900 dark:text-white"
                    placeholder="Enter price"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900 dark:text-white resize-none"
                  placeholder="Enter vehicle description"
                />
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <Star
                    className={`mr-3 ${
                      editForm.is_featured
                        ? "text-yellow-500 fill-current"
                        : "text-gray-400"
                    }`}
                    size={24}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Featured Listing
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Highlight this vehicle
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setEditForm({
                      ...editForm,
                      is_featured: !editForm.is_featured,
                    })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    editForm.is_featured ? "bg-yellow-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      editForm.is_featured ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Add Images Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Add New Images (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-yellow-400 transition-colors cursor-pointer">
                  <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click to upload images or paste URLs
                  </p>
                  <input
                    type="text"
                    placeholder="Paste image URL"
                    className="mt-3 w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900 dark:text-white text-sm"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && e.target.value) {
                        setEditForm({
                          ...editForm,
                          image_urls: [...editForm.image_urls, e.target.value],
                        });
                        e.target.value = "";
                      }
                    }}
                  />
                </div>
                {editForm.image_urls.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {editForm.image_urls.map((url, index) => (
                      <div
                        key={index}
                        className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-sm flex items-center"
                      >
                        <span className="mr-2">Image {index + 1}</span>
                        <button
                          onClick={() => {
                            const newUrls = editForm.image_urls.filter(
                              (_, i) => i !== index
                            );
                            setEditForm({ ...editForm, image_urls: newUrls });
                          }}
                          className="hover:text-yellow-900 dark:hover:text-yellow-100"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-6 flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateVehicle}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl font-medium flex items-center"
              >
                <Save size={18} className="mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Garage;
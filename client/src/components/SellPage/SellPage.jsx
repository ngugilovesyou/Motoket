/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import {
  Camera,
  Upload,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Users,
  Settings,
  DollarSign,
  Eye,
  EyeOff,
} from "lucide-react";
import axios from "axios";
import Navbar from "../Homepage/Navbar";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Authentication/Auth";
import useStore from "../../../store";

export default function SellPage() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    mileage: "",
    price: "",
    condition: "",
    fuel_type: "",
    transmission: "",
    body_type: "",
    color: "",
    region: "",
    description: "",
    features: [],
    contact_name: "",
    contact_phone: "",
    contact_email: "",
  });

  const [images, setImages] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPrice, setShowPrice] = useState(true);
  const [userId, setUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const carMakes = [
    "Toyota",
    "Honda",
    "Ford",
    "BMW",
    "Mercedes-Benz",
    "Audi",
    "Volkswagen",
    "Nissan",
    "Hyundai",
    "Kia",
  ];
  const conditions = ["Excellent", "Very Good", "Good", "Fair", "Needs Work"];
  const fuelTypes = [
    "Gasoline",
    "Diesel",
    "Hybrid",
    "Electric",
    "Plug-in Hybrid",
  ];
  const transmissions = ["Manual", "Automatic", "CVT"];
  const bodyTypes = [
    "Sedan",
    "SUV",
    "Hatchback",
    "Coupe",
    "Convertible",
    "Truck",
    "Van",
  ];
  const availableFeatures = [
    "Air Conditioning",
    "Bluetooth",
    "Backup Camera",
    "Navigation System",
    "Heated Seats",
    "Sunroof",
    "Leather Interior",
    "Cruise Control",
    "Parking Sensors",
    "Keyless Entry",
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: location.pathname }, 
        replace: true, 
      });
    }
  }, [isAuthenticated]);

  // const validateForm = () => {
  //   const requiredFields = [
  //     "make",
  //     "model",
  //     "year",
  //     "mileage",
  //     "condition",
  //     "region",
  //     "price",
  //     "contact_name",
  //     "contact_phone",
  //     "contact_email",
  //   ];

  //   return requiredFields.every((field) => {
  //     const value = formData[field];
  //     return value !== "" && value !== null && value !== undefined;
  //   });
  // };
const validateForm = () => {
  const requiredFields = [
    "make",
    "model",
    "year",
    "mileage",
    "condition",
    "region",
    "price",
    "contact_name",
    "contact_phone",
    "contact_email",
  ];

  console.log("=== FORM VALIDATION DEBUG ===");
  console.log("Current formData:", formData);
  
  const validationResults = requiredFields.map((field) => {
    const value = formData[field];
    const isValid = value !== "" && value !== null && value !== undefined;
    console.log(`${field}: "${value}" - ${isValid ? "VALID" : "INVALID"}`);
    return isValid;
  });

  console.log("All valid:", validationResults.every(v => v));
  console.log("=============================");

  return validationResults.every(v => v);
};
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFeatureToggle = (feature) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 10) {
      alert("Maximum 10 images allowed");
      return;
    }

    files.forEach((file) => {
      if (!file.type.match("image.*")) {
        alert(`${file.name} is not an image file`);
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is too large (max 10MB)`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImages((prev) => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };


  const getDefaultUserName = () => {
  if (!user) return "";
  
  // Debug: Log what's in user object
  console.log("User object in getDefaultUserName:", user);
  
  // Try different possible field names
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  
  if (user.full_name) {
    return user.full_name;
  }
  
  if (user.name) {
    return user.name;
  }
  
  // Fallback: get from sessionStorage
  const storedFirstName = sessionStorage.getItem("user_first_name");
  const storedLastName = sessionStorage.getItem("user_last_name");
  
  if (storedFirstName && storedLastName) {
    return `${storedFirstName} ${storedLastName}`;
  }
  
  return "";
};

const getDefaultUserEmail = () => {
  if (!user) return "";
  
  console.log("User object in getDefaultUserEmail:", user);
  
  if (user.email) {
    if (!formData.contact_email) {
      setTimeout(() => {
        setFormData(prev => ({ ...prev, contact_email: user.email }));
      }, 0);
    }
    return user.email;
  }
  
  return "";
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fill in all required fields");
      
      return;
    }

    const currentUserId = sessionStorage.getItem("user_id");
    // if (!currentUserId) {
    //   alert("User not authenticated");
    //   return;
    // }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      console.log("things to be sent", formDataToSend)

      // Append all vehicle data fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "features") {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, value);
        }
      });

      // Append images as files
      images.forEach((image, index) => {
        if (image.startsWith("data:")) {
          const blob = dataURLtoBlob(image);
          formDataToSend.append("images", blob, `vehicle_image_${index}.jpg`);
        } else if (image instanceof File) {
          formDataToSend.append("images", image);
        }
      });

      const response = await axios.post(
        `https://motoketapi.onrender.com/api/${currentUserId}/post_vehicle/`,
        formDataToSend,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Vehicle created:", response.data);
      alert("Vehicle listed successfully!");

      setCurrentStep(1);
      setFormData({
        make: "",
        model: "",
        year: "",
        mileage: "",
        price: "",
        condition: "",
        fuel_type: "",
        transmission: "",
        body_type: "",
        color: "",
        region: "",
        description: "",
        features: [],
        contact_name: "",
        contact_phone: "",
        contact_email: "",
      });
      setImages([]);
    } catch (error) {
      console.error("Error creating vehicle:", {
        error: error.response?.data || error.message,
        request: error.config,
      });

      let errorMessage = "Failed to list vehicle. Please try again.";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold dark:text-white text-gray-800 mb-4 md:mb-6">
              Vehicle Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block  dark:text-white text-gray-600 mb-1 md:mb-2 text-sm md:text-base">
                  Make *
                </label>
                <select
                  value={formData.make}
                  onChange={(e) => handleInputChange("make", e.target.value)}
                  className="w-full p-2 md:p-3 border-2 border-gray-200 dark:border-gray-600  text-gray-900 rounded-lg dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-0 transition-all duration-300 text-sm md:text-base"
                  // className="w-full p-2 md:p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-white focus:outline-none transition-colors text-sm md:text-base"
                  required
                >
                  <option value="">Select Make</option>
                  {carMakes.map((make) => (
                    <option key={make} value={make}>
                      {make}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block dark:text-white text-gray-600 mb-1 md:mb-2 text-sm md:text-base">
                  Model *
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                  className="w-full p-2 md:p-3 border-2 border-gray-200 dark:border-gray-600  text-gray-900 rounded-lg dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-0 transition-all duration-300 text-sm md:text-base"
                  // className="w-full p-2 md:p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-white focus:outline-none transition-colors text-sm md:text-base"
                  placeholder="e.g., Camry, Civic, F-150"
                  required
                />
              </div>

              <div>
                <label className="block dark:text-white text-gray-600 mb-1 md:mb-2 text-sm md:text-base">
                  Year *
                </label>
                <input
                  type="number"
                  min="1900"
                  max="2025"
                  value={formData.year}
                  onChange={(e) => handleInputChange("year", e.target.value)}
                  className="w-full p-2 md:p-3  border-2 border-gray-200 dark:border-gray-600  text-gray-900 rounded-lg dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-0 transition-all duration-300 text-sm md:text-base"
                  // className="w-full p-2 md:p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-white focus:outline-none transition-colors text-sm md:text-base"
                  placeholder="2020"
                  required
                />
              </div>

              <div>
                <label className="block dark:text-white text-gray-600 mb-1 md:mb-2 text-sm md:text-base">
                  Mileage *
                </label>
                <div className="relative">
                  <Gauge className="absolute left-3 top-2.5 md:top-3 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.mileage}
                    onChange={(e) =>
                      handleInputChange("mileage", e.target.value)
                    }
                    className="w-full p-2 md:p-3 pl-9 md:pl-12 border-2 border-gray-200 dark:border-gray-600  text-gray-900 rounded-lg dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-0 transition-all duration-300 text-sm md:text-base"
                    // className="w-full p-2 md:p-3 pl-9 md:pl-12 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-white focus:outline-none transition-colors text-sm md:text-base"
                    placeholder="50000"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block dark:text-white text-gray-600 mb-1 md:mb-2 text-sm md:text-base">
                  Condition *
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) =>
                    handleInputChange("condition", e.target.value)
                  }
                  className="w-full p-2 md:p-3  border-2 border-gray-200 dark:border-gray-600  text-gray-900 rounded-lg dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-0 transition-all duration-300 text-sm md:text-base"
                  // className="w-full p-2 md:p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-white focus:outline-none transition-colors text-sm md:text-base"
                  required
                >
                  <option value="">Select Condition</option>
                  {conditions.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block dark:text-white text-gray-600 mb-1 md:mb-2 text-sm md:text-base">
                  Body Type
                </label>
                <select
                  value={formData.body_type}
                  onChange={(e) =>
                    handleInputChange("body_type", e.target.value)
                  }
                  className="w-full p-2 md:p-3  border-2 border-gray-200 dark:border-gray-600  text-gray-900 rounded-lg dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-0 transition-all duration-300 text-sm md:text-base"
                  // className="w-full p-2 md:p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-white focus:outline-none transition-colors text-sm md:text-base"
                >
                  <option value="">Select Body Type</option>
                  {bodyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold dark:text-white text-gray-800 mb-4 md:mb-6">
              Technical Specs
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block dark:text-white text-gray-600 mb-1 md:mb-2 text-sm md:text-base">
                  Fuel Type
                </label>
                <div className="relative">
                  <Fuel className="absolute left-3 top-2.5 md:top-3 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                  <select
                    value={formData.fuel_type}
                    onChange={(e) =>
                      handleInputChange("fuel_type", e.target.value)
                    }
                    className="w-full p-2 md:p-3 pl-9 md:pl-12 border-2 border-gray-200 dark:border-gray-600  text-gray-900 rounded-lg dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-0 transition-all duration-300 text-sm md:text-base"
                    // className="w-full p-2 md:p-3 pl-9 md:pl-12 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-white focus:outline-none transition-colors text-sm md:text-base"
                  >
                    <option value="">Select Fuel Type</option>
                    {fuelTypes.map((fuel) => (
                      <option key={fuel} value={fuel}>
                        {fuel}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block dark:text-white text-gray-600 mb-1 md:mb-2 text-sm md:text-base">
                  Transmission
                </label>
                <div className="relative">
                  <Settings className="absolute left-3 top-2.5 md:top-3 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                  <select
                    value={formData.transmission}
                    onChange={(e) =>
                      handleInputChange("transmission", e.target.value)
                    }
                    className="w-full p-2 md:p-3 pl-9 md:pl-12 border-2 border-gray-200 dark:border-gray-600  text-gray-900 rounded-lg dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-0 transition-all duration-300 text-sm md:text-base"
                    // className="w-full p-2 md:p-3 pl-9 md:pl-12 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-white focus:outline-none transition-colors text-sm md:text-base"
                  >
                    <option value="">Select Transmission</option>
                    {transmissions.map((trans) => (
                      <option key={trans} value={trans}>
                        {trans}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block dark:text-white text-gray-600 mb-1 md:mb-2 text-sm md:text-base">
                  Color
                </label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                  className="w-full p-3 md:p-3  border-gray-200 dark:border-gray-600  text-gray-900 rounded-lg dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-0 transition-all duration-300 md:text-base"
                  // className="w-full p-2 md:p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-white focus:outline-none transition-colors text-sm md:text-base"
                  placeholder="e.g., Black, White, Silver"
                />
              </div>

              <div>
                <label className="block dark:text-white text-gray-600 mb-1 md:mb-2 text-sm md:text-base">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 md:top-3 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) =>
                      handleInputChange("region", e.target.value)
                    }
                    className="w-full p-3 md:p-3 pl-9 md:pl-12 border-2 border-gray-200 dark:border-gray-600  text-gray-900 rounded-lg dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-0 transition-all duration-300 md:text-base"
                    // className="w-full p-2 md:p-3 pl-9 md:pl-12 bg-gray-500 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-white focus:border-white focus:outline-none transition-colors text-sm md:text-base"
                    placeholder="eg, Nairobi, Kenya"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block dark:text-white text-gray-600 mb-2 md:mb-4 text-sm md:text-base">
                Features & Options
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
                {availableFeatures.map((feature) => (
                  <label
                    key={feature}
                    className="flex items-center space-x-2 cursor-pointer group text-sm md:text-base"
                  >
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 md:w-5 md:h-5 border-2 rounded flex items-center justify-center transition-colors ${
                        formData.features.includes(feature)
                          ? "bg-white border-white"
                          : "border-gray-400 group-hover:border-gray-300"
                      }`}
                    >
                      {formData.features.includes(feature) && (
                        <svg
                          className="w-2 h-2 md:w-3 md:h-3 text-black"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="dark:text-white text-gray-600 text-xs md:text-sm group-hover:text-grey transition-colors">
                      {feature}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold dark:text-white text-gray-800 mb-4 md:mb-6">
              Photos & Description
            </h2>

            <div>
              <label className="block dark:text-white text-gray-600 mb-2 md:mb-4 text-sm md:text-base">
                Upload Photos
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 md:p-8 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Camera className="mx-auto h-8 w-8 md:h-12 md:w-12 text-gray-400 mb-2 md:mb-4" />
                  <p className="dark:text-white text-gray-600 mb-1 md:mb-2 text-sm md:text-base">
                    Click to upload photos
                  </p>
                  <p className="text-gray-500 text-xs md:text-sm">
                    PNG, JPG up to 10MB each
                  </p>
                </label>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-4 mt-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-20 md:h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs md:text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block dark:text-white text-gray-600 mb-1 md:mb-2 text-sm md:text-base">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={4}
                className="w-full p-2 md:p-3  border-gray-200 dark:border-gray-600  text-gray-900 rounded-lg dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-0 transition-all duration-300 md:text-base"
                // className="w-full p-2 md:p-3 bg-gray-500 dark:bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-white focus:outline-none transition-colors resize-none text-sm md:text-base"
                placeholder="Describe your vehicle's condition, maintenance history, any modifications, and why you're selling..."
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-600 dark:text-white mb-4 md:mb-6">
              Pricing & Contact
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="sm:col-span-2">
                <label className="block dark:text-white text-gray-600 mb-1 md:mb-2 text-sm md:text-base">
                  Asking Price *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 md:top-3 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                  <input
                    type={showPrice ? "number" : "password"}
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className="w-full p-2 md:p-3 pl-9 md:pl-12 pr-9 md:pr-12 border-gray-200 dark:border-gray-600  text-gray-900 rounded-lg dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-0 transition-all duration-300 text-sm md:text-base"
                    // className="w-full p-2 md:p-3 pl-9 md:pl-12 pr-9 md:pr-12 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-white focus:outline-none transition-colors text-sm md:text-base"
                    placeholder="25000"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPrice(!showPrice)}
                    className="absolute right-3 top-2.5 md:top-3 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPrice ? (
                      <Eye className="h-4 w-4 md:h-5 md:w-5" />
                    ) : (
                      <EyeOff className="h-4 w-4 md:h-5 md:w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
  <label className="block dark:text-white text-gray-600 mb-1 md:mb-2 text-sm md:text-base">
    Your Name *
  </label>
  <input
    type="text"
    value={formData.contact_name || getDefaultUserName()}
    onChange={(e) =>
      handleInputChange("contact_name", e.target.value)
    }
    className="w-full p-2 md:p-3 border-gray-200 dark:border-gray-600 text-gray-900 rounded-lg dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-0 transition-all duration-300 text-sm md:text-base"
    required
  />
</div>

              <div>
                <label className="block dark:text-white text-gray-600 mb-1 md:mb-2 text-sm md:text-base">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) =>
                    handleInputChange("contact_phone", e.target.value)
                  }
                  className="w-full p-2 md:p-3  border-gray-200 dark:border-gray-600  text-gray-900 rounded-lg dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-0 transition-all duration-300 text-sm md:text-base"
                  // className="w-full p-2 md:p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-white focus:outline-none transition-colors text-sm md:text-base"
                  placeholder="0712345678"
                  required
                />
              </div>

              <div className="sm:col-span-2">
  <label className="block dark:text-white text-gray-600 mb-1 md:mb-2 text-sm md:text-base">
    Email Address *
  </label>
  <input
    type="email"
    value={formData.contact_email || getDefaultUserEmail()}
    onChange={(e) =>
      handleInputChange("contact_email", e.target.value)
    }
    className="w-full p-2 md:p-3 border-gray-200 dark:border-gray-600 text-gray-900 rounded-lg dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-0 transition-all duration-300 text-sm md:text-base"
    required
  />
</div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-600">
              <h3 className="text-base md:text-lg font-semibold text-gray-600 dark:text-white mb-2 md:mb-4">
                Listing Preview
              </h3>
              <div className="dark:text-white text-gray-600 space-y-1 md:space-y-2 text-sm md:text-base">
                <p>
                  <span className="font-medium">Vehicle:</span> {formData.year}{" "}
                  {formData.make} {formData.model}
                </p>
                <p>
                  <span className="font-medium">Price:</span> ksh .{" "}
                  {formData.price?.toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">Mileage:</span>{" "}
                  {formData.mileage?.toLocaleString()} miles
                </p>
                <p>
                  <span className="font-medium">Location:</span>{" "}
                  {formData.region}
                </p>
                <p>
                  <span className="font-medium">Photos:</span> {images.length}{" "}
                  uploaded
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 text-white pt-16 md:pt-20">
        <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Sell Your Car
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Get the best price for your vehicle
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-1 md:mb-2">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center font-semibold transition-colors text-xs md:text-base ${
                      step <= currentStep
                        ? "bg-white text-black"
                        : "bg-gray-600 text-white"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 4 && (
                    <div
                      className={`w-8 md:w-16 h-1 mx-1 md:mx-2 transition-colors ${
                        step < currentStep ? "bg-white" : "bg-gray-600"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs md:text-sm text-gray-400 px-1 md:px-0">
              <span className="text-center">Vehicle Details</span>
              <span className="text-center">Specifications</span>
              <span className="text-center">Media & Description</span>
              <span className="text-center">Pricing & Contact</span>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl md:rounded-2xl p-4 md:p-8 shadow-lg md:shadow-2xl">
            {renderStep()}

            <div className="flex justify-between mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-700">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-4 py-2 md:px-6 md:py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm md:text-base"
              >
                Previous
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-4 py-2 md:px-6 md:py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-semibold text-sm md:text-base"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`px-5 py-2 md:px-8 md:py-3 bg-white text-black rounded-lg transition-colors font-semibold text-sm md:text-base ${
                    isSubmitting
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {isSubmitting ? "Listing..." : "List My Car"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

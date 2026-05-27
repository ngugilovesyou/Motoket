import { useState, useRef, useContext } from "react";
import { Camera, Check, X, Lock, Eye, EyeOff, Shield, Upload } from "lucide-react";
import { AuthContext } from "../Authentication/Auth";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [previewImage, setPreviewImage] = useState(user.image_url);
  const [imageFile, setImageFile] = useState(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const API_BASE_URL = "https://motoketapi.onrender.com/api";
  const LOCAL_API_URL = "http://127.0.0.1:8000/api";

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    setError("");

    if (showPasswordFields) {
      if (!passwordData.current_password) {
        setError("Please enter your current password");
        return false;
      }
      if (!passwordData.new_password) {
        setError("Please enter a new password");
        return false;
      }
      if (passwordData.new_password.length < 8) {
        setError("New password must be at least 8 characters long");
        return false;
      }
      if (passwordData.current_password === passwordData.new_password) {
        setError("New password must be different from current password");
        return false;
      }
    }

    if (!imageFile && !showPasswordFields) {
      setError("Please select an image to update");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError('');
    setMessage('');
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add image file if selected
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      // Add password data if changing password
      if (showPasswordFields) {
        formData.append('current_password', passwordData.current_password);
        formData.append('new_password', passwordData.new_password);
      }
      
      // Make API call to combined endpoint
      const response = await fetch(
        `${LOCAL_API_URL}/${user.id}/update_profile/`,
        {
          method: "PATCH",
          body: formData,
        }
      );
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message || 'Profile updated successfully!');
        
        // Update preview image if new image was uploaded
        if (data.image_url) {
          setPreviewImage(data.image_url);
          // Update user context if needed
          setUser({ ...user, image_url: data.image_url });
        }
        
        // Reset password fields if password was changed
        if (showPasswordFields) {
          setShowPasswordFields(false);
          setPasswordData({ current_password: '', new_password: '' });
        }
        
        // Reset image file
        setImageFile(null);
      } else {
        // Handle validation errors
        if (data.details && Array.isArray(data.details)) {
          setError(data.details.join('. '));
        } else {
          setError(data.error || 'Failed to update profile');
        }
      }
      
    } catch (err) {
      console.error('Profile update error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setPreviewImage(user.image_url);
    setImageFile(null);
    setShowPasswordFields(false);
    setPasswordData({ current_password: "", new_password: "" });
    setError("");
    setMessage("");
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-gray-900 dark:via-amber-900/20 dark:to-yellow-900/20 py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-linear-to-r from-amber-200/30 to-yellow-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-linear-to-r from-orange-200/20 to-amber-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-yellow-100/10 to-amber-100/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-4xl mx-auto">
        <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-amber-100 dark:border-amber-800/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 dark:from-amber-700 dark:via-yellow-700 dark:to-orange-700 px-8 py-6">
            <h1 className="text-3xl font-bold text-white text-center tracking-wide">
              Profile Settings
            </h1>
            <div className="mt-2 h-1 w-24 bg-white/30 rounded-full mx-auto"></div>
          </div>

          {/* Messages */}
          {message && (
            <div className="mx-8 mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
              <p className="text-green-700 dark:text-green-300 text-center font-medium">
                {message}
              </p>
            </div>
          )}

          {error && (
            <div className="mx-8 mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-red-700 dark:text-red-300 text-center font-medium">
                {error}
              </p>
            </div>
          )}

          {/* Profile Content */}
          <div className="p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Left Column: Profile Image Section */}
              <div className="lg:w-1/3 flex flex-col items-center">
                <div className="relative group">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gradient-to-r from-amber-400 to-yellow-400 shadow-xl relative">
                    <div className="absolute inset-0 bg-linear-to-r from-amber-400 to-yellow-400 rounded-full"></div>
                    <div className="absolute inset-1 rounded-full overflow-hidden bg-white">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-800 dark:to-yellow-800 flex items-center justify-center text-4xl text-amber-700 dark:text-amber-200 font-bold">
                          {user.first_name?.[0]}
                          {user.last_name?.[0]}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Camera button for image upload */}
                  <button
                    onClick={triggerFileInput}
                    className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110"
                  >
                    <Camera className="h-5 w-5" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {/* Update Image Button */}
                {imageFile && (
                  <div className="mt-4 w-full">
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          Update Profile Picture
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setImageFile(null);
                        setPreviewImage(user.image_url);
                      }}
                      className="w-full mt-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                <div className="mt-6 text-center">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    {user.first_name} {user.last_name}
                  </h2>
                  <div className="flex items-center justify-center gap-2 text-amber-700 dark:text-amber-300 mb-3">
                    <Shield className="h-5 w-5" />
                    <span className="font-semibold text-lg">{user.role}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-full inline-block">
                    {user.email}
                  </p>
                  <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
                    Member since{" "}
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Right Column: Password Section */}
              <div className="lg:w-2/3">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                      Account Security
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Update your password to keep your account secure.
                    </p>
                  </div>

                  {/* Password Change Section */}
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-xl border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <Lock className="h-5 w-5 text-amber-600" />
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                            Change Password
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Keep your account secure with a strong password
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowPasswordFields(!showPasswordFields)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                          showPasswordFields
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-amber-500 hover:bg-amber-600 text-white"
                        }`}
                      >
                        {showPasswordFields ? "Cancel" : "Change Password"}
                      </button>
                    </div>

                    {showPasswordFields && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              type={showCurrentPassword ? "text" : "password"}
                              name="current_password"
                              value={passwordData.current_password}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-3 pr-12 border-2 border-amber-200 dark:border-amber-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                              placeholder="Enter your current password"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-amber-600"
                            >
                              {showCurrentPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              name="new_password"
                              value={passwordData.new_password}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-3 pr-12 border-2 border-amber-200 dark:border-amber-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                              placeholder="Enter your new password"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-amber-600"
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Password must be at least 8 characters long
                          </p>
                        </div>

                        {/* Update Password Button */}
                        <div className="pt-4">
                          <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !passwordData.current_password || !passwordData.new_password}
                            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200 w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                Updating Password...
                              </>
                            ) : (
                              <>
                                <Check className="h-5 w-5" />
                                Update Password
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Tips */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                      Quick Tips
                    </h4>
                    <ul className="text-gray-600 dark:text-gray-400 text-sm space-y-1">
                      <li>• Click the camera icon to update your profile picture</li>
                      <li>• Use a strong password with at least 8 characters</li>
                      <li>• Include numbers and special characters for extra security</li>
                      <li>• You can update your profile picture independently</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
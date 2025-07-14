import React, { useState } from "react";
import {
  CreditCard,
  Smartphone,
  DollarSign,
  Phone,
  User,
  Mail,
  Lock,
  Calendar,
  Building,
  MapPin,
  X,
} from "lucide-react";

const Payment = () => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [formData, setFormData] = useState({});

  const paymentMethods = [
    {
      id: "mpesa",
      name: "M-Pesa",
      icon: <Smartphone className="w-6 h-6" />,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
      buttonColor: "bg-green-600 hover:bg-green-700",
    },
    {
      id: "airtel",
      name: "Airtel Money",
      icon: <Smartphone className="w-6 h-6" />,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
      buttonColor: "bg-red-600 hover:bg-red-700",
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: <DollarSign className="w-6 h-6" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    {
      id: "card",
      name: "Debit Card",
      icon: <CreditCard className="w-6 h-6" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
    },
  ];

  const handlePaymentSelect = (paymentId) => {
    if (selectedPayment === paymentId) {
      setSelectedPayment(null);
    } else {
      setSelectedPayment(paymentId);
      setFormData({});
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Payment submitted:", {
      method: selectedPayment,
      data: formData,
    });
    alert(`Payment submitted via ${selectedPayment}!`);
  };

  const selectedMethod = paymentMethods.find(
    (method) => method.id === selectedPayment
  );

  const renderMpesaForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Phone className="w-4 h-4 inline mr-2" />
          Phone Number
        </label>
        <input
          type="tel"
          placeholder="e.g. +254700123456"
          value={formData.phone || ""}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Amount
        </label>
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-500 dark:text-gray-400">
            KES
          </span>
          <input
            type="number"
            placeholder="0.00"
            value={formData.amount || ""}
            onChange={(e) => handleInputChange("amount", e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-transform duration-300 hover:scale-105 ${selectedMethod.buttonColor}`}
      >
        Pay with M-Pesa
      </button>
    </form>
  );

  const renderAirtelForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Phone className="w-4 h-4 inline mr-2" />
          Airtel Phone Number
        </label>
        <input
          type="tel"
          placeholder="e.g. +254700123456"
          value={formData.phone || ""}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Amount
        </label>
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-500 dark:text-gray-400">
            KES
          </span>
          <input
            type="number"
            placeholder="0.00"
            value={formData.amount || ""}
            onChange={(e) => handleInputChange("amount", e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Lock className="w-4 h-4 inline mr-2" />
          Airtel Money PIN
        </label>
        <input
          type="password"
          placeholder="Enter your 4-digit PIN"
          maxLength="4"
          value={formData.pin || ""}
          onChange={(e) => handleInputChange("pin", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          required
        />
      </div>
      <button
        type="submit"
        className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-transform duration-300 hover:scale-105 ${selectedMethod.buttonColor}`}
      >
        Pay with Airtel Money
      </button>
    </form>
  );

  const renderPaypalForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Mail className="w-4 h-4 inline mr-2" />
          PayPal Email
        </label>
        <input
          type="email"
          placeholder="your-email@example.com"
          value={formData.email || ""}
          onChange={(e) => handleInputChange("email", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Lock className="w-4 h-4 inline mr-2" />
          PayPal Password
        </label>
        <input
          type="password"
          placeholder="Enter your PayPal password"
          value={formData.password || ""}
          onChange={(e) => handleInputChange("password", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Amount
        </label>
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-500 dark:text-gray-400">
            $
          </span>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.amount || ""}
            onChange={(e) => handleInputChange("amount", e.target.value)}
            className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-transform duration-300 hover:scale-105 ${selectedMethod.buttonColor}`}
      >
        Continue to PayPal
      </button>
    </form>
  );

  const renderCardForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <CreditCard className="w-4 h-4 inline mr-2" />
          Card Number
        </label>
        <input
          type="text"
          placeholder="1234 5678 9012 3456"
          maxLength="19"
          value={formData.cardNumber || ""}
          onChange={(e) => {
            const value = e.target.value
              .replace(/\s/g, "")
              .replace(/(.{4})/g, "$1 ")
              .trim();
            handleInputChange("cardNumber", value);
          }}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Expiry Date
          </label>
          <input
            type="text"
            placeholder="MM/YY"
            maxLength="5"
            value={formData.expiry || ""}
            onChange={(e) => {
              let value = e.target.value.replace(/\D/g, "");
              if (value.length >= 2) {
                value = value.substring(0, 2) + "/" + value.substring(2, 4);
              }
              handleInputChange("expiry", value);
            }}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Lock className="w-4 h-4 inline mr-2" />
            CVV
          </label>
          <input
            type="text"
            placeholder="123"
            maxLength="4"
            value={formData.cvv || ""}
            onChange={(e) =>
              handleInputChange("cvv", e.target.value.replace(/\D/g, ""))
            }
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <User className="w-4 h-4 inline mr-2" />
          Cardholder Name
        </label>
        <input
          type="text"
          placeholder="John Doe"
          value={formData.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <MapPin className="w-4 h-4 inline mr-2" />
          Billing Address
        </label>
        <input
          type="text"
          placeholder="123 Main Street, City, Country"
          value={formData.address || ""}
          onChange={(e) => handleInputChange("address", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          required
        />
      </div>
      <button
        type="submit"
        className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-transform duration-300 hover:scale-105 ${selectedMethod.buttonColor}`}
      >
        Pay with Debit Card
      </button>
    </form>
  );

  const renderPaymentForm = () => {
    switch (selectedPayment) {
      case "mpesa":
        return renderMpesaForm();
      case "airtel":
        return renderAirtelForm();
      case "paypal":
        return renderPaypalForm();
      case "card":
        return renderCardForm();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar - Payment Options */}
        <div className="w-full lg:w-80 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-gray-800 dark:to-gray-900 border-r border-yellow-200 dark:border-gray-700 p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Payment Options
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Choose your preferred payment method
            </p>
          </div>

          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => handlePaymentSelect(method.id)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  selectedPayment === method.id
                    ? `${method.bgColor} ${method.borderColor} shadow-lg`
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-yellow-300 dark:hover:border-yellow-600"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-lg ${method.bgColor} ${method.color}`}
                  >
                    {method.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      {method.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {method.id === "mpesa" && "Mobile Money"}
                      {method.id === "airtel" && "Mobile Money"}
                      {method.id === "paypal" && "Digital Wallet"}
                      {method.id === "card" && "Bank Card"}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        selectedPayment === method.id
                          ? `${method.borderColor} bg-current ${method.color}`
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content - Payment Forms */}
        <div className="flex-1 p-6 lg:p-12">
          {selectedMethod ? (
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-3 rounded-xl ${selectedMethod.bgColor} ${selectedMethod.color}`}
                  >
                    {selectedMethod.icon}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                      Pay with {selectedMethod.name}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                      Enter your {selectedMethod.name} details below
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-yellow-200 dark:border-gray-700 shadow-lg">
                {renderPaymentForm()}
              </div>

              <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center space-x-2">
                  <Lock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Your payment information is secure and encrypted
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CreditCard className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  Select Payment Method
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Choose your preferred payment option from the sidebar to start
                  making your payment.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;

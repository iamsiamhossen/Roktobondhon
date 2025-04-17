import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMobileAlt, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";

const PatientLogin = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("token", "patientToken");
    localStorage.setItem("role", "patient");
    navigate("/requester-dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-white p-6">
      <div className="w-full max-w-md mx-auto">
        {/* Form Container */}
        <form onSubmit={handleLogin} className="bg-white rounded-xl shadow-lg p-8 space-y-6 border border-red-100">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-red-600">রক্তবন্ধন</h1>
            <p className="text-gray-600 text-lg">জীবন বাঁচাতে রক্ত দিন,রক্ত নিন</p>
          </div>

          {/* Mobile Field */}
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">মোবাইল নম্বর</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaMobileAlt className="text-red-500 text-lg" />
              </div>
              <input
                type="tel"
                className="w-full pl-12 pr-4 py-3 text-lg border border-red-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-gray-50"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                pattern="[0-9]{11}"
                required
                placeholder="০১৭XXXXXXXX"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">পাসওয়ার্ড</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-red-500 text-lg" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full pl-12 pr-12 py-3 text-lg border border-red-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-gray-50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-red-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash className="text-xl" /> : <FaEye className="text-xl" />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-lg font-semibold rounded-lg shadow transition-all flex items-center justify-center space-x-2"
          >
            <FaSignInAlt />
            <span>লগইন করুন</span>
          </button>

          {/* Links */}
          <div className="flex flex-col space-y-3 pt-4 text-center">
            <a href="/Register" className="text-red-600 hover:text-red-800 text-md">
              নতুন একাউন্ট তৈরি করুন
            </a>
            <a href="/forgot-password" className="text-gray-600 hover:text-red-600 text-md">
              পাসওয়ার্ড ভুলে গেছেন?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientLogin;
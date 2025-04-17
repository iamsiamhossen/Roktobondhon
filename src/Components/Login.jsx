import React from "react";
import { FaUserInjured, FaHandHoldingHeart, FaUserShield, FaTint } from "react-icons/fa";
import PatientLogin from "../components/patient/PatientLogin";

const Login = () => {
  return (
    <div 
      className="flex justify-center items-center min-h-screen bg-[#fff9f9]"
      style={{ fontFamily: "'Kalpurush', 'SolaimanLipi', sans-serif" }}
    >
      <div className="p-8 bg-white rounded-2xl shadow-2xl border border-red-200 w-full max-w-md mx-4">
        {/* Header with blood drop icon */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <FaTint className="text-red-500 text-5xl animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold text-red-600 mb-1">রক্তবন্ধন</h1>
          <p className="text-red-400">জীবন বাঁচাতে রক্ত দিন,রক্ত নিন</p>
        </div>

        {/* Role Selection Buttons */}
        <div className="space-y-5">
          {/* Patient Login Button */}
          <button
            onClick={() => document.getElementById("patient_login_modal").showModal()}
            className="flex items-center justify-center w-full py-4 px-5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-md transition-all transform hover:scale-[1.02]"
          >
            <FaUserInjured className="mr-3 text-xl" />
            <span className="text-lg">রোগী লগইন</span>
          </button>

          {/* Donor Login Button */}
          <button
            disabled
            className="flex items-center justify-center w-full py-4 px-5 bg-white hover:bg-gray-50 text-red-600 border-2 border-red-400 rounded-xl shadow-sm transition-all transform hover:scale-[1.02] opacity-70 cursor-not-allowed"
          >
            <FaHandHoldingHeart className="mr-3 text-xl" />
            <span className="text-lg">রক্তদাতা লগইন</span>
            <span className="ml-2 text-sm">(শীঘ্রই আসছে)</span>
          </button>

          {/* Admin Login Button */}
          <button
            disabled
            className="flex items-center justify-center w-full py-4 px-5 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-xl shadow-md opacity-70 cursor-not-allowed"
          >
            <FaUserShield className="mr-3 text-xl" />
            <span className="text-lg">অ্যাডমিন লগইন</span>
            <span className="ml-2 text-sm">(শীঘ্রই আসছে)</span>
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>রক্তের প্রয়োজনে কল করুন: <span className="text-red-600 font-bold">০১৭XX-XXXXXX</span></p>
        </div>

        {/* Patient Login Modal */}
        <dialog id="patient_login_modal" className="modal modal-bottom sm:modal-middle">
  <div className="modal-box bg-white p-0 overflow-hidden w-full sm:max-w-md md:max-w-lg rounded-t-3xl sm:rounded-2xl border-2 border-red-200 shadow-xl">
    {/* Header */}
    <div className="bg-red-600 p-4 sm:p-5 text-white">
      <h3 className="font-bold text-xl sm:text-2xl flex items-center justify-center">
        <FaUserInjured className="mr-2 sm:mr-3 text-lg sm:text-xl" />
        রোগী লগইন
      </h3>
    </div>
    
    {/* Content - Will grow dynamically */}
    <div className="p-4 sm:p-8 max-h-[70vh] overflow-y-auto">
      <PatientLogin />
    </div>
    
    {/* Footer */}
    <div className="modal-action p-4 sm:p-5 bg-gray-50 border-t border-gray-200 sticky bottom-0">
      <form method="dialog" className="w-full flex justify-center">
        <button className="btn bg-white text-red-600 hover:bg-red-50 border border-red-200 px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg w-full sm:w-auto">
          বন্ধ করুন
        </button>
      </form>
    </div>
  </div>
  
  {/* Backdrop */}
  <form method="dialog" className="modal-backdrop bg-black/50">
    <button>close</button>
  </form>
</dialog>
      </div>
    </div>
  );
};

export default Login;
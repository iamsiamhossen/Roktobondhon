import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { FaEnvelope, FaCheckCircle, FaArrowRight } from 'react-icons/fa';

const VerifyEmail = () => {
  const navigate = useNavigate();

  const resendVerification = async () => {
    try {
      await auth.currentUser?.sendEmailVerification();
      alert('ভেরিফিকেশন ইমেইল আবার পাঠানো হয়েছে! আপনার ইমেইল চেক করুন।');
    } catch (error) {
      console.error('ইমেইল পাঠাতে সমস্যা:', error);
      alert('ইমেইল পাঠাতে সমস্যা হয়েছে: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 p-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <FaEnvelope className="text-green-600 text-2xl" />
        </div>
        
        <h2 className="text-2xl font-bold text-black mb-2">ইমেইল ভেরিফিকেশন প্রয়োজন</h2>
        
        <p className="text-gray-600 mb-6">
          রেজিস্ট্রেশন সফল হয়েছে! আমরা আপনার ইমেইল ঠিকানায় একটি ভেরিফিকেশন লিঙ্ক পাঠিয়েছি। 
          দয়া করে আপনার ইমেইল চেক করুন এবং লিঙ্কে ক্লিক করে আপনার অ্যাকাউন্ট ভেরিফাই করুন।
        </p>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
          <p className="text-black flex items-start">
            <FaCheckCircle className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
            <span>ইমেইল ভেরিফিকেশন সম্পন্ন করার পর আপনি লগইন করতে পারবেন</span>
          </p>
        </div>
        
        <div className="flex flex-col space-y-3">
          <button
            onClick={resendVerification}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ইমেইল আবার পাঠান
          </button>
          
          <button
            onClick={() => {
              auth.signOut(); // ইউজারকে লগআউট করানো
              navigate('/login'); // লগইন পেজে রিডাইরেক্ট
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
          >
            লগইন পেজে যান <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTint, FaHospital, FaExclamationTriangle, FaCommentAlt, FaPaperPlane, FaPhone } from 'react-icons/fa';
import { db } from '../firebase'; // Ensure you have firebase config setup

const PostRequestPage = () => {
  const [formData, setFormData] = useState({
    bloodType: '',
    hospital: '',
    urgency: '',
    message: '',
    contactNumber: '',
    requiredDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const { bloodType, hospital, urgency, contactNumber, requiredDate } = formData;
    const errors = [];
    
    if (!bloodType) errors.push('রক্তের গ্রুপ নির্বাচন করুন');
    if (!hospital) errors.push('হাসপাতালের নাম লিখুন');
    if (!urgency) errors.push('জরুরিতা নির্বাচন করুন');
    if (!contactNumber) errors.push('যোগাযোগ নম্বর লিখুন');
    if (!requiredDate) errors.push('রক্ত প্রয়োজন তারিখ নির্বাচন করুন');
    
    // Bangladeshi phone number validation
    if (contactNumber && !/^(?:\+88|01)[0-9]{9}$/.test(contactNumber)) {
      errors.push('সঠিক মোবাইল নম্বর লিখুন (যেমন: 01712345678)');
    }
    
    // Date validation (must be today or future)
    if (requiredDate && new Date(requiredDate) < new Date().setHours(0,0,0,0)) {
      errors.push('আজ বা ভবিষ্যতের তারিখ নির্বাচন করুন');
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (errors.length > 0) {
      alert(`দয়া করে নিচের সমস্যাগুলো সমাধান করুন:\n\n${errors.join('\n')}`);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newRequest = {
        ...formData,
        contactNumber: formData.contactNumber.replace(/\D/g, ''), // Remove non-digits
        timestamp: new Date().toISOString(),
        status: 'pending',
        neededBy: new Date(formData.requiredDate).toISOString()
      };

      await db.collection('bloodRequests').add(newRequest);
      
      alert('আপনার রক্তের অনুরোধ সফলভাবে জমা হয়েছে!');
      navigate('/requestlist');
    } catch (error) {
      console.error("রিকোয়েস্ট জমা দিতে সমস্যা:", error);
      alert('রিকোয়েস্ট জমা দিতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 py-8 px-4 font-kalpurush">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-red-600 flex items-center justify-center gap-2">
            <FaTint className="text-red-500" />
            রক্তের অনুরোধ পোস্ট করুন
          </h2>
          <p className="text-gray-600 mt-2">আপনার রক্তের প্রয়োজনীয়তা শেয়ার করুন</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Blood Type */}
          <div className="relative">
            <label htmlFor="bloodType" className="block text-sm font-medium text-black mb-1">
              <FaTint className="inline mr-2 text-red-400" />
              রক্তের গ্রুপ *
            </label>
            <select
              id="bloodType"
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 text-black"
              required
            >
              <option value="">রক্তের গ্রুপ নির্বাচন করুন</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          {/* Hospital */}
          <div className="relative">
            <label htmlFor="hospital" className="block text-sm font-medium text-gray-700 mb-1">
              <FaHospital className="inline mr-2 text-red-400" />
              হাসপাতালের নাম *
            </label>
            <input
              type="text"
              id="hospital"
              name="hospital"
              value={formData.hospital}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 text-black"
              placeholder="যেমন: সিরাজগঞ্জ জেনারেল হাসপাতাল"
              required
            />
          </div>

          {/* Contact Number */}
          <div className="relative">
            <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
              <FaPhone className="inline mr-2 text-red-400" />
              যোগাযোগ নম্বর *
            </label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 text-black"
              placeholder="যেমন: ০১৭১২৩৪৫৬৭৮"
              required
            />
          </div>

          {/* Urgency */}
          <div className="relative">
            <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-1">
              <FaExclamationTriangle className="inline mr-2 text-red-400" />
              জরুরিতা *
            </label>
            <select
              id="urgency"
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 text-black"
              required
            >
              <option value="">জরুরিতা নির্বাচন করুন</option>
              <option value="জীবন-মরণ (২৪ ঘণ্টার মধ্যে)">জীবন-মরণ (২৪ ঘণ্টার মধ্যে)</option>
              <option value="জরুরি (৪৮ ঘণ্টার মধ্যে)">জরুরি (৪৮ ঘণ্টার মধ্যে)</option>
              <option value="সাধারণ (৭ দিনের মধ্যে)">সাধারণ (৭ দিনের মধ্যে)</option>
            </select>
          </div>

          {/* Required Date */}
          <div className="relative">
            <label htmlFor="requiredDate" className="block text-sm font-medium text-gray-700 mb-1">
              🗓️ রক্ত প্রয়োজন তারিখ *
            </label>
            <input
              type="date"
              id="requiredDate"
              name="requiredDate"
              value={formData.requiredDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 text-black"
              required
            />
          </div>

          {/* Additional Message */}
          <div className="relative">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              <FaCommentAlt className="inline mr-2 text-red-400" />
              অতিরিক্ত তথ্য (ঐচ্ছিক)
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 text-black"
              placeholder="যেমন: অস্ত্রোপচারের জন্য রক্ত প্রয়োজন, রোগীর বর্তমান অবস্থা ইত্যাদি"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-all flex items-center justify-center gap-2 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                জমা হচ্ছে...
              </>
            ) : (
              <>
                <FaPaperPlane />
                অনুরোধ পাঠান
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>* চিহ্নিত ফিল্ডগুলো আবশ্যক</p>
          <p className="mt-1">আপনার অনুরোধ আমাদের ডাটাবেসে সংরক্ষিত হবে এবং প্রাসঙ্গিক রক্তদাতাদের কাছে পৌঁছে দেওয়া হবে</p>
        </div>
      </div>
    </div>
  );
};

export default PostRequestPage;
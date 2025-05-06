import React, { useState } from 'react';
import { 
  FaCheckCircle, 
  FaEnvelope, 
  FaUser, 
  FaPhone, 
  FaTint,
  FaVenusMars,
  FaWeight,
  FaMapMarkerAlt,
  FaIdCard,
  FaCalendarAlt,
  FaLock,
  FaNotesMedical
} from 'react-icons/fa';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DonorRegister = () => {
  const sirajganjUpazilas = [
    "সিরাজগঞ্জ সদর",
    "বেলকুচি",
    "চৌহালি",
    "কামারখন্দ",
    "কাজীপুর",
    "রায়গঞ্জ",
    "শাহজাদপুর",
    "তাড়াশ",
    "উল্লাপাড়া"
  ];

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    bloodType: 'A+',
    gender: 'male',
    dob: null,
    weight: '',
    location: '',
    nid: '',
    lastDonation: null,
    healthConditions: '',
    isAvailable: true
  });

  const [errors, setErrors] = useState({});
  const [registrationStatus, setRegistrationStatus] = useState({
    loading: false,
    success: false,
    error: null
  });

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'পূর্ণ নাম প্রয়োজন';
    if (!formData.email.trim()) newErrors.email = 'ইমেইল প্রয়োজন';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'সঠিক ইমেইল দিন';
    
    if (!formData.password) newErrors.password = 'পাসওয়ার্ড প্রয়োজন';
    else if (formData.password.length < 6) newErrors.password = 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর দীর্ঘ হতে হবে';
    
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'পাসওয়ার্ড মেলে না';
    if (!formData.phone) newErrors.phone = 'মোবাইল নম্বর প্রয়োজন';
    if (!formData.dob) newErrors.dob = 'জন্ম তারিখ প্রয়োজন';
    if (!formData.weight) newErrors.weight = 'ওজন প্রয়োজন';
    if (!formData.location) newErrors.location = 'অবস্থান প্রয়োজন';
    if (!formData.nid) newErrors.nid = 'জাতীয় ID প্রয়োজন';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setRegistrationStatus({ loading: true, success: false, error: null });

    try {
      // 1. Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // 2. Send verification email
      await sendEmailVerification(user);

      // 3. Prepare donor data
      const donorData = {
        uid: user.uid,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        bloodType: formData.bloodType,
        gender: formData.gender,
        dob: formData.dob ? formData.dob.toISOString() : null,
        weight: parseFloat(formData.weight),
        location: formData.location,
        nid: formData.nid,
        lastDonation: formData.lastDonation ? formData.lastDonation.toISOString() : null,
        healthConditions: formData.healthConditions,
        isAvailable: formData.isAvailable,
        status: "active",
        userType: "donor",
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        emailVerified: false,
        donationCount: 0,
        achievements: [
          { title: "নতুন রক্তদাতা", icon: "new", level: 1, date: new Date().toISOString() }
        ]
      };

      // 4. Save to Firestore
      await setDoc(doc(db, "donors", user.uid), donorData);

      // 5. Redirect to verification page
      setRegistrationStatus({ 
        loading: false, 
        success: true, 
        error: null 
      });
      
      // Redirect to verification page
      navigate('/verify-email');

    } catch (error) {
      console.error('Registration error:', error);
      setRegistrationStatus({
        loading: false,
        success: false,
        error: getErrorMessage(error)
      });
    }
  };

  const getErrorMessage = (error) => {
    switch(error.code) {
      case 'auth/email-already-in-use':
        return 'এই ইমেইলটি ইতিমধ্যে ব্যবহৃত হয়েছে';
      case 'auth/weak-password':
        return 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর দীর্ঘ হতে হবে';
      case 'auth/invalid-email':
        return 'অবৈধ ইমেইল ঠিকানা';
      default:
        return error.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।';
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (registrationStatus.success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-50 mb-4">
            <FaCheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            রেজিস্ট্রেশন সফল!
          </h2>
          <p className="text-gray-600 mb-6">
            আপনার ইমেইলে ভেরিফিকেশন লিঙ্ক পাঠানো হয়েছে। দয়া করে ইমেইল ভেরিফাই করুন।
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            লগইন পেজে যান
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-red-700 p-8 text-white text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <FaTint className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold">রক্তদাতা রেজিস্ট্রেশন</h1>
          <p className="text-red-100 mt-2">জীবন বাঁচাতে আপনার তথ্য প্রদান করুন</p>
        </div>

        {/* Form Content */}
        <div className="p-8">
          {registrationStatus.error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border-l-4 border-red-500">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{registrationStatus.error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <FaUser className="mr-3 text-red-600" />
                ব্যক্তিগত তথ্য
              </h3>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  পূর্ণ নাম <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300 text-black placeholder- grey'
                    }`}
                    placeholder="আপনার পূর্ণ নাম"
                  />
                </div>
                {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ইমেইল <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300  text-black placeholder- grey'
                    }`}
                    placeholder="আপনার ইমেইল ঠিকানা"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  পাসওয়ার্ড <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      errors.password ? 'border-red-500' : 'border-gray-300  text-black placeholder- grey'
                    }`}
                    placeholder="পাসওয়ার্ড লিখুন"
                  />
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  পাসওয়ার্ড নিশ্চিত করুন <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300  text-black placeholder- grey'
                    }`}
                    placeholder="পাসওয়ার্ড আবার লিখুন"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  মোবাইল নম্বর <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 11);
                      setFormData(prev => ({ ...prev, phone: value }));
                      if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                    }}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300  text-black placeholder- grey'
                    }`}
                    placeholder="01XXXXXXXXX"
                  />
                </div>
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>
            </div>

            {/* Medical Information Section */}
            <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <FaNotesMedical className="mr-3 text-red-600" />
                চিকিৎসা তথ্য
              </h3>

              {/* Blood Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  রক্তের গ্রুপ <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <FaTint className="absolute left-3 top-3 text-gray-400" />
                  <select
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500  text-black placeholder- grey"
                  >
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
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  লিঙ্গ <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <FaVenusMars className="absolute left-3 top-3 text-gray-400" />
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500  text-black placeholder- grey"
                  >
                    <option value="male">পুরুষ</option>
                    <option value="female">মহিলা</option>
                    <option value="other">অন্যান্য</option>
                  </select>
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  জন্ম তারিখ <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                  <DatePicker
                    selected={formData.dob}
                    onChange={(date) => {
                      setFormData(prev => ({ ...prev, dob: date }));
                      if (errors.dob) setErrors(prev => ({ ...prev, dob: '' }));
                    }}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="দিন/মাস/বছর"
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      errors.dob ? 'border-red-500' : 'border-gray-300  text-black placeholder- grey'
                    }`}
                    showYearDropdown
                    dropdownMode="select"
                    maxDate={new Date()}
                    yearDropdownItemNumber={100}
                    scrollableYearDropdown
                  />
                </div>
                {errors.dob && <p className="mt-1 text-sm text-red-600">{errors.dob}</p>}
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ওজন (কেজি) <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <FaWeight className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || (parseFloat(value) >= 40 && parseFloat(value) <= 150)) {
                        setFormData(prev => ({ ...prev, weight: value }));
                        if (errors.weight) setErrors(prev => ({ ...prev, weight: '' }));
                      }
                    }}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      errors.weight ? 'border-red-500' : 'border-gray-300  text-black placeholder- grey'
                    }`}
                    placeholder="ওজন কেজিতে"
                    min="40"
                    max="150"
                  />
                </div>
                {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight}</p>}
              </div>

              {/* Last Donation Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ">
                  শেষ রক্তদানের তারিখ
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                  <DatePicker
                    selected={formData.lastDonation}
                    onChange={(date) => setFormData(prev => ({ ...prev, lastDonation: date }))}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="দিন/মাস/বছর"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500  text-black placeholder- grey"
                    showYearDropdown
                    dropdownMode="select"
                    maxDate={new Date()}
                    yearDropdownItemNumber={10}
                    scrollableYearDropdown
                  />
                </div>
              </div>

              {/* Health Conditions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  স্বাস্থ্য সম্পর্কিত তথ্য
                </label>
                <div className="relative">
                  <FaNotesMedical className="absolute left-3 top-3 text-gray-400" />
                  <textarea
                    name="healthConditions"
                    value={formData.healthConditions}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500  text-black placeholder- grey"
                    rows="3"
                    placeholder="যেকোনো স্বাস্থ্য সমস্যা বা অ্যালার্জির বিবরণ"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Location & Verification */}
            <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <FaMapMarkerAlt className="mr-3 text-red-600" />
                অবস্থান ও যাচাইকরণ
              </h3>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  আপনার এলাকা <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                  <select
                    name="location"
                    value={formData.location}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, location: e.target.value }));
                      if (errors.location) setErrors(prev => ({ ...prev, location: '' }));
                    }}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      errors.location ? 'border-red-500' : 'border-gray-300  text-black placeholder- grey'
                    }`}
                  >
                    <option value="">উপজেলা নির্বাচন করুন</option>
                    {sirajganjUpazilas.map((upazila, index) => (
                      <option key={index} value={upazila}>{upazila}</option>
                    ))}
                  </select>
                </div>
                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
              </div>

              {/* NID Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  জাতীয় ID নম্বর <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <FaIdCard className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="nid"
                    value={formData.nid}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, nid: e.target.value }));
                      if (errors.nid) setErrors(prev => ({ ...prev, nid: '' }));
                    }}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      errors.nid ? 'border-red-500' : 'border-gray-300  text-black placeholder- grey'
                    }`}
                    placeholder="জাতীয় ID নম্বর"
                  />
                </div>
                {errors.nid && <p className="mt-1 text-sm text-red-600">{errors.nid}</p>}
              </div>

              {/* Availability Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded  text-black placeholder- grey"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  জরুরী অবস্থায় আমাকে কল করতে পারেন
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={registrationStatus.loading}
                className={`w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                  registrationStatus.loading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {registrationStatus.loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    প্রক্রিয়াকরণ হচ্ছে...
                  </>
                ) : (
                  'রেজিস্ট্রেশন সম্পন্ন করুন'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DonorRegister;
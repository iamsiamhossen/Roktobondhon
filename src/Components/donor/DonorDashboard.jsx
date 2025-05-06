
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, FaPhone, FaTint, FaMapMarkerAlt, FaIdCard, FaHistory, 
  FaVenusMars, FaBirthdayCake, FaWeight, FaNotesMedical, FaHeartbeat, 
  FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaEdit, FaPlus, 
  FaChartLine, FaSearch, FaRegCalendarCheck, FaAward, FaBell, FaSave,
  FaChartPie, FaUserShield, FaCertificate, FaRegClock, FaSignOutAlt
} from 'react-icons/fa';
import { GiHealthNormal, GiDrop } from 'react-icons/gi';
import { db } from '../firebase'; // Adjust the path as needed
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const DonorProfile = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  // Fetch donor data from Firestore
  useEffect(() => {
    const fetchDonorData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
            const donorRef = doc(db, 'donors', user.uid);
            const donorSnap = await getDoc(donorRef);
            
            if (donorSnap.exists()) {
                const donorData = donorSnap.data();
                setDonor(donorData);
                setFormData(donorData);
            } else {
                console.log("No donor data found");
            }
        }
      } catch (error) {
        console.error("Error fetching donor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonorData();
  }, [auth.currentUser]);

  // Calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const diff = Date.now() - birthDate.getTime();
    const age = new Date(diff); 
    return Math.abs(age.getUTCFullYear() - 1970);
  };

  // Check eligibility based on last donation date
  const isEligible = () => {
    if (!donor?.lastDonation) return true;
    const lastDonation = new Date(donor.lastDonation);
    const nextDonation = new Date(lastDonation.setMonth(lastDonation.getMonth() + 3));
    return new Date() > nextDonation;
  };

  // Stats data
  const stats = [
    { label: "মোট রক্তদান", value: donor?.donationHistory?.length || 0, icon: <GiDrop className="text-xl" />, trend: "up" },
    { label: "সর্বশেষ দান", value: donor?.lastDonation ? formatDate(donor.lastDonation) : "N/A", icon: <FaRegCalendarCheck className="text-xl" /> },
    { label: "রেটিং", value: "৪.৮/৫", icon: <FaAward className="text-xl" /> },
    { label: "সাহায্য করেছেন", value: "১২ জন", icon: <FaUserShield className="text-xl" />, trend: "up" }
  ];

  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('bn-BD', options);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const donorRef = doc(db, 'donors', user.uid);
        await updateDoc(donorRef, formData);
        setDonor(formData);
        setEditMode(false);
      }
    } catch (error) {
      console.error("Error updating donor profile:", error);
    }
  };

  const toggleAvailability = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const updatedDonor = {...donor, isAvailable: !donor.isAvailable};
        const donorRef = doc(db, 'donors', user.uid);
        await updateDoc(donorRef, { isAvailable: updatedDonor.isAvailable });
        setDonor(updatedDonor);
      }
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">ডাটা লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!donor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <GiDrop className="text-5xl text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">ডাটা পাওয়া যায়নি</h2>
          <p className="mb-4">আপনার প্রোফাইল ডাটা লোড করতে সমস্যা হচ্ছে। অনুগ্রহ করে আবার চেষ্টা করুন।</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            রিফ্রেশ করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-kalpurush">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-700 to-red-800 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center">
            <GiDrop className="mr-2" />
            রক্তদাতা ড্যাশবোর্ড
          </h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
              <FaBell className="text-lg" />
            </button>
            <button 
              onClick={() => navigate('/logout')}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              <FaSignOutAlt className="text-lg" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
            <div className="flex flex-col md:flex-row items-start md:items-center">
              <div className="relative mb-4 md:mb-0 md:mr-6">
                <img
                  src={donor.profilePhoto || "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?t=st=1745082955~exp=1745086555~hmac=6e4143282a4fddb1cbdfd4a360945edf6ae96a3199f9bd0d69733ccfc8fe5fa8&w=826"}
                  alt={donor.fullName}
                  className="w-24 h-24 rounded-full border-4 border-white/50 object-cover shadow-lg"
                />
                <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md">
                  <GiHealthNormal className="text-red-600" />
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{donor.fullName}</h1>
                <div className="flex flex-wrap items-center mt-2 gap-4">
                  <div className="flex items-center bg-white/20 px-3 py-1 rounded-full">
                    <FaTint className="mr-2" />
                    <span className="font-medium">রক্তের গ্রুপ: {donor.bloodType}</span>
                  </div>
                  <div className="flex items-center bg-white/20 px-3 py-1 rounded-full">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{donor.location}</span>
                  </div>
                  <div className={`flex items-center px-3 py-1 rounded-full ${donor.isAvailable ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    {donor.isAvailable ? (
                      <FaCheckCircle className="mr-2 text-green-300" />
                    ) : (
                      <FaTimesCircle className="mr-2 text-red-300" />
                    )}
                    <span>{donor.isAvailable ? 'প্রস্তুত রক্তদান করতে' : 'বর্তমানে অপ্রস্তুত'}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setEditMode(!editMode)}
                className="mt-4 md:mt-0 px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-gray-100 transition flex items-center"
              >
                <FaEdit className="mr-2" /> {editMode ? 'এডিট বন্ধ করুন' : 'প্রোফাইল এডিট'}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center text-black">
                <FaChartPie className="mr-2 text-red-500" /> পরিসংখ্যান
              </h2>
              <div className="space-y-4">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="p-3 rounded-full mr-4 bg-red-100 text-red-600">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                      <p className="text-lg font-bold text-gray-800">
                        {stat.value}
                        {stat.trend && (
                          <span className={`ml-2 text-xs ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                            {stat.trend === 'up' ? '↑' : '↓'}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center text-black">
                <FaCertificate className="mr-2 text-amber-500" /> অর্জনসমূহ
              </h2>
              <div className="space-y-3">
                {donor.achievements?.map((achievement, index) => (
                  <div key={index} className="flex items-center p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <div className="p-2 rounded-full mr-3 bg-amber-100 text-amber-600">
                      {achievement.icon}
                    </div>
                    <div>
                      <p className="font-medium">{achievement.title}</p>
                      <div className="flex mt-1">
                        {[...Array(3)].map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-3 h-3 rounded-full mr-1 ${i < achievement.level ? 'bg-amber-500' : 'bg-amber-200'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                <button className="w-full mt-3 text-sm text-amber-600 hover:underline flex items-center justify-center">
                  সব অর্জন দেখুন <FaPlus className="ml-1 text-xs" />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center text-black">
                <FaRegClock className="mr-2 text-blue-500" /> দ্রুত অ্যাকশন
              </h2>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/requests')}
                  className="w-full p-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg flex items-center justify-center hover:from-red-600 hover:to-red-700 transition"
                >
                  <FaSearch className="mr-2" /> রক্তপ্রার্থী খুঁজুন
                </button>
                <button 
                  onClick={() => navigate('/donor/dashboard/add-donation')}
                  className="w-full p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg flex items-center justify-center hover:from-green-600 hover:to-green-700 transition"
                >
                  <FaPlus className="mr-2" /> রক্তদান যোগ করুন
                </button>
                <button 
                  onClick={toggleAvailability}
                  className={`w-full p-3 rounded-lg flex items-center justify-center transition ${donor.isAvailable ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                >
                  {donor.isAvailable ? (
                    <>
                      <FaTimesCircle className="mr-2" /> অপ্রস্তুত করুন
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="mr-2" /> প্রস্তুত করুন
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Edit or Overview */}
            {editMode ? (
              <div className="bg-white rounded-2xl shadow-lg p-6 text-black">
                <h2 className="text-xl font-bold mb-6 flex items-center">
                  <FaEdit className="mr-2 text-red-500" /> প্রোফাইল এডিট করুন
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">পুরো নাম</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName || ''}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">মোবাইল নম্বর</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">রক্তের গ্রুপ</label>
                    <select
                      name="bloodType"
                      value={formData.bloodType || ''}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">জন্ম তারিখ</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob || ''}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ওজন (কেজি)</label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight || ''}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ঠিকানা</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location || ''}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">স্বাস্থ্য তথ্য</label>
                    <textarea
                      name="healthConditions"
                      value={formData.healthConditions || ''}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    বাতিল করুন
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center"
                  >
                    <FaSave className="mr-2" /> সেভ করুন
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Personal Information */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 text-white">
                    <h2 className="text-xl font-bold flex items-center">
                      <FaUser className="mr-2" /> ব্যক্তিগত তথ্য
                    </h2>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start">
                      <div className="bg-gray-100 p-3 rounded-full mr-4">
                        <FaPhone className="text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">মোবাইল নম্বর</p>
                        <p className="font-medium text-gray-800">{donor.phone || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-gray-100 p-3 rounded-full mr-4">
                        <FaVenusMars className="text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">লিঙ্গ</p>
                        <p className="font-medium text-gray-800">
                          {donor.gender === 'male' ? 'পুরুষ' : donor.gender === 'female' ? 'মহিলা' : 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-gray-100 p-3 rounded-full mr-4">
                        <FaBirthdayCake className="text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">জন্ম তারিখ</p>
                        <p className="font-medium text-gray-800">
                          {donor.dob ? `${formatDate(donor.dob)} (${calculateAge(donor.dob)} বছর)` : 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-gray-100 p-3 rounded-full mr-4">
                        <FaIdCard className="text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">জাতীয় ID</p>
                        <p className="font-medium text-gray-800">{donor.nid || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 text-white">
                    <h2 className="text-xl font-bold flex items-center">
                      <FaHeartbeat className="mr-2" /> চিকিৎসা তথ্য
                    </h2>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start">
                      <div className="bg-gray-100 p-3 rounded-full mr-4">
                        <FaWeight className="text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">ওজন</p>
                        <p className="font-medium text-gray-800">{donor.weight ? `${donor.weight} কেজি` : 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-gray-100 p-3 rounded-full mr-4">
                        <FaCalendarAlt className="text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">শেষ রক্তদান</p>
                        <p className="font-medium text-gray-800">{donor.lastDonation ? formatDate(donor.lastDonation) : 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className={`p-3 rounded-full mr-4 ${isEligible() ? 'bg-green-100' : 'bg-yellow-100'}`}>
                        {isEligible() ? 
                          <FaCheckCircle className="text-green-600" /> : 
                          <FaTimesCircle className="text-yellow-600" />
                        }
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">রক্তদানের উপযোগিতা</p>
                        <p className={`font-medium ${isEligible() ? 'text-green-600' : 'text-yellow-600'}`}>
                          {isEligible() ? 'রক্তদানে সক্ষম' : 'পরবর্তী ৩ মাস অপেক্ষা করুন'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-gray-100 p-3 rounded-full mr-4">
                        <FaNotesMedical className="text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">স্বাস্থ্য তথ্য</p>
                        <p className="font-medium text-gray-800">{donor.healthConditions || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Donation History */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden ">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 text-white">
                <h2 className="text-xl font-bold flex items-center">
                  <FaTint className="mr-2" /> রক্তদানের ইতিহাস
                </h2>
              </div>
              <div className="p-6">
                {donor.donationHistory?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-4">তারিখ</th>
                          <th className="text-left p-4">স্থান</th>
                          <th className="text-left p-4">রক্তের গ্রুপ</th>
                          <th className="text-left p-4">স্ট্যাটাস</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {donor.donationHistory.map((donation, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="p-4">{donation.date}</td>
                            <td className="p-4">{donation.location}</td>
                            <td className="p-4">{donation.bloodType}</td>
                            <td className="p-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${donation.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {donation.verified ? 'যাচাইকৃত' : 'অপেক্ষমান'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <GiDrop className="text-4xl mx-auto text-gray-300 mb-4" />
                    <p className="text-lg">আপনার কোনো রক্তদানের ইতিহাস পাওয়া যায়নি</p>
                    <button 
                      onClick={() => navigate('/donor/dashboard/add-donation')}
                      className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                    >
                      প্রথম রক্তদান রেকর্ড করুন
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorProfile;
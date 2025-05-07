import { FaTint, FaHospitalAlt, FaUser, FaPhone, FaCalendarAlt, FaSearch, 
  FaInfoCircle, FaExclamationTriangle, FaSync, FaMapMarkerAlt, FaHeart } from "react-icons/fa";
import { GiHeartBeats, GiBlood } from "react-icons/gi";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from '../firebase';
import { formatToBengaliDate } from '../Components/requestUtils';

const RequestList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedUrgency, setSelectedUrgency] = useState("");
  const [callingNumber, setCallingNumber] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sirajganj locations
  const sirajganjLocations = [
    "সিরাজগঞ্জ সদর",
    "বেলকুচি",
    "চৌহালী",
    "কামারখন্দ",
    "কাজীপুর",
    "রায়গঞ্জ",
    "শাহজাদপুর",
    "তাড়াশ",
    "উল্লাপাড়া"
  ];

  const fetchRequests = async () => {
    try {
      const q = query(
        collection(db, "bloodRequests"),
        orderBy("timestamp", "desc")
      );

      const querySnapshot = await getDocs(q);

      const requestsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        neededBy: formatToBengaliDate(doc.data().neededBy),
        postedDate: formatToBengaliDate(doc.data().timestamp)
      }));

      setRequests(requestsData);
    } catch (error) {
      console.error("রিকোয়েস্ট লোড করতে সমস্যা:", error);
      alert('রিকোয়েস্ট লোড করতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন');
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (phoneNumber) => {
    setCallingNumber(phoneNumber);
    const cleanNumber = phoneNumber.replace(/\D/g, '').replace(/^0/, '+880');
    window.open(`tel:${cleanNumber}`);
    setTimeout(() => setCallingNumber(null), 3000);
  };

  const handleRefresh = async () => {
    setLoading(true);
    await fetchRequests();
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                     request.hospital?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBloodGroup = selectedBloodGroup ? request.bloodType === selectedBloodGroup : true;
    const matchesLocation = selectedLocation ? request.hospitalLocation === selectedLocation : true;
    const matchesUrgency = selectedUrgency ? 
                     (selectedUrgency === "emergency" ? request.urgency?.includes('জরুরি') : 
                      !request.urgency?.includes('জরুরি')) : true;

    return matchesSearch && matchesBloodGroup && matchesLocation && matchesUrgency;
  });

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-red-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-600">রক্তের অনুরোধ লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 font-kalpurush text-black">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-8 text-center"
      >
        <div className="inline-flex items-center justify-center mb-4">
          <GiHeartBeats className="text-5xl text-red-500 mr-3" />
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-800">
            রক্তের অনুরোধসমূহ
          </h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          সিরাজগঞ্জ জেলার সাম্প্রতিক রক্তের অনুরোধসমূহ - জীবন বাঁচাতে সাহায্য করুন
        </p>
      </motion.div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="রোগীর নাম বা হাসপাতাল খুঁজুন..."
                className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-black bg-gray-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
            </div>
            
            <select
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-black bg-gray-50"
              value={selectedBloodGroup}
              onChange={(e) => setSelectedBloodGroup(e.target.value)}
            >
              <option value="">সব রক্তের গ্রুপ</option>
              {bloodGroups.map(group => (
                <option key={group} value={group} className="text-black">{group}</option>
              ))}
            </select>
            
            <select
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-black bg-gray-50"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">সব অবস্থান</option>
              {sirajganjLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>

            <select
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-black bg-gray-50"
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
            >
              <option value="">সব ধরনের অনুরোধ</option>
              <option value="emergency">জরুরি অনুরোধ</option>
              <option value="normal">সাধারণ অনুরোধ</option>
            </select>
          </div>

          <div className="flex justify-between mt-4">
            <button 
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg flex items-center gap-2 hover:bg-blue-100 transition-colors"
            >
              <FaSync className="text-blue-500" /> রিফ্রেশ করুন
            </button>

            {(selectedBloodGroup || selectedLocation || selectedUrgency || searchTerm) && (
              <button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedBloodGroup("");
                  setSelectedLocation("");
                  setSelectedUrgency("");
                }}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                ফিল্টার রিসেট করুন
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl p-4 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3">
              <div className="text-2xl font-bold">{requests.length}</div>
              <div className="text-sm opacity-80">মোট অনুরোধ</div>
            </div>
            <div className="p-3">
              <div className="text-2xl font-bold">
                {requests.filter(r => r.urgency?.includes('জরুরি')).length}
              </div>
              <div className="text-sm opacity-80">জরুরি অনুরোধ</div>
            </div>
            <div className="p-3">
              <div className="text-2xl font-bold">
                {new Set(requests.map(r => r.bloodType)).size}
              </div>
              <div className="text-sm opacity-80">বিভিন্ন রক্তের গ্রুপ</div>
            </div>
            <div className="p-3">
              <div className="text-2xl font-bold">
                {new Set(requests.map(r => r.location)).size}
              </div>
              <div className="text-sm opacity-80">অবস্থান</div>
            </div>
          </div>
        </div>
      </div>

      {/* Request Cards */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredRequests.length > 0 ? (
          filteredRequests.map((req) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5 }}
              className={`bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 ${
                req.urgency?.includes('জরুরি') ? 'ring-2 ring-red-400' : ''
              }`}
            >
              {/* Blood Group Ribbon */}
              <div className="absolute top-4 right-4">
                <div className="relative">
                  <div className="bg-red-600 text-white px-3 py-1 rounded-full shadow-md flex items-center">
                    <GiBlood className="mr-1" />
                    <span className="font-bold">{req.bloodType}</span>
                  </div>
                  {req.urgency?.includes('জরুরি') && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                      জরুরি
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                {/* Patient Info */}
                <div className="flex items-start mb-4">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <FaUser className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {req.patientName || 'অজ্ঞাত'}
                    </h3>
                    <p className="text-gray-500 text-sm">রোগী</p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-gray-500 flex items-center mb-1">
                      <FaHospitalAlt className="mr-2 text-sm" />
                      <span className="text-xs">হাসপাতাল</span>
                    </div>
                    <p className="font-medium">{req.hospital || 'নির্দিষ্ট করা হয়নি'}</p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-gray-500 flex items-center mb-1">
                      <FaMapMarkerAlt className="mr-2 text-sm" />
                      <span className="text-xs">অবস্থান</span>
                    </div>
                    <p className="font-medium">{req.hospitalLocation|| 'নির্দিষ্ট করা হয়নি'}</p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-gray-500 flex items-center mb-1">
                      <FaCalendarAlt className="mr-2 text-sm" />
                      <span className="text-xs">প্রয়োজন</span>
                    </div>
                    <p className="font-medium">{req.neededBy || 'জরুরি'}</p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-gray-500 flex items-center mb-1">
                      <FaPhone className="mr-2 text-sm" />
                      <span className="text-xs">যোগাযোগ</span>
                    </div>
                    <p className="font-medium text-blue-600">{req.contactNumber}</p>
                  </div>
                </div>

                {/* Additional Info */}
                {req.bags && (
                  <div className="mt-4 bg-amber-50 p-3 rounded-lg border border-amber-100">
                    <div className="flex items-center">
                      <FaInfoCircle className="text-amber-500 mr-2" />
                      <span className="font-medium">{req.bags} ব্যাগ রক্ত প্রয়োজন</span>
                    </div>
                  </div>
                )}

                {/* Message */}
                {req.message && (
                  <div className="mt-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-800 italic">
                      &quot;{req.message}&quot;
                    </p>
                  </div>
                )}

                {/* Call to Action */}
                <div className="mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCall(req.contactNumber)}
                    disabled={callingNumber === req.contactNumber}
                    className={`w-full py-3 px-4 text-white font-medium rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2
                      ${callingNumber === req.contactNumber 
                        ? 'bg-green-600' 
                        : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'}`}
                  >
                    {callingNumber === req.contactNumber ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        কল করা হচ্ছে...
                      </>
                    ) : (
                      <>
                        <FaPhone />
                        কল করুন
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Footer */}
                <div className="mt-4 flex justify-between items-center text-xs text-gray-400">
                  <span>পোস্ট করা: {req.postedDate}</span>
                  <button className="text-red-400 hover:text-red-500">
                    <FaHeart />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="text-gray-300 mb-4">
              <GiBlood className="text-6xl mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">কোন অনুরোধ পাওয়া যায়নি</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              আপনার অনুসন্ধানের সাথে মিলে যায় এমন কোনো রক্তের অনুরোধ পাওয়া যায়নি। 
              অনুগ্রহ করে অন্য ফিল্টার ব্যবহার করে আবার চেষ্টা করুন।
            </p>
            <button 
              onClick={() => {
                setSearchTerm("");
                setSelectedBloodGroup("");
                setSelectedLocation("");
                setSelectedUrgency("");
              }}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-colors"
            >
              সব ফিল্টার রিসেট করুন
            </button>
          </div>
        )}
      </motion.div>

      {/* Floating Help Button */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-red-600 text-white p-4 rounded-full shadow-xl hover:bg-red-700 transition-colors">
          <FaHeart className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default RequestList;
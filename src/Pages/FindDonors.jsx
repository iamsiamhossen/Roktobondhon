import { useState, useEffect } from "react";
import { FaPhone, FaMapMarkerAlt, FaTint, FaClock, FaUser, FaHeart, FaCheck, FaExclamationTriangle } from "react-icons/fa";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const FindDonors = () => {
  // State management
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showPhone, setShowPhone] = useState(null);
  const [selectedDonor, setSelectedDonor] = useState(null);

  // Fetch donors from Firestore
  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const donorsRef = collection(db, "donors");
        const q = query(donorsRef, where("status", "==", "active"));
        const querySnapshot = await getDocs(q);
        
        const donorsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setDonors(donorsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching donors:", error);
        setError("ডাটা লোড করতে সমস্যা হচ্ছে। পরে আবার চেষ্টা করুন");
        setLoading(false);
      }
    };

    fetchDonors();
  }, []);

  // Filter logic
  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         donor.bloodType?.includes(searchQuery);
    const matchesBloodGroup = selectedBloodGroup ? donor.bloodType === selectedBloodGroup : true;
    const matchesLocation = selectedLocation ? donor.location === selectedLocation : true;

    return matchesSearch && matchesBloodGroup && matchesLocation;
  });

  // Sirajganj locations
  const sirajganjLocations = [
    "সিরাজগঞ্জ সদর",
    "বেলকুচি",
    "কাজীপুর",
    "শাহজাদপুর",
    "উল্লাপাড়া",
    "রায়গঞ্জ",
    "তাড়াশ",
    "কামারখন্দ",
    "চৌহালী"
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">রক্তদাতাদের তথ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-6 rounded-xl shadow-md max-w-md text-center">
          <div className="text-red-500 mb-4">
            <FaExclamationTriangle size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-red-600 mb-2">ত্রুটি!</h3>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-kalpurush">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-red-600 mb-2">সিরাজগঞ্জের রক্তদাতা খুঁজুন</h1>
        <p className="text-center text-gray-700 text-lg mb-8">জরুরি প্রয়োজনে আপনার নিকটস্থ রক্তদাতাদের সাথে সরাসরি যোগাযোগ করুন</p>

        {/* Search and Filter Section */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">নাম বা রক্তের গ্রুপ</label>
              <input
                type="text"
                placeholder="সার্চ করুন"
                className="w-full p-3 border-2 border-red-100 rounded-lg focus:ring-2 focus:ring-red-400 text-gray-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">রক্তের গ্রুপ</label>
              <select 
                className="w-full p-3 border-2 border-red-100 rounded-lg text-gray-800"
                value={selectedBloodGroup}
                onChange={(e) => setSelectedBloodGroup(e.target.value)}
              >
                <option value="">সব গ্রুপ</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">উপজেলা</label>
              <select
                className="w-full p-3 border-2 border-red-100 rounded-lg text-gray-800"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">সব এলাকা</option>
                {sirajganjLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedBloodGroup("");
                setSelectedLocation("");
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              ফিল্টার রিসেট
            </button>
          </div>
        </div>

        {/* Donors List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredDonors.length > 0 ? (
            filteredDonors.map(donor => (
              <div 
                key={donor.id} 
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setSelectedDonor(donor)}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
                      {donor.photo ? (
                        <img src={donor.photo} alt={donor.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <FaUser size={24} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-xl font-bold text-red-600">{donor.fullName}</h2>
                          <p className="text-gray-600 flex items-center gap-1">
                            <FaTint className={`text-${donor.bloodType.includes('+') ? 'red-500' : 'blue-500'}`} />
                            {donor.bloodType}
                          </p>
                        </div>
                        <span className="px-2 py-1 rounded-full text-sm bg-green-100 text-green-700">
                          {donor.isAvailable ? "সক্রিয়" : "অনুপলব্ধ"}
                        </span>
                      </div>

                      <div className="mt-3 space-y-1">
                        <p className="text-gray-700 flex items-center gap-2">
                          <FaMapMarkerAlt className="text-gray-400" />
                          {donor.location}
                        </p>
                        <p className="text-gray-700">
                          রক্ত দিয়েছেন: {donor.donationCount || 0} বার
                        </p>
                        <p className="text-gray-700 flex items-center gap-2">
                          <FaClock className="text-gray-400" />
                          শেষ দান: {donor.lastDonation ? new Date(donor.lastDonation).toLocaleDateString() : "তথ্য নেই"}
                        </p>
                      </div>

                      <div className="mt-4">
                        {showPhone === donor.id ? (
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-green-700 font-bold flex items-center gap-2">
                              <FaPhone /> {donor.phone || "তথ্য নেই"}
                            </p>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowPhone(null);
                              }}
                              className="mt-2 text-red-600 hover:underline text-sm"
                            >
                              ফোন নম্বর গোপন করুন
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowPhone(donor.id);
                            }}
                            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                          >
                            <FaPhone /> যোগাযোগ করুন
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500 text-lg">কোন রক্তদাতা পাওয়া যায়নি</p>
              <p className="text-gray-400">আপনার সার্চ ক্রাইটেরিয়া পরিবর্তন করে আবার চেষ্টা করুন</p>
            </div>
          )}
        </div>

        {/* Donor Details Modal */}
        {selectedDonor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-red-600">{selectedDonor.fullName} - {selectedDonor.bloodType}</h2>
                  <button 
                    onClick={() => setSelectedDonor(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="col-span-1">
                    <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden mb-4">
                      {selectedDonor.photo ? (
                        <img src={selectedDonor.photo} alt={selectedDonor.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <FaUser size={48} />
                        </div>
                      )}
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg">
                      <h3 className="font-bold text-red-600 mb-2">যোগাযোগ তথ্য</h3>
                      <p className="text-gray-700 mb-1">
                        <span className="font-semibold">ফোন:</span> {showPhone === selectedDonor.id ? (selectedDonor.phone || "তথ্য নেই") : '***********'}
                      </p>
                      <button
                        onClick={() => setShowPhone(showPhone === selectedDonor.id ? null : selectedDonor.id)}
                        className="mt-2 text-red-600 hover:underline text-sm"
                      >
                        {showPhone === selectedDonor.id ? 'ফোন নম্বর গোপন করুন' : 'ফোন নম্বর দেখুন'}
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-500 text-sm">বয়স</p>
                        <p className="font-semibold text-gray-800">
                          {selectedDonor.dob ? 
                            (new Date().getFullYear() - new Date(selectedDonor.dob).getFullYear()) + " বছর" : 
                            "তথ্য নেই"}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-500 text-sm">লিঙ্গ</p>
                        <p className="font-semibold text-gray-800">
                          {selectedDonor.gender === "male" ? "পুরুষ" : 
                           selectedDonor.gender === "female" ? "মহিলা" : 
                           "তথ্য নেই"}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-500 text-sm">ওজন</p>
                        <p className="font-semibold text-gray-800">
                          {selectedDonor.weight ? selectedDonor.weight + " কেজি" : "তথ্য নেই"}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-500 text-sm">স্বাস্থ্য অবস্থা</p>
                        <p className="font-semibold text-green-600 flex items-center gap-1">
                          <FaCheck /> {selectedDonor.healthConditions || "সুস্থ"}
                        </p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-bold text-red-600 mb-2">অবস্থান</h3>
                      <p className="flex items-center gap-2 text-gray-700">
                        <FaMapMarkerAlt /> {selectedDonor.location || "তথ্য নেই"}, সিরাজগঞ্জ
                      </p>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-bold text-red-600 mb-2">দানের তথ্য</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-gray-500 text-sm">মোট রক্ত দান</p>
                          <p className="font-semibold text-gray-800">{selectedDonor.donationCount || 0} বার</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-gray-500 text-sm">সর্বশেষ দান</p>
                          <p className="font-semibold text-gray-800">
                            {selectedDonor.lastDonation ? 
                              new Date(selectedDonor.lastDonation).toLocaleDateString() : 
                              "তথ্য নেই"}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-gray-500 text-sm">পরবর্তী দানের তারিখ</p>
                          <p className="font-semibold text-gray-800">
  {selectedDonor.lastDonation ? 
    new Date(new Date(selectedDonor.lastDonation).setMonth(
      new Date(selectedDonor.lastDonation).getMonth() + 3
    )).toLocaleDateString() : 
    "তথ্য নেই"}
</p>

                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-gray-500 text-sm">অবস্থা</p>
                          <p className="font-semibold text-green-600">
                            {selectedDonor.isAvailable ? "সক্রিয়" : "অনুপলব্ধ"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowPhone(selectedDonor.id)}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <FaPhone /> {showPhone === selectedDonor.id ? (selectedDonor.phone || "তথ্য নেই") : 'যোগাযোগ করুন'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Emergency Notice */}
        <div className="bg-red-100 p-6 rounded-xl shadow-md">
          <div className="flex items-start gap-4">
            <div className="text-red-600">
              <FaHeart size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-700">জরুরি রক্ত প্রয়োজন?</h3>
              <p className="mt-2 text-red-600">
                সিরাজগঞ্জ জেলায় জরুরি রক্তের প্রয়োজন হলে আমাদের হেল্পলাইনে কল করুন: <span className="font-bold">০১৭০০-০০০০০০</span>
              </p>
              <p className="mt-2 text-red-600">
                অথবা নিকটস্থ হাসপাতালে যোগাযোগ করুন:
              </p>
              <ul className="mt-2 text-red-600 list-disc list-inside">
                <li>সিরাজগঞ্জ জেনারেল হাসপাতাল: ০৭৫১-৬২৩৪৫</li>
                <li>বেলকুচি উপজেলা স্বাস্থ্য কমপ্লেক্স: ০৭৫২-৫৬৭৮৯</li>
                <li>সিরাজগঞ্জ রেড ক্রিসেন্ট সোসাইটি: ০৭৫১-৬৭৮৯০</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindDonors;
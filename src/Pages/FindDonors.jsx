import { useState } from "react";

const FindDonors = () => {
  // ডামি ডেটা - পরবর্তীতে API থেকে লোড করা হবে
  const donors = [
    { 
      id: 1, 
      name: "রাহিম", 
      bloodGroup: "A+", 
      location: "ঢাকা", 
      available: true, 
      lastDonation: "২০২৪-০১-১৫",
      rating: 4.5,
      phone: "০১৭১২-৩৪৫৬৭৮"
    },
    { 
      id: 2, 
      name: "করিম", 
      bloodGroup: "O-", 
      location: "চট্টগ্রাম", 
      available: false, 
      lastDonation: "২০২৩-১২-২০",
      rating: 4.2,
      phone: "০১৯৮৭-৬৫৪৩২১"
    },
  ];

  // স্টেট ম্যানেজমেন্ট
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [showPhone, setShowPhone] = useState(null);
  const [urgencyLevel, setUrgencyLevel] = useState("");

  // ফিল্টার লজিক
  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.name.includes(searchQuery) || donor.bloodGroup.includes(searchQuery);
    const matchesBloodGroup = selectedBloodGroup ? donor.bloodGroup === selectedBloodGroup : true;
    const matchesLocation = selectedLocation ? donor.location === selectedLocation : true;
    const matchesAvailability = onlyAvailable ? donor.available : true;
    const matchesUrgency = urgencyLevel ? donor.available : true;

    return matchesSearch && matchesBloodGroup && matchesLocation && matchesAvailability && matchesUrgency;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-kalpurush">
      <h1 className="text-3xl font-bold text-center text-red-600 mb-2"> রক্তদাতা খুঁজুন</h1>
      <p className="text-center text-gray-700 text-lg">আপনার নিকটস্থ রক্তদাতাদের সাথে সরাসরি যোগাযোগ করুন</p>

      {/* সার্চ এবং ফিল্টার সেকশন */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-lg  text-red-600 ">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="নাম বা রক্তের গ্রুপ"
            className="p-3 border-2 border-red-100 rounded-lg focus:ring-2 focus:ring-red-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select 
            className="p-3 border-2 border-red-100 rounded-lg"
            value={selectedBloodGroup}
            onChange={(e) => setSelectedBloodGroup(e.target.value)}
          >
            <option value="">সব রক্তের গ্রুপ</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>

          <select
            className="p-3 border-2 border-red-100 rounded-lg"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">সব এলাকা</option>
            <option value="ঢাকা">ঢাকা</option>
            <option value="চট্টগ্রাম">চট্টগ্রাম</option>
            <option value="সিলেট">সিলেট</option>
          </select>

          <select
            className="p-3 border-2 border-red-100 rounded-lg"
            value={urgencyLevel}
            onChange={(e) => setUrgencyLevel(e.target.value)}
          >
            <option value="">জরুরি অবস্থা</option>
            <option value="high">জীবন-মরণ (২৪ ঘণ্টা)</option>
            <option value="medium">জরুরি (৪৮ ঘণ্টা)</option>
            <option value="low">সাধারণ (৭ দিন)</option>
          </select>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <label className="flex items-center gap-2 text-red-600">
            <input 
              type="checkbox" 
              checked={onlyAvailable} 
              onChange={() => setOnlyAvailable(!onlyAvailable)} 
              className="w-5 h-5"
            />
            শুধুমাত্র সক্রিয় দাতা দেখুন
          </label>
        </div>
      </div>

      {/* রক্তদাতা লিস্ট */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDonors.map(donor => (
          <div key={donor.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-red-600">{donor.name}</h2>
                  <p className="text-lg text-gray-600">{donor.bloodGroup}</p>
                </div>
                <span className={`px-3 py-1 rounded-full ${donor.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {donor.available ? 'সক্রিয় ✅' : 'অসক্রিয় ❌'}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-gray-700">📍 {donor.location}</p>
                <p className="text-gray-700">⭐ রেটিং: {donor.rating}/5</p>
                <p className="text-gray-700">🩸 শেষ দান: {donor.lastDonation}</p>
              </div>

              <div className="mt-4">
                {showPhone === donor.id ? (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-green-700 font-bold">📞 {donor.phone}</p>
                    <button 
                      onClick={() => setShowPhone(null)}
                      className="mt-2 text-red-600 hover:underline"
                    >
                      ফোন নম্বর গোপন করুন
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowPhone(donor.id)}
                    className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    যোগাযোগ করুন
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ম্যাপ ভিউ সেকশন */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-red-600 mb-4">লোকেশন ভিত্তিক ম্যাপ</h2>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">ম্যাপ লোড হচ্ছে...</p>
        </div>
      </div>

      {/* জরুরি নোটিফিকেশন */}
      <div className="mt-8 bg-red-100 p-6 rounded-xl">
        <h3 className="text-xl font-bold text-red-700">⚠️ জরুরি নোটিফিকেশন সিস্টেম</h3>
        <p className="mt-2 text-red-600">
          জরুরি অবস্থায় SMS নোটিফিকেশন পেতে রেজিস্টার করুন
        </p>
        <button className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
          নোটিফিকেশন সাবস্ক্রাইব করুন
        </button>
      </div>
    </div>
  );
};

export default FindDonors;
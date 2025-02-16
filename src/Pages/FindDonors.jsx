import { useState } from "react";

const FindDonors = () => {
  // Dummy Donor Data (পরবর্তীতে API থেকে আনা হবে)
  const donors = [
    { id: 1, name: "রাহিম", bloodGroup: "A+", location: "ঢাকা", available: true, lastDonation: "2024-01-15" },
    { id: 2, name: "করিম", bloodGroup: "O-", location: "চট্টগ্রাম", available: false, lastDonation: "2023-12-20" },
    { id: 3, name: "সুমাইয়া", bloodGroup: "B+", location: "সিলেট", available: true, lastDonation: "2024-02-05" },
    { id: 4, name: "নুসরাত", bloodGroup: "AB-", location: "খুলনা", available: true, lastDonation: "2024-01-10" },
  ];

  // সার্চ এবং ফিল্টার স্টেট
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // ইউনিক ব্লাড গ্রুপ এবং লোকেশন ফিল্টার
  const bloodGroups = [...new Set(donors.map((donor) => donor.bloodGroup))];
  const locations = [...new Set(donors.map((donor) => donor.location))];

  // ফিল্টারড ডোনর লিস্ট
  const filteredDonors = donors.filter((donor) => {
    return (
      (donor.name.toLowerCase().includes(searchQuery.toLowerCase()) || donor.bloodGroup.includes(searchQuery)) &&
      (selectedBloodGroup ? donor.bloodGroup === selectedBloodGroup : true) &&
      (selectedLocation ? donor.location === selectedLocation : true) &&
      (!onlyAvailable || donor.available)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-red-600">রক্ত দাতা খুঁজুন</h1>
      <p className="text-center text-gray-700 mt-2">আপনার এলাকার রক্ত দাতাদের সাথে যোগাযোগ করুন</p>

      {/* সার্চ এবং ফিল্টার */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {/* সার্চ ইনপুট */}
        <input
          type="text"
          placeholder="নাম বা রক্তের গ্রুপ দিয়ে সার্চ করুন..."
          className="p-2 border rounded-lg w-64"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* রক্তের গ্রুপ ফিল্টার */}
        <select className="p-2 border rounded-lg" value={selectedBloodGroup} onChange={(e) => setSelectedBloodGroup(e.target.value)}>
          <option value="">সব রক্তের গ্রুপ</option>
          {bloodGroups.map((group) => (
            <option key={group} value={group}>{group}</option>
          ))}
        </select>

        {/* লোকেশন ফিল্টার */}
        <select className="p-2 border rounded-lg" value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
          <option value="">সব লোকেশন</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        {/* অ্যাভেলেবিলিটি টগল */}
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={onlyAvailable} onChange={() => setOnlyAvailable(!onlyAvailable)} />
          <span>শুধুমাত্র অ্যাভেলেবল দাতারা</span>
        </label>
      </div>

      {/* ডোনর লিস্ট */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDonors.length > 0 ? (
          filteredDonors.map((donor) => (
            <div key={donor.id} className="p-4 bg-white shadow rounded-lg">
              <h2 className="text-xl font-semibold">{donor.name}</h2>
              <p className="text-red-500 font-bold">{donor.bloodGroup}</p>
              <p className="text-gray-700">📍 {donor.location}</p>
              <p className={`mt-2 font-semibold ${donor.available ? "text-green-500" : "text-red-500"}`}>
                {donor.available ? "অ্যাভেলেবল ✅" : "অ্যাভেলেবল নয় ❌"}
              </p>
              <p className="text-sm text-gray-500">🩸 শেষ দান: {donor.lastDonation}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-4">কোনো দাতা পাওয়া যায়নি!</p>
        )}
      </div>
    </div>
  );
};

export default FindDonors;

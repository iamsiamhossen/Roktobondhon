import { useState } from "react";
import { FaUser, FaMobileAlt, FaLock, FaMapMarkerAlt, FaTint } from "react-icons/fa";

const sirajganjUpazilas = [
  "সিরাজগঞ্জ সদর",
  "উল্লাপাড়া",
  "শাহজাদপুর",
  "রায়গঞ্জ",
  "বেলকুচি",
  "কাজীপুর",
  "কামারখন্দ",
  "তাড়াশ",
  "চৌহালী"
];


const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const PatientRegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    password: "",
    location: "",
    bloodGroup: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Field */}
      <div className="space-y-2">
        <label className="block text-base font-medium text-gray-700">পূর্ণ নাম</label>
        <div className="relative">
          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 text-base text-black border border-red-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Mobile Field */}
      <div className="space-y-2">
        <label className="block text-base font-medium text-gray-700">মোবাইল নম্বর</label>
        <div className="relative">
          <FaMobileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500" />
          <input
            type="tel"
            className="w-full pl-10 pr-4 py-3 text-base text-black border border-red-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            pattern="[0-9]{11}"
            required
            placeholder="০১৭XXXXXXXX"
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label className="block text-base font-medium text-gray-700">পাসওয়ার্ড</label>
        <div className="relative">
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500" />
          <input
            type="password"
            className="w-full pl-10 pr-4 py-3 text-base text-black border border-red-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Blood Group Field */}
      <div className="space-y-2">
        <label className="block text-base font-medium text-gray-700">রক্তের গ্রুপ</label>
        <div className="relative">
          <FaTint className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500" />
          <select
            className="w-full pl-10 pr-4 py-3 text-base text-black bg-white border border-red-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200"
            value={formData.bloodGroup}
            onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
            required
          >
            <option value="">-- সিলেক্ট করুন --</option>
            {bloodGroups.map((group) => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Location Field */}
      <div className="space-y-2">
        <label className="block text-base font-medium text-gray-700">উপজেলা</label>
        <div className="relative">
          <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500" />
          <select
            className="w-full pl-10 pr-4 py-3 text-base text-black bg-white border border-red-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          >
            <option value="">-- সিলেক্ট করুন --</option>
            {sirajganjUpazilas.map((upazila) => (
              <option key={upazila} value={upazila}>{upazila}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow transition-all mt-6"
      >
        রেজিস্টার করুন
      </button>
    </form>
  );
};

export default PatientRegistrationForm;

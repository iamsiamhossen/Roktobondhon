import { useState } from "react";

const RequestBlood = () => {
  const [formData, setFormData] = useState({
    patientName: "",
    bloodGroup: "",
    location: "",
    contactNumber: "",
    neededBy: "",
    emergency: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("রক্তের অনুরোধ পাঠানো হয়েছে:", formData);
    alert("রক্তের অনুরোধ সফলভাবে জমা হয়েছে!");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-red-600 mb-4">
          রক্তের অনুরোধ করুন
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* রোগীর নাম */}
          <div>
            <label className="block text-gray-700">রোগীর নাম</label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* রক্তের গ্রুপ */}
          <div>
            <label className="block text-gray-700">রক্তের গ্রুপ</label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">রক্তের গ্রুপ নির্বাচন করুন</option>
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

          {/* অবস্থান */}
          <div>
            <label className="block text-gray-700">অবস্থান</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* যোগাযোগ নম্বর */}
          <div>
            <label className="block text-gray-700">যোগাযোগ নম্বর</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* প্রয়োজনীয় সময় */}
          <div>
            <label className="block text-gray-700">প্রয়োজনীয় সময় (তারিখ ও সময়)</label>
            <input
              type="datetime-local"
              name="neededBy"
              value={formData.neededBy}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* জরুরি */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="emergency"
              checked={formData.emergency}
              onChange={handleChange}
              className="mr-2 w-5 h-5 text-red-600 border rounded focus:ring-2 focus:ring-red-500"
            />
            <label className="text-gray-700">জরুরি হিসেবে চিহ্নিত করুন 🚨</label>
          </div>

          {/* সাবমিট বাটন */}
          <button
            type="submit"
            className={`w-full py-3 text-white font-bold rounded-lg ${
              formData.emergency ? "bg-red-600 hover:bg-red-700" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            অনুরোধ জমা দিন
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestBlood;

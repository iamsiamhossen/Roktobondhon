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
    console.log("Request Submitted:", formData);
    alert("Blood Request Submitted Successfully!");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-red-600 mb-4">
          Request Blood
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient Name */}
          <div>
            <label className="block text-gray-700">Patient Name</label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Blood Group */}
          <div>
            <label className="block text-gray-700">Blood Group</label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select Blood Group</option>
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

          {/* Location */}
          <div>
            <label className="block text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-gray-700">Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Needed By */}
          <div>
            <label className="block text-gray-700">Needed By (Date & Time)</label>
            <input
              type="datetime-local"
              name="neededBy"
              value={formData.neededBy}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Emergency Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="emergency"
              checked={formData.emergency}
              onChange={handleChange}
              className="mr-2 w-5 h-5 text-red-600 border rounded focus:ring-2 focus:ring-red-500"
            />
            <label className="text-gray-700">Mark as Emergency 🚨</label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 text-white font-bold rounded-lg ${
              formData.emergency ? "bg-red-600 hover:bg-red-700" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestBlood;

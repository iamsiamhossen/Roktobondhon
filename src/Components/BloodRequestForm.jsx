import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaTint, 
  FaHospital, 
  FaExclamationTriangle, 
  FaCommentAlt, 
  FaPaperPlane, 
  FaPhone,
  FaUser,
  FaIdCard,
  FaNotesMedical,
  FaProcedures,
  FaCalendarAlt,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { collection, addDoc } from "firebase/firestore"; 
import { db } from '../firebase';
const PostRequestPage = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    bloodType: '',
    hospital: '',
    hospitalLocation: '',
    urgency: '',
    diagnosis: '',
    procedure: '',
    requiredUnits: '1',
    message: '',
    contactNumber: '',
    requiredDate: '',
    previousTransfusion: '',
    complications: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = [
      { field: 'patientName', message: 'রোগীর নাম লিখুন' },
      { field: 'patientAge', message: 'রোগীর বয়স লিখুন' },
      { field: 'bloodType', message: 'রক্তের গ্রুপ নির্বাচন করুন' },
      { field: 'hospital', message: 'হাসপাতালের নাম লিখুন' },
      { field: 'urgency', message: 'জরুরিতা নির্বাচন করুন' },
      { field: 'diagnosis', message: 'রোগ নির্ণয় লিখুন' },
      { field: 'contactNumber', message: 'যোগাযোগ নম্বর লিখুন' },
      { field: 'requiredDate', message: 'রক্ত প্রয়োজন তারিখ নির্বাচন করুন' }
    ];

    const errors = requiredFields
      .filter(({ field }) => !formData[field])
      .map(({ message }) => message);

    if (formData.contactNumber && !/^(?:\+88|01)[0-9]{9}$/.test(formData.contactNumber)) {
      errors.push('সঠিক মোবাইল নম্বর লিখুন (যেমন: 01712345678)');
    }

    if (formData.requiredDate && new Date(formData.requiredDate) < new Date().setHours(0,0,0,0)) {
      errors.push('আজ বা ভবিষ্যতের তারিখ নির্বাচন করুন');
    }

    if (formData.patientAge && (isNaN(formData.patientAge) || formData.patientAge < 0 || formData.patientAge > 120)) {
      errors.push('সঠিক বয়স লিখুন (0-120)');
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
        contactNumber: formData.contactNumber.replace(/\D/g, ''),
        timestamp: new Date().toISOString(),
        status: 'pending',
        neededBy: new Date(formData.requiredDate).toISOString(),
        requiredUnits: parseInt(formData.requiredUnits),
        age: parseInt(formData.patientAge)
      };
  
      // Firebase v9 syntax
      await addDoc(collection(db, "bloodRequests"), newRequest);
      
      alert('আপনার রক্তের অনুরোধ সফলভাবে জমা হয়েছে!');
      navigate('/requests');
    } catch (error) {
      console.error("রিকোয়েস্ট জমা দিতে সমস্যা:", error);
      alert('রিকোয়েস্ট জমা দিতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 py-8 px-4 font-kalpurush text-black">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-red-600 flex items-center justify-center gap-2">
            <FaTint className="text-red-500" />
            রক্তের অনুরোধ পোস্ট করুন
          </h2>
          <p className="text-gray-600 mt-2">সম্পূর্ণ তথ্য প্রদান করলে রক্তদাতারা আপনাকে সহজেই খুঁজে পাবেন</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section 1: Patient Information */}
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
              <FaUser className="text-red-500" />
              রোগীর ব্যক্তিগত তথ্য
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Patient Name */}
              <div>
                <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-1">
                  রোগীর নাম *
                </label>
                <input
                  type="text"
                  id="patientName"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400"
                  placeholder="রোগীর পূর্ণ নাম"
                  required
                />
              </div>

              {/* Patient Age */}
              <div>
                <label htmlFor="patientAge" className="block text-sm font-medium text-gray-700 mb-1">
                  রোগীর বয়স *
                </label>
                <input
                  type="number"
                  id="patientAge"
                  name="patientAge"
                  value={formData.patientAge}
                  onChange={handleChange}
                  min="0"
                  max="120"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400"
                  placeholder="বছরে"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Blood & Medical Information */}
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
              <FaNotesMedical className="text-red-500" />
              রক্ত ও চিকিৎসা সংক্রান্ত তথ্য
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Blood Type */}
              <div>
                <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 mb-1">
                  রক্তের গ্রুপ *
                </label>
                <select
                  id="bloodType"
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400"
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

              {/* Required Units */}
              <div>
                <label htmlFor="requiredUnits" className="block text-sm font-medium text-gray-700 mb-1">
                  প্রয়োজনীয় রক্তের ব্যাগ সংখ্যা
                </label>
                <select
                  id="requiredUnits"
                  name="requiredUnits"
                  value={formData.requiredUnits}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num} ব্যাগ</option>
                  ))}
                </select>
              </div>

              {/* Diagnosis */}
              <div className="md:col-span-2">
                <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-1">
                  রোগ নির্ণয় *
                </label>
                <input
                  type="text"
                  id="diagnosis"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400"
                  placeholder="যেমন: থ্যালাসেমিয়া, লিউকেমিয়া, অস্ত্রোপচার ইত্যাদি"
                  required
                />
              </div>



              {/* Previous Transfusion */}
              <div>
                <label htmlFor="previousTransfusion" className="block text-sm font-medium text-gray-700 mb-1">
                  পূর্ববর্তী রক্ত সঞ্চালন
                </label>
                <select
                  id="previousTransfusion"
                  name="previousTransfusion"
                  value={formData.previousTransfusion}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400"
                >
                  <option value="">নির্বাচন করুন</option>
                  <option value="হ্যাঁ, কোনো সমস্যা হয়নি">হ্যাঁ, কোনো সমস্যা হয়নি</option>
                  <option value="হ্যাঁ, সমস্যা হয়েছে">হ্যাঁ, সমস্যা হয়েছে</option>
                  <option value="না, প্রথমবার">না, প্রথমবার</option>
                </select>
              </div>

              {/* Complications */}
              <div>
                <label htmlFor="complications" className="block text-sm font-medium text-gray-700 mb-1">
                  কোনো জটিলতা আছে কি?
                </label>
                <input
                  type="text"
                  id="complications"
                  name="complications"
                  value={formData.complications}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400"
                  placeholder="যেমন: অ্যান্টিবডি উপস্থিতি"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Hospital & Contact Info */}
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
              <FaHospital className="text-red-500" />
              হাসপাতাল ও যোগাযোগ তথ্য
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Hospital Name */}
              <div>
                <label htmlFor="hospital" className="block text-sm font-medium text-gray-700 mb-1">
                  হাসপাতালের নাম *
                </label>
                <input
                  type="text"
                  id="hospital"
                  name="hospital"
                  value={formData.hospital}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400"
                  placeholder="হাসপাতালের পূর্ণ নাম"
                  required
                />
              </div>

              {/* Hospital Location */}
              <div>
                <label htmlFor="hospitalLocation" className="block text-sm font-medium text-gray-700 mb-1">
                  হাসপাতালের অবস্থান
                </label>
                <input
                  type="text"
                  id="hospitalLocation"
                  name="hospitalLocation"
                  value={formData.hospitalLocation}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400"
                  placeholder="জেলা/শহর"
                />
              </div>

              {/* Contact Number */}
              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  যোগাযোগ নম্বর *
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400"
                  placeholder="যেমন: ০১৭১২৩৪৫৬৭৮"
                  required
                />
              </div>

              {/* Urgency */}
              <div>
                <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-1">
                  জরুরিতা *
                </label>
                <select
                  id="urgency"
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400"
                  required
                >
                  <option value="">জরুরিতা নির্বাচন করুন</option>
                  <option value="জীবন-মরণ (২৪ ঘণ্টার মধ্যে)">জীবন-মরণ (২৪ ঘণ্টার মধ্যে)</option>
                  <option value="জরুরি (৪৮ ঘণ্টার মধ্যে)">জরুরি (৪৮ ঘণ্টার মধ্যে)</option>
                  <option value="সাধারণ (৭ দিনের মধ্যে)">সাধারণ (৭ দিনের মধ্যে)</option>
                </select>
              </div>

              {/* Required Date */}
              <div>
                <label htmlFor="requiredDate" className="block text-sm font-medium text-gray-700 mb-1">
                  রক্ত প্রয়োজন তারিখ *
                </label>
                <input
                  type="date"
                  id="requiredDate"
                  name="requiredDate"
                  value={formData.requiredDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400"
                  required
                />
              </div>
            </div>
          </div>

          {/* Additional Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              <FaCommentAlt className="inline mr-2 text-red-400" />
              অতিরিক্ত তথ্য (ঐচ্ছিক)
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400"
              placeholder="যেমন: বিশেষ নির্দেশনা, রক্তদাতাদের জন্য তথ্য, রোগীর বর্তমান অবস্থা ইত্যাদি"
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
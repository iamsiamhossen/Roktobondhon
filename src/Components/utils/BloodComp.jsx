// src/components/BloodCompatibility.jsx
import React, { useState } from 'react';
import { FaTint, FaExchangeAlt, FaInfoCircle } from 'react-icons/fa';
import { getCompatibleDonors, isBloodCompatible } from '../utils/bloodCompatibility';

const BloodCompatibility = () => {
  const [donorType, setDonorType] = useState('');
  const [recipientType, setRecipientType] = useState('');
  const [result, setResult] = useState(null);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const checkCompatibility = () => {
    if (!donorType || !recipientType) {
      setResult({ compatible: false, message: 'দুইটি রক্তের গ্রুপ নির্বাচন করুন' });
      return;
    }

    const compatible = isBloodCompatible(donorType, recipientType);
    setResult({
      compatible,
      message: compatible 
        ? `${donorType} রক্তের গ্রুপ ${recipientType} কে দান করতে পারে`
        : `${donorType} রক্তের গ্রুপ ${recipientType} কে দান করতে পারে না`
    });
  };

  const getCompatibleList = () => {
    if (!recipientType) return [];
    return getCompatibleDonors(recipientType);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md font-kalpurush">
      <h2 className="text-xl font-bold mb-4 flex items-center text-red-600">
        <FaTint className="mr-2" />
        রক্তের গ্রুপ সামঞ্জস্যতা পরীক্ষা
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* দাতা সিলেক্টর */}
        <div>
          <label className="block mb-2 text-gray-700">
            দাতার রক্তের গ্রুপ
          </label>
          <select
            value={donorType}
            onChange={(e) => setDonorType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400"
          >
            <option value="">নির্বাচন করুন</option>
            {bloodTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* গ্রহীতা সিলেক্টর */}
        <div>
          <label className="block mb-2 text-gray-700">
            গ্রহীতার রক্তের গ্রুপ
          </label>
          <select
            value={recipientType}
            onChange={(e) => setRecipientType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400"
          >
            <option value="">নির্বাচন করুন</option>
            {bloodTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* চেক বাটন */}
      <button
        onClick={checkCompatibility}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg mb-6 flex items-center justify-center"
      >
        <FaExchangeAlt className="mr-2" />
        সামঞ্জস্যতা পরীক্ষা করুন
      </button>

      {/* ফলাফল প্রদর্শন */}
      {result && (
        <div className={`p-4 rounded-lg ${result.compatible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <p className="font-bold">{result.message}</p>
        </div>
      )}

      {/* সামঞ্জস্যপূর্ণ গ্রুপের তালিকা */}
      {recipientType && (
        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2 flex items-center text-blue-700">
            <FaInfoCircle className="mr-2" />
            {recipientType} রক্তের গ্রুপ গ্রহণ করতে পারে:
          </h3>
          <div className="flex flex-wrap gap-2">
            {getCompatibleList().map(type => (
              <span 
                key={type} 
                className={`px-3 py-1 rounded-full ${type === donorType ? 'bg-red-200 text-red-800' : 'bg-blue-200 text-blue-800'}`}
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* তথ্য বক্স */}
      <div className="mt-6 bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
        <h3 className="font-bold mb-2 text-yellow-800">গুরুত্বপূর্ণ তথ্য:</h3>
        <ul className="list-disc pl-5 text-yellow-700">
          <li className="mb-1">O- সকলকে দান করতে পারে (সর্বজনীন দাতা)</li>
          <li className="mb-1">AB+ সকল থেকে গ্রহণ করতে পারে (সর্বজনীন গ্রহীতা)</li>
          <li>রক্তদানের আগে সর্বদা ডাক্তারের পরামর্শ নিন</li>
        </ul>
      </div>
    </div>
  );
};

export default BloodCompatibility;
import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const Home = () => {
  const recentRequests = [
    { bloodGroup: "O+", location: "ঢাকা মেডিকেল", time: "৫ মিনিট আগে" },
    { bloodGroup: "B-", location: "স্কয়ার হাসপাতাল", time: "১০ মিনিট আগে" },
    { bloodGroup: "A+", location: "আপোলো হাসপাতাল", time: "১৫ মিনিট আগে" },
  ];

  const topDonors = [
    { name: "হাসান", donations: "১০" },
    { name: "আয়েশা", donations: "৮" },
    { name: "রাফি", donations: "৭" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 font-kalpurush">
      <Helmet>
        <title>রক্তবন্ধন | বিনামূল্যে রক্তদাতা খুঁজুন</title>
        <meta
          name="description"
          content="বাংলাদেশের সবচেয়ে বড় রক্তদাতা নেটওয়ার্ক। জরুরি অবস্থায় রক্তের জন্য অনুরোধ করুন বা রক্তদাতা হোন।"
        />
      </Helmet>

      <div className="flex flex-col items-center justify-center text-center py-20 px-4 md:px-10 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <h1 className="text-4xl md:text-5xl font-bold animate-fade-in-down">
          জীবন বাঁচান, রক্ত দান করুন
        </h1>
        <p className="text-base md:text-xl mt-4 max-w-2xl">
          আমাদের রক্তবন্ধন নেটওয়ার্কে যোগ দিন এবং মানুষের সাহায্যে এগিয়ে আসুন। প্রতিটি রক্ত ফোঁটা মূল্যবান!
        </p>
        <div className="mt-6 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          <Link
            to="/finddonor"
            className="px-6 py-3 bg-white text-red-600 font-bold text-xl rounded-lg hover:bg-gray-200 transition-colors"
          >
            রক্তদাতা খুঁজুন
          </Link>
          <Link
            to="/requestblood"
            className="px-6 py-3 bg-black text-white font-bold text-xl rounded-lg hover:bg-gray-800 transition-colors"
          >
            রক্তের অনুরোধ করুন
          </Link>
        </div>
      </div>

      <div className="py-12 px-4 md:px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">এটি কিভাবে কাজ করে?</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {["🔍 রক্তদাতা অনুসন্ধান করুন", "🆘 রক্তের অনুরোধ করুন", "💉 রক্ত দান করুন"].map((title, i) => (
            <div key={i} className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <h3 className="text-xl md:text-xl font-bold text-red-600">{title}</h3>
              <p className="mt-2 text-gray-600">আপনার প্রয়োজনীয় তথ্য এখানে পাবেন।</p>
            </div>
          ))}
        </div>
      </div>

      <div className="py-12 px-4 md:px-6 bg-white">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">🔔 সাম্প্রতিক রক্তের অনুরোধ</h2>
        <div className="mt-6 space-y-4">
          {recentRequests.map((req, index) => (
            <div key={index} className="p-4 bg-red-50 rounded-lg shadow transform transition-transform hover:scale-101">
              <p className="text-lg font-semibold text-red-700">
                জরুরি: {req.bloodGroup} রক্তের প্রয়োজন {req.location}
              </p>
              <span className="text-sm text-gray-600">{req.time}</span>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <Link to="/requestblood" className="text-blue-600 hover:underline">
            সব অনুরোধ দেখুন
          </Link>
        </div>
      </div>

      <div className="py-12 px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">🏆 শীর্ষ দাতাগণ</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {topDonors.map((donor, index) => (
            <div key={index} className="p-4 bg-white rounded-lg shadow transform transition-transform hover:scale-102">
              <p className="text-lg font-semibold text-gray-700">
                🎖️ {donor.name} - {donor.donations} বার রক্ত দান করেছেন
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="py-12 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white text-center">
        <h2 className="text-2xl md:text-3xl font-bold">আজই রক্তদাতা হন!</h2>
        <p className="mt-2">হাজারো মানুষের সাথে যুক্ত হয়ে জীবন বাঁচান।</p>
        <Link
          to="/register"
          className="mt-4 inline-block px-6 py-3 bg-white text-red-600 font-bold rounded-lg hover:bg-gray-200 transition-colors"
        >
          এখনই রেজিস্টার করুন
        </Link>
      </div>
    </div>
  );
};

export default Home;

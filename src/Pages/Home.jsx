import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FaSearch, FaHeartbeat, FaHandsHelping, FaTint, FaMedal, FaBell, FaArrowRight, FaUsers } from "react-icons/fa";
import { GiHealthNormal, GiHeartBeats } from "react-icons/gi";
import { motion } from "framer-motion";
import RecentBloodRequests from "./RecentBloodRequest";

const Home = () => {
  const [recentRequests, setRecentRequests] = useState([]);
  const [topDonors, setTopDonors] = useState([]);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Fetch recent requests (simulated from RequestList data)
    const requestsData = [
      {
        name: "রাহেলা বেগম",
        age: 52,
        bloodGroup: "O+",
        hospital: "২৫০ শয্যা সদর হাসপাতাল, সিরাজগঞ্জ",
        contact: "01712345678",
        neededBy: "২০ এপ্রিল ২০২৫",
        bags: 2,
        emergency: true,
        notes: "অস্ত্রোপচারের জন্য জরুরি রক্ত প্রয়োজন।"
      },
      {
        name: "নাজমুল হাসান",
        age: 34,
        bloodGroup: "A-",
        hospital: "বঙ্গমাতা শেখ ফজিলাতুন্নেছা মুজিব জেনারেল হাসপাতাল",
        contact: "01987654321",
        neededBy: "২১ এপ্রিল ২০২৫",
        bags: 1,
        emergency: false,
        notes: "এক্সিডেন্টের কারণে রক্ত প্রয়োজন।"
      },
      {
        name: "সালমা খাতুন",
        age: 29,
        bloodGroup: "B+",
        hospital: "খাজা ইউনুস আলী মেডিকেল কলেজ হাসপাতাল",
        contact: "01811442233",
        neededBy: "২২ এপ্রিল ২০২৫",
        bags: 1,
        emergency: true,
        notes: "ডেলিভারির সময় অতিরিক্ত রক্তক্ষরণ হয়েছে।"
      }
    ];

    setRecentRequests(requestsData.map(req => ({
      bloodGroup: req.bloodGroup,
      location: req.hospital.split(",")[0],
      time: "আজ",
      emergency: req.emergency
    })));

    // Fetch top donors (simulated from FindDonors data)
    const donorsData = [
      { 
        name: "ফারজানা আক্তার",
        totalDonations: 15,
        bloodGroup: "O+"
      },
      { 
        name: "নাসরিন আক্তার",
        totalDonations: 14,
        bloodGroup: "O-"
      },
      { 
        name: "জাহাঙ্গীর আলম",
        totalDonations: 13,
        bloodGroup: "O+"
      },
      { 
        name: "সালমা বেগম",
        totalDonations: 11,
        bloodGroup: "AB+"
      },
      { 
        name: "আয়েশা সিদ্দিকা",
        totalDonations: 10,
        bloodGroup: "AB-"
      }
    ];

    setTopDonors(donorsData);
  }, []);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const sortedRequests = recentRequests.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-kalpurush">
      <Helmet>
        <title>রক্তবন্ধন | বিনামূল্যে রক্তদাতা খুঁজুন</title>
        <meta
          name="description"
          content="বাংলাদেশের সবচেয়ে বড় রক্তদাতা নেটওয়ার্ক। জরুরি অবস্থায় রক্তের জন্য অনুরোধ করুন বা রক্তদাতা হোন।"
        />
      </Helmet>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-red-50 opacity-95"></div>
        <div className="absolute inset-0 bg-[url('https://img.freepik.com/free-vector/doctors-concept-illustration_114360-1515.jpg?t=st=1746252163~exp=1746255763~hmac=569edb6b2da69c3e5dd9c199ae8647d18390d758f6c7b76e32e67b86be1f1fef&w=1380')] bg-cover bg-no-repeat bg-[center_top_-100px] mix-blend-overlay"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
         <h1 className="text-3xl sm:text-5xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-relaxed text-center px-6">
  <span className="bg-clip-text text-gray-900">
    মানবতার কল্যাণে,
  </span>
  <span className="bg-clip-text text-red-600">
    এগিয়ে আসুন রক্তদানে
  </span>
</h1>

<p className="text-lg sm:text-m md:text-2xl  text-red-600 max-w-3xl mx-auto">
  আমাদের রক্তবন্ধন নেটওয়ার্কে যোগ দিন এবং 
</p>
<p className="text-lg sm:text-m md:text-2xl  text-gray-900 max-w-3xl mx-auto">
  মানুষের সাহায্যে এগিয়ে আসুন। প্রতিটি রক্ত ফোঁটা মূল্যবান!
</p>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/finddonor"
                  className="px-8 py-4 bg-white text-red-700 font-bold text-lg rounded-xl hover:bg-gray-100 transition-all shadow-lg flex items-center justify-center gap-2 border border-red-700"
                  >
                  <FaSearch /> রক্তদাতা খুঁজুন
                </Link>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="relative"
              >
                <Link
                  to="/register"
                  className="px-8 py-4 bg-gray-900 text-white font-bold text-lg rounded-xl hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <GiHealthNormal /> রক্তদাতা হন 
                </Link>
                {isHovering && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full mt-2 left-0 w-64 bg-gray-900 text-white text-sm p-3 rounded-lg shadow-xl z-10"
                  >
                    👉 রক্তদাতা হিসেবে নিবন্ধন করুন এবং মানুষের জীবন বাঁচাতে সাহায্য করুন।
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-red-50 to-white p-6 rounded-xl shadow-sm border border-gray-100 text-center"
            >
              <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
                <FaTint className="text-2xl" />
              </div>
              <p className="text-3xl font-bold text-gray-900">১০+</p>
              <p className="mt-1 text-gray-600">রক্তদান সম্পন্ন</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-red-50 to-white p-6 rounded-xl shadow-sm border border-gray-100 text-center"
            >
              <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
                <FaHeartbeat className="text-2xl" />
              </div>
              <p className="text-3xl font-bold text-gray-900">১০+</p>
              <p className="mt-1 text-gray-600">সুস্থ হয়েছেন</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-red-50 to-white p-6 rounded-xl shadow-sm border border-gray-100 text-center"
            >
              <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
                <FaHandsHelping className="text-2xl" />
              </div>
              <p className="text-3xl font-bold text-gray-900">৫০+</p>
              <p className="mt-1 text-gray-600">সক্রিয় দাতা</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-red-50 to-white p-6 rounded-xl shadow-sm border border-gray-100 text-center"
            >
              <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
                <GiHeartBeats className="text-2xl" />
              </div>
              <p className="text-3xl font-bold text-gray-900">১ জেলা</p>
              <p className="mt-1 text-gray-600">সেবা পাচ্ছেন</p>
            </motion.div>
          </div>
        </div>
      </div>
      {/* why blood donation important */}
      <section className="py-16 bg-gradient-to-b from-red-50 to-white text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            <span className="block">রক্তদান কেন</span>
            <span className="block text-red-600">এত গুরুত্বপূর্ণ?</span>
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
            একটি রক্তদান পারে তিনটি জীবন বাঁচাতে
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-red-500 mb-4">
              <FaTint className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-center mb-3">রক্তের চাহিদা</h3>
            <p className="text-gray-600">
              বাংলাদেশে প্রতি বছর প্রায় ৮-৯ লাখ ব্যাগ রক্তের প্রয়োজন হয়, কিন্তু সংগ্রহ হয় মাত্র ৬-৭ লাখ ব্যাগ
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-red-500 mb-4">
              <FaUsers className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-center mb-3">জীবন রক্ষা</h3>
            <p className="text-gray-600">
            থ্যালাসেমিয়া, ক্যান্সার, দুর্ঘটনা ও সার্জারির রোগীদের জন্য রক্ত অপরিহার্য
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-red-500 mb-4">
              <FaHeartbeat className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-center mb-3">স্বাস্থ্য উপকারিতা</h3>
            <p className="text-gray-600">
              রক্তদান হার্টের স্বাস্থ্য উন্নত করে, ক্যালোরি পোড়ায় এবং নতুন রক্তকণিকা উৎপাদনে সহায়তা করে
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-red-500 mb-4">
              <FaHandsHelping className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-center mb-3">সামাজিক দায়িত্ব</h3>
            <p className="text-gray-600">
              আজ আপনি রক্ত দিন, কাল আপনার বা আপনার প্রিয়জনের প্রয়োজন হতে পারে
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button onClick={() => window.location.href = "/register"} className="px-8 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors text-lg font-medium">
            রক্তদাতা হিসাবে রেজিস্টার করুন
          </button>
        </div>
      </div>
    </section>

      {/* How It Works Section */}
      <div className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-900"
            >
              এটি কিভাবে <span className="text-red-600">কাজ করে</span>?
            </motion.h2>
            <p className="mt-4 max-w-2xl mx-auto text-gray-600">
              মাত্র কয়েকটি সহজ ধাপে আপনি রক্তদাতা খুঁজে পেতে পারেন বা রক্তদাতা হিসেবে নিবন্ধন করতে পারেন
            </p>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={item} className="group">
              <div className="relative bg-white p-8 rounded-2xl shadow-xl h-full border border-gray-100 group-hover:border-red-200 transition-all">
                <div className="absolute -top-6 left-6 bg-red-600 text-white p-3 rounded-full shadow-lg">
                  <span className="text-xl font-bold">১</span>
                </div>
                <div className="h-16 w-16 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mb-6">
                  <FaSearch className="text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">রক্তদাতা খুঁজুন</h3>
                <p className="text-gray-600">
                  আপনার এলাকায় উপলব্ধ রক্তদাতাদের খুঁজে পেতে আমাদের স্মার্ট সার্চ সিস্টেম ব্যবহার করুন।
                </p>
              </div>
            </motion.div>

            <motion.div variants={item} className="group">
              <div className="relative bg-white p-8 rounded-2xl shadow-xl h-full border border-gray-100 group-hover:border-red-200 transition-all">
                <div className="absolute -top-6 left-6 bg-red-600 text-white p-3 rounded-full shadow-lg">
                  <span className="text-xl font-bold">২</span>
                </div>
                <div className="h-16 w-16 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mb-6">
                  <FaBell className="text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">রক্তের অনুরোধ করুন</h3>
                <p className="text-gray-600">
                  জরুরি অবস্থায় রক্তের প্রয়োজন হলে আমাদের সিস্টেমে অনুরোধ পোস্ট করুন।
                </p>
              </div>
            </motion.div>

            <motion.div variants={item} className="group">
              <div className="relative bg-white p-8 rounded-2xl shadow-xl h-full border border-gray-100 group-hover:border-red-200 transition-all">
                <div className="absolute -top-6 left-6 bg-red-600 text-white p-3 rounded-full shadow-lg">
                  <span className="text-xl font-bold">৩</span>
                </div>
                <div className="h-16 w-16 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mb-6">
                  <FaTint className="text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">রক্ত দান করুন</h3>
                <p className="text-gray-600">
                  রক্তদাতা হিসেবে নিবন্ধন করুন এবং মানুষের জীবন বাঁচাতে সাহায্য করুন।
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
       
       {/* Recent blood request */}
       <section>
        <div>
          <RecentBloodRequests/>
        </div>
       </section>
      
      {/* Top Donors Section */}
      <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-900"
            >
              আমাদের <span className="text-red-600">শীর্ষ রক্তদাতা</span>
            </motion.h2>
            <p className="mt-4 max-w-2xl mx-auto text-gray-600">
              যারা সবচেয়ে বেশি সংখ্যক রক্তদান করে মানুষের জীবন বাঁচিয়েছেন
            </p>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-5 gap-6"
          >
            {topDonors.map((donor, index) => (
              <motion.div 
                key={index} 
                variants={item}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="p-6 text-center">
                  <div className="relative mx-auto w-20 h-20 mb-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-red-200 rounded-full"></div>
                    <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-red-600">{index + 1}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">{donor.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{donor.bloodGroup}</p>
                  <div className="flex items-center justify-center space-x-1">
                    <FaTint className="text-red-500" />
                    <span className="font-medium text-gray-900">{donor.totalDonations} বার</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-10">
            <Link 
              to="/finddonor" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 shadow-sm"
            >
              সব দাতা দেখুন
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 overflow-hidden bg-gradient-to-r from-red-700 to-red-800">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              আজই রক্তদাতা হন!
            </h2>
            <p className="text-xl text-red-100 max-w-2xl mx-auto mb-8">
              হাজারো মানুষের সাথে যুক্ত হয়ে জীবন বাঁচান। আপনার একটি রক্তদান কারো জন্য নতুন জীবন বয়ে আনতে পারে।
            </p>
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                to="/register"
                className="px-8 py-4 bg-white text-red-700 font-bold text-lg rounded-xl hover:bg-gray-100 transition-all shadow-lg flex items-center justify-center gap-2 mx-auto"
              >
                <GiHealthNormal className="text-xl" /> এখনই রেজিস্টার করুন
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
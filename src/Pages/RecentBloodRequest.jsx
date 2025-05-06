import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust path as needed
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

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

const RecentBloodRequests = () => {
    const [recentRequests, setRecentRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchRecentRequests = async () => {
        try {
          const q = query(
            collection(db, "bloodRequests"),
            orderBy("timestamp", "desc"),
            limit(3)
          );
  
          const querySnapshot = await getDocs(q);
          const requests = querySnapshot.docs.map(doc => {
            const data = doc.data();
            
            // Safely handle the timestamp
            let timestamp;
            try {
              timestamp = data.timestamp?.toDate?.() || new Date();
            } catch (e) {
              console.warn("Invalid timestamp, using current date", e);
              timestamp = new Date();
            }
  
            return {
              id: doc.id,
              ...data,
              time: formatTimeAgo(timestamp),
              emergency: data.urgency === 'জরুরি'
            };
          });
  
          setRecentRequests(requests);
        } catch (err) {
          console.error("Error fetching requests:", err);
          setError("রিকোয়েস্ট লোড করতে সমস্যা হয়েছে");
        } finally {
          setLoading(false);
        }
      };
  
      fetchRecentRequests();
    }, []);
  
    // Helper function to format time (keep this the same)
    const formatTimeAgo = (date) => {
      const seconds = Math.floor((new Date() - date) / 1000);
      
      let interval = Math.floor(seconds / 31536000);
      if (interval >= 1) return `${interval} বছর আগে`;
      
      interval = Math.floor(seconds / 2592000);
      if (interval >= 1) return `${interval} মাস আগে`;
      
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) return `${interval} দিন আগে`;
      
      interval = Math.floor(seconds / 3600);
      if (interval >= 1) return `${interval} ঘণ্টা আগে`;
      
      interval = Math.floor(seconds / 60);
      if (interval >= 1) return `${interval} মিনিট আগে`;
      
      return "কিছুক্ষণ আগে";
    };
  
  if (loading) {
    return (
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900"
          >
            সাম্প্রতিক <span className="text-red-600">রক্তের অনুরোধ</span>
          </motion.h2>
          <p className="mt-4 max-w-2xl mx-auto text-gray-600">
            জরুরি ভিত্তিতে রক্ত প্রয়োজন এমন সাম্প্রতিক কিছু অনুরোধ
          </p>
        </div>

        {recentRequests.length > 0 ? (
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {recentRequests.map((req) => (
              <motion.div 
                key={req.id} 
                variants={item}
                whileHover={{ y: -5 }}
                className={`rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all ${req.emergency ? 'border-t-4 border-red-500' : 'border-t-4 border-blue-500'}`}
              >
                <div className="bg-white p-6 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${req.emergency ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                      {req.emergency ? 'জরুরি' : 'সাধারণ'}
                    </div>
                    <span className="text-sm text-gray-500">{req.time}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {req.bloodType} রক্তের প্রয়োজন
                  </h3>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">হাসপাতাল:</span> {req.hospital || 'নির্দিষ্ট করা হয়নি'}
                  </p>
                  <p className="text-gray-600 mb-4">
                    <span className="font-medium">অবস্থান:</span> {req.location}
                  </p>
                  <Link 
                    to={'/requests'} 
                    className="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
                  >
                    বিস্তারিত দেখুন <FaArrowRight className="ml-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">কোন সাম্প্রতিক অনুরোধ পাওয়া যায়নি</p>
          </div>
        )}

        <div className="text-center mt-10">
          <Link 
            to="/requests" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 shadow-sm"
          >
            সব অনুরোধ দেখুন
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecentBloodRequests;
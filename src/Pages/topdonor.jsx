import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaTint } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

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

const TopDonorsSection = () => {
  const [topDonors, setTopDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopDonors = async () => {
      try {
        const donorsRef = collection(db, 'donors');
        const q = query(
          donorsRef,
          where('status', '==', 'active'),
          where('donationCount', '>=', 0),
          orderBy('donationCount', 'desc'),
          limit(5)
        );
        
        const querySnapshot = await getDocs(q);
        const donorsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setTopDonors(donorsData);
      } catch (err) {
        console.error('Error fetching top donors:', err);
        setError('Failed to load top donors');
      } finally {
        setLoading(false);
      }
    };

    fetchTopDonors();
  }, []);

  if (loading) {
    return (
      <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">শীর্ষ রক্তদাতাদের তথ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
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

        {topDonors.length > 0 ? (
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-5 gap-6"
          >
            {topDonors.map((donor, index) => (
              <motion.div 
                key={donor.id} 
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
                  <h3 className="text-lg font-bold text-gray-800">{donor.fullName}</h3>
                  <p className="text-sm text-gray-600 mb-2">{donor.bloodType}</p>
                  <div className="flex items-center justify-center space-x-1">
                    <FaTint className="text-red-500" />
                    <span className="font-medium text-gray-900">{donor.donationCount} বার</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">কোন শীর্ষ রক্তদাতা পাওয়া যায়নি</p>
          </div>
        )}

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
  );
};

export default TopDonorsSection;
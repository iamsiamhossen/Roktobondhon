import { collection, query, where, getCountFromServer, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  FaUser, FaTint, FaHospital, FaPhone, FaCalendarAlt, 
  FaChartLine, FaChartPie, FaMapMarkerAlt, FaBell,
  FaClock, FaUserShield, FaSyringe, FaProcedures, FaAmbulance
} from 'react-icons/fa';
import { FiActivity, FiTrendingUp, FiAlertTriangle } from 'react-icons/fi';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

Chart.register(...registerables);

function StatCard({ title, value, icon, trend, color }) {
  const trendColors = {
    up: 'text-emerald-400',
    down: 'text-rose-400',
    neutral: 'text-indigo-300'
  };
  
  const trendIcons = {
    up: <FiTrendingUp className="inline ml-1" />,
    down: <FiTrendingUp className="inline ml-1 transform rotate-180" />,
    neutral: <FiActivity className="inline ml-1" />
  };

  const bgColors = {
    blue: 'from-blue-500 to-blue-600',
    red: 'from-rose-500 to-rose-600',
    green: 'from-emerald-500 to-emerald-600',
    purple: 'from-indigo-500 to-indigo-600',
    amber: 'from-amber-500 to-amber-600'
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`p-5 rounded-xl shadow-lg bg-gradient-to-br ${bgColors[color]} text-white`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-white bg-opacity-20">
          {icon}
        </div>
      </div>
      <div className={`mt-2 text-sm font-medium ${trendColors[trend]}`}>
        {trendIcons[trend]} {trend === 'up' ? 'Increased' : trend === 'down' ? 'Decreased' : 'Stable'} today
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    patients: 0,
    donors: 0,
    requests: 0,
    urgentRequests: 0,
    recentDonations: 0,
    staffMembers: 0
  });
  
  const [bloodGroupData, setBloodGroupData] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [donationTrends, setDonationTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get all counts in parallel
        const [
          patientsCount, 
          donorsCount, 
          requestsCount, 
          urgentCount,
          donationsCount,
          staffCount
        ] = await Promise.all([
          getCountFromServer(collection(db, 'patients')),
          getCountFromServer(collection(db, 'donors')),
          getCountFromServer(collection(db, 'bloodRequests')),
          getCountFromServer(query(collection(db, 'bloodRequests'), where('urgency', '==', 'urgent'))),
          getCountFromServer(query(collection(db, 'donations'), where('date', '>=', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)))),
          getCountFromServer(collection(db, 'staff'))
        ]);

        setStats({
          patients: patientsCount.data().count,
          donors: donorsCount.data().count,
          requests: requestsCount.data().count,
          urgentRequests: urgentCount.data().count,
          recentDonations: donationsCount.data().count,
          staffMembers: staffCount.data().count
        });

        // Blood group distribution
        const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        const bloodCounts = await Promise.all(
          bloodGroups.map(group => 
            getCountFromServer(query(collection(db, 'donors'), where('bloodType', '==', group)))
          )
        );
        
        setBloodGroupData({
          labels: bloodGroups,
          datasets: [{
            data: bloodCounts.map(res => res.data().count),
            backgroundColor: [
              '#EF4444', '#3B82F6', '#10B981', '#F59E0B',
              '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
            ],
            borderWidth: 0,
            borderRadius: 8
          }]
        });

        // Location data with actual city names
        const locations = ['Dhaka', 'Chittagong', 'Sylhet', 'Khulna', 'Rajshahi', 'Barishal'];
        const locationCounts = await Promise.all(
          locations.map(loc => 
            getCountFromServer(query(collection(db, 'donors'), where('city', '==', loc)))
          )
        );
        
        setLocationData({
          labels: locations,
          datasets: [{
            label: 'Donors by City',
            data: locationCounts.map(res => res.data().count),
            backgroundColor: '#6366F1',
            borderRadius: 8
          }]
        });

        // Donation trends (last 7 days)
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const trendCounts = await Promise.all(
          days.map((_, i) => {
            const dayStart = new Date();
            dayStart.setDate(dayStart.getDate() - (6 - i));
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(dayStart);
            dayEnd.setHours(23, 59, 59, 999);
            
            return getCountFromServer(
              query(collection(db, 'donations'), 
              where('date', '>=', dayStart),
              where('date', '<=', dayEnd)
            )
          )})
        );
        
        setDonationTrends({
          labels: days,
          datasets: [{
            label: 'Donations',
            data: trendCounts.map(res => res.data().count),
            borderColor: '#EC4899',
            backgroundColor: 'rgba(236, 72, 153, 0.1)',
            tension: 0.3,
            fill: true
          }]
        });

        // Recent activity with more fields
        const activitySnapshot = await getDocs(
          query(
            collection(db, 'bloodRequests'),
            orderBy('createdAt', 'desc'),
            limit(6)
          )
        );
        setRecentActivity(activitySnapshot.docs.map(doc => ({
          id: doc.id,
          patientName: doc.data().patientName,
          contactNumber: doc.data().contactNumber,
          bloodType: doc.data().bloodType,
          hospital: doc.data().hospital,
          city: doc.data().city,
          urgency: doc.data().urgency,
          status: doc.data().status,
          date: doc.data().createdAt.toDate().toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })
        })));

      } catch (err) {
        console.error("Dashboard error:", err);
        setError('Failed to load dashboard data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center text-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-6 text-lg font-medium text-gray-300">Preparing your dashboard...</p>
          <p className="mt-2 text-sm text-gray-400">Fetching the latest blood bank analytics</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md p-6 rounded-xl bg-gray-800 bg-opacity-50 backdrop-blur-sm">
          <div className="text-5xl mb-4 text-rose-500">⚠️</div>
          <h2 className="text-xl font-bold text-gray-100 mb-2">Dashboard Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Refresh Dashboard
          </button>
        </div>
      </div>
    );
  }

  // StatCard.jsx
const StatCard = ({ title, value, icon, trend, color }) => {
  const colorMap = {
    red: {
      bg: 'bg-red-100',
      text: 'text-red-600',
      border: 'border-red-200',
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      border: 'border-green-200',
    },
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      border: 'border-blue-200',
    },
    amber: {
      bg: 'bg-amber-100',
      text: 'text-amber-600',
      border: 'border-amber-200',
    },
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-600',
      border: 'border-purple-200',
    },
    neutral: {
      bg: 'bg-gray-100',
      text: 'text-gray-600',
      border: 'border-gray-200',
    },
  };

  const colors = colorMap[color] || colorMap.neutral;

  return (
    <div className={`p-5 rounded-xl shadow-sm border ${colors.border} ${colors.bg}`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full bg-white shadow-md ${colors.text} text-2xl`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500 tracking-wide">{title}</p>
          <h3 className={`text-2xl font-semibold ${colors.text}`}>{value}</h3>
        </div>
      </div>
    </div>
  );
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 text-black font-Times New Roman">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Roktobondhon Analytics</h1>
          <p className="text-gray-500 mt-1">
            <FaClock className="inline mr-1" /> Updated just now
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button className="px-4 py-2 bg-white text-black-700 rounded-lg shadow-sm hover:bg-gray-50 transition-colors border border-gray-200">
            <FaUserShield className="inline mr-2" /> Admin Tools
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
            <FiAlertTriangle className="inline mr-2" /> Emergency Mode
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-8">
  <StatCard 
    title="Total Patients" 
    value={stats.patients} 
    icon={<FaProcedures />} 
    trend="up" 
    color="purple" 
  />
  <StatCard 
    title="Active Donors" 
    value={stats.donors} 
    icon={<FaTint />} 
    trend="up" 
    color="red" 
  />
  <StatCard 
    title="Blood Requests" 
    value={stats.requests} 
    icon={<FaHospital />} 
    trend="neutral" 
    color="blue" 
  />
  <StatCard 
    title="Urgent Cases" 
    value={stats.urgentRequests} 
    icon={<FaAmbulance />} 
    trend="down" 
    color="amber" 
  />
  <StatCard 
    title="Recent Donations" 
    value={stats.recentDonations} 
    icon={<FaSyringe />} 
    trend="up" 
    color="green" 
  />
  <StatCard 
    title="Staff Members" 
    value={stats.staffMembers} 
    icon={<FaUserShield />} 
    trend="neutral" 
    color="purple" 
  />
</div>


      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Blood Group Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-lg lg:col-span-1">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FaTint className="mr-2 text-rose-500" />
              Blood Group Stats
            </h2>
            <span className="text-xs px-2 py-1 bg-rose-100 text-rose-800 rounded-full">
              Live Data
            </span>
          </div>
          <div className="h-64">
            {bloodGroupData ? (
              <Pie 
                data={bloodGroupData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        usePointStyle: true,
                        padding: 16
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.label}: ${context.raw} donors`;
                        }
                      }
                    }
                  },
                  cutout: '60%'
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <FaTint className="mx-auto text-3xl mb-2" />
                  <p>No blood group data available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Donors by Location */}
        <div className="bg-white p-6 rounded-xl shadow-lg lg:col-span-1">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-indigo-500" />
              Donors by City
            </h2>
            <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
              Updated today
            </span>
          </div>
          <div className="h-64">
            {locationData ? (
              <Bar 
                data={locationData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        drawBorder: false
                      },
                      ticks: {
                        precision: 0
                      }
                    },
                    x: {
                      grid: {
                        display: false
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <FaMapMarkerAlt className="mx-auto text-3xl mb-2" />
                  <p>No location data available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Donation Trends */}
        <div className="bg-white p-6 rounded-xl shadow-lg lg:col-span-1">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FiTrendingUp className="mr-2 text-pink-500" />
              Weekly Donations
            </h2>
            <span className="text-xs px-2 py-1 bg-pink-100 text-pink-800 rounded-full">
              Last 7 days
            </span>
          </div>
          <div className="h-64">
            {donationTrends ? (
              <Line 
                data={donationTrends}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        drawBorder: false
                      }
                    },
                    x: {
                      grid: {
                        display: false
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  elements: {
                    point: {
                      radius: 4,
                      hoverRadius: 6
                    }
                  }
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <FiTrendingUp className="mx-auto text-3xl mb-2" />
                  <p>No trend data available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <FaCalendarAlt className="mr-2 text-amber-500" />
            Recent Blood Requests
          </h2>
          <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            View All Requests →
          </button>
        </div>
        
        <div className="overflow-x-auto">
          {recentActivity.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentActivity.map(request => (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{request.patientName}</div>
                          <div className="text-sm text-gray-500">{request.contactNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        request.bloodType?.includes('+') ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {request.bloodType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.hospital}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{request.city}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        request.urgency === 'urgent' 
                          ? 'bg-red-100 text-red-800' 
                          : request.status === 'fulfilled'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                      }`}>
                        {request.urgency === 'urgent' ? 'Urgent' : request.status === 'fulfilled' ? 'Completed' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
                <FaCalendarAlt className="w-full h-full" />
              </div>
              <h3 className="text-lg font-medium text-gray-500">No recent activity</h3>
              <p className="mt-1 text-sm text-gray-400">There are no recent blood requests to display</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="bg-white p-4 rounded-xl shadow-lg flex flex-wrap justify-center gap-4">
        <button className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium flex items-center hover:opacity-90 transition-opacity">
          <FaSyringe className="mr-2" /> New Donation
        </button>
        <button className="px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium flex items-center hover:opacity-90 transition-opacity">
          <FaProcedures className="mr-2" /> Add Patient
        </button>
        <button className="px-5 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-medium flex items-center hover:opacity-90 transition-opacity">
          <FaUser className="mr-2" /> Register Donor
        </button>
        <button className="px-5 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg font-medium flex items-center hover:opacity-90 transition-opacity">
          <FaHospital className="mr-2" /> Blood Request
        </button>
      </div>
    </div>
  );
}
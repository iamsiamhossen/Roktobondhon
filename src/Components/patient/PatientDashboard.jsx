import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaUser, FaTint, FaPhone, FaMapMarkerAlt, FaPlus, FaUsers, 
  FaEdit, FaBell, FaHistory, FaSignOutAlt, FaSearch, FaHeartbeat,
  FaSyringe, FaClinicMedical, FaFileMedical, FaUserMd, FaChartLine,
  FaRegCalendarAlt, FaRegComments, FaSave, FaTimes, FaEnvelope,
  FaHome, FaUserCircle, FaCalendarAlt, FaNotesMedical
} from "react-icons/fa";
import { GiDrop, GiHealthNormal } from "react-icons/gi";
// import { GiDrop, GiDrop } from "react-icons/md";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bloodGroup: "",
    location: "",
    age: "",
    profilePhoto: ""
  });
  
  const [notifications, setNotifications] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get patient data from Firestore
          const patientDoc = await getDoc(doc(db, "patients", user.uid));
          
          if (patientDoc.exists()) {
            const patientData = patientDoc.data();
            setPatient(patientData);
            setFormData({
              name: patientData.name || "",
              email: patientData.email || user.email || "",
              phone: patientData.phone || "",
              bloodGroup: patientData.bloodGroup || "",
              location: patientData.location || "",
              age: patientData.age || "",
              profilePhoto: patientData.profilePhoto || "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg"
            });
            
            // Load notifications, appointments and medical history
            setNotifications([
              { id: 1, text: "ডোনার রহিম আপনার অনুরোধ গ্রহণ করেছেন", read: false, time: "১০ মিনিট আগে", type: "donation" },
              { id: 2, text: "ডাঃ করিম আপনাকে বার্তা পাঠিয়েছেন", read: false, time: "৩০ মিনিট আগে", type: "message" },
              { id: 3, text: "আপনার অ্যাপয়েন্টমেন্ট নিশ্চিত হয়েছে", read: false, time: "২ ঘন্টা আগে", type: "appointment" }
            ]);
            
            setUpcomingAppointments([
              { id: 1, doctor: "ডাঃ সুমনা ইসলাম", date: "১৫ এপ্রিল ২০২৫", time: "সকাল ১০:৩০", type: "ফলো-আপ", status: "confirmed" },
              { id: 2, doctor: "ডাঃ রাহুল খান", date: "২০ এপ্রিল ২০২৫", time: "বিকাল ৪:০০", type: "চেক-আপ", status: "pending" }
            ]);

            setMedicalHistory([
              { id: 1, date: "১০ জানুয়ারী ২০২৫", doctor: "ডাঃ সুমনা ইসলাম", diagnosis: "রক্তশূন্যতা", treatment: "আয়রন সাপ্লিমেন্ট", prescription: "Ferrous Sulfate 325mg" },
              { id: 2, date: "৫ ডিসেম্বর ২০২৪", doctor: "ডাঃ রাহুল খান", diagnosis: "সাধারণ চেক-আপ", treatment: "ভিটামিন ডি", prescription: "Vitamin D3 2000IU" }
            ]);
          } else {
            setError("Patient data not found");
            handleLogout();
          }
        } catch (error) {
          console.error("Error loading patient data:", error);
          setError("ডাটা লোড করতে সমস্যা হয়েছে");
          handleLogout();
        } finally {
          setLoading(false);
        }
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      setError("লগআউট করতে সমস্যা হয়েছে");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Update in Firestore
      await updateDoc(doc(db, "patients", user.uid), formData);
      
      // Update display name in auth if name changed
      if (formData.name !== user.displayName) {
        await updateProfile(user, { displayName: formData.name });
      }

      setPatient(formData);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("প্রোফাইল আপডেট করতে সমস্যা হয়েছে");
    }
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? {...n, read: true} : n
    ));
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'donation': return <GiDrop className="text-red-500" />;
      case 'message': return <FaRegComments className="text-blue-500" />;
      case 'appointment': return <FaCalendarAlt className="text-green-500" />;
      default: return <FaBell className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-red-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-2xl text-red-400">লোড হচ্ছে...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-white">
        <div className="text-xl text-red-600 p-6 bg-white rounded-lg shadow-md max-w-md text-center">
          {error}
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-gradient-to-r from-red-600 to-red-700 text-white p-4 flex justify-between items-center shadow-lg sticky top-0 z-20">
        <div className="flex items-center">
          <GiDrop className="text-2xl mr-2" />
          <h1 className="text-xl font-bold">রক্তবন্ধন</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-full hover:bg-red-500 transition-colors relative">
            <FaBell />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute top-0 right-0 bg-white text-red-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>
          <button 
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-red-500 transition-colors"
            aria-label="Logout"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar - Desktop */}
        <div className="hidden md:flex md:flex-col w-64 bg-white shadow-xl border-r border-gray-200 sticky top-0 h-screen">
          {/* Profile Section */}
          <div className="p-6 flex flex-col items-center border-b border-gray-100 bg-gradient-to-b from-red-50 to-white">
            <div className="relative mb-4">
              <img
                src={formData.profilePhoto}
                alt="Patient"
                className="w-24 h-24 rounded-full border-4 border-red-400 object-cover shadow-md"
              />
              <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full border-2 border-red-400">
                <FaUserMd className="text-red-500 text-sm" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-center text-gray-800">{patient.name}</h2>
            <p className="text-gray-600 flex items-center mt-1">
              <GiDrop className={`mr-2 text-lg ${patient.bloodGroup?.includes('+') ? 'text-red-500' : 'text-blue-500'}`} /> 
              <span className="font-medium">{patient.bloodGroup}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1 flex items-center">
              <FaMapMarkerAlt className="mr-1" /> {patient.location}
            </p>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1 flex-1">
            <button 
              onClick={() => setActiveTab("dashboard")}
              className={`w-full text-left p-3 rounded-lg flex items-center transition-all ${activeTab === "dashboard" ? 'bg-red-100 text-red-600 font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <FaHome className="mr-3 text-red-400" /> ড্যাশবোর্ড
            </button>
            <button 
              onClick={() => setActiveTab("appointments")}
              className={`w-full text-left p-3 rounded-lg flex items-center transition-all ${activeTab === "appointments" ? 'bg-red-100 text-red-600 font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <FaCalendarAlt className="mr-3 text-purple-400" /> অ্যাপয়েন্টমেন্ট
            </button>
            <button 
              onClick={() => setActiveTab("medical")}
              className={`w-full text-left p-3 rounded-lg flex items-center transition-all ${activeTab === "medical" ? 'bg-red-100 text-red-600 font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <FaNotesMedical className="mr-3 text-green-400" /> মেডিকেল রেকর্ড
            </button>
            <button 
              onClick={() => setActiveTab("history")}
              className={`w-full text-left p-3 rounded-lg flex items-center transition-all ${activeTab === "history" ? 'bg-red-100 text-red-600 font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <FaHistory className="mr-3 text-amber-400" /> ডোনেশন ইতিহাস
            </button>
            <button 
              onClick={() => setActiveTab("profile")}
              className={`w-full text-left p-3 rounded-lg flex items-center transition-all ${activeTab === "profile" ? 'bg-red-100 text-red-600 font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <FaUserCircle className="mr-3 text-blue-400" /> প্রোফাইল
            </button>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <button 
              onClick={handleLogout}
              className="w-full p-3 rounded-lg flex items-center justify-center text-red-600 hover:bg-red-100 transition-colors font-medium"
            >
              <FaSignOutAlt className="mr-3" /> লগআউট
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
          {/* Mobile Profile Card */}
          <div className="md:hidden bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-200">
            <div className="flex items-center">
              <div className="relative">
                <img
                  src={formData.profilePhoto}
                  alt="Patient"
                  className="w-16 h-16 rounded-full border-4 border-red-400 object-cover mr-4"
                />
                <div className="absolute bottom-0 right-3 bg-white p-1 rounded-full border border-red-400">
                  <FaUserMd className="text-red-500 text-xs" />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">{patient.name}</h2>
                <p className="text-gray-600 flex items-center text-sm">
                  <GiDrop className={`mr-1 text-base ${patient.bloodGroup?.includes('+') ? 'text-red-500' : 'text-blue-500'}`} /> 
                  {patient.bloodGroup} • {patient.age} বছর
                </p>
                <p className="text-gray-500 text-xs flex items-center mt-1">
                  <FaPhone className="mr-1" /> {patient.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar - Mobile */}
          <div className="md:hidden mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="খুঁজুন..."
                className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>

          {/* Dashboard Content */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Welcome Card */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-20">
                  <GiHealthNormal className="text-white text-9xl" />
                </div>
                <h1 className="text-2xl font-bold mb-2 relative z-10">স্বাগতম, {patient.name.split(' ')[0]}!</h1>
                <p className="opacity-90 relative z-10">আপনার স্বাস্থ্য সংক্রান্ত সকল তথ্য এখানে সুরক্ষিত</p>
                <div className="mt-4 flex space-x-3 relative z-10">
                  {/* <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm text-black ">স্বাস্থ্য</span>
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm text-black">রক্তদান</span> */}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 flex items-center">
                  <div className="p-3 rounded-full bg-red-100 text-red-500 mr-3">
                    <FaHeartbeat className="text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">রক্তের গ্রুপ</p>
                    <p className="font-bold text-gray-800">{patient.bloodGroup}</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-3">
                    <FaRegCalendarAlt className="text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">অ্যাপয়েন্টমেন্ট</p>
                    <p className="font-bold text-gray-800">{upcomingAppointments.length}</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-500 mr-3">
                    <FaHistory className="text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">ডোনেশন</p>
                    <p className="font-bold text-gray-800">৩ বার</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-3">
                    <FaBell className="text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">নোটিফিকেশন</p>
                    <p className="font-bold text-gray-800">{notifications.filter(n => !n.read).length}</p>
                  </div>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Notifications */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 flex items-center">
                      <FaBell className="text-red-500 mr-2" /> নোটিফিকেশন
                    </h3>
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {notifications.filter(n => !n.read).length} নতুন
                    </span>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {notifications.slice(0, 3).map(notification => (
                      <div 
                        key={notification.id} 
                        className={`p-4 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-red-50' : ''}`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="flex items-start">
                          <div className="mt-1 mr-3">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-800">{notification.text}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t border-gray-200">
                    <button className="text-red-500 text-sm font-medium hover:underline">
                      সব দেখুন
                    </button>
                  </div>
                </div>

                {/* Upcoming Appointments */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 flex items-center">
                      <FaCalendarAlt className="text-purple-500 mr-2" /> আসন্ন অ্যাপয়েন্টমেন্ট
                    </h3>
                    <button 
                      className="text-sm text-purple-600 hover:underline"
                      onClick={() => setActiveTab("appointments")}
                    >
                      সব দেখুন
                    </button>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {upcomingAppointments.slice(0, 2).map(appointment => (
                      <div key={appointment.id} className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-800">{appointment.doctor}</h4>
                            <p className="text-sm text-gray-600">{appointment.type}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              <FaRegCalendarAlt className="inline mr-1" />
                              {appointment.date} • {appointment.time}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            appointment.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {appointment.status === 'confirmed' ? 'নিশ্চিত' : 'পেন্ডিং'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t border-gray-200">
                    <button 
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                      onClick={() => setActiveTab("appointments")}
                    >
                      নতুন অ্যাপয়েন্টমেন্ট
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-4">দ্রুত অ্যাকশন</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button 
                    className="p-3 rounded-xl border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-colors flex flex-col items-center"
                    onClick={() => setActiveTab("appointments")}
                  >
                    <div className="p-3 rounded-full bg-red-100 text-red-500 mb-2">
                      <FaRegCalendarAlt className="text-xl" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">অ্যাপয়েন্টমেন্ট</span>
                  </button>
                  
                  <button 
                    className="p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors flex flex-col items-center"
                    onClick={() => navigate('/find-donor')}
                  >
                    <div className="p-3 rounded-full bg-blue-100 text-blue-500 mb-2">
                      <FaUsers className="text-xl" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">ডোনার খুঁজুন</span>
                  </button>
                  
                  <button 
                    className="p-3 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors flex flex-col items-center"
                    onClick={() => setActiveTab("medical")}
                  >
                    <div className="p-3 rounded-full bg-green-100 text-green-500 mb-2">
                      <FaFileMedical className="text-xl" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">মেডিকেল রেকর্ড</span>
                  </button>
                  
                  <button 
                    className="p-3 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors flex flex-col items-center"
                    onClick={() => navigate('/emergency')}
                  >
                    <div className="p-3 rounded-full bg-purple-100 text-purple-500 mb-2">
                      <GiDrop className="text-xl" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">জরুরী সাহায্য</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === "appointments" && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <FaCalendarAlt className="text-purple-500 mr-2" /> আমার অ্যাপয়েন্টমেন্ট
                </h2>
                <button 
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium flex items-center"
                  onClick={() => navigate('/book-appointment')}
                >
                  <FaPlus className="mr-2" /> নতুন অ্যাপয়েন্টমেন্ট
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ডাক্তার</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">তারিখ</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">সময়</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ধরণ</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">স্ট্যাটাস</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {upcomingAppointments.map((appointment) => (
                      <tr key={appointment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <FaUserMd className="text-purple-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{appointment.doctor}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.time}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            appointment.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {appointment.status === 'confirmed' ? 'নিশ্চিত' : 'পেন্ডিং'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-red-500 hover:text-red-700 mr-3">বাতিল</button>
                          <button className="text-blue-500 hover:text-blue-700">বিস্তারিত</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Medical Records Tab */}
          {activeTab === "medical" && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <FaFileMedical className="text-green-500 mr-2" /> মেডিকেল রেকর্ড
                </h2>
                <button 
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium flex items-center"
                  onClick={() => navigate('/add-record')}
                >
                  <FaPlus className="mr-2" /> নতুন রেকর্ড
                </button>
              </div>
              
              <div className="space-y-4">
                {medicalHistory.map(record => (
                  <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800">{record.diagnosis}</h3>
                        <p className="text-sm text-gray-600 mt-1">{record.doctor}</p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                          <FaRegCalendarAlt className="mr-1" /> {record.date}
                        </p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        চিকিৎসা সম্পন্ন
                      </span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <h4 className="text-sm font-medium text-gray-700">চিকিৎসা:</h4>
                      <p className="text-sm text-gray-600 mt-1">{record.treatment}</p>
                    </div>
                    <div className="mt-2">
                      <h4 className="text-sm font-medium text-gray-700">প্রেসক্রিপশন:</h4>
                      <p className="text-sm text-gray-600 mt-1">{record.prescription}</p>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full">
                        বিস্তারিত
                      </button>
                      <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full">
                        প্রেসক্রিপশন
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Profile Edit Tab */}
{activeTab === "profile" && (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold text-gray-800 flex items-center">
        <FaUserCircle className="text-blue-500 mr-2" /> প্রোফাইল
      </h2>
      {editMode ? (
        <div className="flex space-x-2">
          <button 
            onClick={() => setEditMode(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
          >
            <FaTimes className="mr-2" /> বাতিল
          </button>
          <button 
            onClick={handleSaveProfile}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center"
          >
            <FaSave className="mr-2" /> সংরক্ষণ
          </button>
        </div>
      ) : (
        <button 
          onClick={() => setEditMode(true)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center"
        >
          <FaEdit className="mr-2" /> এডিট
        </button>
      )}
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col items-center">
        <div className="relative mb-4">
          <img
            src={formData.profilePhoto || patient.profilePhoto}
            alt="Patient"
            className="w-32 h-32 rounded-full border-4 border-red-400 object-cover shadow-md"
          />
          {editMode && (
            <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full border border-gray-300 shadow-sm hover:bg-gray-100 cursor-pointer">
              <FaEdit className="text-gray-600" />
              <input 
                type="file" 
                className="hidden" 
                // onChange={handlePhotoChange}
                accept="image/*"
              />
            </label>
          )}
        </div>
        <h3 className="text-lg font-bold text-gray-800">{patient.name}</h3>
        <p className="text-gray-600 flex items-center mt-1">
          <GiDrop className={`mr-2 text-lg ${patient.bloodGroup?.includes('+') ? 'text-red-500' : 'text-blue-500'}`} /> 
          <span className="font-medium">{patient.bloodGroup}</span>
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">নাম</label>
          {editMode ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent"
            />
          ) : (
            <p className="p-2 bg-gray-50 rounded-lg">{patient.name}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ইমেইল</label>
          {editMode ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent"
            />
          ) : (
            <p className="p-2 bg-gray-50 rounded-lg">{patient.email}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ফোন নম্বর</label>
          {editMode ? (
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent"
            />
          ) : (
            <p className="p-2 bg-gray-50 rounded-lg">{patient.phone}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">রক্তের গ্রুপ</label>
          {editMode ? (
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent"
            >
              <option value="">নির্বাচন করুন</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          ) : (
            <p className="p-2 bg-gray-50 rounded-lg">{patient.bloodGroup || "উল্লেখ করা হয়নি"}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">জন্ম তারিখ</label>
          {editMode ? (
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent"
            />
          ) : (
            <p className="p-2 bg-gray-50 rounded-lg">
              {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('bn-BD') : "উল্লেখ করা হয়নি"}
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">লিঙ্গ</label>
          {editMode ? (
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent"
            >
              <option value="">নির্বাচন করুন</option>
              <option value="male">পুরুষ</option>
              <option value="female">মহিলা</option>
              <option value="other">অন্যান্য</option>
            </select>
          ) : (
            <p className="p-2 bg-gray-50 rounded-lg">
              {patient.gender === "male" ? "পুরুষ" : 
               patient.gender === "female" ? "মহিলা" : 
               patient.gender === "other" ? "অন্যান্য" : "উল্লেখ করা হয়নি"}
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ঠিকানা</label>
          {editMode ? (
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent"
            />
          ) : (
            <p className="p-2 bg-gray-50 rounded-lg">{patient.address || "উল্লেখ করা হয়নি"}</p>
          )}
        </div>
      </div>
    </div>
  </div>
)}
{/* Donation History Tab */}
{activeTab === "history" && (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold text-gray-800 flex items-center">
        <GiDrop className="text-red-500 mr-2" /> ডোনেশন ইতিহাস
      </h2>
      <button 
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium flex items-center"
        onClick={() => navigate('/donate-blood')}
      >
        <FaPlus className="mr-2" /> নতুন ডোনেশন
      </button>
    </div>
    
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">তারিখ</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">স্থান</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">রক্তের পরিমাণ</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">রিসিপিয়েন্ট</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">স্ট্যাটাস</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">১০ মার্চ ২০২৫</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ঢাকা মেডিকেল কলেজ</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">১ ব্যাগ</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">আনিকা ইসলাম (A+)</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                সফল
              </span>
            </td>
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">১৫ জানুয়ারী ২০২৫</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">স্যার সলিমুল্লাহ মেডিকেল কলেজ</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">১ ব্যাগ</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">রহিম আহমেদ (B+)</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                সফল
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
)}
{/* Add this inside the profile tab, after the address field */}
<div className="pt-4 mt-4 border-t border-gray-200">
  <h3 className="text-lg font-medium text-gray-800 mb-3">পাসওয়ার্ড পরিবর্তন</h3>
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">বর্তমান পাসওয়ার্ড</label>
      <input
        type="password"
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent"
        placeholder="বর্তমান পাসওয়ার্ড"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">নতুন পাসওয়ার্ড</label>
      <input
        type="password"
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent"
        placeholder="নতুন পাসওয়ার্ড"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">পাসওয়ার্ড নিশ্চিত করুন</label>
      <input
        type="password"
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent"
        placeholder="পাসওয়ার্ড নিশ্চিত করুন"
      />
    </div>
    <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
      পাসওয়ার্ড পরিবর্তন করুন
    </button>
  </div>
</div></div></div>
{/* Add this after the password section */}



</div>
  );};
export default PatientDashboard;
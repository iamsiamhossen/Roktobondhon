import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import Login from "./Components/Login";
import Register from "./Components/Register";
import RequestList from "./Pages/RequestList";
import Dashboard from "./Components/Dashboard";
import PrivateRoute from "./Components/PrivateRoute";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import NotFound from './Pages/NotFound';
import FindDonors from "./Pages/FindDonors";
import BloodRequestForm from "./Components/BloodRequestForm";
import PatientDashboard from "./Components/patient/PatientDashboard";
import DonorDashboard from "./Components/donor/DonorDashboard";
import AdminDashboard from "./Components/admin/admindashboard";
import ScrollToTop from "./Components/Scrolltop";
import VerifyEmail from "./Components/Verifyemail";
import AdminLogin from "./components/admin/adminlogin";
import DonorLogin from "./components/donor/DonorLogin";
import PatientLogin from "./components/patient/PatientLogin";
import DonorRegister from "./components/donor/DonorRegister";
import PatientRegister from "./components/patient/PatientRegister";
import TopDoner from "./Pages/topdonor";


// import PatientRegister from "./Components/patient/PatientRegister";

function App() {
  return (
   
<Router>
      
      <div className="flex flex-col min-h-screen overflow-x-hidden">
        <Navbar />
        <ScrollToTop />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/finddonor" element={<FindDonors />} />
            <Route path="/requestblood" element={<BloodRequestForm />} />
            {/* <Route path="/donors" element={<DonorList />} /> */}
            <Route path="/requests" element={<RequestList />} />
            <Route path= "/verify-email" element={<VerifyEmail />} />
            <Route path ="/admin/login" element={<AdminLogin/>}/>
            <Route path ="/donor/login" element={<DonorLogin/>}/>
            <Route path ="/patient/login" element={<PatientLogin/>}/>
            <Route path ="/patient/register" element = {<PatientRegister/>}/>
            <Route path ="/donor/register" element = {<DonorRegister/>}/>
            <Route path ="/top/donor" element={<TopDoner/>}/>



            {/* Protected Routes */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/patient/dashboard" element={<PrivateRoute><PatientDashboard /></PrivateRoute>} />
            <Route path="/donor/dashboard" element={<PrivateRoute><DonorDashboard /></PrivateRoute>} />
            <Route path="/admin/dashboard" element={<AdminDashboard/>} />

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
   
    
  );
}

export default App;

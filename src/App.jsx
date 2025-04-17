import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import Login from "./Components/Login";
import Register from "./Components/Register";
import DonorList from "./Components/DonorList";
import RequestList from "./Pages/RequestList";
import Dashboard from "./Components/Dashboard";
import PrivateRoute from "./Components/PrivateRoute";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import NotFound from './Pages/NotFound';
import FindDonors from "./Pages/FindDonors";
import BloodRequestForm from "./Components/BloodRequestForm";
// import PatientRegister from "./Components/patient/PatientRegister";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
      <Route path="/finddonor" element={<FindDonors />} />
      <Route path="/requestblood" element={<BloodRequestForm />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/donors" element={<DonorList />} />
        <Route path="/requests" element={<RequestList />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="*" element={<NotFound />} />
        {/* <Route path="/PatientRegister" element={<PatientRegister />} /> */}
      </Routes>

      
      <Footer />
    </Router>
  );
}

export default App;

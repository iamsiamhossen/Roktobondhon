import { FaUserInjured, FaHandHoldingHeart, FaUserShield, FaTint } from "react-icons/fa";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const auth = getAuth(app);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Reload user to get latest data
          await user.reload();
          const currentUser = auth.currentUser;
          
          // Get the user's token to check claims
          const token = await currentUser.getIdTokenResult(true);
          
          if (token.claims.admin) {
            // Skip email verification for admin and redirect directly
            navigate("/admin/dashboard");
            return;
          } else {
            // For non-admin users, check email verification
            if (!currentUser.emailVerified) {
              await signOut(auth);
              navigate('/verify-email', { 
                state: { email: user.email } 
              });
              return;
            }
            
            // Redirect other roles after verification
            if (token.claims.donor) navigate("/donor/dashboard");
            else if (token.claims.patient) navigate("/patient/dashboard");
            else {
              await signOut(auth);
              alert("আপনার অ্যাক্সেস পাওয়ার জন্য অনুমোদন প্রয়োজন");
            }
          }
        } catch (error) {
          console.error("Error verifying user:", error);
          await signOut(auth);
        }
      }
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center " style={{backgroundImage: "url('https://img.freepik.com/free-vector/doctors-concept-illustration_114360-1515.jpg?t=st=1746252163~exp=1746255763~hmac=569edb6b2da69c3e5dd9c199ae8647d18390d758f6c7b76e32e67b86be1f1fef&w=1380')"}}>
      
      <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl w-full max-w-md">
        
        {/* হেডার */}
        <div className="text-center mb-8">
          <FaTint className="text-red-500 text-5xl mx-auto mb-3" />
          <h1 className="text-3xl font-bold text-red-600">রক্তবন্ধন</h1>
          <p className="text-red-400">জীবন বাঁচাতে রক্ত দিন</p>
        </div>

        {/* রোল সিলেকশন বাটন */}
        <div className="space-y-4">
          <button 
            onClick={() => navigate("/patient/login")}
            className="flex items-center justify-center w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
          >
            <FaUserInjured className="mr-2" />
            রোগী লগইন
          </button>

          <button 
            onClick={() => navigate("/donor/login")}
            className="flex items-center justify-center w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
          >
            <FaHandHoldingHeart className="mr-2" />
            রক্তদাতা লগইন
          </button>

          {/* <button 
            onClick={() => navigate("/admin/login")}
            className="flex items-center justify-center w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
          >
            <FaUserShield className="mr-2" />
            অ্যাডমিন লগইন
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
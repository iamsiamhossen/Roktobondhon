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
          // ইমেইল ভেরিফিকেশন চেক
          await user.reload();
          const currentUser = auth.currentUser;
          
          if (!currentUser.emailVerified) {
            await signOut(auth);
            navigate('/verify-email', { 
              state: { email: user.email } 
            });
            return;
          }

          // রোল চেক
          // const token = await currentUser.getIdTokenResult(true);
          // if (token.claims.admin) navigate("/admin/dashboard");
          // else if (token.claims.donor) navigate("/donor/dashboard");
          // else if (token.claims.patient) navigate("/patient/dashboard");
          // else {
          //   await signOut(auth);
          //   alert("আপনার অ্যাক্সেস পাওয়ার জন্য অনুমোদন প্রয়োজন");
          // }
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
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{backgroundImage: "url('your-bg-image.jpg')"}}>
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

          <button 
            onClick={() => navigate("/admin/login")}
            className="flex items-center justify-center w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
          >
            <FaUserShield className="mr-2" />
            অ্যাডমিন লগইন
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
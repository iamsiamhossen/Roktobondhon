import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";

const PatientLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();

  // Check user auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (!user.emailVerified) {
          await auth.signOut();
          setIsCheckingAuth(false);
          return;
        }

        const patientDoc = await getDoc(doc(db, 'patients', user.uid));
        if (patientDoc.exists()) {
          navigate('/patient/dashboard');
        } else {
          await auth.signOut();
          setIsCheckingAuth(false);
        }
      } else {
        setIsCheckingAuth(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        await auth.signOut();
        setError('আপনার ইমেইল ভেরিফাই করা হয়নি। দয়া করে আপনার ইমেইল চেক করুন।');
        setLoading(false);
        return;
      }

      const patientDoc = await getDoc(doc(db, 'patients', user.uid));
      if (!patientDoc.exists()) {
        await auth.signOut();
        setError('এই ইমেইল রোগী হিসেবে রেজিস্টার্ড নয়।');
        setLoading(false);
        return;
      }

    } catch (error) {
      switch (error.code) {
        case 'auth/user-not-found':
          setError('এই ইমেইলে কোনো একাউন্ট নেই');
          break;
        case 'auth/wrong-password':
          setError('ভুল পাসওয়ার্ড');
          break;
        case 'auth/too-many-requests':
          setError('অনেকবার চেষ্টা করা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন');
          break;
        case 'auth/invalid-email':
          setError('অবৈধ ইমেইল ঠিকানা');
          break;
        default:
          setError('লগইনে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন');
      }
      setLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50">
        <FaSpinner className="animate-spin text-4xl text-rose-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 to-rose-200 p-4 font-kalpurush text-black">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-rose-600">রোগীর লগইন</h2>

        {error && (
          <div className="bg-rose-100 text-rose-700 border border-rose-300 px-4 py-3 mb-4 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <label className="text-sm text-gray-700 block mb-1">ইমেইল</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                placeholder="আপনার ইমেইল দিন"
              />
            </div>
          </div>

          <div className="relative">
            <label className="text-sm text-gray-700 block mb-1">পাসওয়ার্ড</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none text-black"
                placeholder="আপনার পাসওয়ার্ড দিন"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition duration-300 ${
              loading ? 'bg-rose-400 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-700'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <FaSpinner className="animate-spin" />
                লগইন হচ্ছে...
              </span>
            ) : (
              "লগইন করুন"
            )}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          একাউন্ট নেই?{" "}
          <a href="/patient/register" className="text-rose-600 font-medium hover:underline">
            রেজিস্টার করুন
          </a>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;

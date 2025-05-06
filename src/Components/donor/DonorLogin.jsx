import React, { useState, useEffect } from 'react';
import { auth, signInWithEmailAndPassword } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const DonorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();

  // Check initial auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if email is verified
        if (!user.emailVerified) {
          await auth.signOut();
          setIsCheckingAuth(false);
          return;
        }

        // Check if user is a donor
        const donorDoc = await getDoc(doc(db, 'donors', user.uid));
        if (donorDoc.exists()) {
          navigate('/donor/dashboard');
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if email is verified
      if (!user.emailVerified) {
        await auth.signOut();
        setError('আপনার ইমেইল ভেরিফাই করা হয়নি। দয়া করে আপনার ইমেইল চেক করুন।');
        setLoading(false);
        return;
      }

      // Check if user is a donor
      const donorDoc = await getDoc(doc(db, 'donors', user.uid));
      
      if (!donorDoc.exists()) {
        await auth.signOut();
        setError('আপনার একাউন্ট ডোনার হিসেবে রেজিস্টার্ড নয়');
        setLoading(false);
        return;
      }

      // Redirect will be handled by the onAuthStateChanged listener
      
    } catch (error) {
      console.error('Login error:', error);
      switch(error.code) {
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-red-600 mx-auto mb-4" />
          <p className="text-gray-700">চেক করা হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4 text-black">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-green-600 p-6 text-white text-center">
          <h2 className="text-2xl font-bold">ডোনার লগইন</h2>
          <p className="mt-1 text-red-100">জীবন বাঁচাতে আপনার একাউন্টে প্রবেশ করুন</p>
        </div>

        {/* Form */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ইমেইল <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="আপনার ইমেইল দিন"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                পাসওয়ার্ড <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="আপনার পাসওয়ার্ড দিন"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-green-600 text-white rounded-lg transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    লগইন হচ্ছে...
                  </>
                ) : (
                  'লগইন করুন'
                )}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center text-sm">
            <button
              onClick={() => navigate('/forgot-password')}
              className="text-red-600 hover:underline"
            >
              পাসওয়ার্ড ভুলে গেছেন?
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              একাউন্ট নেই?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-red-600 font-medium hover:underline"
              >
                রেজিস্ট্রেশন করুন
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorLogin;
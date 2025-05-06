import React, { useState, useEffect } from "react";
import { FaShieldAlt, FaLock } from "react-icons/fa";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("admin@bloodbond.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();

  // Check for immediate redirect if already logged in
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult(true);
          if (idTokenResult.claims.admin) {
            navigate("/admin/dashboard");
          }
        } catch (error) {
          console.error("Session check error:", error);
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const auth = getAuth();
  
    try {
      // 1. Sign in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // 2. Force token refresh to get latest claims
      const idTokenResult = await userCredential.user.getIdTokenResult(true);
      
      // 3. Verify admin claims
      if (!idTokenResult.claims.admin) {
        await auth.signOut();
        throw new Error("Admin privileges not found");
      }
      
      // 4. Redirect to admin dashboard
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.code === "auth/invalid-credential" 
          ? "Invalid admin credentials" 
          : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Enhanced error messages
  const getErrorMessage = (code) => {
    const messages = {
      "auth/invalid-credential": "Invalid admin credentials",
      "auth/user-not-found": "Admin account not found",
      "auth/wrong-password": "Incorrect password",
      "auth/too-many-requests": "Account temporarily locked due to many failed attempts",
      "auth/network-request-failed": "Network error. Please check your connection",
      "default": "Admin authentication failed"
    };
    return messages[code] || messages.default;
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-white-600 to-white-800 text-white">
      {/* Security Shield Animation */}
      <div className="absolute top-1/4 left-1/4 opacity-10">
        <FaShieldAlt className="text-9xl animate-pulse" />
      </div>
      
      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-black p-8 rounded-2xl shadow-2xl backdrop-blur-lg border border-white/20">
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <FaShieldAlt className="text-6xl text-indigo-300 mb-4" />
            {verifying && (
              <FaLock className="absolute -right-2 -bottom-2 text-xl text-yellow-300 animate-bounce" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-white/80">Restricted access to authorized personnel only</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-400/30 text-red-100 rounded-lg text-center border border-red-400/50">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 text-white rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all placeholder-white/50"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 text-white rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all placeholder-white/50"
              required
              disabled={loading}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center ${
              loading ? "opacity-80" : "hover:shadow-indigo-500/30 hover:scale-[1.02]"
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {verifying ? "Verifying Privileges..." : "Authenticating..."}
              </>
            ) : (
              "Access Admin Dashboard"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
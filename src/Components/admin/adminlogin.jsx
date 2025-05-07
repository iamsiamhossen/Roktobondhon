import React, { useState, useEffect } from "react";
import { FaShieldAlt, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase";

const AdminLogin = () => {
  const [email, setEmail] = useState("admin@bloodbond.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth(app);

  // Check for existing admin session
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const token = await user.getIdTokenResult(true);
          if (token.claims.admin) {
            navigate("/admin/dashboard", { replace: true });
          } else {
            await auth.signOut();
          }
        } catch (error) {
          console.error("Session check error:", error);
        }
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // ✅ Force refresh to get updated custom claims
      const token = await userCredential.user.getIdTokenResult(true);
      console.log("Token claims:", token.claims); // 👈 Add this line for debug
  
      // ✅ Check admin claim
      if (!token.claims.admin) {
        await auth.signOut();
        throw new Error("Unauthorized: Admin privileges not found");
      }
  
      // ✅ Optional: Warn if email not verified (but allow if admin)
      if (!userCredential.user.emailVerified) {
        console.warn("⚠️ Admin email not verified – continuing due to admin privileges");
      }
  
      navigate("/admin/dashboard");
  
    } catch (error) {
      console.error("Admin login error:", error);
      setError(
        error.code === "auth/wrong-password" ? "Incorrect password" :
        error.code === "auth/user-not-found" ? "Admin account not found" :
        error.message.includes("privileges") ? error.message :
        "Admin authentication failed"
      );
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
        <div className="text-center mb-8">
          <FaShieldAlt className="text-5xl text-indigo-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white">Admin Authentication</h1>
          <p className="text-gray-400">System administrator access only</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 text-red-100 rounded-lg border border-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 text-white"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 text-white pr-12"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex justify-center items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  {/* Spinner */}
                </svg>
                Verifying...
              </>
            ) : "Login as Admin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

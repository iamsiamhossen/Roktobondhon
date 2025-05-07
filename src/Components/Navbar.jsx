import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // New state for admin check
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Check for admin claims
        const idToken = await currentUser.getIdTokenResult(true);
        setIsAdmin(!!idToken.claims.admin);
        
        // Only set userType from sessionStorage if not admin
        if (!idToken.claims.admin) {
          const storedType = sessionStorage.getItem("userType");
          setUserType(storedType);
        } else {
          setUserType("admin");
        }
      } else {
        setIsAdmin(false);
        setUserType(null);
      }
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    sessionStorage.removeItem("userType");
    setUser(null);
    setUserType(null);
    setIsAdmin(false);
    setIsMenuOpen(false);
    navigate("/login");
  };

  const handleProfileClick = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      // Force refresh to get latest claims
      const idToken = await user.getIdTokenResult(true);
      
      if (idToken.claims.admin) {
        // Skip verification for admin users
        navigate("/admin/dashboard");
      } else {
        // For non-admin users, check verification
        await user.reload();
        if (!user.emailVerified) {
          navigate("/verify-email");
          return;
        }
        // Redirect based on user type
        navigate(userType === "donor" 
          ? "/donor/dashboard" 
          : "/patient/dashboard");
      }
    } catch (error) {
      console.error("Profile navigation error:", error);
    }
  };

  if (isLoading) return <div className="h-16 bg-white"></div>;

  const navItems = [
    { path: "/", label: "হোম" },
    { path: "/requests", label: "রক্তের অনুরোধ তালিকা" },
    { path: "/requestblood", label: "পোস্ট করুন" },
    ...(user
      ? [
          {
            path: isAdmin 
              ? "/admin/dashboard" 
              : userType === "donor" 
                ? "/donor/dashboard" 
                : "/patient/dashboard",
            label: "প্রোফাইল",
            onClick: handleProfileClick // Add click handler for profile
          },
        ]
      : []),
  ];

  const authItems = !user
    ? [
        { path: "/login", label: "লগইন" },
        { path: "/register", label: "রেজিস্টার" },
      ]
    : [
        
      ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg">
        <div className="container mx-auto flex justify-between items-center p-4">
          <Link
            to="/"
            className="text-3xl font-extrabold text-white drop-shadow-md hover:text-yellow-300 transition-all font-kalpurush"
          >
            রক্তবন্ধন
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 text-lg font-medium transition-colors ${
                  location.pathname === item.path
                    ? "text-yellow-300"
                    : "text-white hover:text-yellow-300"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* রক্ত অনুরোধ বোতাম */}
            {/* <Link
              to="/requestblood"
              className="px-4 py-2 rounded-lg text-lg text-white hover:text-yellow-300"
            >
              পোস্ট করুন 
            </Link> */}

            {authItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-lg font-medium transition-colors ${
                  location.pathname === item.path
                    ? "bg-white text-red-600"
                    : "bg-red-700 hover:bg-red-800 text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {user && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-lg font-medium bg-red-700 hover:bg-red-800 text-white transition-colors"
              >
                লগআউট
              </button>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? "✖" : "☰"}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="fixed top-20 right-4 left-4 z-40 bg-white text-black shadow-xl rounded-lg p-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block py-3 px-4 text-lg hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}


          {authItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block py-3 px-4 text-lg hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {user && (
            <button
              onClick={handleLogout}
              className="block w-full py-3 px-4 text-lg text-left hover:bg-gray-100 rounded"
            >
              লগআউট
            </button>
          )}
        </div>
      )}

      <div className="h-16"></div>
    </>
  );
};

export default Navbar;

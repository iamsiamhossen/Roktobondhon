import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center p-4">
         {/* 🏠 "রক্তবন্ধন" = Home Link */}
         <Link to="/" className="text-3xl font-extrabold text-white drop-shadow-md hover:text-yellow-300 transition-all font-kalpurush">
          রক্তবন্ধন
        </Link>

        {/* 🖥️ Classy Desktop Menu */}
        <div className="hidden md:flex">
          {[
            { path: "/", label: "হোম" },
            { path: "/requests", label: "রক্তের অনুরোধ তালিকা" },
            { path: "/login", label: "লগিন" },
            { path: "/register", label: "রেজিস্ট্রেশন" }
          ].map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`relative text-xl font-medium px-4 py-2 transition-all duration-300 
              ${
                location.pathname === item.path
                  ? "text-yellow-300 after:w-full"
                  : "text-white after:w-0 hover:text-yellow-200"
              } 
              after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-yellow-300 after:transition-all after:duration-300`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden btn btn-circle btn-outline text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? "✖" : "☰"}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-16 right-4 w-3/4 bg-white text-black shadow-lg rounded-lg p-5 z-50">
            {["/", "/requests", "/login", "/register"].map((path, index) => (
              <Link
                key={index}
                to={path}
                className="block py-2 text-lg hover:text-red-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {path === "/" ? "হোম" : path === "/requests" ? "রক্তের অনুরোধ তালিকা" : path === "/login" ? "লগিন" : "রক্তদাতা রেজিস্ট্রেশন"}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

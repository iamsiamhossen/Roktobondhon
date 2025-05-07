import React from 'react';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaHeart, 
  FaUserShield,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const handleAdminClick = () => {
    navigate("/admin/login");
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12 font-kalpurush">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Organization Info Column */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-5">
              <div className="bg-red-600 p-2 rounded-lg mr-3">
                <FaHeart className="text-2xl" />
              </div>
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600">
                রক্তবন্ধন
              </h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              রক্তবন্ধন হল বাংলাদেশের সবচেয়ে বড় রক্তদাতা নেটওয়ার্ক। আমরা জরুরি অবস্থায় রক্তের জন্য অনুরোধ এবং রক্তদাতা খুঁজে পেতে সাহায্য করি।
            </p>
            <div className="mt-4 flex flex-wrap space-x-3">
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-full text-sm font-medium transition-all duration-300 transform hover:-translate-y-1 mb-2 md:mb-0">
                ডাউনলোড অ্যাপ
              </button>
              <button className="px-4 py-2 border border-red-600 text-red-400 hover:bg-red-600 hover:text-white rounded-full text-sm font-medium transition-all duration-300 transform hover:-translate-y-1">
                সাবস্ক্রাইব
              </button>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-xl font-bold mb-6 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-gradient-to-r from-red-500 to-red-700">
              প্রয়োজনীয় লিঙ্ক
            </h3>
            <ul className="space-y-3">
              {[
                { name: "আমাদের সম্পর্কে", link: "/about" },
                { name: "গোপনীয়তা নীতি", link: "/privacy" },
                { name: "শর্তাবলী", link: "/terms" },
                { name: "যোগাযোগ", link: "/contact" },
                { name: "এফএকিউ", link: "/faq" },
                { name: "ব্লগ", link: "/blog" },
              ].map((item, index) => (
                <li key={index}>
                  <a 
                    href={item.link} 
                    className="text-gray-300 hover:text-red-400 transition-all duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-red-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info Column */}
          <div>
            <h3 className="text-xl font-bold mb-6 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-gradient-to-r from-red-500 to-red-700">
              যোগাযোগ
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-red-600 p-2 rounded-lg mr-3 flex-shrink-0">
                  <FaPhone className="text-lg" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">কল করুন</p>
                  <a href="tel:+880123456789" className="text-gray-300 hover:text-red-400 transition-colors font-medium">
                    +880 1234 56789
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-red-600 p-2 rounded-lg mr-3 flex-shrink-0">
                  <FaEnvelope className="text-lg" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">ইমেইল করুন</p>
                  <a href="mailto:support@raktobondhon.com" className="text-gray-300 hover:text-red-400 transition-colors font-medium">
                    support@raktobondhon.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-red-600 p-2 rounded-lg mr-3 flex-shrink-0">
                  <FaMapMarkerAlt className="text-lg" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">ঠিকানা</p>
                  <p className="text-gray-300 font-medium">
                    খাজা ইউনুস আলী বিশ্ববিদ্যালয়, সিরাজগঞ্জ, বাংলাদেশ
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Access Column */}
          <div>
            <h3 className="text-xl font-bold mb-6 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-gradient-to-r from-blue-500 to-blue-700">
              প্রশাসন
            </h3>
            <div className="space-y-4">
              <button 
                onClick={handleAdminClick}
                className="flex items-center px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all w-full group"
              >
                <div className="bg-blue-600 p-2 rounded-lg mr-3">
                  <FaUserShield className="text-lg" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm">সিস্টেম ম্যানেজমেন্ট</p>
                  <p className="text-white font-medium group-hover:text-blue-400 transition-colors">
                    অ্যাডমিন লগইন
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              {[
                { icon: <FaFacebook className="text-xl" />, link: "https://facebook.com" },
                { icon: <FaTwitter className="text-xl" />, link: "https://twitter.com" },
                { icon: <FaInstagram className="text-xl" />, link: "https://instagram.com" },
                { icon: <FaLinkedin className="text-xl" />, link: "https://linkedin.com" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-red-400 transition-colors bg-gray-800 hover:bg-gray-700 p-3 rounded-full"
                >
                  {social.icon}
                </a>
              ))}
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} রক্তবন্ধন. সর্বস্বত্ব সংরক্ষিত।
              </p>
              <p className="text-gray-500 text-xs mt-1 flex items-center justify-center md:justify-end">
                Made by Team Hotasha
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
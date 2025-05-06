import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12 font-kalpurush">
      <div className="container mx-auto px-4">
       
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

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

          <div>
            <h3 className="text-xl font-bold mb-6 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-gradient-to-r from-red-500 to-red-700">
              যোগাযোগ
            </h3>
            <div className="space-y-4">
              <ContactInfo icon="phone" title="কল করুন" contact="+880 1234 56789" contactType="tel:+" />
              <ContactInfo icon="email" title="ইমেইল করুন" contact="support@raktobondhon.com" contactType="mailto:" />
              <ContactInfo icon="location" title="ঠিকানা" contact="খাজা ইউনুস আলী বিশ্ববিদ্যালয়, সিরাজগঞ্জ, বাংলাদেশ" />
            </div>
          </div>
        </div>

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

// Helper component for contact information
const ContactInfo = ({ icon, title, contact, contactType }) => {
  const icons = {
    phone: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
      </svg>
    ),
    email: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
      </svg>
    ),
    location: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
      </svg>
    ),
  };

  return (
    <div className="flex items-start">
      <div className="bg-red-600 p-2 rounded-lg mr-3 flex-shrink-0">
        {icons[icon]}
      </div>
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        {contactType ? (
          <a href={`${contactType}${contact}`} className="text-gray-300 hover:text-red-400 transition-colors font-medium">
            {contact}
          </a>
        ) : (
          <p className="text-gray-300 font-medium">{contact}</p>
        )}
      </div>
    </div>
  );
};

export default Footer;

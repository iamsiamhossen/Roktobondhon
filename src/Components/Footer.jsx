const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8 font-kalpurush">
      <div className="container mx-auto px-4">
        {/* ফুটার কন্টেন্ট */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* কোম্পানি সম্পর্কে */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-4">রক্তবন্ধন</h3>
            <p className="text-sm text-gray-300">
              রক্তবন্ধন হল বাংলাদেশের সবচেয়ে বড় রক্তদাতা নেটওয়ার্ক। আমরা জরুরি অবস্থায় রক্তের জন্য অনুরোধ এবং রক্তদাতা খুঁজে পেতে সাহায্য করি।
            </p>
          </div>

          {/* দরকারী লিঙ্ক */}
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">দরকারী লিঙ্ক</h3>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-sm text-gray-300 hover:text-red-400 transition-colors">
                  আমাদের সম্পর্কে
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-sm text-gray-300 hover:text-red-400 transition-colors">
                  গোপনীয়তা নীতি
                </a>
              </li>
              <li>
                <a href="/terms" className="text-sm text-gray-300 hover:text-red-400 transition-colors">
                  শর্তাবলী
                </a>
              </li>
              <li>
                <a href="/contact" className="text-sm text-gray-300 hover:text-red-400 transition-colors">
                  যোগাযোগ
                </a>
              </li>
            </ul>
          </div>

          {/* সোশ্যাল মিডিয়া এবং যোগাযোগ */}
          <div className="text-center md:text-right">
            <h3 className="text-xl font-bold mb-4">আমাদের সাথে যুক্ত থাকুন</h3>
            <div className="flex justify-center md:justify-end space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-red-400 transition-colors"
              >
                <i className="fab fa-facebook text-2xl"></i>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-red-400 transition-colors"
              >
                <i className="fab fa-twitter text-2xl"></i>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-red-400 transition-colors"
              >
                <i className="fab fa-instagram text-2xl"></i>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-red-400 transition-colors"
              >
                <i className="fab fa-linkedin text-2xl"></i>
              </a>
            </div>
            <p className="text-sm text-gray-300 mt-4">
              ইমেইল: <a href="mailto:support@raktobondhon.com" className="hover:text-red-400">support@raktobondhon.com</a>
            </p>
            <p className="text-sm text-gray-300 mt-1">
              ফোন: <a href="tel:+880123456789" className="hover:text-red-400">+880 1234 56789</a>
            </p>
          </div>
        </div>

        {/* কপিরাইট এবং ক্রেডিট */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-300">
            © {new Date().getFullYear()} রক্তবন্ধন. সর্বস্বত্ব সংরক্ষিত।
          </p>
          <p className="text-sm text-gray-300 mt-1">
            Made with <span className="text-red-400 font-semibold">❤️ Team Hotasha</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
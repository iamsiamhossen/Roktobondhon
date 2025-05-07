import { FaUserInjured, FaHandHoldingHeart, FaTint } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        // <div className="absolute inset-0 bg-[url('https://img.freepik.com/free-vector/doctors-concept-illustration_114360-1515.jpg?t=st=1746252163~exp=1746255763~hmac=569edb6b2da69c3e5dd9c199ae8647d18390d758f6c7b76e32e67b86be1f1fef&w=1380')] bg-cover bg-no-repeat bg-[center_top_-100px] mix-blend-overlay"></div>
        backgroundImage: `url('https://img.freepik.com/free-vector/doctors-concept-illustration_114360-1515.jpg?t=st=1746252163~exp=1746255763~hmac=569edb6b2da69c3e5dd9c199ae8647d18390d758f6c7b76e32e67b86be1f1fef&w=1380')`,
        fontFamily: "'Kalpurush', 'SolaimanLipi', sans-serif",
      }}
    >
      {/* Glassmorphism Blur Overlay */}
      {/* <div className="absolute inset-0 bg-white/10 backdrop-blur-sm z-0" /> */}

      {/* Registration Card */}
      <div className="relative z-10 p-8 bg-white bg-opacity-90 rounded-2xl shadow-2xl border border-red-200 w-full max-w-md mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <FaTint className="text-red-500 text-5xl animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold text-red-600 mb-1">রক্তবন্ধন</h1>
          <p className="text-red-400">নতুন একাউন্ট তৈরি করুন</p>
        </div>

        {/* Role Selection Buttons - Now Direct Links */}
        <div className="space-y-5">
          <button
            onClick={() => navigate("/patient/register")}
            className="flex items-center justify-center w-full py-4 px-5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-md transition-all transform hover:scale-[1.02]"
          >
            <FaUserInjured className="mr-3 text-xl" />
            <span className="text-lg">রোগী রেজিস্ট্রেশন</span>
          </button>

          <button
            onClick={() => navigate("/donor/register")}
            className="flex items-center justify-center w-full py-4 px-5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl shadow-md transition-all transform hover:scale-[1.02]"
          >
            <FaHandHoldingHeart className="mr-3 text-xl" />
            <span className="text-lg">রক্তদাতা রেজিস্ট্রেশন</span>
          </button>
        </div>

        {/* Info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>প্রয়োজনে কল করুন: <span className="text-red-600 font-bold">০১৪০০৬৯৫৬২১</span></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaMobileAlt,
  FaLock,
  FaMapMarkerAlt,
  FaTint,
  FaVenusMars,
  FaEnvelope
} from "react-icons/fa";
import { auth, db } from "../firebase"; // Adjust path as needed
import { 
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const sirajganjUpazilas = [
  "সিরাজগঞ্জ সদর",
  "উল্লাপাড়া",
  "শাহজাদপুর",
  "রায়গঞ্জ",
  "বেলকুচি",
  "কাজীপুর",
  "কামারখন্দ",
  "তাড়াশ",
  "চৌহালী"
];

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const genderOptions = [
  { value: "male", label: "পুরুষ" },
  { value: "female", label: "মহিলা" },
  { value: "other", label: "অন্যান্য" }
];

const PatientRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    location: "",
    bloodGroup: "",
    gender: ""
  });

  const [isRegistrationSuccessful, setIsRegistrationSuccessful] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1. Create user in Firebase Authentication
      const { email, password, name, mobile, location, bloodGroup, gender } = formData;
      
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // 2. Update user profile with display name
      await updateProfile(userCredential.user, {
        displayName: name
      });

      // 3. Send email verification
      await sendEmailVerification(userCredential.user);

      // 4. Save additional patient data to Firestore
      await setDoc(doc(db, "patients", userCredential.user.uid), {
        name,
        email,
        mobile,
        location,
        bloodGroup,
        gender,
        createdAt: new Date(),
        emailVerified: false,
        role: "patient"
      });

      setIsRegistrationSuccessful(true);
      
      // Redirect to login after 5 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = "রেজিস্ট্রেশন ব্যর্থ হয়েছে";
      
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "এই ইমেইল দিয়ে ইতিমধ্যে রেজিস্টার করা হয়েছে";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "পাসওয়ার্ড অবশ্যই ৬ অক্ষরের বেশি হতে হবে";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "অবৈধ ইমেইল ঠিকানা";
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-black">
      {!isRegistrationSuccessful ? (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 space-y-4 bg-white shadow-md rounded-md font-kalpurush">
          <h2 className="text-2xl font-bold mb-4 text-center text-red-600">রোগীর রেজিস্ট্রেশন</h2>
          
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block mb-1 font-medium text-black">পূর্ণ নাম</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500" />
              <input
                type="text"
                required
                className="pl-10 w-full border rounded-lg py-2 px-4 text-black"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          {/* Email (new field for Firebase) */}
          <div>
            <label className="block mb-1 font-medium text-black">ইমেইল</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500" />
              <input
                type="email"
                required
                className="pl-10 w-full border rounded-lg py-2 px-4 text-black"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@domain.com"
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block mb-1 font-medium text-black">লিঙ্গ</label>
            <div className="relative">
              <FaVenusMars className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500" />
              <select
                required
                className="pl-10 w-full border rounded-lg py-2 text-black"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="">-- সিলেক্ট করুন --</option>
                {genderOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile */}
          <div>
            <label className="block mb-1 font-medium text-black">মোবাইল নম্বর</label>
            <div className="relative">
              <FaMobileAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500" />
              <input
                type="tel"
                pattern="[0-9]{11}"
                required
                className="pl-10 w-full border rounded-lg py-2 px-4 text-black"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                placeholder="০১৭XXXXXXXX"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium text-black">পাসওয়ার্ড</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500" />
              <input
                type="password"
                required
                minLength="6"
                className="pl-10 w-full border rounded-lg py-2 px-4 text-black"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          {/* Blood Group */}
          <div>
            <label className="block mb-1 font-medium text-black">রক্তের গ্রুপ</label>
            <div className="relative">
              <FaTint className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500" />
              <select
                required
                className="pl-10 w-full border rounded-lg py-2 text-black"
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              >
                <option value="">-- সিলেক্ট করুন --</option>
                {bloodGroups.map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block mb-1 font-medium text-black">উপজেলা</label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500" />
              <select
                required
                className="pl-10 w-full border rounded-lg py-2 text-black"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              >
                <option value="">-- সিলেক্ট করুন --</option>
                {sirajganjUpazilas.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? "প্রসেসিং..." : "রেজিস্ট্রার করুন"}
          </button>
        </form>
      ) : (
        <div className="max-w-xl mx-auto p-6 space-y-4 bg-white shadow-md rounded-md text-center text-black font-kalpurush">
          <h2 className="text-2xl font-bold mb-4 text-green-600">রেজিস্ট্রেশন সফল!</h2>
          <p className="text-lg mb-4 text-black">
            আপনার রেজিস্ট্রেশন সফলভাবে সম্পন্ন হয়েছে। একটি ভেরিফিকেশন ইমেইল পাঠানো হয়েছে আপনার ইমেইলে।
          </p>
          <p className="text-black">
            দয়া করে আপনার ইমেইল ভেরিফাই করুন। আপনি লগিন করতে পারবেন ইমেইল ভেরিফিকেশনের পর।
          </p>
          <p className="text-black mt-2">
            আপনাকে লগিন পৃষ্ঠায় রিডাইরেক্ট করা হবে...
          </p>
        </div>
      )}
    </div>
  );
};

export default PatientRegister;
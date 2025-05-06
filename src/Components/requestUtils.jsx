// src/utils/requestUtils.js

// Helper function to format date in Bengali
export const formatToBengaliDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('bn-BD', options);
  };
  
  // Validate request data
  const validateRequest = (request) => {
    if (!request.bloodType || !request.hospital || !request.requiredDate) {
      throw new Error("Required fields are missing");
    }
  };
  
  // Save real blood request
  export const saveRealRequest = (request, user) => {
    try {
      validateRequest(request);
      
      const requests = getRealRequests();
      const newRequest = {
        ...request,
        id: `real_${Date.now()}`,
        postedBy: user?.name || 'অজ্ঞাত',
        userPhone: user?.phone || '',
        timestamp: new Date().toISOString(),
        neededBy: formatToBengaliDate(request.requiredDate),
        isDemo: false
      };
      
      localStorage.setItem('realBloodRequests', JSON.stringify([newRequest, ...requests]));
      return newRequest;
    } catch (error) {
      console.error("রিকোয়েস্ট সেভ করতে সমস্যা:", error);
      return null;
    }
  };
  
  // Delete a real request
  export const deleteRealRequest = (id) => {
    try {
      const requests = getRealRequests().filter(req => req.id !== id);
      localStorage.setItem('realBloodRequests', JSON.stringify(requests));
      return true;
    } catch (error) {
      console.error("রিকোয়েস্ট ডিলিট করতে সমস্যা:", error);
      return false;
    }
  };
  
  // Get only real requests
  export const getRealRequests = () => {
    try {
      return JSON.parse(localStorage.getItem('realBloodRequests')) || [];
    } catch (error) {
      console.error("রিকোয়েস্ট পাওয়া যাচ্ছে না:", error);
      return [];
    }
  };
  
  // Get demo requests (with dynamic dates)
  export const getDemoRequests = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return [
      {
        id: "demo_1",
        name: "রাহেলা বেগম",
        bloodType: "O+",
        hospital: "২৫০ শয্যা সদর হাসপাতাল, সিরাজগঞ্জ",
        contact: "01712345678",
        neededBy: formatToBengaliDate(today.toISOString()),
        bags: 2,
        emergency: true,
        notes: "অস্ত্রোপচারের জন্য জরুরি রক্ত প্রয়োজন।",
        timestamp: today.toISOString(),
        isDemo: true
      },
      {
        id: "demo_2",
        name: "জাহিদ হাসান",
        bloodType: "B-",
        hospital: "ঢাকা মেডিকেল কলেজ হাসপাতাল",
        contact: "01898765432",
        neededBy: formatToBengaliDate(tomorrow.toISOString()),
        bags: 1,
        emergency: false,
        notes: "কেমোথেরাপির জন্য রক্ত প্রয়োজন",
        timestamp: today.toISOString(),
        isDemo: true
      }
    ];
  };
  
  // Get combined requests (real + demo) with demo as fallback
  export const getAllRequests = () => {
    const realRequests = getRealRequests();
    return realRequests.length > 0 ? realRequests : getDemoRequests();
  };
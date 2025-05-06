// src/services/notificationService.js
import { collection, query, where, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { getCompatibleBloodTypes } from '../utils/bloodCompatibility';

/**
 * রক্তের অনুরোধ পোস্ট হলে ম্যাচিং ডোনারদের নোটিফাই করুন
 * @param {string} requestId - রিকোয়েস্ট ডকুমেন্ট আইডি
 * @param {string} bloodType - প্রয়োজনীয় রক্তের গ্রুপ (A+, B-, etc)
 * @param {string} location - লোকেশন (সিরাজগঞ্জ সদর, বেলকুচি, etc)
 * @param {string} hospital - হাসপাতালের নাম
 * @param {string} contactNumber - যোগাযোগ নম্বর
 */
export const notifyMatchingDonors = async (requestId, bloodType, location, hospital, contactNumber) => {
  try {
    // ১. কম্প্যাটিবল রক্তের গ্রুপ বের করুন
    const compatibleTypes = getCompatibleBloodTypes(bloodType);
    
    // ২. ম্যাচিং ডোনারদের খুঁজুন (একই ব্লাড গ্রুপ + লোকেশন + নোটিফিকেশন অন)
    const donorsRef = collection(db, "donors");
    const donorQuery = query(
      donorsRef,
      where("bloodType", "in", compatibleTypes),
      where("location", "==", location),
      where("notificationEnabled", "==", true)
    );

    const donorSnapshot = await getDocs(donorQuery);
    
    // ৩. প্রতিটি ডোনারের জন্য নোটিফিকেশন তৈরি করুন
    const batch = writeBatch(db);
    const notificationsRef = collection(db, "notifications");
    
    donorSnapshot.forEach((donorDoc) => {
      const notificationRef = doc(notificationsRef);
      batch.set(notificationRef, {
        donorId: donorDoc.id,
        requestId,
        message: `জরুরি রক্তের প্রয়োজন: ${bloodType} রক্তের প্রয়োজন ${hospital} হাসপাতালে`,
        isRead: false,
        createdAt: new Date().toISOString(),
        bloodType,
        location,
        contactNumber,
        hospital
      });
    });

    // ৪. ব্যাচ কমিট করুন
    await batch.commit();
    console.log(`সফলভাবে ${donorSnapshot.size} জন ডোনারকে নোটিফাই করা হয়েছে`);

  } catch (error) {
    console.error("ডোনারদের নোটিফাই করতে সমস্যা:", error);
    throw new Error("নোটিফিকেশন সিস্টেমে সমস্যা হয়েছে");
  }
};

/**
 * ডোনারের সকল নোটিফিকেশন মার্ক অ্যাজ রিড করুন
 * @param {string} donorId - ডোনার ডকুমেন্ট আইডি
 */
export const markAllNotificationsAsRead = async (donorId) => {
  try {
    // ১. আনরিড নোটিফিকেশনগুলো খুঁজুন
    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("donorId", "==", donorId),
      where("isRead", "==", false)
    );

    const snapshot = await getDocs(q);
    
    // ২. ব্যাচ আপডেট তৈরি করুন
    const batch = writeBatch(db);
    snapshot.forEach((doc) => {
      batch.update(doc.ref, { isRead: true });
    });

    // ৩. ব্যাচ কমিট করুন
    await batch.commit();
    console.log(`সফলভাবে ${snapshot.size} টি নোটিফিকেশন রিড মার্ক করা হয়েছে`);

  } catch (error) {
    console.error("নোটিফিকেশন মার্ক করতে সমস্যা:", error);
    throw new Error("নোটিফিকেশন আপডেট করতে সমস্যা হয়েছে");
  }
};

/**
 * ডোনারের জন্য নোটিফিকেশন কাউন্ট করুন
 * @param {string} donorId - ডোনার ডকুমেন্ট আইডি
 * @returns {Promise<number>} আনরিড নোটিফিকেশন কাউন্ট
 */
export const getUnreadNotificationCount = async (donorId) => {
  try {
    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("donorId", "==", donorId),
      where("isRead", "==", false)
    );

    const snapshot = await getDocs(q);
    return snapshot.size;

  } catch (error) {
    console.error("নোটিফিকেশন কাউন্ট করতে সমস্যা:", error);
    return 0;
  }
};
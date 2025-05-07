import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
import admin from 'firebase-admin';

const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Replace with your actual Firebase UID
const uid = "XC43mPXMKxXNbCzwxJUOXU0M1I92";

// Set custom claim
admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`✅ Admin claim set for user UID: ${uid}`);

    // Verify it worked
    return admin.auth().getUser(uid);
  })
  .then((userRecord) => {
    console.log("🔍 Updated custom claims:", userRecord.customClaims);
  })
  .catch((error) => {
    console.error("❌ Error setting admin claim:", error);
  });

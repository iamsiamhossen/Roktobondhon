import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
import admin from 'firebase-admin';

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const uid = "xG1O9cpqvCbduxGtLp3rsGAspmh2";

// Verify the claims
admin.auth().getUser(uid)
  .then((userRecord) => {
    console.log("Current custom claims:", userRecord.customClaims);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error verifying claims:", error);
    process.exit(1);
  });
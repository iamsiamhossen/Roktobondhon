import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
      apiKey: "AIzaSyDNJLrr40z6FqFW1IhJ7KSJ5jitxKy8lcg",
      authDomain: "roktobondhon5sisters.firebaseapp.com",
      projectId: "roktobondhon5sisters",
      storageBucket: "roktobondhon5sisters.firebasestorage.app",
      messagingSenderId: "146339138095",
      appId: "1:146339138095:web:8fb51426acce340f7714da",
      measurementId: "G-ZVZSFZG9S4"
    };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  app, 
  auth, 
  db, 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  signInWithEmailAndPassword
};
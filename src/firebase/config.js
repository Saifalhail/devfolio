// Firebase configuration
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDummyKeyForDevEnvironment",
  authDomain: "devfolio-84079.firebaseapp.com",
  projectId: "devfolio-84079",
  storageBucket: "devfolio-84079.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789012:web:abcdef1234567890",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-ABCDEFGHIJ"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
export default app;

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// Your web app's Firebase configuration
// NOTE: This is the FRONTEND configuration and is separate from the backend
// In development, we're using environment variables from .env.local
// In production, these should be set in the hosting environment
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// For development builds we provide fallback credentials to make local
// testing easier. These should **never** be used in production.
if (process.env.NODE_ENV !== 'production') {
  console.warn('Using development Firebase config');
  
  // Development Firebase configuration with mock values for local development
  firebaseConfig.apiKey = "demo-api-key";
  firebaseConfig.authDomain = "demo-project.firebaseapp.com";
  firebaseConfig.projectId = "demo-project";
  firebaseConfig.storageBucket = "demo-project.appspot.com";
  firebaseConfig.messagingSenderId = "123456789012";
  firebaseConfig.appId = "1:123456789012:web:1234567890abcdef";
  firebaseConfig.measurementId = "G-ABCDEFGHIJ";
}

// Check if Firebase config is properly loaded
const configLoaded = Object.values(firebaseConfig).every(value => value !== undefined);
console.log('Firebase config loaded:', configLoaded);
if (!configLoaded) {
  console.warn('Firebase environment variables are not properly loaded:', 
    Object.keys(firebaseConfig).filter(key => firebaseConfig[key] === undefined));
  console.warn('Make sure you have created a .env file with the necessary REACT_APP_FIREBASE_* variables');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth and get a reference to the service
const auth = getAuth(app);

// Initialize Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Functions and get a reference to the service
const functions = getFunctions(app);

// Initialize Analytics only if supported
let analytics = null;
isSupported().then(supported => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

// Connect to emulators in development mode
if (process.env.NODE_ENV !== 'production') {
  // Use auth emulator for local development
  // Note: You would need to run the Firebase emulators locally
  // connectAuthEmulator(auth, 'http://localhost:9099');
  // connectFirestoreEmulator(db, 'localhost', 8080);
  // connectFunctionsEmulator(functions, 'localhost', 5001);
  
  console.log('Firebase initialized with development configuration');
}

// Export the services you'll use throughout your app
export { app, analytics, auth, db, functions };

// Export a function to get functions with a specific region if needed
export const getFunctionsWithRegion = (region) => getFunctions(app, region);

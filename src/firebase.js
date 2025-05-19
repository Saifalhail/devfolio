// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

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

// For development - use direct configuration values
// In production, these would come from environment variables
if (!firebaseConfig.projectId) {
  console.warn('Using development Firebase config');
  
  // Development Firebase configuration
  // Replace with your own Firebase project details for testing
  firebaseConfig.apiKey = "AIzaSyBrkXIQBEvF9qslWeO91XUUUng3-D94L_k";
  firebaseConfig.authDomain = "devfolio-test-project.firebaseapp.com";
  firebaseConfig.projectId = "devfolio-test-project";
  firebaseConfig.storageBucket = "devfolio-test-project.appspot.com";
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

// Initialize Analytics and get a reference to the service
const analytics = getAnalytics(app);

// Initialize Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Cloud Functions and get a reference to the service
// Default to us-central1 region
const functions = getFunctions(app, 'us-central1');

// Export the services you'll use throughout your app
export { app, analytics, auth, db, functions };

// Export a function to get functions with a specific region if needed
export const getFunctionsWithRegion = (region) => getFunctions(app, region);

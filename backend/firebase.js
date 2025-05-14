// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth'; // Import Authentication
import { getFirestore } from 'firebase/firestore'; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFC5fTqsPYKHnuWq9IEIX2OEqFt7bQDpQ",
  authDomain: "devfolio-84079.firebaseapp.com",
  projectId: "devfolio-84079",
  storageBucket: "devfolio-84079.firebasestorage.app",
  messagingSenderId: "311766073175",
  appId: "1:311766073175:web:62f4934248f2c7ec494812",
  measurementId: "G-6XSF8W31KN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics and get a reference to the service
const analytics = getAnalytics(app);

// Initialize Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);


// Export the services you'll use throughout your app
export { analytics, auth, db };

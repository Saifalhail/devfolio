// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

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
  
  // Only use fallback values if environment variables are not set
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'undefined') {
    // Development Firebase configuration with mock values for local development
    firebaseConfig.apiKey = "demo-api-key-for-development-only";
    firebaseConfig.authDomain = "demo-project.firebaseapp.com";
    firebaseConfig.projectId = "demo-project";
    firebaseConfig.storageBucket = "demo-project.appspot.com";
    firebaseConfig.messagingSenderId = "123456789012";
    firebaseConfig.appId = "1:123456789012:web:1234567890abcdef";
    firebaseConfig.measurementId = "G-ABCDEFGHIJ";
  }
}

// Check if Firebase config is properly loaded
const configLoaded = Object.values(firebaseConfig).every(value => value !== undefined);
console.log('Firebase config loaded:', configLoaded);
if (!configLoaded) {
  console.warn('Firebase environment variables are not properly loaded:', 
    Object.keys(firebaseConfig).filter(key => firebaseConfig[key] === undefined));
  console.warn('Make sure you have created a .env file with the necessary REACT_APP_FIREBASE_* variables');
}

// Flag to identify if we're using mock credentials
const usingMockCredentials = process.env.NODE_ENV !== 'production' && 
                           firebaseConfig.apiKey === "demo-api-key-for-development-only";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services based on whether we're using mock credentials
let auth, db, functions, storage, analytics = null;

if (usingMockCredentials) {
  console.warn('Using mock Firebase credentials. Some Firebase features will be limited.');
  
  // Create mock services that won't throw errors
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback) => callback(null),
    signInWithEmailAndPassword: () => Promise.resolve({ user: { uid: 'mock-user-id' } }),
    createUserWithEmailAndPassword: () => Promise.resolve({ user: { uid: 'mock-user-id' } }),
    signOut: () => Promise.resolve()
  };
  
  db = {
    collection: () => ({
      doc: () => ({
        get: () => Promise.resolve({ exists: false, data: () => ({}) }),
        set: () => Promise.resolve(),
        update: () => Promise.resolve(),
        delete: () => Promise.resolve()
      }),
      where: () => ({
        get: () => Promise.resolve({ docs: [] })
      }),
      add: () => Promise.resolve({ id: 'mock-doc-id' })
    })
  };
  
  functions = { httpsCallable: () => () => Promise.resolve({ data: {} }) };
  storage = { ref: () => ({ put: () => ({ snapshot: {}, ref: { getDownloadURL: () => Promise.resolve('https://mock-url.com') } }) }) };
} else {
  // Initialize real Firebase services
  auth = getAuth(app);
  db = getFirestore(app);
  functions = getFunctions(app);
  storage = getStorage(app);
  
  // Initialize Analytics only if supported
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// Use Firebase emulators in development, but only if we're not using mock credentials
if (process.env.NODE_ENV !== 'production' && 
    process.env.REACT_APP_USE_FIREBASE_EMULATORS === 'true' && 
    !usingMockCredentials) {
  console.log('Using Firebase emulators');
  // Use try-catch blocks to prevent emulator connection errors from breaking the app
  try {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    console.log('Connected to Auth emulator');
  } catch (e) {
    console.error('Failed to connect to Auth emulator:', e);
  }
  
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('Connected to Firestore emulator');
  } catch (e) {
    console.error('Failed to connect to Firestore emulator:', e);
  }
  
  try {
    connectFunctionsEmulator(functions, 'localhost', 5001);
    console.log('Connected to Functions emulator');
  } catch (e) {
    console.error('Failed to connect to Functions emulator:', e);
  }
  
  try {
    connectStorageEmulator(storage, 'localhost', 9199);
    console.log('Connected to Storage emulator');
  } catch (e) {
    console.error('Failed to connect to Storage emulator:', e);
  }
}

// Export the services you'll use throughout your app
export { app, analytics, auth, db, functions, storage };

// Export a function to get functions with a specific region if needed
export const getFunctionsWithRegion = (region) => getFunctions(app, region);

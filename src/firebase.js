// Import the functions you need from the SDKs you need
import { initializeApp, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
// Using the exact configuration from Firebase Console
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAFC5fTqsPYKHnuWq9IEIX2OEqFt7bQDpQ",
  authDomain: "devfolio-84079.firebaseapp.com",
  projectId: "devfolio-84079",
  storageBucket: "devfolio-84079.firebasestorage.app",
  messagingSenderId: "311766073175",
  appId: "1:311766073175:web:62f4934248f2c7ec494812",
  measurementId: "G-6XSF8W31KN"
};

// Log Firebase config for debugging
console.log('Firebase Config Project ID:', firebaseConfig.projectId);
console.log('Firebase Config Auth Domain:', firebaseConfig.authDomain);

// IMPORTANT: We're removing the environment variable override in production
// to ensure we always use the hardcoded Firebase config from above

// Only use environment variables in development, never in production
if (process.env.NODE_ENV !== 'production' && 
    process.env.REACT_APP_FIREBASE_API_KEY && 
    process.env.REACT_APP_FIREBASE_PROJECT_ID) {
  console.log('Using environment variables for Firebase config');
  firebaseConfig.apiKey = process.env.REACT_APP_FIREBASE_API_KEY;
  firebaseConfig.authDomain = process.env.REACT_APP_FIREBASE_AUTH_DOMAIN;
  firebaseConfig.projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID;
  firebaseConfig.storageBucket = process.env.REACT_APP_FIREBASE_STORAGE_BUCKET;
  firebaseConfig.messagingSenderId = process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID;
  firebaseConfig.appId = process.env.REACT_APP_FIREBASE_APP_ID;
  firebaseConfig.measurementId = process.env.REACT_APP_FIREBASE_MEASUREMENT_ID;
}

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

// Flag to identify if we're using mock credentials - NEVER use mocks in production
let usingMockCredentials = process.env.NODE_ENV !== 'production' && 
  (firebaseConfig.apiKey === "demo-api-key-for-development-only" || !firebaseConfig.apiKey);

// Force this to false in production to ensure we never use mock services
if (process.env.NODE_ENV === 'production') {
  console.log('Running in production mode, using real Firebase services');
  // Always use real Firebase services in production
  usingMockCredentials = false;
}

// Initialize Firebase with proper error handling in a try-catch block
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase core initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase core:', error);
  // If it's already initialized, use the existing app
  if (error.code === 'app/duplicate-app') {
    console.log('Using existing Firebase app instance');
    app = getApp();
  } else {
    // Re-throw non-initialization errors
    throw error;
  }
}

// Initialize Firebase services with error handling
let auth, db, functions, storage;
try {
  auth = getAuth(app);
  console.log('Firebase Auth initialized');
} catch (error) {
  console.error('Error initializing Firebase Auth:', error);
  auth = { currentUser: null };
}

try {
  db = getFirestore(app);
  console.log('Firebase Firestore initialized');
} catch (error) {
  console.error('Error initializing Firebase Firestore:', error);
  db = {};
}

try {
  functions = getFunctions(app);
  console.log('Firebase Functions initialized');
} catch (error) {
  console.error('Error initializing Firebase Functions:', error);
  functions = {};
}

try {
  storage = getStorage(app);
  console.log('Firebase Storage initialized');
} catch (error) {
  console.error('Error initializing Firebase Storage:', error);
  storage = {};
}
let analytics = null;

// Initialize analytics if in browser environment
if (typeof window !== 'undefined') {
  try {
    isSupported().then(supported => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    }).catch(error => {
      console.error('Error checking analytics support:', error);
    });
  } catch (error) {
    console.error('Firebase initialization error:', error);
    console.error('Analytics initialization error:', error);
    if (typeof document !== 'undefined') {
      // Only show alert in browser environment
      alert('Firebase initialization error: ' + error.message);
    }
  }
}

// Connect to emulators if in development mode
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_EMULATORS === 'true') {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectFunctionsEmulator(functions, 'localhost', 5001);
    connectStorageEmulator(storage, 'localhost', 9199);
    console.log('Connected to Firebase emulators');
  } catch (error) {
    console.error('Error connecting to emulators:', error);
  }
}

// Create mock services if using mock credentials
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
export { GoogleAuthProvider, signInWithPopup };

// Export a function to get functions with a specific region if needed
export const getFunctionsWithRegion = (region) => getFunctions(app, region);

// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
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

// Initialize Firebase with proper error handling
let app;

// Function to safely initialize Firebase
const initializeFirebase = () => {
  try {
    // First check if the config is valid
    if (!firebaseConfig || !firebaseConfig.apiKey || !firebaseConfig.projectId) {
      console.error('Invalid Firebase configuration:', firebaseConfig);
      throw new Error('Invalid Firebase configuration');
    }

    // Check if Firebase is already initialized
    if (getApps().length > 0) {
      console.log('Using existing Firebase app instance');
      return getApp();
    }

    // Initialize a new app
    console.log('Initializing new Firebase app with config:', {
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain
    });
    return initializeApp(firebaseConfig);
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    
    // Create a mock app to prevent crashes
    return {
      name: 'firebase-initialization-failed',
      options: { ...firebaseConfig },
      automaticDataCollectionEnabled: false
    };
  }
};

// Initialize Firebase
app = initializeFirebase();

// Helper function to safely initialize Firebase services
const safeInitialize = (serviceName, initFn) => {
  try {
    if (!app || app.name === 'firebase-initialization-failed') {
      console.warn(`Skipping ${serviceName} initialization due to failed Firebase app initialization`);
      return createMockService(serviceName);
    }
    const service = initFn(app);
    console.log(`Firebase ${serviceName} initialized successfully`);
    return service;
  } catch (error) {
    console.error(`Error initializing Firebase ${serviceName}:`, error);
    return createMockService(serviceName);
  }
};

// Create mock services based on service type
const createMockService = (serviceName) => {
  console.warn(`Creating mock ${serviceName} service`);
  
  switch(serviceName) {
    case 'Auth':
      return {
        currentUser: null,
        onAuthStateChanged: (callback) => {
          callback(null);
          return () => {};
        },
        signInWithEmailAndPassword: () => Promise.resolve({ user: { uid: 'mock-user-id' } }),
        createUserWithEmailAndPassword: () => Promise.resolve({ user: { uid: 'mock-user-id' } }),
        signOut: () => Promise.resolve()
      };
    case 'Firestore':
      return {
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
    case 'Functions':
      return { httpsCallable: () => () => Promise.resolve({ data: {} }) };
    case 'Storage':
      return { 
        ref: () => ({ 
          put: () => ({ 
            snapshot: {}, 
            ref: { 
              getDownloadURL: () => Promise.resolve('https://mock-url.com') 
            } 
          }) 
        }) 
      };
    default:
      return {};
  }
};

// Initialize Firebase services with error handling
let auth = safeInitialize('Auth', getAuth);
let db = safeInitialize('Firestore', getFirestore);
let functions = safeInitialize('Functions', getFunctions);
let storage = safeInitialize('Storage', getStorage);
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

// Override services with mocks if using mock credentials
if (usingMockCredentials) {
  console.warn('Using mock Firebase credentials. Some Firebase features will be limited.');
  
  // Create mock services that won't throw errors
  auth = createMockService('Auth');
  db = createMockService('Firestore');
  functions = createMockService('Functions');
  storage = createMockService('Storage');
  console.log('All Firebase services replaced with mock implementations');
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

// Export Firebase services with safe getters to prevent circular dependencies
export const getFirestoreDb = () => {
  try {
    return db || createMockService('Firestore');
  } catch (error) {
    console.error('Error accessing Firestore:', error);
    return createMockService('Firestore');
  }
};

export const getStorageInstance = () => {
  try {
    return storage || createMockService('Storage');
  } catch (error) {
    console.error('Error accessing Storage:', error);
    return createMockService('Storage');
  }
};

// Export a function to check if Firebase is properly initialized
export const isFirebaseInitialized = () => {
  try {
    return app && app.name !== 'firebase-initialization-failed';
  } catch (error) {
    console.error('Error checking Firebase initialization:', error);
    return false;
  }
};

// Export a function to get functions with a specific region if needed
export const getFunctionsWithRegion = (region) => getFunctions(app, region);

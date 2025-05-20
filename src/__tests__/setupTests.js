// Jest setup file
import '@testing-library/jest-dom';
import 'jest-styled-components';

// Mock ResizeObserver
global.ResizeObserver = require('resize-observer-polyfill');

// Mock matchMedia
global.matchMedia = global.matchMedia || function(query) {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
};

// Mock window.scrollTo
global.scrollTo = jest.fn();

// Mock Intersection Observer
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
    this.observe = jest.fn();
    this.unobserve = jest.fn();
    this.disconnect = jest.fn();
  }
};

// Mock window.fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
);

// Mock localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    key: jest.fn(i => Object.keys(store)[i] || null),
    get length() {
      return Object.keys(store).length;
    }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Set up i18next for tests
jest.mock('../i18n', () => {
  return {
    __esModule: true,
    default: {
      t: (key) => key,
      changeLanguage: jest.fn(),
      language: 'en',
      use: jest.fn().mockReturnThis(),
      init: jest.fn(),
    },
  };
});

// Mock Firebase
jest.mock('firebase/app', () => {
  return {
    __esModule: true,
    default: {
      initializeApp: jest.fn(),
      apps: [],
    },
    initializeApp: jest.fn(),
  };
});

jest.mock('firebase/auth', () => {
  return {
    __esModule: true,
    getAuth: jest.fn(() => ({
      currentUser: null,
      onAuthStateChanged: jest.fn((callback) => {
        callback(null);
        return jest.fn(); // Return unsubscribe function
      }),
      signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { uid: 'test-uid' } })),
      signOut: jest.fn(() => Promise.resolve()),
    })),
    signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { uid: 'test-uid' } })),
    signInWithPopup: jest.fn(() => Promise.resolve({ user: { uid: 'test-uid' } })),
    createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { uid: 'test-uid' } })),
    signOut: jest.fn(() => Promise.resolve()),
    GoogleAuthProvider: jest.fn(() => ({})),
    onAuthStateChanged: jest.fn((auth, callback) => {
      callback(null);
      return jest.fn(); // Return unsubscribe function
    }),
  };
});

jest.mock('firebase/firestore', () => {
  return {
    __esModule: true,
    getFirestore: jest.fn(() => ({})),
    collection: jest.fn(() => ({
      add: jest.fn(() => Promise.resolve({ id: 'test-doc-id' })),
      doc: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve({
          exists: true,
          data: () => ({ id: 'test-doc-id' }),
          id: 'test-doc-id',
        })),
        set: jest.fn(() => Promise.resolve()),
        update: jest.fn(() => Promise.resolve()),
        delete: jest.fn(() => Promise.resolve()),
      })),
    })),
    doc: jest.fn(() => ({
      get: jest.fn(() => Promise.resolve({
        exists: true,
        data: () => ({ id: 'test-doc-id' }),
        id: 'test-doc-id',
      })),
    })),
    getDoc: jest.fn(() => Promise.resolve({
      exists: () => true,
      data: () => ({ id: 'test-doc-id' }),
      id: 'test-doc-id',
    })),
    setDoc: jest.fn(() => Promise.resolve()),
    updateDoc: jest.fn(() => Promise.resolve()),
    deleteDoc: jest.fn(() => Promise.resolve()),
    onSnapshot: jest.fn((docRef, callback) => {
      callback({
        exists: () => true,
        data: () => ({ id: 'test-doc-id' }),
        id: 'test-doc-id',
      });
      return jest.fn(); // Return unsubscribe function
    }),
  };
});

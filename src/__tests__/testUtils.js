// Test utilities for DevFolio project
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import mediaQuery from 'css-mediaquery';

// Use mock AuthContext for tests to avoid Firebase dependencies
import { AuthProvider } from '../__mocks__/authContext';
import { ThemeProvider } from 'styled-components';

// Mock i18n instead of importing the real one to avoid network dependencies
const i18n = {
  language: 'en',
  t: (key) => key,
  changeLanguage: jest.fn(),
  use: jest.fn().mockReturnThis(),
  init: jest.fn(),
};

// Try to import theme, but don't fail if it doesn't exist
let theme = {};
try {
  theme = require('../styles/theme').default;
} catch (e) {
  console.log('Theme not found, using empty theme object');
}

// Create a custom matchMedia function for responsive testing
function createMatchMedia(width) {
  return (query) => ({
    matches: mediaQuery.match(query, { width }),
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  });
}

// Mock Firebase modules
jest.mock('firebase/app', () => {
  return {
    initializeApp: jest.fn(() => ({})),
  };
});

jest.mock('firebase/auth', () => {
  return {
    getAuth: jest.fn(() => ({})),
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signInWithPopup: jest.fn(),
    GoogleAuthProvider: jest.fn(() => ({})),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn(),
    RecaptchaVerifier: jest.fn(),
    signInWithPhoneNumber: jest.fn(),
  };
});

jest.mock('firebase/firestore', () => {
  return {
    getFirestore: jest.fn(() => ({})),
    collection: jest.fn(),
    addDoc: jest.fn(),
    getDocs: jest.fn(),
  };
});

jest.mock('firebase/functions', () => {
  return {
    getFunctions: jest.fn(() => ({})),
    httpsCallable: jest.fn(() => jest.fn()),
  };
});

jest.mock('firebase/analytics', () => {
  return {
    getAnalytics: jest.fn(() => ({})),
  };
});

// Custom render function that includes providers
const customRender = (ui, options = {}) => {
  // Extract any custom viewport width from options
  const { viewport, ...restOptions } = options;
  
  // Set up responsive testing if viewport is provided
  if (viewport) {
    const width = typeof viewport === 'number' ? viewport : viewport.width;
    window.matchMedia = createMatchMedia(width);
    
    // Set window dimensions
    window.innerWidth = width;
    window.innerHeight = viewport.height || 768;
  }
  
  const AllProviders = ({ children }) => {
    return (
      <AuthProvider>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={theme}>
            <BrowserRouter>
              {children}
            </BrowserRouter>
          </ThemeProvider>
        </I18nextProvider>
      </AuthProvider>
    );
  };

  return render(ui, { wrapper: AllProviders, ...restOptions });
};

// Define common device sizes for responsive testing
export const devices = {
  mobileSmall: { width: 320, height: 568 },  // iPhone 5/SE
  mobileMedium: { width: 375, height: 667 }, // iPhone 6/7/8
  mobileLarge: { width: 414, height: 736 },  // iPhone 6/7/8 Plus
  tablet: { width: 768, height: 1024 },       // iPad
  laptop: { width: 1366, height: 768 },       // Laptop
  desktop: { width: 1920, height: 1080 }      // Desktop
};

// Helper function to simulate window resize
export const resizeWindow = (width, height) => {
  window.innerWidth = width;
  window.innerHeight = height;
  window.matchMedia = createMatchMedia(width);
  window.dispatchEvent(new Event('resize'));
};

// Helper function to render at specific device size
export const renderWithViewport = (ui, device) => {
  const viewport = typeof device === 'string' ? devices[device] : device;
  return customRender(ui, { viewport });
};

// Export everything from react-testing-library
export * from '@testing-library/react';

// Override render method
export { customRender as render };

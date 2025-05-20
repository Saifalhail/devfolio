import React from 'react';

// Mock user object
const mockUser = {
  uid: 'test-user-id',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: null,
  emailVerified: true,
  phoneNumber: null
};

// Create mock auth context
export const AuthContext = React.createContext({
  currentUser: null,
  loading: false,
  error: null,
  signInWithGoogle: jest.fn(() => Promise.resolve({ user: mockUser })),
  signInWithEmailPassword: jest.fn(() => Promise.resolve({ user: mockUser })),
  signInWithPhoneNumber: jest.fn(() => Promise.resolve({ user: mockUser })),
  signUpWithEmailPassword: jest.fn(() => Promise.resolve({ user: mockUser })),
  signOut: jest.fn(() => Promise.resolve()),
  resetPassword: jest.fn(() => Promise.resolve()),
  updateProfile: jest.fn(() => Promise.resolve()),
  verifyPhoneNumber: jest.fn(() => Promise.resolve('verification-id')),
  confirmPhoneVerification: jest.fn(() => Promise.resolve({ user: mockUser }))
});

// Create mock provider component
export const AuthProvider = ({ children, mockAuthState = {} }) => {
  const defaultState = {
    currentUser: null,
    loading: false,
    error: null,
    signInWithGoogle: jest.fn(() => Promise.resolve({ user: mockUser })),
    signInWithEmailPassword: jest.fn(() => Promise.resolve({ user: mockUser })),
    signInWithPhoneNumber: jest.fn(() => Promise.resolve({ user: mockUser })),
    signUpWithEmailPassword: jest.fn(() => Promise.resolve({ user: mockUser })),
    signOut: jest.fn(() => Promise.resolve()),
    resetPassword: jest.fn(() => Promise.resolve()),
    updateProfile: jest.fn(() => Promise.resolve()),
    verifyPhoneNumber: jest.fn(() => Promise.resolve('verification-id')),
    confirmPhoneVerification: jest.fn(() => Promise.resolve({ user: mockUser }))
  };

  const value = { ...defaultState, ...mockAuthState };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook for using the mock auth context
export const useAuth = () => {
  return React.useContext(AuthContext);
};

export default { AuthContext, AuthProvider, useAuth };

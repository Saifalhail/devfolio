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

// Create mock auth context that matches the real AuthContext interface
export const AuthContext = React.createContext({
  currentUser: null,
  loading: false,
  error: '',
  setError: jest.fn(),
  // Match the exact function names used in the real AuthContext
  signInWithEmail: jest.fn(() => Promise.resolve({ user: mockUser })),
  login: jest.fn(() => Promise.resolve({ user: mockUser })), // Alias for backward compatibility
  signup: jest.fn(() => Promise.resolve({ user: mockUser })),
  logout: jest.fn(() => Promise.resolve(true)),
  signInWithGoogle: jest.fn(() => Promise.resolve({ user: mockUser })),
  loginWithGoogle: jest.fn(() => Promise.resolve({ user: mockUser })), // Alias for backward compatibility
  signInWithPhone: jest.fn(() => Promise.resolve({ confirmationResult: { confirm: jest.fn() } })),
  verifyPhoneCode: jest.fn(() => Promise.resolve({ user: mockUser }))
});

// Create mock provider component
export const AuthProvider = ({ children, mockAuthState = {} }) => {
  const defaultState = {
    currentUser: null,
    loading: false,
    error: '',
    setError: jest.fn(),
    // Match the exact function names used in the real AuthContext
    signInWithEmail: jest.fn(() => Promise.resolve({ user: mockUser })),
    login: jest.fn(() => Promise.resolve({ user: mockUser })), // Alias for backward compatibility
    signup: jest.fn(() => Promise.resolve({ user: mockUser })),
    logout: jest.fn(() => Promise.resolve(true)),
    signInWithGoogle: jest.fn(() => Promise.resolve({ user: mockUser })),
    loginWithGoogle: jest.fn(() => Promise.resolve({ user: mockUser })), // Alias for backward compatibility
    signInWithPhone: jest.fn(() => Promise.resolve({ confirmationResult: { confirm: jest.fn() } })),
    verifyPhoneCode: jest.fn(() => Promise.resolve({ user: mockUser }))
  };

  // For testing, we can override any of the default values
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

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase';
import useFirebaseListener from '../hooks/useFirebaseListener';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sign up with email and password - REAL FIREBASE
  async function signup(email, password, displayName) {
    try {
      setError('');
      console.log('Creating new user with email and password');
      
      // Create user with email and password in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update the user's display name
      // Note: In a real app, you would use updateProfile here
      // For now, we'll just set it in the state
      user.displayName = displayName;
      
      // Set the current user
      setCurrentUser(user);
      
      console.log('User created successfully:', user.uid);
      return { user };
    } catch (err) {
      console.error('Signup error:', err);
      
      // Handle specific error cases
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use. Please try signing in instead.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please use a stronger password.');
      } else {
        setError(err.message || 'Failed to create account');
      }
      
      throw err;
    }
  }

  // Sign in with email and password - REAL FIREBASE
  async function signInWithEmail(email, password) {
    try {
      setError('');
      console.log('Signing in with email and password');
      
      // Sign in with email and password in Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Set the current user
      setCurrentUser(user);
      
      console.log('User signed in successfully:', user.uid);
      return { user };
    } catch (err) {
      console.error('Sign-in error:', err);
      
      // Handle specific error cases
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password. Please try again.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed login attempts. Please try again later.');
      } else {
        setError(err.message || 'Failed to sign in');
      }
      
      throw err;
    }
  }

  // Mock user data for development
  const mockUsers = [
    {
      uid: 'mock-user-1',
      email: 'user@example.com',
      displayName: 'Demo User',
      photoURL: 'https://via.placeholder.com/150',
    }
  ];
  
  // Sign in with Google - MOCK FOR DEVELOPMENT, REAL FOR PRODUCTION
  async function signInWithGoogle() {
    try {
      setError('');
      setLoading(true);
      
      // For development environment, use mock authentication
      if (process.env.NODE_ENV !== 'production') {
        console.log('Using mock Google authentication for development');
        
        // Create a mock user with Google profile data
        const mockUser = {
          uid: 'google-mock-user-1',
          email: 'developer@example.com',
          displayName: 'Developer Account',
          photoURL: 'https://via.placeholder.com/150',
          providerId: 'google.com',
          emailVerified: true
        };
        
        // Set the current user with mock data
        setCurrentUser(mockUser);
        
        console.log('Mock Google authentication successful');
        setLoading(false);
        return { user: mockUser };
      }
      
      // For production, use real Google authentication
      console.log('Initiating real Google authentication with Firebase config:', auth.app.options.apiKey);
      
      // Create a Google auth provider
      const provider = new GoogleAuthProvider();
      
      // Add scopes for better user experience
      provider.addScope('profile');
      provider.addScope('email');
      
      // Set custom parameters for a better UX
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      // First check if we have a redirect result
      try {
        const redirectResult = await getRedirectResult(auth);
        if (redirectResult) {
          // User just got redirected back from the auth provider
          console.log('Redirect result received:', redirectResult);
          const user = redirectResult.user;
          console.log('Google authentication successful via redirect, user:', user.email);
          
          // Set the current user
          setCurrentUser(user);
          setLoading(false);
          return { user };
        }
      } catch (redirectError) {
        console.error('Redirect result error:', redirectError);
        // Continue with the sign-in process even if getting redirect result failed
      }
      
      // If no redirect result, initiate the redirect flow
      console.log('Starting Google sign-in redirect flow');
      await signInWithRedirect(auth, provider);
      
      // The page will redirect to Google and then back to the app
      // The function won't return here in the normal flow
      setLoading(false);
      return { user: null };
      
    } catch (error) {
      console.error('Google sign-in error:', error);
      setLoading(false);
      
      // Handle specific error cases
      if (error.code === 'auth/api-key-not-valid') {
        setError('Authentication configuration error. Please contact support.');
      } else if (error.code === 'auth/unauthorized-domain') {
        setError(`This domain is not authorized for Google sign-in. Please use the app at https://devfolio-84079.web.app`);
      } else if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign-in was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        setError('Pop-up was blocked by your browser. Please allow pop-ups for this site.');
      } else {
        setError(error.message || 'Failed to sign in with Google');
      }
      
      throw error;
    }
  }

  // Initialize phone auth and sign in with phone number - REAL FIREBASE
  async function signInWithPhone(phoneNumber, recaptchaContainer) {
    try {
      setError('');
      console.log('Initializing phone authentication');
      
      // Create a reCAPTCHA verifier instance
      const recaptchaVerifier = new RecaptchaVerifier(
        recaptchaContainer,
        {
          size: 'normal',
          callback: () => {
            console.log('reCAPTCHA verified');
          },
          'expired-callback': () => {
            setError('reCAPTCHA expired. Please try again.');
          }
        },
        auth
      );

      // Render the reCAPTCHA widget
      await recaptchaVerifier.render();
      
      // Format phone number if needed (ensure it has country code)
      const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      
      // Send verification code
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhoneNumber, recaptchaVerifier);
      
      // Store confirmation result to use when verifying code
      window.confirmationResult = confirmationResult;
      
      console.log('Verification code sent to phone');
      return confirmationResult;
    } catch (err) {
      console.error('Phone verification error:', err);
      
      // Handle specific error cases
      if (err.code === 'auth/invalid-phone-number') {
        setError('Invalid phone number. Please enter a valid phone number with country code.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many verification attempts. Please try again later.');
      } else {
        setError(err.message || 'Failed to send verification code');
      }
      
      throw err;
    }
  }
  
  // Verify phone code - REAL FIREBASE
  async function verifyPhoneCode(verificationCode) {
    try {
      setError('');
      console.log('Verifying phone code');
      
      if (!window.confirmationResult) {
        throw new Error('No verification sent. Please send a code first.');
      }
      
      // Confirm the verification code
      const result = await window.confirmationResult.confirm(verificationCode);
      const user = result.user;
      
      // Set the current user
      setCurrentUser(user);
      
      console.log('Phone verification successful');
      return { user };
    } catch (err) {
      console.error('Code verification error:', err);
      
      // Handle specific error cases
      if (err.code === 'auth/invalid-verification-code') {
        setError('Invalid verification code. Please try again.');
      } else if (err.code === 'auth/code-expired') {
        setError('Verification code has expired. Please request a new code.');
      } else {
        setError(err.message || 'Failed to verify code');
      }
      
      throw err;
    }
  }

  // Sign out - REAL FIREBASE
  async function logout() {
    try {
      console.log('Signing out user');
      await signOut(auth);
      setCurrentUser(null);
      return true;
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to log out');
      throw err;
    }
  }

  // Listen to auth state changes - REAL FIREBASE
  // Using useFirebaseListener hook for proper cleanup
  useFirebaseListener(() => {
    console.log('Setting up auth state listener');

    // Set up Firebase auth state observer
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
    });

    // Return the unsubscribe function for the hook to handle cleanup
    return unsubscribe;
  }, [auth]);

  // For backward compatibility with existing code
  const login = signInWithEmail;
  const loginWithGoogle = signInWithGoogle;
  
  const value = {
    currentUser,
    signInWithEmail,
    login, // For backward compatibility
    signup,
    logout,
    signInWithGoogle,
    loginWithGoogle, // For backward compatibility
    signInWithPhone,
    verifyPhoneCode,
    error,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

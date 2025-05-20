import { useEffect, useRef } from 'react';

/**
 * Custom hook to manage Firebase listener cleanup
 * 
 * This hook ensures that Firebase listeners are properly unsubscribed when the component unmounts,
 * preventing memory leaks and unnecessary background processing.
 * 
 * @param {Function} listenerSetup - A function that sets up the Firebase listener and returns an unsubscribe function
 * @param {Array} dependencies - An array of dependencies that should trigger the listener to be reset
 * @returns {void}
 * 
 * @example
 * // In a component:
 * useFirebaseListener(() => {
 *   // Set up the listener
 *   const unsubscribe = onAuthStateChanged(auth, (user) => {
 *     // Handle auth state changes
 *   });
 *   
 *   // Return the unsubscribe function
 *   return unsubscribe;
 * }, []);
 */
function useFirebaseListener(listenerSetup, dependencies = []) {
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    // Set up the listener and store the unsubscribe function
    if (typeof listenerSetup === 'function') {
      unsubscribeRef.current = listenerSetup();
    }

    // Cleanup function that runs when the component unmounts or dependencies change
    return () => {
      if (unsubscribeRef.current && typeof unsubscribeRef.current === 'function') {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, dependencies); // Re-run effect when dependencies change
}

export default useFirebaseListener;

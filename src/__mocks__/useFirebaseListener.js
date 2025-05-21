// Mock implementation of useFirebaseListener hook
import { useEffect } from 'react';

/**
 * Mock version of the useFirebaseListener hook for testing
 * 
 * This mock version simply calls the listenerSetup function once and handles cleanup
 * without any actual Firebase dependencies
 */
function useFirebaseListener(listenerSetup, dependencies = []) {
  useEffect(() => {
    // Just call the setup function if it exists
    let unsubscribe = null;
    if (typeof listenerSetup === 'function') {
      unsubscribe = listenerSetup();
    }
    
    // Return cleanup function
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, dependencies);
}

export default useFirebaseListener;

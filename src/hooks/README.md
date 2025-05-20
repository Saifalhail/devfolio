# Custom React Hooks

This directory contains custom React hooks used throughout the DevFolio project.

## useFirebaseListener

The `useFirebaseListener` hook provides a standardized way to manage Firebase listeners and ensure proper cleanup when components unmount.

### Usage

```javascript
import useFirebaseListener from '../hooks/useFirebaseListener';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

function MyComponent() {
  useFirebaseListener(() => {
    // Set up the listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Handle auth state changes
      console.log('Auth state changed:', user);
    });
    
    // Return the unsubscribe function
    return unsubscribe;
  }, []);
  
  // Rest of component
}
```

### Parameters

- `listenerSetup` (Function): A function that sets up the Firebase listener and returns an unsubscribe function
- `dependencies` (Array, optional): An array of dependencies that should trigger the listener to be reset, similar to useEffect dependencies

### Benefits

1. **Prevents Memory Leaks**: Ensures Firebase listeners are properly unsubscribed when components unmount
2. **Standardized Pattern**: Provides a consistent way to handle Firebase listeners across the application
3. **Dependency Tracking**: Resets listeners when dependencies change, similar to useEffect
4. **Offline Testing**: Works with mock Firebase implementations for testing in offline environments like Codex

### Implementation Details

The hook uses `useEffect` and `useRef` internally to track the unsubscribe function and ensure it's called during cleanup.

### Testing

When testing components that use Firebase listeners, you can use the mock Firebase implementation in `src/__mocks__/firebase.js` along with this hook to ensure proper testing in offline environments.

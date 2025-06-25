import { useState, useEffect, useRef } from 'react';
import { 
  Query, 
  DocumentReference, 
  onSnapshot, 
  DocumentData, 
  QuerySnapshot, 
  DocumentSnapshot,
  getDoc,
  getDocs
} from 'firebase/firestore';

interface FirestoreState<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
}

/**
 * Enhanced custom hook to subscribe to Firestore document or collection changes
 * with improved error handling and connection management
 * 
 * @param queryOrRef Firestore query or document reference
 * @param enabled Optional flag to enable/disable the subscription
 * @returns Object containing data, loading state, and error
 */
// Flag to disable real-time updates and use one-time fetches instead
// Set to true to prevent constant Firestore POST requests
const DISABLE_REALTIME_UPDATES = true;

export function useFirestoreSnapshot<T = DocumentData>(
  queryOrRef: Query<DocumentData> | DocumentReference<DocumentData> | null,
  enabled: boolean = true
): T[] {
  const [data, setData] = useState<T[]>([]);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const attemptCountRef = useRef(0);
  const maxRetries = 3;
  const initialFetchDoneRef = useRef(false);
  
  // Function to safely unsubscribe from previous listeners
  const safeUnsubscribe = () => {
    if (unsubscribeRef.current) {
      try {
        unsubscribeRef.current();
      } catch (err) {
        console.warn('Error unsubscribing from Firestore:', err);
      }
      unsubscribeRef.current = null;
    }
  };

  // Function to fetch data once instead of setting up a listener
  const fetchOnce = async () => {
    try {
      if (!queryOrRef) return;
      
      if ('type' in queryOrRef && queryOrRef.type === 'document') {
        // For document references
        const docSnap = await getDoc(queryOrRef);
        if (docSnap.exists()) {
          setData([{
            id: docSnap.id,
            ...docSnap.data()
          } as T]);
        } else {
          setData([]);
        }
      } else {
        // For queries
        const querySnap = await getDocs(queryOrRef as Query<DocumentData>);
        const results = querySnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as T[];
        setData(results);
      }
    } catch (err) {
      console.error('Error fetching Firestore data:', err);
      setData([]);
    }
  };

  useEffect(() => {
    // If disabled or no query/ref provided, clean up and return
    if (!enabled || !queryOrRef) {
      safeUnsubscribe();
      return;
    }

    // Reset attempt counter when query changes
    attemptCountRef.current = 0;
    
    // Clean up any existing subscription
    safeUnsubscribe();
    
    // If we've already done the initial fetch and real-time updates are disabled, don't fetch again
    if (DISABLE_REALTIME_UPDATES && initialFetchDoneRef.current) {
      return;
    }

    // For development mode or when real-time updates are disabled, just fetch once
    if (DISABLE_REALTIME_UPDATES) {
      fetchOnce();
      initialFetchDoneRef.current = true;
      return;
    }

    // Set up the new subscription with error handling and retry logic
    const setupSubscription = () => {
      try {
        // Handle different types separately
        if ('type' in queryOrRef && queryOrRef.type === 'document') {
          // This is a DocumentReference
          unsubscribeRef.current = onSnapshot(
            queryOrRef,
            (snapshot: DocumentSnapshot) => {
              if (snapshot.exists()) {
                setData([{
                  id: snapshot.id,
                  ...snapshot.data()
                } as T]);
              } else {
                setData([]);
              }
            },
            (error) => {
              console.error("Firestore document snapshot error:", error);
              setData([]);
              
              // If we get an internal assertion error, try to recover by fetching once
              if (error.code === 'internal' || error.message.includes('INTERNAL ASSERTION FAILED')) {
                safeUnsubscribe();
                fetchOnce();
              }
            }
          );
        } else {
          // This is a Query
          unsubscribeRef.current = onSnapshot(
            queryOrRef as Query<DocumentData>,
            (snapshot: QuerySnapshot) => {
              const results = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              })) as T[];
              setData(results);
            },
            (error) => {
              console.error("Firestore query snapshot error:", error);
              
              // If we get an internal assertion error, try to recover by fetching once
              if (error.code === 'internal' || error.message.includes('INTERNAL ASSERTION FAILED')) {
                safeUnsubscribe();
                fetchOnce();
              } else {
                setData([]);
              }
            }
          );
        }
      } catch (err) {
        console.error("Error setting up Firestore subscription:", err);
        setData([]);
        
        // Retry setup if we haven't exceeded max retries
        if (attemptCountRef.current < maxRetries) {
          attemptCountRef.current++;
          console.log(`Retrying Firestore subscription (attempt ${attemptCountRef.current}/${maxRetries})`);
          setTimeout(setupSubscription, 1000 * attemptCountRef.current); // Exponential backoff
        } else {
          // Fall back to one-time fetch if we can't set up a subscription
          fetchOnce();
        }
      }
    };

    // Start the subscription setup
    setupSubscription();

    // Cleanup subscription on unmount or when dependencies change
    return () => safeUnsubscribe();
  }, [queryOrRef, enabled]);

  return data;
}

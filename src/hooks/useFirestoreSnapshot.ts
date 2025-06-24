import { useState, useEffect } from 'react';
import { 
  Query, 
  DocumentReference, 
  onSnapshot, 
  DocumentData, 
  QuerySnapshot, 
  DocumentSnapshot,
  getDoc
} from 'firebase/firestore';

/**
 * Custom hook to subscribe to Firestore document or collection changes
 * @param queryOrRef Firestore query or document reference
 * @returns Array of documents with their IDs or a single document
 */
export function useFirestoreSnapshot<T = DocumentData>(queryOrRef: Query<DocumentData> | DocumentReference<DocumentData>): T[] {
  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    if (!queryOrRef) return;

    let unsubscribe: () => void;

    // Handle different types separately to satisfy TypeScript
    if ('type' in queryOrRef && queryOrRef.type === 'document') {
      // This is a DocumentReference
      unsubscribe = onSnapshot(
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
        }
      );
    } else {
      // This is a Query
      unsubscribe = onSnapshot(
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
          setData([]);
        }
      );
    }

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [queryOrRef]);

  return data;
}

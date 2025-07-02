import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { firestore as db } from '../firebase/config';

const STORAGE_KEY = 'tasks';

/**
 * Custom hook to load tasks from Firestore with localStorage fallback.
 * It listens to the "tasks" collection and keeps localStorage in sync.
 */
export default function useTasks() {
  const [tasks, setTasks] = useState([]);

  // Load tasks from localStorage on first render
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setTasks(parsed);
        }
      }
    } catch (err) {
      console.error('Failed to parse stored tasks', err);
    }
  }, []);

  // Subscribe to Firestore tasks collection when available
  useEffect(() => {
    if (!db || typeof collection !== 'function') return undefined;

    try {
      const unsubscribe = onSnapshot(collection(db, 'tasks'), (snapshot) => {
        const fetched = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTasks(fetched);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(fetched));
        } catch (err) {
          console.error('Failed to store tasks', err);
        }
      });
      return unsubscribe;
    } catch (err) {
      console.error('Failed to subscribe to tasks collection', err);
      return undefined;
    }
  }, []);

  return tasks;
}


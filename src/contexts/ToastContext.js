import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Common/Toast';

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, { type = 'info', duration = 3000 } = {}) => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }, [removeToast]);

  const showToast = useCallback((message, type = 'info') => {
    addToast(message, { type });
  }, [addToast]);

  const value = {
    toasts,
    addToast,
    removeToast,
    showToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

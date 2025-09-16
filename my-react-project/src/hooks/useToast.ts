import { useState, useCallback } from 'react';
import { type ToastProps } from '../components/Toast';

interface ToastOptions {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastProps = {
      id,
      ...options,
      onClose: (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }
    };

    setToasts(prev => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((title: string, message: string, duration?: number) => {
    addToast({ type: 'success', title, message, duration });
  }, [addToast]);

  const error = useCallback((title: string, message: string, duration?: number) => {
    addToast({ type: 'error', title, message, duration });
  }, [addToast]);

  const info = useCallback((title: string, message: string, duration?: number) => {
    addToast({ type: 'info', title, message, duration });
  }, [addToast]);

  const warning = useCallback((title: string, message: string, duration?: number) => {
    addToast({ type: 'warning', title, message, duration });
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning
  };
};

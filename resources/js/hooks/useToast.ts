import { useState, useCallback } from 'react';
import type { Toast, ToastType } from '@/components/Install/Toast';

let toastId = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((type: ToastType, message: string, duration?: number) => {
    const id = `toast-${++toastId}`;
    const toast: Toast = { id, type, message, duration };

    // Log to console
    const logMethod = type === 'error' ? 'error' : type === 'warning' ? 'warn' : 'log';
    console[logMethod as keyof Console](`[Toast ${type.toUpperCase()}]`, message);

    setToasts((prev) => [...prev, toast]);
    return id;
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((message: string, duration?: number) => show('success', message, duration), [show]);
  const error = useCallback((message: string, duration?: number) => show('error', message, duration), [show]);
  const warning = useCallback((message: string, duration?: number) => show('warning', message, duration), [show]);
  const info = useCallback((message: string, duration?: number) => show('info', message, duration), [show]);

  const clear = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    show,
    success,
    error,
    warning,
    info,
    remove,
    clear,
  };
};

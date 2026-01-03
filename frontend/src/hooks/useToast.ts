import { useState, useCallback } from 'react';
import type { Toast, ToastType } from '../components/common/Toast';

let toastIdCounter = 0;

export const useToast = () => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((
        message: string,
        type: ToastType = 'info',
        options?: { title?: string; duration?: number }
    ) => {
        const id = `toast-${++toastIdCounter}`;
        const toast: Toast = {
            id,
            type,
            message,
            title: options?.title,
            duration: options?.duration ?? 5000,
        };

        setToasts((prev) => [...prev, toast]);
        return id;
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const success = useCallback((message: string, title?: string) => {
        return showToast(message, 'success', { title, duration: 4000 });
    }, [showToast]);

    const error = useCallback((message: string, title?: string) => {
        return showToast(message, 'error', { title, duration: 6000 });
    }, [showToast]);

    const warning = useCallback((message: string, title?: string) => {
        return showToast(message, 'warning', { title, duration: 5000 });
    }, [showToast]);

    const info = useCallback((message: string, title?: string) => {
        return showToast(message, 'info', { title, duration: 5000 });
    }, [showToast]);

    return {
        toasts,
        showToast,
        removeToast,
        success,
        error,
        warning,
        info,
    };
};


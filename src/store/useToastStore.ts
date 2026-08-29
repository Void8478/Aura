import { create } from 'zustand';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
}

interface ToastStore {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newItem: ToastItem = { id, duration: 4000, ...toast };

    set((state) => ({
      toasts: [...state.toasts, newItem],
    }));

    if (newItem.duration && newItem.duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, newItem.duration);
    }

    return id;
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
  clearToasts: () => {
    set({ toasts: [] });
  },
}));

export const toast = {
  success: (title: string, description?: string) =>
    useToastStore.getState().addToast({ title, description, variant: 'success' }),
  info: (title: string, description?: string) =>
    useToastStore.getState().addToast({ title, description, variant: 'info' }),
  warning: (title: string, description?: string) =>
    useToastStore.getState().addToast({ title, description, variant: 'warning' }),
  error: (title: string, description?: string) =>
    useToastStore.getState().addToast({ title, description, variant: 'error' }),
};

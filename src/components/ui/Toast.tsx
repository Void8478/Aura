import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import type { ToastItem } from '../../store/useToastStore';
import { useToastStore } from '../../store/useToastStore';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-24 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastCard: React.FC<{ toast: ToastItem; onDismiss: () => void }> = ({
  toast,
  onDismiss,
}) => {
  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-aura-accent shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-aura-amber shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
  };

  const variant = toast.variant || 'info';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      className="pointer-events-auto p-4 rounded-xl bg-aura-850 border border-aura-700/80 shadow-aura-elevated flex items-start gap-3 select-none"
    >
      <div className="mt-0.5">{icons[variant]}</div>

      <div className="flex-1 min-w-0">
        <h5 className="text-xs font-semibold text-aura-100">{toast.title}</h5>
        {toast.description && (
          <p className="text-xs text-aura-400 font-sans mt-0.5 leading-relaxed">
            {toast.description}
          </p>
        )}
      </div>

      <button
        onClick={onDismiss}
        className="p-1 text-aura-500 hover:text-aura-200 rounded transition-colors -mr-1 -mt-1"
        aria-label="Dismiss toast"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
};

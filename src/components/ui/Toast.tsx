'use client';
import { Toast as ToastType } from '@/hooks/useToast';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastType[];
  removeToast: (id: string) => void;
}

const icons = {
  success: <CheckCircle size={18} className="text-emerald-400" />,
  error: <AlertCircle size={18} className="text-red-400" />,
  info: <Info size={18} className="text-blue-400" />,
};

const borders = {
  success: 'border-l-4 border-emerald-400',
  error: 'border-l-4 border-red-400',
  info: 'border-l-4 border-blue-400',
};

export default function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div
      className="fixed top-4 right-4 z-[100] flex flex-col gap-3"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl min-w-[300px] max-w-[380px] animate-slide-in-right ${borders[toast.type]}`}
          style={{ background: 'var(--surface)' }}
          role="alert"
        >
          {icons[toast.type]}
          <span className="flex-1 text-sm font-medium" style={{ color: 'var(--text)' }}>
            {toast.message}
          </span>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Dismiss notification"
          >
            <X size={14} style={{ color: 'var(--muted)' }} />
          </button>
        </div>
      ))}
    </div>
  );
}

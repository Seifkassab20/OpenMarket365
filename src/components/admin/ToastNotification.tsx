'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (title: string, message?: string, type?: ToastType) => void;
  addToast: (type: ToastType, message: string, title?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((title: string, message?: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, [removeToast]);

  const addToast = useCallback((type: ToastType, message: string, title?: string) => {
    const headerTitle = title || (type.charAt(0).toUpperCase() + type.slice(1));
    showToast(headerTitle, message, type);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, addToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const icons = {
            success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
            error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
            warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
            info: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
          };

          const borders = {
            success: 'border-emerald-500/40 bg-[#16211a]',
            error: 'border-rose-500/40 bg-[#241718]',
            warning: 'border-amber-500/40 bg-[#251f15]',
            info: 'border-sky-500/40 bg-[#141f27]',
          };

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-4 rounded-xl border shadow-xl flex items-start gap-3 backdrop-blur-md transition-all animate-in slide-in-from-bottom-2 ${borders[toast.type]}`}
            >
              {icons[toast.type]}
              <div className="flex-grow space-y-0.5">
                <div className="text-xs font-bold text-white tracking-wide">{toast.title}</div>
                {toast.message && (
                  <div className="text-[11px] text-zinc-300 leading-relaxed">{toast.message}</div>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

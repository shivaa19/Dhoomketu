import React, { useEffect } from 'react';

export interface ToastMessage {
  id: number;
  title: string;
  msg: string;
  icon?: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-surface-container-highest border border-outline-variant/40 px-space-lg py-space-md rounded-xl shadow-2xl flex items-center gap-space-md transition-all animate-in fade-in slide-in-from-bottom-3 max-w-md">
      <span className="material-symbols-outlined text-tertiary text-[24px]">
        {toast.icon || 'check_circle'}
      </span>
      <div className="flex-1">
        <span className="font-headline-sm text-headline-sm text-on-surface block leading-tight">
          {toast.title}
        </span>
        <span className="font-body-sm text-body-sm text-on-surface-variant block mt-0.5">
          {toast.msg}
        </span>
      </div>
      <button
        onClick={onDismiss}
        className="text-on-surface-variant hover:text-on-surface text-[18px] ml-2"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
};

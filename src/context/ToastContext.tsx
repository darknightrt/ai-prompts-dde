"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'warning';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ message: string; type: ToastType; visible: boolean }>({
    message: '',
    type: 'success',
    visible: false,
  });

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  }, []);

  let bgColor = 'bg-[#10b981]'; // success
  let icon = 'fa-check-circle';

  if (toast.type === 'error') {
    bgColor = 'bg-red-500';
    icon = 'fa-trash-can';
  } else if (toast.type === 'warning') {
    bgColor = 'bg-orange-500';
    icon = 'fa-circle-exclamation';
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div 
        className={`fixed z-[120] min-w-[250px] text-white text-center rounded-lg p-4 left-1/2 -translate-x-1/2 transition-all duration-300 pointer-events-none flex items-center justify-center gap-2 shadow-lg ${bgColor} ${
          toast.visible ? 'bottom-[50px] opacity-100' : 'bottom-[30px] opacity-0'
        }`}
      >
        <i className={`fa-solid ${icon}`}></i> {toast.message}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

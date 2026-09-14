"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

/**
 * Toasts float above the surface, so they carry the strongest extrusion
 * (`lifted`) to justify their elevation. Chroma appears only in the icon
 * well — the body stays monochrome like everything else.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const iconStyles: Record<ToastType, string> = {
    success: "text-neu-teal",
    error: "text-neu-danger",
    info: "text-neu-accent",
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="pointer-events-none fixed bottom-6 right-6 z-50 flex w-full max-w-sm flex-col gap-3"
        role="region"
        aria-label="การแจ้งเตือน"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            aria-live="polite"
            className="pointer-events-auto flex animate-fade-in items-center justify-between rounded-card bg-neu-base p-4 shadow-neu-lifted transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neu-base shadow-neu-inset-deep ${iconStyles[toast.type]}`}
              >
                {toast.type === "success" && <CheckCircle2 size={17} />}
                {toast.type === "error" && <AlertCircle size={17} />}
                {toast.type === "info" && <Info size={17} />}
              </div>
              <span className="text-xs font-ui text-neu-fg">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 rounded-full p-1.5 text-neu-muted transition-colors duration-300 hover:text-neu-fg active:shadow-neu-inset-sm focus-neu"
              aria-label="ปิดการแจ้งเตือน"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

import React, { createContext, useCallback, useContext, useState } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const STYLES = {
  error: {
    bg: "bg-red-50 border-red-200",
    text: "text-red-700",
    icon: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
  },
  success: {
    bg: "bg-green-50 border-green-200",
    text: "text-green-700",
    icon: <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />,
  },
  info: {
    bg: "bg-blue-50 border-blue-200",
    text: "text-blue-700",
    icon: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
  },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, { type = "info", duration = 5000 } = {}) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss]
  );

  const toast = {
    show: showToast,
    error: (message, opts) => showToast(message, { ...opts, type: "error" }),
    success: (message, opts) => showToast(message, { ...opts, type: "success" }),
    info: (message, opts) => showToast(message, { ...opts, type: "info" }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Toast stack — fixed top-right, above everything */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-[340px] max-w-[calc(100vw-2rem)]">
        {toasts.map((t) => {
          const style = STYLES[t.type] || STYLES.info;
          return (
            <div
              key={t.id}
              role="alert"
              className={`flex items-start gap-3 rounded-xl border shadow-lg px-4 py-3 ${style.bg} animate-[fadeIn_0.2s_ease-out]`}
            >
              {style.icon}
              <p className={`text-sm font-medium flex-1 ${style.text}`}>{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className={`shrink-0 ${style.text} opacity-60 hover:opacity-100 transition-opacity`}
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
};
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const STYLES = {
  error: {
    bg: "bg-[#FBEAEA] border-[#E8B4B4]",
    text: "text-[#B33A3A]",
    icon: <AlertCircle className="w-5 h-5 text-[#B33A3A] shrink-0" />,
  },
  warning: {
    bg: "bg-[#FFF5E5] border-[#F5D9A8]",
    text: "text-[#B4791F]",
    icon: <AlertTriangle className="w-5 h-5 text-[#F5A623] shrink-0" />,
  },
  success: {
    bg: "bg-[#F3F9F5] border-[#BFE0CB]",
    text: "text-[#2A523D]",
    icon: <CheckCircle2 className="w-5 h-5 text-[#3A7654] shrink-0" />,
  },
  info: {
    bg: "bg-[#F3F2F2] border-[#CBE0CF]",
    text: "text-[#386641]",
    icon: <Info className="w-5 h-5 text-[#386641] shrink-0" />,
  },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timerId = timers.current.get(id);
    if (timerId) {
      clearTimeout(timerId);
      timers.current.delete(id);
    }
  }, []);

  const showToast = useCallback(
    (message, { type = "info", duration = 5000 } = {}) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);
      if (duration > 0) {
        const timerId = setTimeout(() => dismiss(id), duration);
        timers.current.set(id, timerId);
      }
      return id;
    },
    [dismiss]
  );

  // Clear any still-pending timers if the provider itself unmounts.
  useEffect(() => {
    const timersMap = timers.current;
    return () => {
      timersMap.forEach((timerId) => clearTimeout(timerId));
      timersMap.clear();
    };
  }, []);

  const toast = {
    show: showToast,
    error: (message, opts) => showToast(message, { ...opts, type: "error" }),
    warning: (message, opts) => showToast(message, { ...opts, type: "warning" }),
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
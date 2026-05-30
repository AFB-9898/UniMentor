import { useEffect, useState } from "react";

export type ToastVariant = "success" | "error" | "info";

interface ToastProps {
  message: string;
  variant: ToastVariant;
  onClose: () => void;
  duration?: number;
}

const variantStyles: Record<ToastVariant, string> = {
  success:
    "bg-green-600 text-white",
  error:
    "bg-red-600 text-white",
  info:
    "bg-blue-600 text-white",
};

const variantIcons: Record<ToastVariant, string> = {
  success: "✓",
  error: "✕",
  info: "ℹ",
};

/**
 * Toast — notification atom with auto-dismiss.
 *
 * Renders a fixed toast at the top-right of the viewport.
 * Calls onClose after `duration` ms (default 4000).
 */
export default function Toast({
  message,
  variant,
  onClose,
  duration = 4000,
}: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation on next frame
    const enter = requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Wait for exit animation
    }, duration);
    return () => {
      cancelAnimationFrame(enter);
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  return (
    <div
      role="alert"
      className={`
        fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg
        transition-all duration-300
        ${variantStyles[variant]}
        ${visible ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"}
      `}
    >
      <span className="text-lg font-bold" aria-hidden>
        {variantIcons[variant]}
      </span>
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-2 text-white/80 hover:text-white transition-colors"
        aria-label="Cerrar notificación"
      >
        ✕
      </button>
    </div>
  );
}

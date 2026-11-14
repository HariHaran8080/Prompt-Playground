import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import type { Toast } from "../types/prompt";

type Props = {
  toasts: Toast[];
  onDismiss: (id: string) => void;
};

export default function ToastContainer({ toasts, onDismiss }: Props) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 border shadow-lg text-xs transition-all animate-in fade-in slide-in-from-bottom-2 duration-200 ${
            toast.type === "success"
              ? "bg-white border-green-300 text-gray-800"
              : toast.type === "error"
              ? "bg-white border-red-300 text-gray-800"
              : "bg-white border-gray-300 text-gray-800"
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === "success" && (
              <CheckCircle2 size={16} className="text-green-600" />
            )}
            {toast.type === "error" && (
              <AlertCircle size={16} className="text-red-600" />
            )}
            {toast.type === "info" && (
              <Info size={16} className="text-blue-600" />
            )}
          </div>

          <div className="flex-1 font-medium leading-relaxed">{toast.message}</div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-gray-400 hover:text-black p-0.5"
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}


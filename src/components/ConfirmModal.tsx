import { AlertTriangle, X } from "lucide-react";

type Props = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = false,
  onConfirm,
  onCancel,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md border border-gray-200 shadow-xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            {isDestructive && <AlertTriangle size={17} className="text-red-500" />}
            <h3 className="font-semibold text-sm">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            aria-label="Close dialog"
            className="p-1 hover:bg-gray-100 text-gray-500 hover:text-black"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5">
          <p className="text-sm text-gray-600 leading-relaxed">{message}</p>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onCancel}
              className="border border-gray-300 px-4 py-2 text-xs font-medium hover:bg-gray-50"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-xs font-medium text-white ${
                isDestructive
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-black hover:bg-gray-800"
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


import React from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

const ConfirmModal = ({
  show,
  type = "info",
  title,
  message,
  onClose,
  onConfirm,
  confirmText,
  cancelText,
  closeOnOverlay = true,
}) => {
  if (!show) return null;

  const isConfirm = typeof onConfirm === "function";

  let icon, ringClass, confirmButtonClass;
  switch (type) {
    case "success":
      icon = <CheckCircle className="w-8 h-8 text-green-500" />;
      ringClass = "bg-green-50 ring-green-50/50";
      confirmButtonClass =
        "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20";
      break;
    case "error":
      icon = <XCircle className="w-8 h-8 text-red-500" />;
      ringClass = "bg-red-50 ring-red-50/50";
      confirmButtonClass =
        "bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20";
      break;
    default:
      icon = <AlertCircle className="w-8 h-8 text-blue-500" />;
      ringClass = "bg-blue-50 ring-blue-50/50";
      confirmButtonClass =
        "bg-[#0B2F7F] hover:bg-[#1A45A0] shadow-lg shadow-[#0B2F7F]/20";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-all"
        onClick={closeOnOverlay ? onClose : undefined}
      ></div>
      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 border border-slate-100 transform transition-all scale-100">
        <div className="flex flex-col items-center text-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ring-4 ${ringClass}`}
          >
            {icon}
          </div>
          <h2 className="text-xl font-bold mb-2 text-slate-800">{title}</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">{message}</p>

          {isConfirm ? (
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                {cancelText || "Batal"}
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all transform active:scale-95 ${confirmButtonClass}`}
              >
                {confirmText || "Ya"}
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              className={`w-full py-3 rounded-xl text-white font-semibold transition-colors ${confirmButtonClass}`}
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

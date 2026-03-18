import React from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

const ConfirmModal = ({ show, type = "info", title, message, onClose }) => {
  if (!show) return null;

  let icon, color;
  switch (type) {
    case "success":
      icon = <CheckCircle className="w-8 h-8 text-green-500" />;
      color = "bg-green-50";
      break;
    case "error":
      icon = <XCircle className="w-8 h-8 text-red-500" />;
      color = "bg-red-50";
      break;
    default:
      icon = <AlertCircle className="w-8 h-8 text-blue-500" />;
      color = "bg-blue-50";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-all"
        onClick={onClose}
      ></div>
      <div
        className={`relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 border border-slate-100 transform transition-all scale-100 ${color}`}
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">{icon}</div>
          <h2 className="text-xl font-bold mb-2 text-slate-800">{title}</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">{message}</p>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-[#0B2F7F] hover:bg-[#1A45A0] text-white font-semibold transition-colors shadow-lg shadow-[#0B2F7F]/20"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

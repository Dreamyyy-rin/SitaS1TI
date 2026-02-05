import React from "react";
import { CheckCircle2 } from "lucide-react";

const SuccessToast = ({ show }) => {
  if (!show) return null;

  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-in-right">
      <div className="bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
        <CheckCircle2 className="w-6 h-6" />
        <div>
          <p className="font-bold">Berhasil!</p>
          <p className="text-sm">Pengaturan deadline berhasil disimpan</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessToast;

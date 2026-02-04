import React from "react";
import { ShieldAlert } from "lucide-react";

const DeleteActionModal = ({
  isOpen,
  onClose,
  onSoftDelete,
  onHardDelete,
  user,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Kelola Penghapusan User
            </h3>
            <p className="text-sm text-slate-500">{user?.name || "Pengguna"}</p>
          </div>
        </div>

        <p className="mt-4 text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
          Tindakan ini akan mempengaruhi akses pengguna.
        </p>

        <div className="mt-6 space-y-3">
          <button
            onClick={onSoftDelete}
            className="w-full px-4 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 shadow-lg shadow-amber-500/20 transition-all"
          >
            Nonaktifkan User
          </button>
          <button
            onClick={onHardDelete}
            className="w-full px-4 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 shadow-lg shadow-rose-600/20 transition-all"
          >
            Hapus Permanen
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteActionModal;

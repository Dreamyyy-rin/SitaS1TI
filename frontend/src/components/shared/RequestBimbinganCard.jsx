import React, { useMemo, useState } from "react";
import ConfirmModal from "./ConfirmModal";

const RequestBimbinganCard = ({ request, onAccept, onReject }) => {
  const [confirmState, setConfirmState] = useState({
    show: false,
    action: null, // 'accept' | 'reject'
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const confirmCopy = useMemo(() => {
    const action = confirmState.action;
    const mahasiswaLabel = request?.nim
      ? `${request.nama} (${request.nim})`
      : request?.nama || "Mahasiswa";

    if (action === "accept") {
      return {
        type: "info",
        title: "Konfirmasi Terima",
        message: `Apakah Anda yakin ingin menerima permintaan bimbingan dari ${mahasiswaLabel}?`,
        confirmText: "Ya, Terima",
      };
    }
    if (action === "reject") {
      return {
        type: "error",
        title: "Konfirmasi Tolak",
        message: `Apakah Anda yakin ingin menolak permintaan bimbingan dari ${mahasiswaLabel}?`,
        confirmText: "Ya, Tolak",
      };
    }
    return {
      type: "info",
      title: "Konfirmasi",
      message: "Apakah Anda yakin?",
      confirmText: "Ya",
    };
  }, [confirmState.action, request?.nama, request?.nim]);

  const handleConfirm = async () => {
    if (isProcessing) return;
    try {
      setIsProcessing(true);
      if (confirmState.action === "accept") {
        await onAccept?.(request.id);
      } else if (confirmState.action === "reject") {
        await onReject?.(request.id);
      }
    } finally {
      setIsProcessing(false);
      setConfirmState({ show: false, action: null });
    }
  };

  const isFinalized = Boolean(request?.decision);
  const buttonsDisabled = isProcessing || isFinalized;

  return (
    <>
      <ConfirmModal
        show={confirmState.show}
        type={confirmCopy.type}
        title={confirmCopy.title}
        message={confirmCopy.message}
        confirmText={confirmCopy.confirmText}
        cancelText="Batal"
        onClose={() =>
          setConfirmState({
            show: false,
            action: null,
          })
        }
        onConfirm={handleConfirm}
      />

      <tr className="border-t hover:bg-gray-50">
        <td className="px-4 py-3 text-sm">
          <div>
            <p className="font-semibold text-slate-800">{request.nama}</p>
            <p className="text-xs text-slate-500">{request.nim}</p>
          </div>
        </td>
        <td className="px-4 py-3 text-sm">{request.judul}</td>
        <td className="px-4 py-3 text-sm">{request.tanggal}</td>
        <td className="px-4 py-3 text-center">
          <div className="flex justify-center gap-2">
            <button
              onClick={() =>
                setConfirmState({
                  show: true,
                  action: "accept",
                })
              }
              disabled={buttonsDisabled}
              className={`text-white px-3 py-1 rounded text-xs transition-colors ${
                buttonsDisabled
                  ? "bg-slate-300 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              Terima
            </button>
            <button
              onClick={() =>
                setConfirmState({
                  show: true,
                  action: "reject",
                })
              }
              disabled={buttonsDisabled}
              className={`text-white px-3 py-1 rounded text-xs transition-colors ${
                buttonsDisabled
                  ? "bg-slate-300 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              Tolak
            </button>
          </div>
        </td>
      </tr>
    </>
  );
};

export default RequestBimbinganCard;

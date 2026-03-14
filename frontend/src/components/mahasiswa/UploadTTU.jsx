import React, { useState, useRef, useEffect } from "react";
import {
  UploadCloud,
  FileText,
  X,
  Eye,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  History,
  ArrowRight,
} from "lucide-react";
import { useTTU } from "../../contexts/TTUContext";

const UploadTTU = ({ onSwitchToReview }) => {
  const {
    currentStage,
    submittedFile,
    submitFile,
    cancelSubmission,
    isUploading,
    uploadError,
    ttuStatus,
    submissionHistory,
    loadingHistory,
    loadSubmissionHistory,
  } = useTTU();

  // Ambil file terbaru dari submissionHistory untuk currentStage
  const latestSubmittedFile = React.useMemo(() => {
    if (!submissionHistory || submissionHistory.length === 0) return null;
    const stageKey = `ttu_${currentStage}`;
    // Filter hanya submission untuk stage ini dan statusnya submitted/reviewed
    const filtered = submissionHistory.filter(
      (s) =>
        s.ttu_number === stageKey &&
        (s.status === "submitted" || s.status === "reviewed"),
    );
    if (filtered.length === 0) return null;
    // Ambil yang terbaru (diasumsikan sudah urut, atau ambil yang paling akhir)
    return filtered[filtered.length - 1];
  }, [submissionHistory, currentStage]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadSubmissionHistory();
  }, [loadSubmissionHistory]);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (file) {
      setSelectedFile({
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
      });
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePreview = () => {
    if (selectedFile && selectedFile.file) {
      const fileURL = URL.createObjectURL(selectedFile.file);
      window.open(fileURL, "_blank");

      setTimeout(() => URL.revokeObjectURL(fileURL), 100);
    }
  };

  const handleSubmit = async () => {
    if (selectedFile) {
      const success = await submitFile(selectedFile);
      if (success) {
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const handleCancelSubmission = () => {
    setShowCancelDialog(true);
  };

  const handleConfirmCancel = async () => {
    const success = await cancelSubmission();
    setShowCancelDialog(false);

    if (!success) {
      alert("Gagal membatalkan pengajuan. Silakan coba lagi.");
    }
  };

  const handleCloseCancelDialog = () => {
    setShowCancelDialog(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Upload Tugas Talenta Unggul {currentStage <= 2 ? currentStage : 2}
        </h2>
        <p className="text-gray-600">
          {currentStage <= 2
            ? `Silakan upload draf untuk TTU ${currentStage}`
            : "TTU 1 dan TTU 2 telah diselesaikan"}
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg font-medium">
            <span className="w-2 h-2 bg-blue-500 rounded-full "></span>
            TTU {currentStage <= 2 ? currentStage : 2} dari 3
          </span>
          {ttuStatus && (
            <span
              className={`inline-flex items-center px-3 py-1.5 rounded-lg font-medium text-xs ${
                ttuStatus[`ttu_${currentStage}`]?.status === "open"
                  ? "bg-green-50 text-green-700"
                  : ttuStatus[`ttu_${currentStage}`]?.status === "submitted"
                    ? "bg-yellow-50 text-yellow-700"
                    : ttuStatus[`ttu_${currentStage}`]?.status === "approved"
                      ? "bg-emerald-50 text-emerald-700"
                      : ttuStatus[`ttu_${currentStage}`]?.status === "reviewed"
                        ? "bg-purple-50 text-purple-700"
                        : ttuStatus[`ttu_${currentStage}`]?.status ===
                            "needs_revision"
                          ? "bg-orange-50 text-orange-700"
                          : "bg-slate-50 text-slate-500"
              }`}
            >
              Status:{" "}
              {ttuStatus[`ttu_${currentStage}`]?.status === "open"
                ? "Dibuka"
                : ttuStatus[`ttu_${currentStage}`]?.status === "submitted"
                  ? "Diajukan"
                  : ttuStatus[`ttu_${currentStage}`]?.status === "approved"
                    ? "Disetujui"
                    : ttuStatus[`ttu_${currentStage}`]?.status === "reviewed"
                      ? "Ditinjau"
                      : ttuStatus[`ttu_${currentStage}`]?.status ===
                          "needs_revision"
                        ? "Perlu Revisi"
                        : ttuStatus[`ttu_${currentStage}`]?.status ||
                          "Terkunci"}
            </span>
          )}
        </div>
      </div>

      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{uploadError}</p>
        </div>
      )}

      {/* Stage 3 - TTU3 should be uploaded from Daftar Review */}
      {currentStage >= 3 ? (
        <div className="bg-white rounded-xl shadow-sm border border-green-200 p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {ttuStatus?.ttu_3?.status === "approved"
              ? "Semua TTU Telah Diselesaikan!"
              : "TTU 1 & TTU 2 Telah Disetujui!"}
          </h3>
          {ttuStatus?.ttu_3?.status !== "approved" && (
            <>
              <p className="text-gray-600 mb-6">
                Untuk mengunggah TTU 3, silakan gunakan menu{" "}
                <span className="font-semibold text-blue-700">
                  Daftar Tinjauan
                </span>
                .
              </p>
              {onSwitchToReview && (
                <button
                  onClick={onSwitchToReview}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                >
                  Buka Daftar Tinjauan
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      ) : ttuStatus && ttuStatus[`ttu_${currentStage}`]?.status === "locked" ? (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">
            TTU {currentStage} masih terkunci
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Selesaikan tahap sebelumnya terlebih dahulu
          </p>
        </div>
      ) : latestSubmittedFile ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                File Berhasil Dikirim
              </h3>
              <p className="text-sm text-gray-600">
                File Anda telah dikirim untuk ditinjau. Anda dapat membatalkan
                pengajuan jika ingin mengunggah file baru.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {latestSubmittedFile.file_name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(latestSubmittedFile.file_size)}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleCancelSubmission}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Batalkan Pengajuan
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            Membatalkan pengajuan akan memungkinkan Anda untuk mengunggah file
            baru
          </p>
        </div>
      ) : (
        <>
          <div
            className={`bg-white rounded-xl shadow-sm border-2 border-dashed transition-all ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="p-12 text-center">
              <div className="flex justify-center mb-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                    isDragging ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  <UploadCloud
                    className={`w-8 h-8 ${
                      isDragging ? "text-blue-600" : "text-gray-400"
                    }`}
                  />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isDragging
                  ? "Lepaskan file di sini"
                  : "Seret & Lepas File Anda"}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                atau klik tombol di bawah untuk memilih file
              </p>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileInputChange}
                className="hidden"
                accept=".pdf,.doc,.docx"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                <FileText className="w-4 h-4" />
                Pilih File
              </button>
              <p className="text-xs text-gray-500 mt-4">
                Format yang didukung: PDF, DOC, DOCX, PPT, PPTX (Max 10MB)
              </p>
            </div>
          </div>

          {selectedFile && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Pratinjau File
              </h3>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 mb-1 truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {formatFileSize(selectedFile.size)} •{" "}
                      {selectedFile.type || "Tipe tidak dikenal"}
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                    title="Hapus file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handlePreview}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Pratinjau
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isUploading}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm disabled:bg-slate-300"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Mengunggah...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      Kirim
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Submission History */}
      {submissionHistory && submissionHistory.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-slate-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Riwayat Upload
            </h3>
            <span className="text-sm text-slate-500">
              ({submissionHistory.length} file)
            </span>
          </div>

          {loadingHistory ? (
            <div className="text-center py-8 text-slate-500">
              <div className="animate-spin w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full mx-auto mb-3"></div>
              Memuat riwayat...
            </div>
          ) : (
            <div className="space-y-3">
              {/* Kelompokkan submission berdasarkan ttu_number */}
              {["ttu_1", "ttu_2", "ttu_3"].map((ttuKey) => {
                const submissions = submissionHistory.filter(
                  (s) => s.ttu_number === ttuKey,
                );
                if (submissions.length === 0) return null;
                // Cari submission yang sudah approved
                const approvedSub = submissions.find(
                  (s) => s.status === "approved",
                );
                // Urutkan berdasarkan uploaded_at (terbaru di atas)
                const sortedSubs = [...submissions].sort(
                  (a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at),
                );
                return sortedSubs.map((sub, idx) => (
                  <div
                    key={sub._id || `${ttuKey}-${idx}`}
                    className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span className="font-medium text-slate-600 text-xs uppercase">
                            {sub.ttu_number.replace("_", " ")}
                          </span>
                          <span className="font-medium text-slate-800 text-sm">
                            {sub.file_name}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                              (approvedSub && sub._id === approvedSub._id) ||
                              sub.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : sub.status === "reviewed"
                                  ? "bg-blue-100 text-blue-700"
                                  : sub.status === "rejected"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {(approvedSub && sub._id === approvedSub._id) ||
                            sub.status === "approved"
                              ? "Disetujui"
                              : sub.status === "reviewed"
                                ? "Ditinjau"
                                : sub.status === "rejected"
                                  ? "Ditolak"
                                  : "Diajukan"}
                          </span>
                          {idx === 0 && (
                            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-600">
                              Terbaru
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          {new Date(sub.uploaded_at).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ));
              })}
            </div>
          )}
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-all"
            onClick={handleCloseCancelDialog}
          ></div>

          <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 border border-slate-100 transform transition-all scale-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4 ring-4 ring-orange-50/50">
                <AlertCircle className="w-8 h-8 text-orange-500" />
              </div>

              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Batalkan Pengajuan?
              </h3>

              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Anda dapat mengunggah file baru setelah pembatalan.
              </p>

              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={handleCloseCancelDialog}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  Tidak
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700 shadow-lg shadow-orange-600/20 transition-all transform active:scale-95"
                >
                  Ya, Batalkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadTTU;

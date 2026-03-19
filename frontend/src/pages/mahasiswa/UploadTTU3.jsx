import React, { useState, useRef, useEffect } from "react";
import ConfirmModal from "../../components/shared/ConfirmModal";
import {
  UploadCloud,
  FileText,
  X,
  Eye,
  CheckCircle,
  AlertCircle,
  Lock,
  Clock,
  History,
  Trash2,
} from "lucide-react";
import ReviewChat from "../../components/shared/ReviewChat";

const API = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

const UploadTTU3 = ({ student }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [submittedFile, setSubmittedFile] = useState(null);
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("sita_token");

  // Load TTU3 submission status and history
  useEffect(() => {
    loadTTU3Status();
    loadTTU3History();
  }, []);

  const loadTTU3Status = async () => {
    try {
      if (!token) return;
      const [profileRes, subsRes] = await Promise.all([
        fetch(`${API}/api/mahasiswa/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API}/api/mahasiswa/submissions`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const profileResult = await profileRes.json().catch(() => ({}));
      const subsResult = await subsRes.json().catch(() => ({}));

      if (profileResult.success && profileResult.data) {
        const ttu = profileResult.data.ttu_status || {};
        const ttu3Status = ttu.ttu_3?.status;
        setCurrentUserId(profileResult.data._id);
        setIsApproved(ttu3Status === "approved");
        if (ttu3Status === "submitted" || ttu3Status === "reviewed") {
          const ttu3Sub = (subsResult.data || []).find(
            (s) => s.ttu_number === "ttu_3",
          );
          if (ttu3Sub) {
            setSubmittedFile({
              name: ttu3Sub.file_name,
              size: ttu3Sub.file_size,
              submission_id: ttu3Sub._id,
              status: ttu3Sub.status,
            });
          }
        } else {
          setSubmittedFile(null);
        }
      }
    } catch (err) {
      console.error("Failed to load TTU3 status:", err);
    }
  };

  const loadTTU3History = async () => {
    try {
      setLoadingHistory(true);
      if (!token) return;
      const response = await fetch(`${API}/api/mahasiswa/ttu/ttu_3/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json().catch(() => ({}));
      if (result.success && result.data) {
        setSubmissionHistory(result.data);
      }
    } catch (err) {
      console.error("Failed to load TTU3 history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

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
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(file.type)) {
        setUploadError(
          "Format file tidak didukung. Hanya PDF, DOC, dan DOCX yang diperbolehkan.",
        );
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError("Ukuran file terlalu besar. Maksimal 10MB.");
        return;
      }

      setUploadError("");
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
    setUploadError("");
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
    if (!selectedFile) {
      setUploadError("Silakan pilih file terlebih dahulu");
      return;
    }

    try {
      setIsUploading(true);
      setUploadError("");

      const formData = new FormData();
      formData.append("file", selectedFile.file);

      const response = await fetch(`${API}/api/mahasiswa/upload/ttu_3`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false) {
        throw new Error(result.error || "Gagal mengunggah file");
      }

      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      // Reload status and history
      await loadTTU3Status();
      await loadTTU3History();
    } catch (err) {
      setUploadError(err.message || "Gagal mengunggah file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelSubmission = () => {
    setShowCancelDialog(true);
  };

  // State untuk notifikasi modal
  const [notif, setNotif] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
  });

  const handleConfirmCancel = async () => {
    try {
      const response = await fetch(`${API}/api/mahasiswa/ttu/ttu_3/cancel`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false) {
        throw new Error(result.error || "Gagal membatalkan submission");
      }
      setSubmittedFile(null);
      await loadTTU3Status();
      await loadTTU3History();
    } catch (err) {
      setNotif({
        show: true,
        type: "error",
        title: "Gagal Membatalkan",
        message: "Gagal membatalkan pengajuan. Silakan coba lagi.",
      });
    }
    setShowCancelDialog(false);
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

  // Check if TTU 2 is approved
  const isTTU2Approved = student?.ttu_status?.ttu_2?.status === "approved";

  // Access Denied if TTU 2 is not approved
  if (!isTTU2Approved) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">Daftar Tinjauan</h2>
          <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 font-medium">
            Tinjauan TTU
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-center min-h-[500px] p-12">
            <div className="text-center max-w-md">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center">
                  <Lock className="w-12 h-12 text-slate-400" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Menu ini Belum Dapat Diakses
              </h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                Selesaikan Tugas Talenta Unggul 2 Anda dan dapatkan persetujuan
                dari dosen pembimbing untuk mengakses menu ini.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ConfirmModal
        show={notif.show}
        type={notif.type}
        title={notif.title}
        message={notif.message}
        onClose={() => setNotif({ ...notif, show: false })}
      />
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Daftar Tinjauan
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Unggah file Tugas Talenta Unggul 3 untuk ditinjau oleh dosen
              peninjau
            </p>
          </div>
          <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 font-medium">
            TTU 3
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">
                Petunjuk Unggah File TTU 3
              </p>
              <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                <li>TTU 2 Anda sudah disetujui oleh dosen pembimbing</li>
                <li>
                  Unggah file TTU 3 untuk ditinjau oleh dosen peninjau yang
                  ditentukan oleh kaprodi
                </li>
                <li>Format file: PDF, DOC, DOCX, PPT, PPTX</li>
                <li>Maksimal ukuran file adalah 50MB</li>
              </ul>
            </div>
          </div>
        </div>

        {uploadError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{uploadError}</p>
          </div>
        )}

        {submittedFile ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  File TTU 3 Berhasil Dikirim
                </h3>
                <p className="text-sm text-gray-600">
                  File Anda telah dikirim untuk ditinjau oleh dosen peninjau.
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
                    {submittedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(submittedFile.size)}
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                    submittedFile.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : submittedFile.status === "reviewed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {submittedFile.status === "approved"
                    ? "Disetujui"
                    : submittedFile.status === "reviewed"
                      ? "Ditinjau"
                      : "Diajukan"}
                </span>
              </div>
            </div>

            {submittedFile.status === "submitted" && (
              <button
                onClick={handleCancelSubmission}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Batalkan Pengajuan
              </button>
            )}
          </div>
        ) : (
          <>
            <div
              className={`bg-white rounded-xl shadow-sm border-2 border-dashed transition-all ${
                isApproved
                  ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                  : isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={isApproved ? undefined : handleDragEnter}
              onDragLeave={isApproved ? undefined : handleDragLeave}
              onDragOver={isApproved ? undefined : handleDragOver}
              onDrop={isApproved ? undefined : handleDrop}
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
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  disabled={isApproved}
                />
                <button
                  onClick={() => !isApproved && fileInputRef.current?.click()}
                  disabled={isApproved}
                  className={`inline-flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-colors shadow-sm ${
                    isApproved
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Pilih File
                </button>
                <p className="text-xs text-gray-500 mt-4">
                  Format yang didukung: PDF, DOC, DOCX, PPT, PPTX (Max 50MB)
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

        {currentUserId && (
          <div className="w-full mt-6">
            <ReviewChat
              mahasiswaId={student?._id}
              role="mahasiswa"
              currentUserId={currentUserId}
              disableAutoScroll={false}
            />
          </div>
        )}

        {submissionHistory && submissionHistory.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-slate-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Riwayat Upload TTU 3
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
                {submissionHistory.map((sub, index) => (
                  <div
                    key={sub._id || index}
                    className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span className="font-medium text-slate-800 text-sm">
                            {sub.file_name}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                              sub.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : sub.status === "reviewed"
                                  ? "bg-blue-100 text-blue-700"
                                  : sub.status === "rejected"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {sub.status === "approved"
                              ? "Disetujui"
                              : sub.status === "reviewed"
                                ? "Ditinjau"
                                : sub.status === "rejected"
                                  ? "Ditolak"
                                  : "Diajukan"}
                          </span>
                          {index === 0 && (
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
                ))}
              </div>
            )}
          </div>
        )}

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
    </>
  );
};

export default UploadTTU3;

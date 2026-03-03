import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  X,
  Eye,
  CheckCircle,
  AlertCircle,
  Lock,
} from "lucide-react";

const UploadTTU3 = ({ student }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

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

      const token = localStorage.getItem("sita_token");
      const baseUrl =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

      const formData = new FormData();
      formData.append("file", selectedFile.file);

      // Placeholder for actual API call
      // const response = await fetch(`${baseUrl}/api/mahasiswa/upload-ttu3-review`, {
      //   method: "POST",
      //   headers: { Authorization: `Bearer ${token}` },
      //   body: formData,
      // });
      // const result = await response.json();
      // if (!response.ok || result.success === false) {
      //   throw new Error(result.error || "Gagal upload file");
      // }

      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 1500));

      alert("✅ File TTU3 berhasil diupload!");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setUploadError(err.message || "Gagal upload file");
    } finally {
      setIsUploading(false);
    }
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
          <h2 className="text-2xl font-bold text-slate-800">Daftar Review</h2>
          <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 font-medium">
            Review TTU
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
                Selesaikan Tugas Talenta Unggul 2 Anda dan dapatkan persetujuan dari dosen pembimbing
                untuk mengakses menu ini.
              </p>

              
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Daftar Review</h2>
          <p className="text-sm text-slate-500 mt-1">
            Upload file Tugas Talenta Unggul yang telah disetujui dosen
            pembimbing
          </p>
        </div>
        <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 font-medium">
          Review TTU
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900 mb-1">
              Petunjuk Upload File TTU
            </p>
            <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
              <li>Pastikan file TTU sudah disetujui oleh dosen pembimbing</li>
              <li>Format file: PDF, DOC, atau DOCX</li>
              <li>Maksimal ukuran file adalah 10MB</li>
              <li>File akan direview oleh tim akademik</li>
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
            {isDragging ? "Lepaskan file di sini" : "Drag & Drop File Anda"}
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
            Format yang didukung: PDF, DOC, DOCX (Max 10MB)
          </p>
        </div>
      </div>

      {selectedFile && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            File Preview
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
                  {selectedFile.type || "Unknown type"}
                </p>
              </div>
              <button
                onClick={handleRemoveFile}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                title="Remove file"
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
              Preview
            </button>
            <button
              onClick={handleSubmit}
              disabled={isUploading}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm disabled:bg-slate-300"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Mengupload...
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
    </div>
  );
};

export default UploadTTU3;

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  X,
  Eye,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { useTTU } from "../contexts/TTUContext";

const UploadTTU = ({ onSwitchToReview }) => {
  const { currentStage, submittedFile, submitFile, cancelSubmission } =
    useTTU();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
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
      // Create a URL for the file and open it in a new window
      const fileURL = URL.createObjectURL(selectedFile.file);
      window.open(fileURL, "_blank");

      // Clean up the URL after a delay to prevent memory leaks
      setTimeout(() => URL.revokeObjectURL(fileURL), 100);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      submitFile(selectedFile);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      // Switch to review tab automatically
      if (onSwitchToReview) {
        onSwitchToReview();
      }
    }
  };

  const handleCancelSubmission = () => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin membatalkan pengajuan file? Anda dapat mengupload file baru setelah pembatalan.",
      )
    ) {
      cancelSubmission();
    }
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
          Upload TTU - Tahap {currentStage}
        </h2>
        <p className="text-gray-600">
          Silakan upload draf untuk tahap TTU {currentStage}
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg font-medium">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Tahap {currentStage} dari 3
          </span>
        </div>
      </div>

     
      {submittedFile ? (
       
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
                File Anda telah dikirim untuk review. Anda dapat membatalkan
                pengajuan jika ingin mengupload file baru.
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
            Membatalkan pengajuan akan memungkinkan Anda untuk mengupload file
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
                Format yang didukung: PDF, DOC, DOCX, PPT, PPTX (Max 10MB)
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
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                >
                  <UploadCloud className="w-4 h-4" />
                  Kirim
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UploadTTU;

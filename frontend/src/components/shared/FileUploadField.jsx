import React, { useState, useRef } from "react";
import { FileText, Upload, X, Download, Eye } from "lucide-react";

const FileUploadField = ({
  label,
  id,
  required = false,
  downloadTemplateLink = null,
  onFileChange,
}) => {
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
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
      };
      setSelectedFile(fileData);
      if (onFileChange) {
        onFileChange(id, fileData);
      }
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
    if (onFileChange) {
      onFileChange(id, null);
    }
  };

  const handlePreview = () => {
    if (selectedFile && selectedFile.file) {
      const fileURL = URL.createObjectURL(selectedFile.file);
      window.open(fileURL, "_blank");

      setTimeout(() => URL.revokeObjectURL(fileURL), 100);
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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {downloadTemplateLink && (
          <a
            href={downloadTemplateLink}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
            download
          >
            <Download className="w-3 h-3" />
            Download Template
          </a>
        )}
      </div>

      {!selectedFile ? (
        <div
          className={`border-2 border-dashed rounded-xl transition-all ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-slate-200 hover:border-slate-300 bg-slate-50"
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="p-6 text-center">
            <div className="flex justify-center mb-3">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                  isDragging ? "bg-blue-100" : "bg-white"
                }`}
              >
                <Upload
                  className={`w-6 h-6 ${
                    isDragging ? "text-blue-600" : "text-slate-400"
                  }`}
                />
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-2">
              {isDragging ? "Lepaskan file di sini" : "Drag & drop file atau"}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              id={id}
              onChange={handleFileInputChange}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg border border-slate-200 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Pilih File
            </button>
            <p className="text-xs text-slate-500 mt-3">
              PDF, JPG, PNG (Max 5MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-600">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
              title="Hapus file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handlePreview}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploadField;

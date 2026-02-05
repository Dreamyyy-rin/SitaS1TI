import React, { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import AccessDenied from "../../components/shared/AccessDenied";
import FileUploadField from "../../components/shared/FileUploadField";

const UploadBerkasPage = () => {
  //dummy
  const [studentProgress, setStudentProgress] = useState(2);

  const [uploadedFiles, setUploadedFiles] = useState({
    transkrip: null,
    kst: null,
    ijasah: null,
    pengesahan: null,
    pasFoto: null,
    ktp: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (fieldId, fileData) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [fieldId]: fileData,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = Object.keys(uploadedFiles);
    const missingFiles = requiredFields.filter(
      (field) => !uploadedFiles[field],
    );

    if (missingFiles.length > 0) {
      alert(
        `Harap lengkapi semua berkas yang diperlukan.\n\nBerkas yang belum diupload: ${missingFiles.length}`,
      );
      return;
    }

    setIsSubmitting(true);

    //simulasi api
    setTimeout(() => {
      alert(
        "✅ Semua berkas berhasil dikirim!\n\nData akan diverifikasi oleh admin.",
      );
      setIsSubmitting(false);
    }, 1500);
  };

  if (studentProgress < 2) {
    return <AccessDenied />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Upload Berkas</h2>
          <p className="text-sm text-slate-500 mt-1">
            Upload berkas finalisasi Tugas Akhir
          </p>
        </div>
        <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 font-medium">
          Upload Berkas
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900 mb-1">
              Petunjuk Upload Berkas
            </p>
            <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
              <li>Pastikan semua berkas dalam format PDF, JPG, atau PNG</li>
              <li>Maksimal ukuran file adalah 5MB per berkas</li>
              <li>Periksa kembali kelengkapan dokumen sebelum mengirim</li>
              <li>Berkas yang sudah dikirim akan diverifikasi oleh admin</li>
            </ul>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">
            Dokumen yang Diperlukan
          </h3>

          <div className="space-y-6">
            <FileUploadField
              label="Transkrip Nilai"
              id="transkrip"
              required={true}
              onFileChange={handleFileChange}
            />

            <FileUploadField
              label="Kartu Studi Tetap (KST)"
              id="kst"
              required={true}
              onFileChange={handleFileChange}
            />

            <FileUploadField
              label="Foto Copy Ijasah SMA"
              id="ijasah"
              required={true}
              onFileChange={handleFileChange}
            />

            <FileUploadField
              label="Lembar Pengesahan"
              id="pengesahan"
              required={true}
              onFileChange={handleFileChange}
            />

            <FileUploadField
              label="Pas Foto 8 Lembar (4x6 Hitam Putih)"
              id="pasFoto"
              required={true}
              onFileChange={handleFileChange}
            />

            <FileUploadField
              label="Fotocopy KTP Berwarna"
              id="ktp"
              required={true}
              onFileChange={handleFileChange}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">
                Total Berkas Diupload
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {Object.values(uploadedFiles).filter((f) => f !== null).length}{" "}
                dari 6 berkas
              </p>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all shadow-sm ${
                isSubmitting
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md"
              }`}
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? "Mengirim..." : "Simpan & Kirim"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UploadBerkasPage;

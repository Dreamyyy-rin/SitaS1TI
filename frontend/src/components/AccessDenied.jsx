import React from "react";
import { Lock, AlertCircle } from "lucide-react";

const AccessDenied = () => {
  return (
    <div className="space-y-6 animate-fade-in">
 
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Upload Berkas</h2>
        <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 font-medium">
          Upload Berkas Finalisasi
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
              Upload Berkas Tidak Dapat Diakses
            </h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              Selesaikan TTU 2 untuk mengakses
              pemberkasan.
            </p>

            {/* Info Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-medium text-amber-900 mb-1">
                  Persyaratan Akses
                </p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Anda harus menyelesaikan dan mendapat persetujuan dari dosen
                  pembimbing untuk TTU 2 sebelum dapat mengakses menu
                  upload berkas finalisasi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;

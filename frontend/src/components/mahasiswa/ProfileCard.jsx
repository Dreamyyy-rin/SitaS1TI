import React, { useState, useEffect } from "react";
import { toTitleCase } from "../../utils/textFormatter";

const ProfileCard = ({ student }) => {
  const [pembimbing, setPembimbing] = useState({
    pembimbing_1: null,
    pembimbing_2: null,
  });

  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

  useEffect(() => {
    loadPembimbing();
  }, []);

  const loadPembimbing = async () => {
    try {
      const token = localStorage.getItem("sita_token");
      const response = await fetch(`${baseUrl}/api/mahasiswa/pembimbing`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success && result.data) {
        setPembimbing(result.data);
      }
    } catch (err) {
      console.error("Failed to load pembimbing:", err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full -mr-16 -mt-16 opacity-50"></div>

        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="w-24 h-24 rounded-full bg-[#0B2F7F] flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-900/20 border-4 border-white">
            {student.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>

          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            <div>
              <p className="text-sm text-slate-400 mb-1">Nama Lengkap</p>
              <p className="text-lg font-semibold text-slate-800">
                {toTitleCase(student.name)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">NIM</p>
              <p className="text-lg font-semibold text-slate-700 font-mono">
                {student.nim}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Program Studi</p>
              <p className="text-base font-medium text-slate-700">
                {toTitleCase(student.prodi)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Dosen Pembimbing</p>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-orange-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <p className="text-base font-medium text-slate-700">
                  {toTitleCase(student.supervisor)}
                </p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-end pl-6">
            <p className="text-sm text-slate-400 mb-2">Tahap Pengerjaan</p>
            <div className="px-4 py-2 bg-blue-50 text-[#0B2F7F] rounded-lg font-bold text-lg border border-blue-100">
              {student.stage}
            </div>
            {student.stage === "Selesai" ? (
              <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Selesai
              </p>
            ) : (
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Sedang Berjalan
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

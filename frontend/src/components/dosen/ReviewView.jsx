import React, { useState } from "react";
import { FileText, ChevronDown, ChevronUp } from "lucide-react";
import ReviewChat from "../shared/ReviewChat";

const API = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export default function ReviewView({
  mahasiswaBimbingan = [],
  onPreviewFile,
  onAcceptReview,
  currentDosenId,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedChat, setExpandedChat] = useState(null);

  const mahasiswaWithTtu3 = mahasiswaBimbingan.filter((mhs) => mhs.ttu3);

  const mahasiswaForReview = mahasiswaWithTtu3.filter((mhs) => {
    const query = searchQuery.toLowerCase();
    return (
      mhs.nama.toLowerCase().includes(query) ||
      mhs.nim.toLowerCase().includes(query)
    );
  });

  const toggleChat = (id) => {
    setExpandedChat(expandedChat === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau NIM..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2F7F] focus:border-transparent"
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {mahasiswaForReview.length === 0 && mahasiswaWithTtu3.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 text-center py-16">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">
            Data mahasiswa tidak ditemukan
          </p>
          <p className="text-slate-400 text-sm mt-2">
            Tidak ada mahasiswa yang cocok dengan pencarian "{searchQuery}"
          </p>
        </div>
      )}

      {mahasiswaWithTtu3.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 text-center py-16">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">
            Belum ada submission untuk direview
          </p>
          <p className="text-slate-400 text-sm mt-2">
            Mahasiswa yang sudah upload TTU 3 akan muncul di sini
          </p>
        </div>
      )}

      {mahasiswaForReview.map((mhs) => (
        <div
          key={mhs.id}
          className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
        >
          {/* Header row */}
          <div className="p-5 flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-bold text-slate-800">{mhs.nama}</h3>
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {mhs.nim}
                </span>
                {mhs.ttu3Status === "approved" && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-green-100 text-green-700">
                    Disetujui
                  </span>
                )}
                {(mhs.ttu3Status === "submitted" ||
                  mhs.ttu3Status === "reviewed") && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-yellow-100 text-yellow-700">
                    {mhs.ttu3Status === "reviewed" ? "Ditinjau" : "Diajukan"}
                  </span>
                )}
              </div>
              {mhs.judul && mhs.judul !== "-" && (
                <p className="text-sm text-slate-600 mt-1">
                  <span className="font-medium text-slate-500">Judul:</span>{" "}
                  {mhs.judul}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onPreviewFile(mhs, "TTU 3")}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm underline"
              >
                Lihat File
              </button>
              {mhs.ttu3Status !== "approved" && (
                <button
                  onClick={() => onAcceptReview(mhs)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium transition-colors"
                >
                  Setujui TTU 3
                </button>
              )}
            </div>
          </div>

          {/* Chat toggle */}
          <div className="border-t border-slate-100">
            <button
              onClick={() => toggleChat(mhs.id)}
              className="w-full flex items-center justify-between px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <span className="font-medium">Diskusi Tinjauan</span>
              {expandedChat === mhs.id ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {expandedChat === mhs.id && (
              <div className="border-t border-slate-100">
                <ReviewChat
                  mahasiswaId={mhs.id}
                  role="dosen"
                  currentUserId={currentDosenId}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

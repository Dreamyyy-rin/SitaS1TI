import React, { useState } from "react";
import { FileText } from "lucide-react";

export default function ReviewView({
  mahasiswaBimbingan = [],
  reviewComments = {},
  onCommentChange,
  onPreviewFile,
  onAcceptReview,
}) {
  const [searchQuery, setSearchQuery] = useState("");

 
  const mahasiswaWithTtu2 = mahasiswaBimbingan.filter((mhs) => mhs.ttu2);

  const mahasiswaForReview = mahasiswaWithTtu2.filter((mhs) => {
    const query = searchQuery.toLowerCase();
    return (
      mhs.nama.toLowerCase().includes(query) ||
      mhs.nim.toLowerCase().includes(query)
    );
  });

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

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  No
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Mahasiswa
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Judul
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  File TTU 2
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Komentar Review
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {mahasiswaForReview.map((mhs, index) => (
                <tr key={mhs.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{index + 1}</td>
                  <td className="px-4 py-3 text-sm">
                    <div>
                      <p className="font-semibold text-slate-800">{mhs.nama}</p>
                      <p className="text-xs text-slate-500">{mhs.nim}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{mhs.judul}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => onPreviewFile(mhs, "TTU 2")}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm underline"
                    >
                      Lihat File
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 items-center">
                      <textarea
                        value={reviewComments[mhs.id] || ""}
                        onChange={(e) =>
                          onCommentChange(mhs.id, e.target.value)
                        }
                        placeholder="Tulis komentar review..."
                        rows={2}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                      <button
                        onClick={() => {
                          const comment = reviewComments[mhs.id] || "";
                          if (comment.trim()) {
                            alert(
                              `Komentar untuk ${mhs.nama} terkirim: "${comment}"`,
                            );
                          } else {
                            alert("Silakan tulis komentar terlebih dahulu");
                          }
                        }}
                        className="bg-[#0B2F7F] text-white px-3 py-2 rounded hover:bg-blue-800 text-sm font-medium whitespace-nowrap h-fit"
                      >
                        Kirim
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => onAcceptReview(mhs)}
                      className="bg-[#0B2F7F] text-white px-4 py-1 rounded hover:bg-blue-800 text-sm font-medium"
                    >
                      Accept
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {mahasiswaForReview.length === 0 && mahasiswaWithTtu2.length > 0 && (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">
              Data mahasiswa tidak ditemukan
            </p>
            <p className="text-slate-400 text-sm mt-2">
              Tidak ada mahasiswa yang cocok dengan pencarian "{searchQuery}"
            </p>
          </div>
        )}

        {mahasiswaWithTtu2.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">
              Belum ada submission untuk direview
            </p>
            <p className="text-slate-400 text-sm mt-2">
              Mahasiswa yang sudah upload TTU 2 akan muncul di sini
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

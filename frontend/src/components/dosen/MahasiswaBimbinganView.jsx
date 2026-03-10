import React, { useState } from "react";
import {
  Users,
  CheckCircle,
  Clock,
  MessageCircle,
  FileText,
  Download,
  History,
  X,
} from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export default function MahasiswaBimbinganView({
  mahasiswaBimbingan = [],
  onAcceptMahasiswa,
  onRejectMahasiswa,
  onOpenDetail,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFileModal, setShowFileModal] = useState(false);
  const [fileModalMhs, setFileModalMhs] = useState(null);
  const [fileSubmissions, setFileSubmissions] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);

  const handleOpenFileModal = async (mhs) => {
    setFileModalMhs(mhs);
    setShowFileModal(true);
    setFileSubmissions([]);
    setLoadingFiles(true);
    const token = localStorage.getItem("sita_token");
    try {
      const res = await fetch(
        `${API}/api/dosen/mahasiswa/${mhs.id}/submissions`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();
      if (data.success) setFileSubmissions(data.data || []);
    } catch {
      /* ignore */
    } finally {
      setLoadingFiles(false);
    }
  };

  const filtered = mahasiswaBimbingan.filter((mhs) => {
    const q = searchQuery.toLowerCase();
    return (
      mhs.nama.toLowerCase().includes(q) || mhs.nim.toLowerCase().includes(q)
    );
  });

  const statusBadge = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 border border-green-200";
      case "reviewed":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "rejected":
        return "bg-red-100 text-red-700 border border-red-200";
      case "submitted":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      default:
        return "bg-slate-100 text-slate-600 border border-slate-200";
    }
  };

  const statusLabel = (status) => {
    switch (status) {
      case "approved":
        return "Disetujui";
      case "reviewed":
        return "Direview";
      case "rejected":
        return "Ditolak";
      case "submitted":
        return "Dikirim";
      default:
        return status || "-";
    }
  };

  return (
    <>
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
                    Nama
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    NIM
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Judul
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    TTU 1
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    TTU 2
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    TTU 3
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    File
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Pesan
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((mhs) => {
                  const hasTTU3 = !!mhs.ttu_status?.ttu_3?.status;
                  // Cek apakah ada TTU yang bisa di-ACC/tolak
                  const ttuStatus = mhs.ttu_status || {};
                  const canApprove = ["ttu_1", "ttu_2", "ttu_3"].some((key) =>
                    ["submitted", "reviewed"].includes(ttuStatus[key]?.status),
                  );

                  return (
                    <tr key={mhs.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-semibold">
                        {mhs.nama}
                      </td>
                      <td className="px-4 py-3 text-sm">{mhs.nim}</td>
                      <td className="px-4 py-3 text-sm max-w-[200px] truncate">
                        {mhs.judul}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {mhs.ttu1 ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <Clock className="w-5 h-5 text-gray-400 mx-auto" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {mhs.ttu2 ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <Clock className="w-5 h-5 text-gray-400 mx-auto" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {mhs.ttu3 ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <Clock className="w-5 h-5 text-gray-400 mx-auto" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleOpenFileModal(mhs)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium mx-auto"
                        >
                          <FileText className="w-4 h-4" />
                          Lihat File
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex gap-2 justify-center flex-wrap">
                          <button
                            onClick={() =>
                              onOpenDetail && onOpenDetail(mhs, "pesan")
                            }
                            className="flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-lg transition-colors text-[#0B2F7F] hover:bg-[#0B2F7F]/10 border border-[#0B2F7F]"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Pesan
                          </button>
                          {hasTTU3 ? (
                            <button
                              onClick={() =>
                                onOpenDetail && onOpenDetail(mhs, "komentar")
                              }
                              className="flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-lg transition-colors text-purple-600 hover:bg-purple-50 border border-purple-400"
                            >
                              <MessageCircle className="w-4 h-4" />
                              Komentar TTU 3
                            </button>
                          ) : (
                            <button
                              disabled
                              className="flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-lg transition-colors text-slate-400 bg-slate-50 border border-slate-200 cursor-not-allowed"
                              title="Mahasiswa belum mengupload TTU 3"
                            >
                              <MessageCircle className="w-4 h-4" />
                              Komentar TTU 3
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => onAcceptMahasiswa(mhs.id)}
                            disabled={!canApprove}
                            className={
                              !canApprove
                                ? "bg-slate-300 text-slate-500 px-3 py-1 rounded text-sm font-medium cursor-not-allowed"
                                : "bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm font-medium"
                            }
                            title={
                              !canApprove
                                ? "Tidak ada TTU yang bisa di-ACC"
                                : "Terima"
                            }
                          >
                            Terima
                          </button>
                          <button
                            onClick={() => onRejectMahasiswa(mhs.id)}
                            disabled={!canApprove}
                            className={
                              !canApprove
                                ? "bg-slate-300 text-slate-500 px-3 py-1 rounded text-sm font-medium cursor-not-allowed"
                                : "bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm font-medium"
                            }
                            title={
                              !canApprove
                                ? "Tidak ada TTU yang bisa ditolak"
                                : "Tolak"
                            }
                          >
                            Tolak
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && mahasiswaBimbingan.length > 0 && (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">
                Data mahasiswa tidak ditemukan
              </p>
              <p className="text-slate-400 text-sm mt-2">
                Tidak ada mahasiswa yang cocok dengan pencarian "{searchQuery}"
              </p>
            </div>
          )}

          {mahasiswaBimbingan.length === 0 && (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">
                Belum ada mahasiswa bimbingan
              </p>
              <p className="text-slate-400 text-sm mt-2">
                Mahasiswa yang Anda bimbing akan muncul di sini
              </p>
            </div>
          )}
        </div>
      </div>

      {/* File History Modal */}
      {showFileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowFileModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-[#0B2F7F]" />
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Riwayat Upload
                  </h3>
                  {fileModalMhs && (
                    <p className="text-xs text-slate-500">
                      {fileModalMhs.nama} — {fileModalMhs.nim}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowFileModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              {loadingFiles ? (
                <p className="text-center text-slate-400 py-8">
                  Memuat data...
                </p>
              ) : fileSubmissions.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">
                    Belum ada file yang diunggah
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 mb-3">
                    {fileSubmissions.length} file ditemukan
                  </p>
                  {fileSubmissions.map((sub, idx) => (
                    <div
                      key={sub._id || idx}
                      className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <span className="font-medium text-slate-800 text-sm truncate">
                            {sub.file_name || sub.filename || "File"}
                          </span>
                          {idx === 0 && (
                            <span className="flex-shrink-0 text-xs bg-blue-100 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                              Terbaru
                            </span>
                          )}
                        </div>
                        <span
                          className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(sub.status)}`}
                        >
                          {statusLabel(sub.status)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Clock className="w-3.5 h-3.5" />
                          {sub.submitted_at
                            ? new Date(sub.submitted_at).toLocaleString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )
                            : "-"}
                        </div>
                        <a
                          href={`${API}/api/dosen/submissions/${sub._id}/download?token=${localStorage.getItem("sita_token")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs text-[#0B2F7F] hover:underline font-medium"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Unduh
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

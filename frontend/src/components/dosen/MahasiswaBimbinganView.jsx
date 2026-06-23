import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Tambahan impor navigate
import { Users, CheckCircle, Clock, MessageCircle } from "lucide-react";

export default function MahasiswaBimbinganView({
  mahasiswaBimbingan = [],
  onAcceptMahasiswa,
  onRejectMahasiswa,
  onOpenChat,
  newUploadIds,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); // Inisialisasi navigasi

  const filteredMahasiswa = mahasiswaBimbingan.filter((mhs) => {
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
                  Bimbingan
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMahasiswa.map((mhs) => (
                <tr key={mhs.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-semibold">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          navigate(`/dosen-mahasiswa-bimbingan/${mhs.id}`, {
                            state: { mahasiswa: mhs },
                          })
                        }
                        className="text-left text-slate-700 hover:text-[#0B2F7F] hover:underline focus:outline-none transition-colors"
                        title="Klik untuk melihat detail mahasiswa"
                      >
                        {mhs.nama}
                      </button>

                      {newUploadIds?.has(mhs.id) && (
                        <span className="px-1.5 py-0.5 text-xs font-bold rounded-full bg-blue-100 text-blue-700">
                          Baru
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{mhs.nim}</td>
                  <td className="px-4 py-3 text-sm max-w-[250px] whitespace-normal break-words">
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
                      onClick={() => onOpenChat(mhs)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm underline"
                    >
                      Bimbingan
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => onAcceptMahasiswa(mhs.id)}
                        disabled={
                          !(
                            ["submitted", "reviewed"].includes(
                              mhs.ttu_status?.ttu_1?.status,
                            ) ||
                            ["submitted", "reviewed"].includes(
                              mhs.ttu_status?.ttu_2?.status,
                            ) ||
                            ["submitted", "reviewed"].includes(
                              mhs.ttu_status?.ttu_3?.status,
                            )
                          ) ||
                          (mhs.ttu1 && mhs.ttu2 && mhs.ttu3)
                        }
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          (mhs.ttu1 && mhs.ttu2 && mhs.ttu3) ||
                          !(
                            ["submitted", "reviewed"].includes(
                              mhs.ttu_status?.ttu_1?.status,
                            ) ||
                            ["submitted", "reviewed"].includes(
                              mhs.ttu_status?.ttu_2?.status,
                            ) ||
                            ["submitted", "reviewed"].includes(
                              mhs.ttu_status?.ttu_3?.status,
                            )
                          )
                            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                            : "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                        }`}
                      >
                        Terima
                      </button>
                      <button
                        onClick={() => onRejectMahasiswa(mhs.id)}
                        disabled={
                          !(
                            ["submitted", "reviewed"].includes(
                              mhs.ttu_status?.ttu_1?.status,
                            ) ||
                            ["submitted", "reviewed"].includes(
                              mhs.ttu_status?.ttu_2?.status,
                            ) ||
                            ["submitted", "reviewed"].includes(
                              mhs.ttu_status?.ttu_3?.status,
                            )
                          ) ||
                          (mhs.ttu1 && mhs.ttu2 && mhs.ttu3)
                        }
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          (mhs.ttu1 && mhs.ttu2 && mhs.ttu3) ||
                          !(
                            ["submitted", "reviewed"].includes(
                              mhs.ttu_status?.ttu_1?.status,
                            ) ||
                            ["submitted", "reviewed"].includes(
                              mhs.ttu_status?.ttu_2?.status,
                            ) ||
                            ["submitted", "reviewed"].includes(
                              mhs.ttu_status?.ttu_3?.status,
                            )
                          )
                            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                            : "bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                        }`}
                      >
                        Tolak
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMahasiswa.length === 0 && mahasiswaBimbingan.length > 0 && (
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
  );
}

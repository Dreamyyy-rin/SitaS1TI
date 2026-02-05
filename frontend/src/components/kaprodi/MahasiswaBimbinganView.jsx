import React, { useState } from "react";
import { CheckCircle, Clock, Users } from "lucide-react";

const MahasiswaBimbinganView = ({ mahasiswaBimbingan, userData, onAccept }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handlePreviewFile = (mahasiswa, ttuType) => {
    alert(`Preview file ${ttuType} untuk ${mahasiswa.nama}`);
  };

  
  const dosenLogin = userData?.name || "Dr. Ahmad Fauzi, M.Kom"; //dummy sajaa

  
  const mahasiswaForDosen = mahasiswaBimbingan.filter(
    (mhs) => mhs.dosen === dosenLogin,
  );

 
  const filteredMahasiswa = mahasiswaForDosen.filter((mhs) => {
    const query = searchQuery.toLowerCase();
    return (
      mhs.nama.toLowerCase().includes(query) ||
      mhs.nim.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <p className="text-slate-600 mb-4">
          Daftar mahasiswa yang Anda bimbing: <b>{dosenLogin}</b>
        </p>
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
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMahasiswa.map((mhs) => (
                <tr key={mhs.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-semibold">
                    {mhs.nama}
                  </td>
                  <td className="px-4 py-3 text-sm">{mhs.nim}</td>
                  <td className="px-4 py-3 text-sm">{mhs.judul}</td>
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
                      onClick={() => handlePreviewFile(mhs, "TTU")}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm underline"
                    >
                      Lihat File
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => onAccept(mhs.id)}
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

        {filteredMahasiswa.length === 0 && mahasiswaForDosen.length > 0 && (
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

        {mahasiswaForDosen.length === 0 && (
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
};

export default MahasiswaBimbinganView;

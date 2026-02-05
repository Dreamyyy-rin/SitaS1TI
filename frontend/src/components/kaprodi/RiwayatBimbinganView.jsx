import React from "react";
import { CheckCircle } from "lucide-react";

const RiwayatBimbinganView = ({
  riwayatBimbingan,
  searchQuery,
  onSearchChange,
}) => {

  const filteredRiwayat = riwayatBimbingan.filter((riwayat) => {
    const query = searchQuery.toLowerCase();
    return (
      riwayat.nama.toLowerCase().includes(query) ||
      riwayat.nim.toLowerCase().includes(query)
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
            onChange={(e) => onSearchChange(e.target.value)}
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
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Nama
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  NIM
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Judul
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Dosen Pembimbing
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Tanggal Selesai
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRiwayat.map((riwayat) => (
                <tr key={riwayat.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{riwayat.nama}</td>
                  <td className="px-4 py-3 text-sm">{riwayat.nim}</td>
                  <td className="px-4 py-3 text-sm">{riwayat.judul}</td>
                  <td className="px-4 py-3 text-sm">{riwayat.dosen}</td>
                  <td className="px-4 py-3 text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {riwayat.tanggalSelesai}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RiwayatBimbinganView;

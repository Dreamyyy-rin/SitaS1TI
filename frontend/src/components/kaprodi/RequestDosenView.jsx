import React from "react";

const RequestDosenView = ({
  requestDosenBaru,
  requestGantiDosen,
  availableDosen,
  selectedDosen,
  onDosenChange,
  onApprove,
  onReject,
}) => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-[#0B2F7F] mb-4">
        Permintaan Dosen Pembimbing
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Mahasiswa
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                NIM
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Judul
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Pembimbing 1
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Pembimbing 2
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Tanggal
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {requestDosenBaru.map((req) => (
              <tr key={req.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">
                  <div className="font-medium text-gray-800">{req.nama}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{req.nim}</td>
                <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                  {req.judul}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="text-blue-700 font-medium">
                    {req.pembimbing1}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={
                      req.pembimbing2 !== "(Tidak ada)"
                        ? "text-blue-700 font-medium"
                        : "text-gray-400 italic"
                    }
                  >
                    {req.pembimbing2}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {req.tanggal}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onApprove(req.id)}
                      className="bg-green-500 text-white px-4 py-1.5 rounded text-xs font-medium hover:bg-green-600 transition-colors"
                    >
                      Setuju
                    </button>
                    <button
                      onClick={() => onReject(req.id)}
                      className="bg-red-500 text-white px-4 py-1.5 rounded text-xs font-medium hover:bg-red-600 transition-colors"
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
      {requestDosenBaru.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-sm">Tidak ada permintaan dosen pembimbing</p>
        </div>
      )}
    </div>

    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-[#0B2F7F] mb-4">
        Permintaan Ganti Dosen Pembimbing
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Mahasiswa
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                NIM
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Dosen Lama
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Dosen Baru
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Alasan
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Tanggal
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {requestGantiDosen.map((req) => (
              <tr key={req.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">
                  <div className="font-medium text-gray-800">{req.nama}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{req.nim}</td>
                <td className="px-4 py-3 text-sm">
                  <span className="text-red-600">{req.dosenLama}</span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="text-green-600 font-medium">
                    {req.dosenBaru}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  <div className="whitespace-normal break-words max-w-md">
                    {req.alasan}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {req.tanggal}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onApprove(req.id)}
                      className="bg-green-500 text-white px-4 py-1.5 rounded text-xs font-medium hover:bg-green-600 transition-colors"
                    >
                      Setuju
                    </button>
                    <button
                      onClick={() => onReject(req.id)}
                      className="bg-red-500 text-white px-4 py-1.5 rounded text-xs font-medium hover:bg-red-600 transition-colors"
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
      {requestGantiDosen.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-sm">Tidak ada permintaan ganti dosen pembimbing</p>
        </div>
      )}
    </div>
  </div>
);

export default RequestDosenView;

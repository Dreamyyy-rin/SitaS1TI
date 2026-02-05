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
        Request Dosen Pembimbing
      </h3>
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
                Dosen Diajukan
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
                <td className="px-4 py-3 text-sm">{req.nama}</td>
                <td className="px-4 py-3 text-sm">{req.nim}</td>
                <td className="px-4 py-3 text-sm">{req.judul}</td>
                <td className="px-4 py-3 text-sm">
                  {req.dosenDiajukan ? (
                    <span className="text-gray-800">{req.dosenDiajukan}</span>
                  ) : (
                    <select
                      value={selectedDosen[req.id] || ""}
                      onChange={(e) => onDosenChange(req.id, e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2F7F]"
                    >
                      <option value="">Belum dipilih</option>
                      {availableDosen.map((dosen, idx) => (
                        <option key={idx} value={dosen}>
                          {dosen}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">{req.tanggal}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onApprove(req.id, "dosen baru")}
                      className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                    >
                      Setuju
                    </button>
                    <button
                      onClick={() => onReject(req.id, "dosen baru")}
                      className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
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
    </div>

    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-[#0B2F7F] mb-4">
        Request Ganti Dosen Pembimbing
      </h3>
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
                <td className="px-4 py-3 text-sm">{req.nama}</td>
                <td className="px-4 py-3 text-sm">{req.nim}</td>
                <td className="px-4 py-3 text-sm">{req.judul}</td>
                <td className="px-4 py-3 text-sm">{req.dosenLama}</td>
                <td className="px-4 py-3 text-sm">{req.dosenBaru}</td>
                <td className="px-4 py-3 text-sm">{req.alasan}</td>
                <td className="px-4 py-3 text-sm">{req.tanggal}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onApprove(req.id, "ganti dosen")}
                      className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                    >
                      Setuju
                    </button>
                    <button
                      onClick={() => onReject(req.id, "ganti dosen")}
                      className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
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
    </div>
  </div>
);

export default RequestDosenView;

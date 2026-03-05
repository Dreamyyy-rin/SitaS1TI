import React, { useState } from "react";
import { CheckCircle, Clock, Users, RefreshCw, X } from "lucide-react";

const MahasiswaBimbinganView = ({
  mahasiswaBimbingan,
  availableDosen = [],
  userData,
  onAccept,
  onChangePembimbing,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [changingMhs, setChangingMhs] = useState(null); // mahasiswa being edited
  const [selectedSlot, setSelectedSlot] = useState("pembimbing_1");
  const [selectedDosenId, setSelectedDosenId] = useState("");

  const handlePreviewFile = (mahasiswa, ttuType) => {
    alert(`Preview file ${ttuType} untuk ${mahasiswa.nama}`);
  };

  const openChangeModal = (mhs) => {
    setChangingMhs(mhs);
    setSelectedSlot("pembimbing_1");
    setSelectedDosenId("");
  };

  const handleConfirmChange = () => {
    if (!selectedDosenId) {
      alert("Pilih dosen pembimbing baru");
      return;
    }
    if (onChangePembimbing) {
      onChangePembimbing(changingMhs.id, selectedSlot, selectedDosenId);
    }
    setChangingMhs(null);
  };

  // Filter dosen options: exclude current pembimbing on other slot & reviewer
  const getDosenOptions = () => {
    if (!changingMhs) return availableDosen;
    const excludeIds = new Set();
    if (selectedSlot === "pembimbing_1" && changingMhs.pembimbing_2_id)
      excludeIds.add(changingMhs.pembimbing_2_id);
    if (selectedSlot === "pembimbing_2" && changingMhs.pembimbing_1_id)
      excludeIds.add(changingMhs.pembimbing_1_id);
    if (changingMhs.reviewer_id) excludeIds.add(changingMhs.reviewer_id);
    return availableDosen.filter((d) => !excludeIds.has(d._id));
  };

  
  const activeMahasiswa = mahasiswaBimbingan.filter(
    (mhs) => mhs.onboarding_status === "approved" || mhs.status === "active"
  );

  const filteredMahasiswa = activeMahasiswa.filter((mhs) => {
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nama</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">NIM</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Dosen Pembimbing</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Reviewer</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">TTU 1</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">TTU 2</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">TTU 3</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredMahasiswa.map((mhs) => (
                <tr key={mhs.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-semibold">{mhs.nama}</td>
                  <td className="px-4 py-3 text-sm">{mhs.nim}</td>
                  <td className="px-4 py-3 text-sm">{mhs.dosen}{mhs.dosen2 && mhs.dosen2 !== "-" ? `, ${mhs.dosen2}` : ""}</td>
                  <td className="px-4 py-3 text-sm">{mhs.reviewer || "-"}</td>
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
                      onClick={() => openChangeModal(mhs)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors text-xs font-semibold"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Ganti Pembimbing
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMahasiswa.length === 0 && activeMahasiswa.length > 0 && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">Data mahasiswa tidak ditemukan</p>
            <p className="text-slate-400 text-sm mt-2">
              Tidak ada mahasiswa yang cocok dengan pencarian "{searchQuery}"
            </p>
          </div>
        )}

        {activeMahasiswa.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">Belum ada mahasiswa bimbingan</p>
            <p className="text-slate-400 text-sm mt-2">
              Mahasiswa yang sudah memiliki pembimbing akan muncul di sini
            </p>
          </div>
        )}
      </div>

      {/* Ganti Pembimbing Modal */}
      {changingMhs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
            onClick={() => setChangingMhs(null)}
          ></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">
                Ganti Dosen Pembimbing
              </h3>
              <button
                onClick={() => setChangingMhs(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-slate-50 rounded-lg">
              <p className="text-sm font-semibold text-slate-700">{changingMhs.nama}</p>
              <p className="text-xs text-slate-500">NIM: {changingMhs.nim}</p>
              <p className="text-xs text-slate-500 mt-1">
                Pembimbing 1: {changingMhs.dosen || "-"} | Pembimbing 2: {changingMhs.dosen2 || "-"}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Slot yang diganti
                </label>
                <select
                  value={selectedSlot}
                  onChange={(e) => {
                    setSelectedSlot(e.target.value);
                    setSelectedDosenId("");
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pembimbing_1">Pembimbing 1</option>
                  <option value="pembimbing_2">Pembimbing 2</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Dosen Pembimbing Baru
                </label>
                <select
                  value={selectedDosenId}
                  onChange={(e) => setSelectedDosenId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Pilih Dosen --</option>
                  {getDosenOptions().map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.nama} ({d.nidn || d.nip || "-"}) — {d.active_students_count ?? 0} mhs
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setChangingMhs(null)}
                className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmChange}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm"
              >
                Ganti Pembimbing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MahasiswaBimbinganView;

import React, { useState } from "react";
import { CheckCircle, Clock, Users, RefreshCw, X } from "lucide-react";
import ConfirmModal from "../shared/ConfirmModal";

const MahasiswaBimbinganView = ({
  mahasiswaBimbingan,
  availableDosen = [],
  userData,
  onAccept,
  onChangePembimbing,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [changingMhs, setChangingMhs] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("pembimbing_1");
  const [selectedDosenId, setSelectedDosenId] = useState("");
  const [notif, setNotif] = useState({
    show: false,
    title: "",
    message: "",
    type: "info",
  });

  const openChangeModal = (mhs) => {
    setChangingMhs(mhs);
    setSelectedSlot("pembimbing_1");
    setSelectedDosenId("");
  };

  const handleConfirmChange = () => {
    if (!selectedDosenId) {
      setNotif({
        show: true,
        title: "Ganti Pembimbing",
        message: "Pilih dosen pembimbing baru",
        type: "error",
      });
      return;
    }

    if (onChangePembimbing) {
      onChangePembimbing(changingMhs.id, selectedSlot, selectedDosenId);
    }

    setChangingMhs(null);
  };

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
    (mhs) => mhs.onboarding_status === "approved" || mhs.status === "active",
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
      {notif.show && (
        <ConfirmModal
          show={notif.show}
          title={notif.title}
          message={notif.message}
          type={notif.type}
          onClose={() => setNotif({ ...notif, show: false })}
        />
      )}

      <div className="relative">
        <input
          type="text"
          placeholder="Cari berdasarkan nama atau NIM..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2F7F]"
        />

        <svg
          className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Nama
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  NIM
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Dosen Pembimbing
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Reviewer
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  TTU 1
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  TTU 2
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  TTU 3
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold">
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

                  <td className="px-4 py-3 text-sm">
                    {mhs.dosen}
                    {mhs.dosen2 && mhs.dosen2 !== "-" ? `, ${mhs.dosen2}` : ""}
                  </td>

                  <td className="px-4 py-3 text-sm">{mhs.reviewer || "-"}</td>

                  <td className="text-center">
                    {mhs.ttu1 ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-400 mx-auto" />
                    )}
                  </td>

                  <td className="text-center">
                    {mhs.ttu2 ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-400 mx-auto" />
                    )}
                  </td>

                  <td className="text-center">
                    {mhs.ttu3 ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-400 mx-auto" />
                    )}
                  </td>

                  <td className="text-center">
                    <button
                      onClick={() => openChangeModal(mhs)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 text-xs font-semibold"
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

        {filteredMahasiswa.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">
              Data mahasiswa tidak ditemukan
            </p>
          </div>
        )}
      </div>

      {changingMhs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setChangingMhs(null)}
          />

          <div className="relative bg-white w-full max-w-md rounded-xl p-6 shadow-xl">
            <div className="flex justify-between mb-4">
              <h3 className="font-bold">Ganti Dosen Pembimbing</h3>
              <button onClick={() => setChangingMhs(null)}>
                <X />
              </button>
            </div>

            <div className="space-y-3">
              <select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="pembimbing_1">Pembimbing 1</option>
                <option value="pembimbing_2">Pembimbing 2</option>
              </select>

              <select
                value={selectedDosenId}
                onChange={(e) => setSelectedDosenId(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Pilih Dosen</option>
                {getDosenOptions().map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.nama}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setChangingMhs(null)}
                className="flex-1 border rounded-lg py-2"
              >
                Batal
              </button>

              <button
                onClick={handleConfirmChange}
                className="flex-1 bg-blue-600 text-white rounded-lg py-2"
              >
                Ganti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MahasiswaBimbinganView;

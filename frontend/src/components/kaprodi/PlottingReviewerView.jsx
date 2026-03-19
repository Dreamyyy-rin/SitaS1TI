import React, { useState } from "react";
import { Info, XCircle, CheckCircle } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

const PlottingReviewerView = ({
  mahasiswaBimbingan,
  availableDosen,
  selectedReviewers,
  onReviewerChange,
  onSavePlotting,
}) => {
  const [saving, setSaving] = useState(false);
  // Notifikasi pop up
  const [notification, setNotification] = useState({
    open: false,
    type: "info",
    title: "",
    message: "",
  });
  const showNotification = ({ type = "info", title = "", message = "" }) => {
    setNotification({ open: true, type, title, message });
  };
  const closeNotification = () =>
    setNotification((prev) => ({ ...prev, open: false }));

  const getAvailableReviewers = (mhs) => {
    // Exclude pembimbing 1 & 2 from reviewer options
    return availableDosen.filter(
      (d) => d._id !== mhs.pembimbing_1_id && d._id !== mhs.pembimbing_2_id,
    );
  };

  const handleSave = async () => {
    const token = localStorage.getItem("sita_token");
    if (!token) return;

    setSaving(true);
    let hasError = false;
    try {
      // Save each reviewer assignment
      for (const [mahasiswaId, reviewerId] of Object.entries(
        selectedReviewers,
      )) {
        if (!reviewerId) continue;

        const res = await fetch(`${API}/api/kaprodi/assign-reviewer`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mahasiswa_id: mahasiswaId,
            reviewer_id: reviewerId,
          }),
        });
        const result = await res.json().catch(() => ({}));
        if (!res.ok || result.success === false) {
          hasError = true;
          showNotification({
            type: "error",
            title: "Gagal",
            message:
              result.error ||
              result.message ||
              "Gagal menyimpan salah satu reviewer",
          });
          break;
        }
      }
      if (!hasError) {
        showNotification({
          type: "success",
          title: "Berhasil",
          message: "Plotting reviewer berhasil disimpan!",
        });
        setTimeout(() => window.location.reload(), 1200);
      }
    } catch (err) {
      showNotification({
        type: "error",
        title: "Gagal",
        message: "Gagal menghubungi server",
      });
    } finally {
      setSaving(false);
    }
  };

  // Only show mahasiswa that have pembimbing assigned
  const eligibleMahasiswa = mahasiswaBimbingan.filter((m) => m.pembimbing_1_id);

  return (
    <div className="space-y-6">
      {/* Notification Modal */}
      {notification.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-all"
            onClick={closeNotification}
          ></div>
          <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 border border-slate-100 transform transition-all scale-100">
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ring-4 ${
                  notification.type === "success"
                    ? "bg-green-50 ring-green-50/50"
                    : notification.type === "error"
                      ? "bg-red-50 ring-red-50/50"
                      : "bg-blue-50 ring-blue-50/50"
                }`}
              >
                {notification.type === "success" ? (
                  <CheckCircle
                    className="w-8 h-8 text-green-500"
                    strokeWidth={2}
                  />
                ) : notification.type === "error" ? (
                  <XCircle className="w-8 h-8 text-red-500" strokeWidth={2} />
                ) : (
                  <Info className="w-8 h-8 text-blue-500" strokeWidth={2} />
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                {notification.title}
              </h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                {notification.message}
              </p>
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={closeNotification}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  No
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Mahasiswa
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Judul
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Dosen Pembimbing 1
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Dosen Pembimbing 2
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Dosen Peninjau
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {eligibleMahasiswa.map((mhs, index) => {
                const reviewers = getAvailableReviewers(mhs);
                // Prioritaskan nilai yang sudah dipilih user, lalu fallback ke reviewer yang sudah tersimpan
                const currentReviewerId =
                  mhs.id in selectedReviewers
                    ? selectedReviewers[mhs.id]
                    : mhs.reviewer_id || "";
                const hasReviewer = !!currentReviewerId;

                return (
                  <tr key={mhs.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{index + 1}</td>
                    <td className="px-4 py-3 text-sm">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {mhs.nama}
                        </p>
                        <p className="text-xs text-slate-500">{mhs.nim}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm max-w-xs">
                      <span className="line-clamp-2" title={mhs.judul}>
                        {mhs.judul || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{mhs.dosen || "-"}</td>
                    <td className="px-4 py-3 text-sm">
                      {mhs.dosen2 && mhs.dosen2 !== "-" ? mhs.dosen2 : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={currentReviewerId}
                        onChange={(e) =>
                          onReviewerChange(mhs.id, e.target.value)
                        }
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2F7F]"
                      >
                        <option value="">Belum dipilih</option>
                        {reviewers.map((dosen) => (
                          <option key={dosen._id} value={dosen._id}>
                            {dosen.nama}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {hasReviewer ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                          Sudah Diplot
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700">
                          Belum Diplot
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {eligibleMahasiswa.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-500 text-lg">
              Belum ada mahasiswa yang bisa diplot reviewer
            </p>
            <p className="text-slate-400 text-sm mt-2">
              Mahasiswa harus sudah memiliki pembimbing terlebih dahulu
            </p>
          </div>
        )}
      </div>

      {eligibleMahasiswa.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#0B2F7F] text-white px-6 py-2 rounded hover:bg-blue-800 font-semibold disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PlottingReviewerView;

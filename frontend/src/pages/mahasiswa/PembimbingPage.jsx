import React, { useState, useEffect } from "react";
import { Mail, User, AlertCircle, Send } from "lucide-react";

const PembimbingPage = () => {
  const [pembimbing, setPembimbing] = useState({
    pembimbing_1: null,
    pembimbing_2: null,
  });
  const [dosenList, setDosenList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(null);

  const [formData, setFormData] = useState({
    newPembimbingId: "",
    alasan: "",
    slot: "pembimbing_1",
  });

  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  useEffect(() => {
    loadSupervisorData();
    loadDosenList();
    checkPendingRequest();
  }, []);

  const loadSupervisorData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("sita_token");
      const response = await fetch(`${baseUrl}/api/mahasiswa/pembimbing`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success && result.data) {
        setPembimbing(result.data);
      }
    } catch (err) {
      console.error("Failed to load supervisor:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDosenList = async () => {
    try {
      const token = localStorage.getItem("sita_token");
      const response = await fetch(`${baseUrl}/api/mahasiswa/dosen-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success && result.data) {
        setDosenList(result.data);
      }
    } catch (err) {
      console.error("Failed to load dosen list:", err);
    }
  };

  const checkPendingRequest = async () => {
    try {
      const token = localStorage.getItem("sita_token");
      const response = await fetch(
        `${baseUrl}/api/mahasiswa/pembimbing-request/status?type=change`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const result = await response.json();
      if (result.success && result.data) {
        setPendingRequest(result.data);
      }
    } catch (err) {
      console.error("Failed to check pending request:", err);
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();

    if (!formData.newPembimbingId || !formData.alasan.trim()) {
      alert("Harap isi semua field yang diperlukan");
      return;
    }

    if (formData.alasan.trim().length < 20) {
      alert("Alasan harus minimal 20 karakter");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("sita_token");
      const response = await fetch(
        `${baseUrl}/api/mahasiswa/pembimbing-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      const result = await response.json();
      if (result.success) {
        alert("✅ Permintaan pergantian pembimbing berhasil dikirim!");
        setShowRequestForm(false);
        setFormData({ newPembimbingId: "", alasan: "", slot: "pembimbing_1" });
        checkPendingRequest();
      } else {
        alert(`❌ ${result.error || "Gagal mengirim permintaan"}`);
      }
    } catch (err) {
      alert("❌ Terjadi kesalahan saat mengirim permintaan");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">
            Dosen Pembimbing
          </h2>
        </div>
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-slate-500 mt-4">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Dosen Pembimbing
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Informasi dosen pembimbing Tugas Akhir Anda
          </p>
        </div>
        <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 font-medium">
          Pembimbing
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-50 to-transparent rounded-bl-full -mr-16 -mt-16 opacity-50"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
            <User className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-bold text-slate-800">
              Dosen Pembimbing Saat Ini
            </h3>
          </div>

          {pembimbing?.pembimbing_1 ? (
            <div className="space-y-6">
              {[
                { label: "Pembimbing 1", data: pembimbing.pembimbing_1 },
                { label: "Pembimbing 2", data: pembimbing.pembimbing_2 },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-6 border-b border-slate-100 pb-6 last:border-b-0 last:pb-0"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-orange-900/20 border-4 border-white">
                    {item.data
                      ? item.data.nama
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")
                      : "-"}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="text-sm font-semibold text-orange-600">
                      {item.label}
                    </div>
                    {item.data ? (
                      <>
                        <p className="text-xl font-semibold text-slate-800">
                          {item.data.nama}
                        </p>
                        {item.data.nidn && (
                          <p className="text-sm text-slate-500 font-mono">
                            NIDN: {item.data.nidn}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail className="w-4 h-4 text-orange-500" />
                          <a
                            href={`mailto:${item.data.email}`}
                            className="text-sm hover:text-orange-600 transition-colors"
                          >
                            {item.data.email}
                          </a>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-slate-400">Belum ditetapkan</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">
                Dosen pembimbing belum ditetapkan
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Silakan hubungi Kaprodi untuk penugasan pembimbing
              </p>
            </div>
          )}
        </div>
      </div>

      {pendingRequest && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 mb-1">
                Permintaan Pergantian Pembimbing Sedang Diproses
              </p>
              <p className="text-xs text-blue-800">
                Status:{" "}
                <span className="font-semibold capitalize">
                  {pendingRequest.overall_status || "pending"}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {!pendingRequest && pembimbing?.pembimbing_1 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Permintaan Pergantian Pembimbing
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Ajukan permintaan jika ingin mengganti dosen pembimbing
              </p>
            </div>
            {!showRequestForm && (
              <button
                onClick={() => setShowRequestForm(true)}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Ajukan Permintaan
              </button>
            )}
          </div>

          {showRequestForm && (
            <form onSubmit={handleSubmitRequest} className="space-y-4 mt-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-800">
                  <strong>Catatan:</strong> Permintaan pergantian pembimbing
                  akan diproses oleh Kaprodi. Pastikan Anda memiliki alasan yang
                  valid dan jelas.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Slot Dosen Pembimbing <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-slate-500 mt-1">
                  Pilih slot pembimbing yang ingin diganti
                </p>
                <select
                  value={formData.slot}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      slot: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-slate-700"
                  required
                >
                  <option value="pembimbing_1">Pembimbing 1</option>
                  <option value="pembimbing_2">Pembimbing 2</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Dosen Pembimbing Baru <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-slate-500 mt-1">
                  Pilih dosen baru atau biarkan Kaprodi yang menentukan
                </p>
                <select
                  value={formData.newPembimbingId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      newPembimbingId: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-slate-700"
                  required
                >
                  <option value="">Pilih Dosen</option>
                  <optgroup label="Dosen yang Tersedia">
                    {dosenList
                      .filter(
                        (d) =>
                          d._id !== pembimbing?.pembimbing_1?._id &&
                          d._id !== pembimbing?.pembimbing_2?._id,
                      )
                      .map((dosen) => (
                        <option key={dosen._id} value={dosen._id}>
                          {dosen.nama}
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Alasan Pergantian <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.alasan}
                  onChange={(e) =>
                    setFormData({ ...formData, alasan: e.target.value })
                  }
                  rows={5}
                  placeholder="Jelaskan alasan Anda mengajukan pergantian dosen pembimbing (minimal 20 karakter)"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-slate-700 resize-none"
                  required
                  minLength={20}
                />
                <p className="text-xs text-slate-500 mt-1">
                  {formData.alasan.length}/20 karakter minimum
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Kirim Permintaan
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowRequestForm(false);
                    setFormData({ newPembimbingId: "", alasan: "" });
                    setFormData({
                      newPembimbingId: "",
                      alasan: "",
                      slot: "pembimbing_1",
                    });
                  }}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {!pembimbing?.pembimbing_1 && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">
            Anda belum memiliki dosen pembimbing
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Silakan hubungi Kaprodi untuk mendapatkan dosen pembimbing
          </p>
        </div>
      )}
    </div>
  );
};

export default PembimbingPage;

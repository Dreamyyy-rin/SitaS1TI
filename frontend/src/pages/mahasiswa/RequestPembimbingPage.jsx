import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, AlertCircle, Send } from "lucide-react";

const RequestPembimbingPage = () => {
  const navigate = useNavigate();
  const [dosenList, setDosenList] = useState([]);
  const [pendingRequest, setPendingRequest] = useState(null);
  const [formData, setFormData] = useState({
    pembimbing_1_id: "",
    pembimbing_2_id: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  useEffect(() => {
    const token = localStorage.getItem("sita_token");
    if (!token) {
      navigate("/login?role=mahasiswa");
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        const [dosenRes, statusRes] = await Promise.all([
          fetch(`${baseUrl}/api/mahasiswa/dosen-list`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${baseUrl}/api/mahasiswa/pembimbing-request/status?type=initial`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const dosenResult = await dosenRes.json().catch(() => ({}));
        const statusResult = await statusRes.json().catch(() => ({}));

        if (dosenResult.success) {
          setDosenList(dosenResult.data || []);
        }

        if (statusResult.success) {
          setPendingRequest(statusResult.data || null);
        }
      } catch (err) {
        setError("Gagal memuat data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.pembimbing_1_id) {
      setError("Pembimbing 1 wajib dipilih");
      return;
    }

    if (formData.pembimbing_2_id && formData.pembimbing_2_id === formData.pembimbing_1_id) {
      setError("Pembimbing 2 tidak boleh sama dengan Pembimbing 1");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      const token = localStorage.getItem("sita_token");
      const response = await fetch(`${baseUrl}/api/mahasiswa/pembimbing-request/initial`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pembimbing_1_id: formData.pembimbing_1_id,
          pembimbing_2_id: formData.pembimbing_2_id || null,
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false) {
        throw new Error(result.error || "Gagal mengirim request");
      }

      setPendingRequest(result.data || { status: "pending" });
      setFormData({ pembimbing_1_id: "", pembimbing_2_id: "" });
    } catch (err) {
      setError(err.message || "Gagal mengirim request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10 font-sans">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Pilih Dosen Pembimbing
              </h1>
              <p className="text-sm text-slate-500">
                Lengkapi pemilihan pembimbing sebelum masuk ke dashboard mahasiswa.
              </p>
            </div>
          </div>

          {isLoading && (
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-slate-500">
              Memuat data...
            </div>
          )}

          {error && !isLoading && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          {pendingRequest ? (
            <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5" />
              <div>
                <p className="font-semibold">Request pembimbing sedang diproses</p>
                <p className="text-xs mt-1">Status: {pendingRequest.overall_status || "pending"}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Pembimbing 1 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.pembimbing_1_id}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, pembimbing_1_id: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Pilih Dosen --</option>
                  {dosenList.map((dosen) => (
                    <option key={dosen._id} value={dosen._id}>
                      {dosen.nama} - {dosen.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Pembimbing 2 (Opsional)
                </label>
                <select
                  value={formData.pembimbing_2_id}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, pembimbing_2_id: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Tidak memilih pembimbing 2 --</option>
                  {dosenList
                    .filter((dosen) => dosen._id !== formData.pembimbing_1_id)
                    .map((dosen) => (
                      <option key={dosen._id} value={dosen._id}>
                        {dosen.nama} - {dosen.email}
                      </option>
                    ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:bg-slate-300"
              >
                {isSubmitting ? (
                  "Mengirim..."
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Kirim Request
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/login?role=mahasiswa")}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Kembali ke Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestPembimbingPage;

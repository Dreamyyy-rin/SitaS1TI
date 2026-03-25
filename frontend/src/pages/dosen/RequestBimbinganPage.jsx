import React, { useState, useEffect } from "react";
import ConfirmModal from "../../components/shared/ConfirmModal";
import { CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SidebarDosen from "../../components/dosen/SidebarDosen";
import RequestBimbinganView from "../../components/dosen/RequestBimbinganView";

export default function RequestBimbinganPage() {
  const [notif, setNotif] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
  });
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestBimbingan, setRequestBimbingan] = useState([]);
  const [requestCount, setRequestCount] = useState(() => {
    const cached = localStorage.getItem("dosen_request_count");
    return cached ? parseInt(cached, 10) : 0;
  });
  const [mahasiswaBimbinganCount] = useState(() =>
    parseInt(localStorage.getItem("dosen_mahasiswa_upload_count") || "0", 10),
  );
  const [reviewCount] = useState(() =>
    parseInt(localStorage.getItem("dosen_review_count") || "0", 10),
  );
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [actedIds, setActedIds] = useState(new Set());

  useEffect(() => {
    const token = localStorage.getItem("sita_token");
    const userData = localStorage.getItem("sita_user");

    if (!token) {
      navigate("/login?role=dosen");
      return;
    }

    const loadData = async () => {
      try {
        let parsedUser = null;
        if (userData) {
          parsedUser = JSON.parse(userData);
          setProfile(parsedUser);
        }

        const baseUrl =
          import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
        const response = await fetch(
          `${baseUrl}/api/dosen/pembimbing-requests`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const result = await response.json().catch(() => ({}));
        if (!response.ok || result.success === false) {
          throw new Error(result.error || "Gagal memuat request");
        }

        const dosenId = parsedUser?._id;
        const normalized = (result.data || []).map((req) => ({
          id: req._id,
          nama: req.mahasiswa?.nama || "-",
          nim: req.mahasiswa?.nim || "-",
          judul: req.judul || "-",
          tanggal: new Date(req.created_at).toLocaleDateString("id-ID"),
        }));

        setRequestBimbingan(normalized);
        const count = (result.data || []).length;
        setRequestCount(count);
        localStorage.setItem("dosen_request_count", count.toString());
      } catch (err) {
        setError(err.message || "Error memuat data user");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const user = {
    name: profile?.nama || "Dosen",
    nip: profile?.nip || "-",
    email: profile?.email || "-",
  };

  const handleAcceptRequest = (id) => {
    setSelectedRequestId(id);
    setShowApproveModal(true);
  };

  const handleRejectRequest = (id) => {
    setSelectedRequestId(id);
    setShowRejectModal(true);
  };

  const confirmApprove = async () => {
    const id = selectedRequestId;
    setShowApproveModal(false);
    setSelectedRequestId(null);
    const baseUrl =
      import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
    const token = localStorage.getItem("sita_token");
    try {
      const res = await fetch(
        `${baseUrl}/api/dosen/pembimbing-requests/${id}/approve`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();
      if (data.success) {
        setActedIds((prev) => {
          const next = new Set(prev);
          next.add(id);
          return next;
        });
        setNotif({
          show: true,
          type: "success",
          title: "Permintaan Disetujui",
          message:
            "Permintaan berhasil disetujui. Bimbingan akan disetujui ketika kaprodi juga sudah menyetujui.",
        });
      } else {
        setNotif({
          show: true,
          type: "error",
          title: "Gagal",
          message: data.message || data.error || "Gagal menerima permintaan",
        });
      }
    } catch {
      setNotif({
        show: true,
        type: "error",
        title: "Koneksi Gagal",
        message: "Gagal menghubungi server",
      });
    }
  };

  const confirmReject = async () => {
    const id = selectedRequestId;
    setShowRejectModal(false);
    setSelectedRequestId(null);
    const baseUrl =
      import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
    const token = localStorage.getItem("sita_token");
    try {
      const res = await fetch(
        `${baseUrl}/api/dosen/pembimbing-requests/${id}/reject`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();
      if (data.success) {
        setActedIds((prev) => {
          const next = new Set(prev);
          next.add(id);
          return next;
        });
        setNotif({
          show: true,
          type: "success",
          title: "Permintaan Ditolak",
          message: "Permintaan bimbingan berhasil ditolak.",
        });
      } else {
        setNotif({
          show: true,
          type: "error",
          title: "Gagal Tolak",
          message: data.message || data.error || "Gagal menolak permintaan",
        });
      }
    } catch {
      setNotif({
        show: true,
        type: "error",
        title: "Koneksi Gagal",
        message: "Gagal menghubungi server",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("sita_token");
    localStorage.removeItem("sita_user");
    navigate("/login?role=dosen");
  };

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-sans text-slate-600">
      <ConfirmModal
        show={notif.show}
        type={notif.type}
        title={notif.title}
        message={notif.message}
        onClose={() => setNotif({ ...notif, show: false })}
      />
      <SidebarDosen
        activeMenu="request-bimbingan"
        onMenuClick={(key) => {
          if (key === "dashboard") navigate("/dosen-dashboard");
          else if (key === "mahasiswa-bimbingan")
            navigate("/dosen-mahasiswa-bimbingan");
          else if (key === "review") navigate("/dosen-review");
          else if (key === "data-akun") navigate("/data-akun");
          else if (key === "panduan") navigate("/dosen-panduan");
        }}
        onLogout={handleLogout}
        user={user}
        requestCount={requestCount}
        mahasiswaBimbinganCount={mahasiswaBimbinganCount}
        reviewCount={reviewCount}
      />

      <main className="flex-1 ml-16 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto pb-10">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#0B2F7F]">
              Permintaan Bimbingan
            </h1>
            <p className="text-gray-600 mt-2">
              Daftar mahasiswa yang mengajukan permintaan bimbingan
            </p>
          </div>

          {isLoading && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 text-slate-500">
              Memuat data...
            </div>
          )}
          {error && !isLoading && (
            <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-4 text-rose-700">
              {error}
            </div>
          )}
          {!isLoading && (
            <RequestBimbinganView
              requestBimbingan={requestBimbingan}
              onAccept={handleAcceptRequest}
              onReject={handleRejectRequest}
              actedIds={actedIds}
            />
          )}
        </div>
      </main>

      {/* Approve Confirmation Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-all"
            onClick={() => setShowApproveModal(false)}
          ></div>
          <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 border border-slate-100 transform transition-all scale-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 ring-4 ring-green-50/50">
                <CheckCircle
                  className="w-8 h-8 text-green-500"
                  strokeWidth={2}
                />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Setujui Permintaan Bimbingan?
              </h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Permintaan ini akan menunggu persetujuan kaprodi sebelum
                dikonfirmasi.
              </p>
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={confirmApprove}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all"
                >
                  Ya, Setujui
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-all"
            onClick={() => setShowRejectModal(false)}
          ></div>
          <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 border border-slate-100 transform transition-all scale-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 ring-4 ring-red-50/50">
                <XCircle className="w-8 h-8 text-red-500" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Tolak Permintaan Bimbingan?
              </h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Mahasiswa akan mendapat notifikasi bahwa permintaannya ditolak.
              </p>
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={confirmReject}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all"
                >
                  Ya, Tolak
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

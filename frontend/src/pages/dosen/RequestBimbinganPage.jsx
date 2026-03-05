import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarDosen from "../../components/dosen/SidebarDosen";
import RequestBimbinganView from "../../components/dosen/RequestBimbinganView";

export default function RequestBimbinganPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestBimbingan, setRequestBimbingan] = useState([]);
  const [requestCount, setRequestCount] = useState(() => {
    const cached = localStorage.getItem("dosen_request_count");
    return cached ? parseInt(cached, 10) : 0;
  });

  useEffect(() => {
    const token = localStorage.getItem("sita_token");
    const userData = localStorage.getItem("sita_user");

    if (!token) {
      navigate("/login?role=dosen");
      return;
    }

    const loadData = async () => {
      try {
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setProfile(parsedUser);
        }

        const baseUrl =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
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

        const normalized = (result.data || []).map((req) => ({
          id: req._id,
          nama: req.mahasiswa?.nama || "-",
          nim: req.mahasiswa?.nim || "-",
          judul: req.judul || "-",
          tanggal: new Date(req.created_at).toLocaleDateString("id-ID"),
        }));

        setRequestBimbingan(normalized);
        // Backend already filters by overall_status = pending, so count all returned data
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

  const handleAcceptRequest = async (id) => {
    const baseUrl =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
    const token = localStorage.getItem("sita_token");
    try {
      const res = await fetch(
        `${baseUrl}/api/dosen/pembimbing-requests/${id}/approve`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (data.success) {
        alert(
          "✓ Request berhasil disetujui. Mahasiswa dapat masuk dashboard setelah Kaprodi dan semua Dosen Pembimbing menyetujui.",
        );
        // Reload data from backend to get updated list
        window.location.reload();
      } else {
        alert(data.message || data.error || "Gagal approve request");
      }
    } catch {
      alert("Gagal menghubungi server");
    }
  };

  const handleRejectRequest = async (id) => {
    const baseUrl =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
    const token = localStorage.getItem("sita_token");
    try {
      const res = await fetch(
        `${baseUrl}/api/dosen/pembimbing-requests/${id}/reject`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (data.success) {
        alert("✓ Request berhasil ditolak.");
        // Reload data from backend to get updated list
        window.location.reload();
      } else {
        alert(data.message || data.error || "Gagal reject request");
      }
    } catch {
      alert("Gagal menghubungi server");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("sita_token");
    localStorage.removeItem("sita_user");
    navigate("/login?role=dosen");
  };

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-sans text-slate-600">
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
      />

      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
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
            />
          )}
        </div>
      </main>
    </div>
  );
}

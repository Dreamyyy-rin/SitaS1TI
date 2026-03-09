import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarDosen from "../../components/dosen/SidebarDosen";
import DashboardView from "../../components/dosen/DashboardView";

const API = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export default function DosenDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    total_mahasiswa: 0,
    total_request: 0,
    ttu_selesai: 0,
  });
  const [mahasiswaBimbingan, setMahasiswaBimbingan] = useState([]);
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

    try {
      if (userData) setProfile(JSON.parse(userData));
    } catch {
      /* ignore */
    }

    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch(`${API}/api/dosen/dashboard-stats`, { headers })
        .then((r) => r.json())
        .catch(() => ({})),
      fetch(`${API}/api/dosen/mahasiswa-bimbingan`, { headers })
        .then((r) => r.json())
        .catch(() => ({})),
      fetch(`${API}/api/dosen/pembimbing-requests`, { headers })
        .then((r) => r.json())
        .catch(() => ({})),
    ])
      .then(([statsRes, mhsRes, reqRes]) => {
        if (statsRes.success) setStats(statsRes.data);
        if (mhsRes.success) setMahasiswaBimbingan(mhsRes.data || []);
        if (reqRes.success) {
          setRequestBimbingan(reqRes.data || []);
          // Backend already filters by overall_status = pending, so count all returned data
          const count = (reqRes.data || []).length;
          setRequestCount(count);
          localStorage.setItem("dosen_request_count", count.toString());
        }
      })
      .catch((err) => setError("Gagal memuat data dashboard"))
      .finally(() => setIsLoading(false));
  }, [navigate]);

  const user = {
    name: profile?.nama || "Dosen",
    nip: profile?.nip || profile?.nidn || "-",
    email: profile?.email || "-",
  };

  const recentActivities = [
    ...requestBimbingan.slice(0, 5).map((r, i) => ({
      id: `req-${i}`,
      type: "request",
      message: `${r.mahasiswa?.nama || "Mahasiswa"} mengajukan request pembimbing`,
      time: r.created_at
        ? new Date(r.created_at).toLocaleDateString("id-ID")
        : "-",
    })),
  ];

  const handleLogout = () => {
    localStorage.removeItem("sita_token");
    localStorage.removeItem("sita_user");
    navigate("/login?role=dosen");
  };

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-sans text-slate-600">
      <SidebarDosen
        activeMenu="dashboard"
        onMenuClick={(key) => {
          if (key === "request-bimbingan") navigate("/dosen-request-bimbingan");
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
              Dasbor Dosen
            </h1>
            {user && (
              <p className="text-gray-600 mt-2">Selamat datang, {user.name}</p>
            )}
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
            <DashboardView
              stats={stats}
              requestBimbingan={requestBimbingan}
              mahasiswaBimbingan={mahasiswaBimbingan}
              recentActivities={recentActivities}
            />
          )}
        </div>
      </main>
    </div>
  );
}

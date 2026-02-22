import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarDosen from "../../components/dosen/SidebarDosen";
import MahasiswaBimbinganView from "../../components/dosen/MahasiswaBimbinganView";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export default function MahasiswaBimbinganPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [mahasiswaBimbingan, setMahasiswaBimbingan] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("sita_token");
    const userData = localStorage.getItem("sita_user");

    if (!token) {
      navigate("/login?role=dosen");
      return;
    }

    try {
      if (userData) setProfile(JSON.parse(userData));
    } catch { /* ignore */ }

    const headers = { Authorization: `Bearer ${token}` };

    fetch(`${API}/api/dosen/mahasiswa-bimbingan`, { headers })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          const mapped = (res.data || []).map(m => {
            const ttu = m.ttu_status || {};
            return {
              id: m._id,
              nama: m.nama || "-",
              nim: m.nim || "-",
              prodi: m.prodi || "-",
              email: m.email || "-",
              reviewer: m.reviewer || "-",
              ttu1: ttu.ttu_1?.status === "approved",
              ttu2: ttu.ttu_2?.status === "approved",
              ttu3: ttu.ttu_3?.status === "approved",
              ttu_status: ttu,
              status: m.onboarding_status === "approved" ? "active" : m.onboarding_status,
            };
          });
          setMahasiswaBimbingan(mapped);
        }
      })
      .catch(() => setError("Gagal memuat data mahasiswa"))
      .finally(() => setIsLoading(false));
  }, [navigate]);

  const user = {
    name: profile?.nama || "Dosen",
    nip: profile?.nip || profile?.nidn || "-",
    email: profile?.email || "-",
  };

  const handlePreviewFile = (mahasiswa, ttuType) => {
    alert(`Preview file ${ttuType} untuk ${mahasiswa.nama}`);
  };

  const handleAcceptMahasiswa = (id) => {
    const token = localStorage.getItem("sita_token");
    const mhs = mahasiswaBimbingan.find(m => m.id === id);
    if (!mhs) return;

    // Determine which TTU to approve based on progress
    let ttuToApprove = null;
    const ttu = mhs.ttu_status || {};
    if (ttu.ttu_1?.status === "submitted" || ttu.ttu_1?.status === "reviewed") ttuToApprove = "ttu_1";
    else if (ttu.ttu_2?.status === "submitted" || ttu.ttu_2?.status === "reviewed") ttuToApprove = "ttu_2";

    if (!ttuToApprove) {
      alert("Tidak ada TTU yang perlu di-ACC saat ini");
      return;
    }

    fetch(`${API}/api/dosen/ttu/${ttuToApprove}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mahasiswa_id: id }),
    })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          alert(`${ttuToApprove.replace("_", " ").toUpperCase()} untuk ${mhs.nama} berhasil di-ACC`);
          // Reload data
          window.location.reload();
        } else {
          alert(res.message || "Gagal ACC TTU");
        }
      })
      .catch(() => alert("Gagal menghubungi server"));
  };

  const handleLogout = () => {
    localStorage.removeItem("sita_token");
    localStorage.removeItem("sita_user");
    navigate("/login?role=dosen");
  };

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-sans text-slate-600">
      <SidebarDosen
        activeMenu="mahasiswa-bimbingan"
        onMenuClick={(key) => {
          if (key === "dashboard") navigate("/dosen-dashboard");
          else if (key === "request-bimbingan") navigate("/dosen-request-bimbingan");
          else if (key === "review") navigate("/dosen-review");
          else if (key === "data-akun") navigate("/data-akun");
          else if (key === "panduan") navigate("/dosen-panduan");
        }}
        onLogout={handleLogout}
        user={user}
      />

      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto pb-10">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#0B2F7F]">Mahasiswa Bimbingan</h1>
            <p className="text-gray-600 mt-2">Daftar mahasiswa yang Anda bimbing</p>
          </div>

          {isLoading && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 text-slate-500">Memuat data...</div>
          )}
          {error && !isLoading && (
            <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-4 text-rose-700">{error}</div>
          )}
          {!isLoading && (
            <MahasiswaBimbinganView
              mahasiswaBimbingan={mahasiswaBimbingan}
              onPreviewFile={handlePreviewFile}
              onAcceptMahasiswa={handleAcceptMahasiswa}
            />
          )}
        </div>
      </main>
    </div>
  );
}

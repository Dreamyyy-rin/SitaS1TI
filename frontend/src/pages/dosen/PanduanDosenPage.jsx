import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarDosen from "../../components/dosen/SidebarDosen";
import PanduanDosenView from "../../components/dosen/PanduanDosenView";

export default function PanduanDosenPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestCount, setRequestCount] = useState(0);
  const mahasiswaBimbinganCount = parseInt(
    localStorage.getItem("dosen_mahasiswa_upload_count") || "0",
    10,
  );
  const reviewCount = parseInt(
    localStorage.getItem("dosen_review_count") || "0",
    10,
  );

  const API = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

  useEffect(() => {
    const token = localStorage.getItem("sita_token");
    const userData = localStorage.getItem("sita_user");

    if (!token) {
      navigate("/login?role=dosen");
      return;
    }

    try {
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setProfile(parsedUser);
      }
    } catch (err) {
      setError("Error memuat data user");
    } finally {
      setIsLoading(false);
    }

    const headers = { Authorization: `Bearer ${token}` };
    fetch(`${API}/api/dosen/pembimbing-requests`, { headers })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          const count = (res.data || []).length;
          setRequestCount(count);
          localStorage.setItem("dosen_request_count", count.toString());
        }
      })
      .catch(() => {});
  }, [navigate]);

  const user = {
    name: profile?.nama || "Dosen",
    nip: profile?.nip || "-",
    email: profile?.email || "-",
  };

  const handleLogout = () => {
    localStorage.removeItem("sita_token");
    localStorage.removeItem("sita_user");
    navigate("/login?role=dosen");
  };

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-sans text-slate-600">
      <SidebarDosen
        activeMenu="panduan"
        requestCount={requestCount}
        mahasiswaBimbinganCount={mahasiswaBimbinganCount}
        reviewCount={reviewCount}
        onMenuClick={(key) => {
          if (key === "dashboard") navigate("/dosen-dashboard");
          else if (key === "request-bimbingan")
            navigate("/dosen-request-bimbingan");
          else if (key === "mahasiswa-bimbingan")
            navigate("/dosen-mahasiswa-bimbingan");
          else if (key === "review") navigate("/dosen-review");
          else if (key === "data-akun") navigate("/data-akun");
        }}
        onLogout={handleLogout}
        user={user}
      />

      <main className="flex-1 ml-16 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto pb-10">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#0B2F7F]">Panduan</h1>
            <p className="text-gray-600 mt-2">
              Panduan penggunaan sistem untuk Dosen
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
          {!isLoading && <PanduanDosenView />}
        </div>
      </main>
    </div>
  );
}

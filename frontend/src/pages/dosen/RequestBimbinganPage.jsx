import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarDosen from "../../components/dosen/SidebarDosen";
import RequestBimbinganView from "../../components/dosen/RequestBimbinganView";

export default function RequestBimbinganPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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
  }, [navigate]);

  const user = {
    name: profile?.nama || "Dosen",
    nip: profile?.nip || "-",
    email: profile?.email || "-",
  };

  //dummy req bimbingan
  const requestBimbingan = [
    {
      id: 1,
      nama: "Andi Wijaya",
      nim: "200411100001",
      judul: "Sistem Informasi Akademik Berbasis Web",
      tanggal: "2024-02-05",
    },
    {
      id: 2,
      nama: "Maya Kusuma",
      nim: "200411100012",
      judul: "Aplikasi Mobile untuk Manajemen Tugas",
      tanggal: "2024-02-06",
    },
  ];

  const handleAcceptRequest = (id) => {
    alert(
      `Request dari mahasiswa dengan ID ${id} diterima. Mahasiswa akan menjadi mahasiswa bimbingan Anda setelah persetujuan dari Kaprodi.`,
    );
  };

  const handleRejectRequest = (id) => {
    alert(`Request dari mahasiswa dengan ID ${id} ditolak.`);
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
      />

      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto pb-10">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#0B2F7F]">
              Request Bimbingan
            </h1>
            <p className="text-gray-600 mt-2">
              Daftar mahasiswa yang mengajukan request bimbingan
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

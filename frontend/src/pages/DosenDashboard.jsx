import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SidebarDosen from "../components/SidebarDosen";
import DataAkunPage from "./DataAkunPage";
import PanduanPage from "./PanduanPage";
import { ClipboardList, Users, TrendingUp } from "lucide-react";

export default function DosenDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState("dashboard");
  const [activeMenu, setActiveMenu] = useState("dashboard");

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

  const user = useMemo(() => {
    const fallback = {
      name: "Dosen",
      nip: "-",
      email: "-",
    };

    if (!profile) {
      return fallback;
    }

    return {
      ...fallback,
      name: profile.nama || fallback.name,
      nip: profile.nip || fallback.nip,
      email: profile.email || fallback.email,
    };
  }, [profile]);

  const DashboardView = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Dashboard Dosen</h2>
        <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 font-medium">
          Semester Genap 2025/2026
        </div>
      </div>

   
      <div className="bg-gradient-to-br from-[#0B2F7F] to-[#1e40af] rounded-2xl shadow-xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold backdrop-blur-sm">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-bold">{user.name}</h3>
            <p className="text-blue-100">NIP: {user.nip}</p>
            <p className="text-blue-100 text-sm">{user.email}</p>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Request Bimbingan</p>
              <h3 className="text-2xl font-bold text-slate-800">1</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Mahasiswa</p>
              <h3 className="text-2xl font-bold text-slate-800">0</h3>
            </div>
          </div>
        </div>
      </div>

    
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-slate-800">
            Aktivitas Terbaru
          </h3>
        </div>
        <div className="text-center py-12 text-slate-400">
          <p>Belum ada aktivitas terbaru</p>
        </div>
      </div>
    </div>
  );

  const RequestBimbinganView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Request Bimbingan</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="text-center py-12 text-slate-400">
          <ClipboardList className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p>Belum ada request bimbingan</p>
        </div>
      </div>
    </div>
  );

  const MahasiswaSayaView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Mahasiswa Saya</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="text-center py-12 text-slate-400">
          <Users className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p>Belum ada mahasiswa bimbingan</p>
        </div>
      </div>
    </div>
  );

  const handleLogout = () => {
    localStorage.removeItem("sita_token");
    localStorage.removeItem("sita_user");
    navigate("/login?role=dosen");
  };

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-sans text-slate-600">
      <SidebarDosen
        activeMenu={activeMenu}
        onMenuClick={(key, viewName) => {
          setActiveMenu(key);
          setView(viewName);
        }}
        onLogout={handleLogout}
        user={user}
      />

      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto pb-10">
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
          {view === "dashboard" && <DashboardView />}
          {view === "request-bimbingan" && <RequestBimbinganView />}
          {view === "mahasiswa-saya" && <MahasiswaSayaView />}
          {view === "data-akun" && <DataAkunPage student={user} />}
          {view === "panduan" && <PanduanPage />}
        </div>
      </main>
    </div>
  );
}

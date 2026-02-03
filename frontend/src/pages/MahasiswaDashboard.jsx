import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarMahasiswa from "../components/SidebarMahasiswa";
import { TTUProvider } from "../contexts/TTUContext";
import ProfileCard from "../components/ProfileCard";
import TimelineCard from "../components/TimelineCard";
import UploadTTUPage from "./UploadTTUPage";
import ReviewPage from "./ReviewPage";
import UploadBerkasPage from "./UploadBerkasPage";
import DataAkunPage from "./DataAkunPage";
import PanduanPage from "./PanduanPage";

export default function MahasiswaDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("sita_token");
    if (!token) {
      navigate("/login?role=mahasiswa");
      return;
    }

    const baseUrl =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${baseUrl}/api/mahasiswa/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || result.success === false) {
          throw new Error(result.error || "Gagal memuat profil");
        }
        setProfile(result.data || null);
      } catch (err) {
        setError(err.message || "Gagal memuat profil");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const student = useMemo(() => {
    const fallback = {
      name: "Mahasiswa",
      nim: "-",
      prodi: "-",
      email: "-",
      stage: "TTU 1",
      supervisor: "Belum ditetapkan",
    };

    if (!profile) {
      return fallback;
    }

    return {
      ...fallback,
      name: profile.nama || fallback.name,
      nim: profile.nim || fallback.nim,
      prodi: profile.prodi || fallback.prodi,
      email: profile.email || fallback.email,
    };
  }, [profile]);

  const [view, setView] = useState("home");
  const [activeMenu, setActiveMenu] = useState("home");

  const HomeView = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
        <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 font-medium">
          Semester Genap 2025/2026
        </div>
      </div>

      <ProfileCard student={student} />
      <TimelineCard student={student} />
    </div>
  );

  const UploadTTUView = () => (
    <UploadTTUPage onSwitchToReview={() => setView("review")} />
  );

  return (
    <TTUProvider>
      <div className="flex bg-[#F8FAFC] min-h-screen font-sans text-slate-600">
        <SidebarMahasiswa
          activeMenu={activeMenu}
          onMenuClick={(key, viewName) => {
            setActiveMenu(key);
            setView(viewName);
          }}
          onLogout={() => {
            localStorage.removeItem("sita_token");
            localStorage.removeItem("sita_user");
            setView("home");
            setActiveMenu("home");
            navigate("/login?role=mahasiswa");
          }}
          student={student}
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
            {view === "home" && <HomeView />}
            {view === "upload-ttu" && <UploadTTUView />}
            {view === "review" && <ReviewPage student={student} />}
            {view === "upload-berkas" && <UploadBerkasPage />}
            {view === "data-akun" && <DataAkunPage student={student} />}
            {view === "panduan" && <PanduanPage />}
          </div>
        </main>
      </div>
    </TTUProvider>
  );
}

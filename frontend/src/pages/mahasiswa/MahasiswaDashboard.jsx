import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarMahasiswa from "../../components/mahasiswa/SidebarMahasiswa";
import { TTUProvider } from "../../contexts/TTUContext";
import ProfileCard from "../../components/mahasiswa/ProfileCard";
import TimelineCard from "../../components/mahasiswa/TimelineCard";
import UploadTTUPage from "./UploadTTUPage";
import PembimbingPage from "./PembimbingPage";
import PesanPage from "./BimbinganPage";
import UploadTTU3 from "./UploadTTU3";
import DataAkunPage from "../shared/DataAkunPage";
import PanduanPage from "./PanduanPage";
import ErrorBoundary from "../../components/shared/ErrorBoundary";

export default function MahasiswaDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [pembimbing, setPembimbing] = useState({
    pembimbing_1: null,
    pembimbing_2: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("sita_token");
    if (!token) {
      navigate("/login?role=mahasiswa");
      return;
    }

    const baseUrl =
      import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

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
        const loadedProfile = result.data || null;
        setProfile(loadedProfile);
        if (loadedProfile && loadedProfile.onboarding_status !== "approved") {
          navigate("/mahasiswa/request-pembimbing");
        }

        const pembimbingRes = await fetch(
          `${baseUrl}/api/mahasiswa/pembimbing`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const pembimbingResult = await pembimbingRes.json().catch(() => ({}));
        if (pembimbingResult.success) {
          setPembimbing(
            pembimbingResult.data || { pembimbing_1: null, pembimbing_2: null },
          );
        }
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

    // Compute current stage from ttu_status
    const ttu = profile.ttu_status || {};
    let stage = "TTU 1";
    if (ttu.ttu_3?.status === "approved") {
      stage = "Selesai";
    } else if (ttu.ttu_2?.status === "approved") {
      stage = "TTU 3";
    } else if (ttu.ttu_1?.status === "approved") {
      stage = "TTU 2";
    } else {
      stage = "TTU 1";
    }

    // Get supervisor name from pembimbing state
    const supervisorName = pembimbing?.pembimbing_1?.nama || "Belum ditetapkan";

    return {
      ...fallback,
      name: profile.nama || fallback.name,
      nim: profile.nim || fallback.nim,
      prodi: profile.prodi || fallback.prodi,
      email: profile.email || fallback.email,
      stage,
      supervisor: supervisorName,
      ttu_status: ttu,
    };
  }, [profile, pembimbing]);

  const [view, setView] = useState("home");
  const [activeMenu, setActiveMenu] = useState("home");

  const HomeView = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800">Dasbor</h2>

      <ProfileCard student={student} />
      <TimelineCard student={student} />
    </div>
  );

  const UploadTTUView = () => (
    <UploadTTUPage
      onSwitchToReview={() => {
        setView("daftar-review");
        setActiveMenu("daftar-review");
      }}
    />
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

        <main className="flex-1 ml-16 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen">
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
            <ErrorBoundary>
              {view === "home" && <HomeView />}
              {view === "upload-ttu" && <UploadTTUView />}
              {view === "bimbingan" && <PembimbingPage />}
              {view === "pesan" && <PesanPage />}
              {view === "daftar-review" && <UploadTTU3 student={student} />}
              {view === "data-akun" && <DataAkunPage student={student} />}
              {view === "panduan" && <PanduanPage />}
              {![
                "home",
                "upload-ttu",
                "bimbingan",
                "pesan",
                "daftar-review",
                "data-akun",
                "panduan",
              ].includes(view) && (
                <div className="text-center p-8">
                  <p className="text-slate-500">Menu tidak ditemukan: {view}</p>
                  <button
                    onClick={() => {
                      setView("home");
                      setActiveMenu("home");
                    }}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Kembali ke Dasbor
                  </button>
                </div>
              )}
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </TTUProvider>
  );
}

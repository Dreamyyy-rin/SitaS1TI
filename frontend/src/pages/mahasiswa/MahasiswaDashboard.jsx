import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, CheckCircle } from "lucide-react";
import SidebarMahasiswa from "../../components/mahasiswa/SidebarMahasiswa";
import { TTUProvider } from "../../contexts/TTUContext";
import ProfileCard from "../../components/mahasiswa/ProfileCard";
import TimelineCard from "../../components/mahasiswa/TimelineCard";
import UploadTTUPage from "./UploadTTUPage";
import PembimbingPage from "./PembimbingPage";
import UploadTTU3 from "./UploadTTU3";
import DataAkunPage from "../shared/DataAkunPage";
import PanduanPage from "./PanduanPage";

export default function MahasiswaDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);
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
        if (loadedProfile?.ttu_status?.ttu_3?.status === "approved") {
          const celebKey = `sita_ttu3_celebrated_${loadedProfile._id}`;
          if (!sessionStorage.getItem(celebKey)) {
            setShowCelebration(true);
            sessionStorage.setItem(celebKey, "1");
          }
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
            setShowCelebration(false);
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
            {view === "home" && <HomeView />}
            {view === "upload-ttu" && <UploadTTUView />}
            {view === "bimbingan" && <PembimbingPage />}
            {view === "daftar-review" && <UploadTTU3 student={student} />}
            {view === "data-akun" && <DataAkunPage student={student} />}
            {view === "panduan" && <PanduanPage />}
          </div>
        </main>

        {showCelebration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setShowCelebration(false)}
            />
            <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 border border-slate-100 text-center">
              <button
                onClick={() => setShowCelebration(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex justify-center mb-5">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center ring-8 ring-green-50/60">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Selamat! 🎉
              </h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Tugas Talenta Unggul 3 Anda telah disetujui. Anda telah berhasil
                menyelesaikan seluruh Tugas Talenta Unggul!
              </p>

              <div className="bg-[#0B2F7F]/5 border border-[#0B2F7F]/10 rounded-2xl p-5 mb-6 text-left">
                <p className="text-sm text-slate-500 italic leading-relaxed">
                  Pergi ke taman memetik melati,
                  <br />
                  Melati putih harum baunya.
                  <br />
                  Selamat atas tugas akhir yang telah diselesaikan hari ini,
                  <br />
                  Semoga sukses selalu menyertai langkahmu ke depannya.
                </p>
              </div>

              <button
                onClick={() => setShowCelebration(false)}
                className="w-full py-3 rounded-xl bg-[#0B2F7F] hover:bg-[#1A45A0] text-white font-semibold transition-colors shadow-lg shadow-[#0B2F7F]/20"
              >
                Terima Kasih!
              </button>
            </div>
          </div>
        )}
      </div>
    </TTUProvider>
  );
}

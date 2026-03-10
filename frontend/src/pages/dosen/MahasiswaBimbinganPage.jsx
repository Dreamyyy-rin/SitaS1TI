import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, CheckCircle, XCircle } from "lucide-react";
import SidebarDosen from "../../components/dosen/SidebarDosen";
import MahasiswaBimbinganView from "../../components/dosen/MahasiswaBimbinganView";
import ConfirmModal from "../../components/shared/ConfirmModal";

const API = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export default function MahasiswaBimbinganPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [mahasiswaBimbingan, setMahasiswaBimbingan] = useState([]);
  const [requestCount, setRequestCount] = useState(() => {
    const cached = localStorage.getItem("dosen_request_count");
    return cached ? parseInt(cached, 10) : 0;
  });
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedMahasiswaId, setSelectedMahasiswaId] = useState(null);
  // Hapus deklarasi notif/setNotif duplikat, hanya satu state notif
  const [notif, setNotif] = useState({
    show: false,
    title: "",
    message: "",
    reload: false,
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

    // Fetch request count
    fetch(`${API}/api/dosen/pembimbing-requests`, { headers })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          // Backend already filters by overall_status = pending, so count all returned data
          const count = (res.data || []).length;
          setRequestCount(count);
          localStorage.setItem("dosen_request_count", count.toString());
        }
      })
      .catch(() => {});

    fetch(`${API}/api/dosen/mahasiswa-bimbingan`, { headers })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          const mapped = (res.data || []).map((m) => {
            const ttu = m.ttu_status || {};
            return {
              id: m._id,
              nama: m.nama || "-",
              nim: m.nim || "-",
              prodi: m.prodi || "-",
              email: m.email || "-",
              judul: m.judul || "-",
              reviewer: m.reviewer || "-",
              ttu1: ttu.ttu_1?.status === "approved",
              ttu2: ttu.ttu_2?.status === "approved",
              ttu3: ttu.ttu_3?.status === "approved",
              ttu_status: ttu,
              status:
                m.onboarding_status === "approved"
                  ? "active"
                  : m.onboarding_status,
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

  const handleAcceptMahasiswa = (id) => {
    const mhs = mahasiswaBimbingan.find((m) => m.id === id);
    if (!mhs) return;

    
    let ttuToApprove = null;
    const ttu = mhs.ttu_status || {};

   
    if (ttu.ttu_1?.status === "submitted" || ttu.ttu_1?.status === "reviewed") {
      ttuToApprove = "ttu_1";
    } else if (
      ttu.ttu_2?.status === "submitted" ||
      ttu.ttu_2?.status === "reviewed"
    ) {
      ttuToApprove = "ttu_2";
    } else if (
      ttu.ttu_3?.status === "submitted" ||
      ttu.ttu_3?.status === "reviewed"
    ) {
      ttuToApprove = "ttu_3";
    }

    if (!ttuToApprove) {
      setNotif({
        show: true,
        title: "TTU Tidak Tersedia",
        message: "Tidak ada TTU yang perlu di-ACC saat ini",
        reload: false,
      });
      return;
    }

    setSelectedMahasiswaId(id);
    setShowAcceptModal(true);
  };

  const confirmAccept = () => {
    const token = localStorage.getItem("sita_token");
    const mhs = mahasiswaBimbingan.find((m) => m.id === selectedMahasiswaId);
    if (!mhs) return;

   
    let ttuToApprove = null;
    const ttu = mhs.ttu_status || {};

    if (ttu.ttu_1?.status === "submitted" || ttu.ttu_1?.status === "reviewed") {
      ttuToApprove = "ttu_1";
    } else if (
      ttu.ttu_2?.status === "submitted" ||
      ttu.ttu_2?.status === "reviewed"
    ) {
      ttuToApprove = "ttu_2";
    } else if (
      ttu.ttu_3?.status === "submitted" ||
      ttu.ttu_3?.status === "reviewed"
    ) {
      ttuToApprove = "ttu_3";
    }

    if (!ttuToApprove) return;

    fetch(`${API}/api/dosen/ttu/${ttuToApprove}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mahasiswa_id: selectedMahasiswaId }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setNotif({
            show: true,
            title: "TTU Berhasil Disetujui",
            message: res.message || "TTU berhasil disetujui",
            reload: true,
          });
        } else {
          setNotif({
            show: true,
            title: "Gagal Menyetujui TTU",
            message: res.message || "Gagal menyetujui TTU",
            reload: false,
          });
        }
      })
      .catch(() => {
        setNotif({
          show: true,
          title: "Gagal Menghubungi Server",
          message: "Gagal menghubungi server",
          reload: false,
        });
      })
      .finally(() => {
        setShowAcceptModal(false);
        setSelectedMahasiswaId(null);
      });
  };

  const handleRejectMahasiswa = (id) => {
    const mhs = mahasiswaBimbingan.find((m) => m.id === id);
    if (!mhs) return;


    let ttuToReject = null;
    const ttu = mhs.ttu_status || {};

    if (ttu.ttu_1?.status === "submitted" || ttu.ttu_1?.status === "reviewed") {
      ttuToReject = "ttu_1";
    } else if (
      ttu.ttu_2?.status === "submitted" ||
      ttu.ttu_2?.status === "reviewed"
    ) {
      ttuToReject = "ttu_2";
    } else if (
      ttu.ttu_3?.status === "submitted" ||
      ttu.ttu_3?.status === "reviewed"
    ) {
      ttuToReject = "ttu_3";
    }

    if (!ttuToReject) {
      setNotif({
        show: true,
        title: "TTU Tidak Tersedia",
        message: "Tidak ada TTU yang perlu ditinjau saat ini",
        reload: false,
      });
      return;
    }

    setSelectedMahasiswaId(id);
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    const token = localStorage.getItem("sita_token");
    const mhs = mahasiswaBimbingan.find((m) => m.id === selectedMahasiswaId);
    if (!mhs) return;


    let ttuToReject = null;
    const ttu = mhs.ttu_status || {};

    if (ttu.ttu_1?.status === "submitted" || ttu.ttu_1?.status === "reviewed") {
      ttuToReject = "ttu_1";
    } else if (
      ttu.ttu_2?.status === "submitted" ||
      ttu.ttu_2?.status === "reviewed"
    ) {
      ttuToReject = "ttu_2";
    } else if (
      ttu.ttu_3?.status === "submitted" ||
      ttu.ttu_3?.status === "reviewed"
    ) {
      ttuToReject = "ttu_3";
    }

    if (!ttuToReject) return;

    fetch(`${API}/api/dosen/ttu/${ttuToReject}/reject`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mahasiswa_id: selectedMahasiswaId,
        reason: "Ditolak oleh pembimbing",
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setNotif({
            show: true,
            title: "TTU Berhasil Ditolak",
            message: res.message || "TTU berhasil ditolak",
            reload: true,
          });
        } else {
          setNotif({
            show: true,
            title: "Gagal Menolak TTU",
            message: res.message || "Gagal menolak TTU",
            reload: false,
          });
        }
      })
      .catch(() => {
        setNotif({
          show: true,
          title: "Gagal Menghubungi Server",
          message: "Gagal menghubungi server",
          reload: false,
        });
      })
      .finally(() => {
        setShowRejectModal(false);
        setSelectedMahasiswaId(null);
      });
  };

  const handleOpenDetail = (mhs, page = "pesan") => {
    if (page === "komentar") {
      navigate(`/dosen-mahasiswa/${mhs.id}/komentar`, {
        state: { mahasiswa: mhs },
      });
    } else {
      navigate(`/dosen-mahasiswa/${mhs.id}`, {
        state: { mahasiswa: mhs },
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
      <SidebarDosen
        activeMenu="mahasiswa-bimbingan"
        onMenuClick={(key) => {
          if (key === "dashboard") navigate("/dosen-dashboard");
          else if (key === "request-bimbingan")
            navigate("/dosen-request-bimbingan");
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
              Mahasiswa Bimbingan
            </h1>
            <p className="text-gray-600 mt-2">
              Daftar mahasiswa yang Anda bimbing
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
            <MahasiswaBimbinganView
              mahasiswaBimbingan={mahasiswaBimbingan}
              onAcceptMahasiswa={handleAcceptMahasiswa}
              onRejectMahasiswa={handleRejectMahasiswa}
              currentUserId={profile?._id || profile?.user_id}
              onOpenDetail={handleOpenDetail}
            />
          )}
        </div>
      </main>

      
      {showAcceptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => {
              setShowAcceptModal(false);
              setSelectedMahasiswaId(null);
            }}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Setujui TTU?
              </h3>
              <p className="text-slate-600 mb-6">
                Mahasiswa akan dapat melanjutkan ke tahap TTU berikutnya setelah
                disetujui.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => {
                    setShowAcceptModal(false);
                    setSelectedMahasiswaId(null);
                  }}
                  className="flex-1 px-4 py-2.5 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={confirmAccept}
                  className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
                >
                  Ya, Terima
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

  
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => {
              setShowRejectModal(false);
              setSelectedMahasiswaId(null);
            }}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Tolak TTU?
              </h3>
              <p className="text-slate-600 mb-6">
                Mahasiswa perlu mengunggah file baru untuk tahap yang sama.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setSelectedMahasiswaId(null);
                  }}
                  className="flex-1 px-4 py-2.5 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={confirmReject}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                >
                  Ya, Tolak
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal
        show={notif.show}
        title={notif.title}
        message={notif.message}
        type={notif.title.toLowerCase().includes("gagal") ? "error" : "success"}
        onClose={() => {
          setNotif({ show: false, title: "", message: "", reload: false });
          if (notif.reload) window.location.reload();
        }}
      />
    </div>
  );
}

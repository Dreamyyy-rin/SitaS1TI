import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SidebarKaprodi from "../../components/kaprodi/SidebarKaprodi";
import KaprodiManajemenDosen from "./KaprodiManajemenDosen";
import DashboardView from "../../components/kaprodi/DashboardView";
import RequestDosenView from "../../components/kaprodi/RequestDosenView";
import MahasiswaBimbinganView from "../../components/kaprodi/MahasiswaBimbinganView";
import DataAkunKaprodiView from "../../components/kaprodi/DataAkunKaprodiView";
import PanduanKaprodiView from "../../components/kaprodi/PanduanKaprodiView";
import RiwayatBimbinganView from "../../components/kaprodi/RiwayatBimbinganView";
import PlottingReviewerView from "../../components/kaprodi/PlottingReviewerView";

const KaprodiDashboard = () => {
  const [notification, setNotification] = useState({
    open: false,
    type: "info",
    title: "",
    message: "",
    onClose: null,
  });

  const showNotification = ({
    type = "info",
    title = "",
    message = "",
    onClose = null,
  }) => {
    setNotification({ open: true, type, title, message, onClose });
  };

  const closeNotification = () => {
    setNotification((prev) => {
      if (prev.onClose) prev.onClose();
      return { ...prev, open: false };
    });
  };
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [userData, setUserData] = useState(null);
  const [selectedDosen, setSelectedDosen] = useState({});
  const [selectedReviewers, setSelectedReviewers] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [availableDosen, setAvailableDosen] = useState([]);
  const [requestDosenBaru, setRequestDosenBaru] = useState([]);
  const [requestGantiDosen, setRequestGantiDosen] = useState([]);
  const [requestLoading, setRequestLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    total_request: 0,
    total_mahasiswa: 0,
    ttu_selesai: 0,
    total_dosen: 0,
  });
  const [mahasiswaBimbingan, setMahasiswaBimbingan] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [totalRequests, setTotalRequests] = useState(() => {
    const cached = localStorage.getItem("kaprodi_total_requests");
    return cached ? parseInt(cached, 10) : 0;
  });
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actedIds, setActedIds] = useState(new Set());

  const API = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

  useEffect(() => {
    const storedUser = localStorage.getItem("sita_user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    setSearchQuery("");
  }, [activeMenu]);

  useEffect(() => {
    const token = localStorage.getItem("sita_token");
    if (!token) {
      navigate("/login?role=kaprodi");
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    const loadAll = async () => {
      try {
        setRequestLoading(true);

        const [dosenRes, initialRes, changeRes, statsRes, mhsRes] =
          await Promise.all([
            fetch(`${API}/api/kaprodi/dosen-list`, { headers })
              .then((r) => r.json())
              .catch(() => ({})),
            fetch(`${API}/api/kaprodi/pembimbing-requests?type=initial`, {
              headers,
            })
              .then((r) => r.json())
              .catch(() => ({})),
            fetch(`${API}/api/kaprodi/pembimbing-requests?type=change`, {
              headers,
            })
              .then((r) => r.json())
              .catch(() => ({})),
            fetch(`${API}/api/kaprodi/dashboard-stats`, { headers })
              .then((r) => r.json())
              .catch(() => ({})),
            fetch(`${API}/api/kaprodi/mahasiswa`, { headers })
              .then((r) => r.json())
              .catch(() => ({})),
          ]);

        const dosenList = dosenRes.success ? dosenRes.data || [] : [];
        setAvailableDosen(dosenList);

        if (statsRes.success) setDashboardStats(statsRes.data);

        // Build mahasiswa bimbingan from real data
        if (mhsRes.success) {
          const mhsList = (mhsRes.data || []).map((m) => {
            const ttu = m.ttu_status || {};
            const p1 = m.pembimbing_1_id
              ? dosenList.find((d) => d._id === m.pembimbing_1_id)
              : null;
            const p2 = m.pembimbing_2_id
              ? dosenList.find((d) => d._id === m.pembimbing_2_id)
              : null;
            return {
              id: m._id,
              nama: m.nama || "-",
              nim: m.nim || "-",
              judul: m.judul || "-",
              prodi: m.prodi || "-",
              email: m.email || "-",
              dosen: p1 ? p1.nama : "-",
              dosen2: p2 ? p2.nama : "-",
              reviewer: m.reviewer || "-",
              ttu1: ttu.ttu_1?.status === "approved",
              ttu2: ttu.ttu_2?.status === "approved",
              ttu3: ttu.ttu_3?.status === "approved",
              ttu_status: ttu,
              tanggalSelesai: ttu.ttu_3?.approved_at
                ? new Date(ttu.ttu_3.approved_at).toLocaleDateString("id-ID")
                : "-",
              status:
                m.onboarding_status === "approved"
                  ? "active"
                  : m.onboarding_status,
              onboarding_status: m.onboarding_status,
              pembimbing_1_id: m.pembimbing_1_id,
              pembimbing_2_id: m.pembimbing_2_id,
              reviewer_id: m.reviewer_id,
            };
          });
          setMahasiswaBimbingan(mhsList);
        }

        const mapDosen = dosenList.reduce((acc, item) => {
          acc[item._id] = item;
          return acc;
        }, {});

        if (initialRes.success) {
          const normalizedInitial = (initialRes.data || []).map((req) => {
            const pembimbing1 = req.requested_pembimbing_1_id
              ? mapDosen[req.requested_pembimbing_1_id]?.nama
              : null;
            const pembimbing2 = req.requested_pembimbing_2_id
              ? mapDosen[req.requested_pembimbing_2_id]?.nama
              : null;
            return {
              id: req._id,
              nama: req.mahasiswa?.nama || "-",
              nim: req.mahasiswa?.nim || "-",
              judul: req.judul || "-",
              pembimbing1: pembimbing1 || "-",
              pembimbing2: pembimbing2 || "(Tidak ada)",
              tanggal: new Date(req.created_at).toLocaleDateString("id-ID"),
              raw: req,
            };
          });
          setRequestDosenBaru(normalizedInitial);

          if (changeRes.success) {
            const normalizedChange = (changeRes.data || []).map((req) => ({
              id: req._id,
              nama: req.mahasiswa?.nama || "-",
              nim: req.mahasiswa?.nim || "-",
              judul: req.judul || "-",
              dosenLama:
                req.requested_slot === "pembimbing_2"
                  ? mapDosen[req.current_pembimbing_2_id]?.nama || "-"
                  : mapDosen[req.current_pembimbing_1_id]?.nama || "-",
              dosenBaru: mapDosen[req.requested_pembimbing_1_id]?.nama || "-",
              alasan: req.alasan || "-",
              tanggal: new Date(req.created_at).toLocaleDateString("id-ID"),
              raw: req,
            }));
            setRequestGantiDosen(normalizedChange);

            // Initialize actedIds from requests where kaprodi has already acted
            const initialActed = new Set([
              ...normalizedInitial
                .filter((r) => r.raw?.status_kaprodi !== "pending")
                .map((r) => r.id),
              ...normalizedChange
                .filter((r) => r.raw?.status_kaprodi !== "pending")
                .map((r) => r.id),
            ]);
            setActedIds(initialActed);
          }
        }

        // Update total requests and cache it
        const total =
          (initialRes.data || []).length + (changeRes.data || []).length;
        setTotalRequests(total);
        localStorage.setItem("kaprodi_total_requests", total.toString());

        
        const allRequestActivities = [
          ...(initialRes.data || []).map((r) => ({
            id: `req-${r._id}`,
            type: "request",
            message: `${r.mahasiswa?.nama || "Mahasiswa"} mengajukan request dosen pembimbing`,
            time: new Date(r.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
            _date: new Date(r.created_at),
          })),
          ...(changeRes.data || []).map((r) => ({
            id: `chg-${r._id}`,
            type: "change",
            message: `${r.mahasiswa?.nama || "Mahasiswa"} mengajukan ganti dosen pembimbing`,
            time: new Date(r.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
            _date: new Date(r.created_at),
          })),
        ];

        setRecentActivities(
          allRequestActivities
            .sort((a, b) => b._date - a._date)
            .slice(0, 8)
            .map(({ _date, ...rest }) => rest),
        );
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setRequestLoading(false);
      }
    };

    loadAll();
  }, []);

  const riwayatBimbingan = mahasiswaBimbingan.filter(
    (m) => m.ttu1 && m.ttu2 && m.ttu3,
  );

  const handleDosenChange = (requestId, dosenName) => {
    setSelectedDosen((prev) => ({
      ...prev,
      [requestId]: dosenName,
    }));
  };

  const handleAccept = async (id) => {
    // Mark bimbingan as validated by kaprodi (informational only)
    const mhs = mahasiswaBimbingan.find((m) => m.id === id);
    if (mhs && mhs.ttu1 && mhs.ttu2 && mhs.ttu3) {
      showNotification({
        type: "success",
        title: "Validasi TTU",
        message: `Mahasiswa ${mhs.nama} sudah menyelesaikan seluruh TTU.`,
      });
    } else {
      showNotification({
        type: "error",
        title: "Validasi TTU",
        message: `Mahasiswa belum menyelesaikan seluruh TTU.`,
      });
    }
  };

  const handleChangePembimbing = async (mahasiswaId, slot, newDosenId) => {
    const token = localStorage.getItem("sita_token");
    try {
      const res = await fetch(`${API}/api/kaprodi/change-pembimbing`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mahasiswa_id: mahasiswaId,
          slot: slot,
          new_dosen_id: newDosenId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification({
          type: "success",
          title: "Berhasil",
          message: data.message,
        });
        // Refresh mahasiswa data
        const mhsRes = await fetch(`${API}/api/kaprodi/mahasiswa`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const mhsData = await mhsRes.json();
        if (mhsData.success) {
          const dosenList = availableDosen;
          const mhsList = (mhsData.data || []).map((m) => {
            const ttu = m.ttu_status || {};
            const p1 = m.pembimbing_1_id
              ? dosenList.find((d) => d._id === m.pembimbing_1_id)
              : null;
            const p2 = m.pembimbing_2_id
              ? dosenList.find((d) => d._id === m.pembimbing_2_id)
              : null;
            return {
              id: m._id,
              nama: m.nama || "-",
              nim: m.nim || "-",
              judul: m.judul || "-",
              prodi: m.prodi || "-",
              email: m.email || "-",
              dosen: p1 ? p1.nama : "-",
              dosen2: p2 ? p2.nama : "-",
              reviewer: m.reviewer || "-",
              ttu1: ttu.ttu_1?.status === "approved",
              ttu2: ttu.ttu_2?.status === "approved",
              ttu3: ttu.ttu_3?.status === "approved",
              ttu_status: ttu,
              tanggalSelesai: ttu.ttu_3?.approved_at
                ? new Date(ttu.ttu_3.approved_at).toLocaleDateString("id-ID")
                : "-",
              status:
                m.onboarding_status === "approved"
                  ? "active"
                  : m.onboarding_status,
              onboarding_status: m.onboarding_status,
              pembimbing_1_id: m.pembimbing_1_id,
              pembimbing_2_id: m.pembimbing_2_id,
              reviewer_id: m.reviewer_id,
            };
          });
          setMahasiswaBimbingan(mhsList);
        }
      } else {
        showNotification({
          type: "error",
          title: "Gagal",
          message: data.message || "Gagal mengganti pembimbing",
        });
      }
    } catch (err) {
      console.error(err);
      showNotification({
        type: "error",
        title: "Gagal",
        message: "Gagal menghubungi server",
      });
    }
  };

  const handleApprove = (id) => {
    setSelectedRequestId(id);
    setShowApproveModal(true);
  };

  const confirmApprove = async () => {
    const token = localStorage.getItem("sita_token");
    const id = selectedRequestId;

    try {
      const res = await fetch(
        `${API}/api/kaprodi/pembimbing-requests/${id}/approve`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (data.success) {
        setActedIds((prev) => {
          const next = new Set(prev);
          next.add(id);
          return next;
        });
        showNotification({
          type: "success",
          title: "Permintaan Disetujui",
          message:
            "Bimbingan akan disetujui ketika dosen juga sudah menyetujui.",
        });

        const mhsRes = await fetch(`${API}/api/kaprodi/mahasiswa`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const mhsData = await mhsRes.json();
        if (mhsData.success) {
          const dosenRes = await fetch(`${API}/api/kaprodi/dosen-list`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const dosenData = await dosenRes.json();
          const dosenList = dosenData.success ? dosenData.data || [] : [];

          const mhsList = (mhsData.data || []).map((m) => {
            const ttu = m.ttu_status || {};
            const p1 = m.pembimbing_1_id
              ? dosenList.find((d) => d._id === m.pembimbing_1_id)
              : null;
            const p2 = m.pembimbing_2_id
              ? dosenList.find((d) => d._id === m.pembimbing_2_id)
              : null;
            return {
              id: m._id,
              nama: m.nama || "-",
              nim: m.nim || "-",
              judul: m.judul || "-",
              prodi: m.prodi || "-",
              email: m.email || "-",
              dosen: p1 ? p1.nama : "-",
              dosen2: p2 ? p2.nama : "-",
              reviewer: m.reviewer || "-",
              ttu1: ttu.ttu_1?.status === "approved",
              ttu2: ttu.ttu_2?.status === "approved",
              ttu3: ttu.ttu_3?.status === "approved",
              ttu_status: ttu,
              tanggalSelesai: ttu.ttu_3?.approved_at
                ? new Date(ttu.ttu_3.approved_at).toLocaleDateString("id-ID")
                : "-",
              status:
                m.onboarding_status === "approved"
                  ? "active"
                  : m.onboarding_status,
              onboarding_status: m.onboarding_status,
              pembimbing_1_id: m.pembimbing_1_id,
              pembimbing_2_id: m.pembimbing_2_id,
              reviewer_id: m.reviewer_id,
            };
          });
          setMahasiswaBimbingan(mhsList);
        }
      } else {
        showNotification({
          type: "error",
          title: "Gagal Approve",
          message: data.message || data.error || "Gagal approve request",
        });
      }
    } catch (err) {
      console.error(err);
      showNotification({
        type: "error",
        title: "Gagal Approve",
        message: "Gagal menghubungi server",
      });
    } finally {
      setShowApproveModal(false);
      setSelectedRequestId(null);
    }
  };

  const handleReject = (id) => {
    setSelectedRequestId(id);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    const token = localStorage.getItem("sita_token");
    const id = selectedRequestId;

    try {
      const res = await fetch(
        `${API}/api/kaprodi/pembimbing-requests/${id}/reject`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ alasan: rejectReason }),
        },
      );
      const data = await res.json();
      if (data.success) {
        setActedIds((prev) => {
          const next = new Set(prev);
          next.add(id);
          return next;
        });
        showNotification({
          type: "success",
          title: "Permintaan Ditolak",
          message: "Permintaan bimbingan mahasiswa berhasil ditolak.",
        });
        const newTotal = Math.max(0, totalRequests - 1);
        setTotalRequests(newTotal);
        localStorage.setItem("kaprodi_total_requests", newTotal.toString());
      } else {
        showNotification({
          type: "error",
          title: "Gagal Reject",
          message: data.message || data.error || "Gagal reject request",
        });
      }
    } catch (err) {
      console.error(err);
      showNotification({
        type: "error",
        title: "Gagal Reject",
        message: "Gagal menghubungi server",
      });
    } finally {
      setShowRejectModal(false);
      setSelectedRequestId(null);
      setRejectReason("");
    }
  };

  const handleReviewerChange = (mahasiswaId, reviewerName) => {
    setSelectedReviewers((prev) => ({
      ...prev,
      [mahasiswaId]: reviewerName,
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("sita_token");
    localStorage.removeItem("sita_user");
    navigate("/login?role=kaprodi");
  };

  const getPageTitle = () => {
    switch (activeMenu) {
      case "dashboard":
        return "Dasbor Kaprodi";
      case "request-pembimbing":
        return "Permintaan Pembimbing";
      case "plotting":
        return "Penempatan Peninjau";
      case "mahasiswa-bimbingan":
        return "Mahasiswa Bimbingan";
      case "riwayat":
        return "Riwayat Bimbingan";
      case "data-dosen":
        return "Manajemen Dosen";
      case "data-akun":
        return "Data Akun";
      case "panduan":
        return "Panduan";
      default:
        return "Dasbor Kaprodi";
    }
  };

  const getPageDescription = () => {
    switch (activeMenu) {
      case "dashboard":
        return userData
          ? `Selamat datang, ${userData.nama || "Kaprodi"}`
          : "Pantau aktivitas dan statistik program studi dari satu tempat.";
      case "request-pembimbing":
        return "Tinjau pengajuan pembimbing baru dan pergantian pembimbing dari mahasiswa.";
      case "plotting":
        return "Tetapkan dosen peninjau untuk mahasiswa tanpa benturan dengan dosen pembimbing.";
      case "mahasiswa-bimbingan":
        return "Pantau progres mahasiswa aktif dan kelola perubahan pembimbing bila diperlukan.";
      case "riwayat":
        return "Lihat arsip mahasiswa yang telah menyelesaikan seluruh tahapan TTU.";
      case "data-dosen":
        return "Pantau ketersediaan dosen pembimbing beserta status dan beban bimbingannya.";
      case "data-akun":
        return "Kelola profil kaprodi dan keamanan akun.";
      case "panduan":
        return "Pelajari fungsi setiap menu kaprodi dan alur kerja yang tersedia.";
      default:
        return "Pantau aktivitas dan statistik program studi dari satu tempat.";
    }
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return (
          <DashboardView
            stats={dashboardStats}
            recentActivities={recentActivities}
          />
        );
      case "request-pembimbing":
        return (
          <RequestDosenView
            requestDosenBaru={requestDosenBaru}
            requestGantiDosen={requestGantiDosen}
            availableDosen={availableDosen}
            selectedDosen={selectedDosen}
            onDosenChange={handleDosenChange}
            onApprove={handleApprove}
            onReject={handleReject}
            actedIds={actedIds}
          />
        );
      case "plotting":
        return (
          <PlottingReviewerView
            mahasiswaBimbingan={mahasiswaBimbingan}
            availableDosen={availableDosen}
            selectedReviewers={selectedReviewers}
            onReviewerChange={handleReviewerChange}
          />
        );
      case "mahasiswa-bimbingan":
        return (
          <MahasiswaBimbinganView
            mahasiswaBimbingan={mahasiswaBimbingan}
            availableDosen={availableDosen}
            userData={userData}
            onAccept={handleAccept}
            onChangePembimbing={handleChangePembimbing}
          />
        );
      case "riwayat":
        return (
          <RiwayatBimbinganView
            riwayatBimbingan={riwayatBimbingan}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        );
      case "data-dosen":
        return <KaprodiManajemenDosen />;
      case "data-akun":
        return <DataAkunKaprodiView userData={userData} />;
      case "panduan":
        return <PanduanKaprodiView />;
      default:
        return <DashboardView recentActivities={recentActivities} />;
    }
  };

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-sans text-slate-600">
      <SidebarKaprodi
        activeMenu={activeMenu}
        onMenuClick={setActiveMenu}
        onLogout={handleLogout}
        user={userData}
        totalRequests={totalRequests}
      />
      <main className="flex-1 ml-16 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto pb-10">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#0B2F7F]">
              {getPageTitle()}
            </h1>
            <p className="text-slate-500 mt-2">{getPageDescription()}</p>
          </div>
          {renderContent()}
        </div>
      </main>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-all"
            onClick={() => setShowApproveModal(false)}
          ></div>

          <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 border border-slate-100 transform transition-all scale-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 ring-4 ring-green-50/50">
                <CheckCircle
                  className="w-8 h-8 text-green-500"
                  strokeWidth={2}
                />
              </div>

              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Setujui Request Pembimbing?
              </h3>

              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Permintaan akan diproses setelah dosen pembimbing menyetujui.
              </p>

              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={confirmApprove}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all transform active:scale-95"
                >
                  Ya, Setujui
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-all"
            onClick={() => setShowRejectModal(false)}
          ></div>

          <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 border border-slate-100 transform transition-all scale-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 ring-4 ring-red-50/50">
                <XCircle className="w-8 h-8 text-red-500" strokeWidth={2} />
              </div>

              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Tolak Request Pembimbing?
              </h3>

              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Request ini akan ditolak dan dihapus dari daftar.
              </p>

              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={confirmReject}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all transform active:scale-95"
                >
                  Ya, Tolak
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Notification Modal */}
      {notification.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-all"
            onClick={closeNotification}
          ></div>
          <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 border border-slate-100 transform transition-all scale-100">
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ring-4 ${
                  notification.type === "success"
                    ? "bg-green-50 ring-green-50/50"
                    : notification.type === "error"
                      ? "bg-red-50 ring-red-50/50"
                      : "bg-blue-50 ring-blue-50/50"
                }`}
              >
                {notification.type === "success" ? (
                  <CheckCircle
                    className="w-8 h-8 text-green-500"
                    strokeWidth={2}
                  />
                ) : notification.type === "error" ? (
                  <XCircle className="w-8 h-8 text-red-500" strokeWidth={2} />
                ) : (
                  <Info className="w-8 h-8 text-blue-500" strokeWidth={2} />
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                {notification.title}
              </h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                {notification.message}
              </p>
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={closeNotification}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KaprodiDashboard;

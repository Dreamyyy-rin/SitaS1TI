import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarKaprodi from "../../components/kaprodi/SidebarKaprodi";
import KaprodiManajemenDosen from "./KaprodiManajemenDosen";
import KaprodiDeadlineTTU from "./KaprodiDeadlineTTU";
import DashboardView from "../../components/kaprodi/DashboardView";
import RequestDosenView from "../../components/kaprodi/RequestDosenView";
import MahasiswaBimbinganView from "../../components/kaprodi/MahasiswaBimbinganView";
import DataAkunKaprodiView from "../../components/kaprodi/DataAkunKaprodiView";
import PanduanKaprodiView from "../../components/kaprodi/PanduanKaprodiView";
import RiwayatBimbinganView from "../../components/kaprodi/RiwayatBimbinganView";
import PlottingReviewerView from "../../components/kaprodi/PlottingReviewerView";
import ReviewView from "../../components/kaprodi/ReviewView";

const KaprodiDashboard = () => {
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
  const [dashboardStats, setDashboardStats] = useState({ total_request: 0, total_mahasiswa: 0, ttu_selesai: 0, total_dosen: 0 });
  const [mahasiswaBimbingan, setMahasiswaBimbingan] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

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
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    const loadAll = async () => {
      try {
        setRequestLoading(true);

        const [dosenRes, initialRes, changeRes, statsRes, mhsRes] = await Promise.all([
          fetch(`${API}/api/kaprodi/dosen-list`, { headers }).then(r => r.json()).catch(() => ({})),
          fetch(`${API}/api/kaprodi/pembimbing-requests?type=initial`, { headers }).then(r => r.json()).catch(() => ({})),
          fetch(`${API}/api/kaprodi/pembimbing-requests?type=change`, { headers }).then(r => r.json()).catch(() => ({})),
          fetch(`${API}/api/kaprodi/dashboard-stats`, { headers }).then(r => r.json()).catch(() => ({})),
          fetch(`${API}/api/kaprodi/mahasiswa`, { headers }).then(r => r.json()).catch(() => ({})),
        ]);

        const dosenList = dosenRes.success ? (dosenRes.data || []) : [];
        setAvailableDosen(dosenList);

        if (statsRes.success) setDashboardStats(statsRes.data);

        // Build mahasiswa bimbingan from real data
        if (mhsRes.success) {
          const mhsList = (mhsRes.data || []).map(m => {
            const ttu = m.ttu_status || {};
            const p1 = m.pembimbing_1_id ? dosenList.find(d => d._id === m.pembimbing_1_id) : null;
            const p2 = m.pembimbing_2_id ? dosenList.find(d => d._id === m.pembimbing_2_id) : null;
            return {
              id: m._id,
              nama: m.nama || "-",
              nim: m.nim || "-",
              prodi: m.prodi || "-",
              email: m.email || "-",
              dosen: p1 ? p1.nama : "-",
              dosen2: p2 ? p2.nama : "-",
              reviewer: m.reviewer || "-",
              ttu1: ttu.ttu_1?.status === "approved",
              ttu2: ttu.ttu_2?.status === "approved",
              ttu3: ttu.ttu_3?.status === "approved",
              ttu_status: ttu,
              status: m.onboarding_status === "approved" ? "active" : m.onboarding_status,
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
            const pembimbing1 = req.requested_pembimbing_1_id ? mapDosen[req.requested_pembimbing_1_id]?.nama : null;
            const pembimbing2 = req.requested_pembimbing_2_id ? mapDosen[req.requested_pembimbing_2_id]?.nama : null;
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
        }

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
            dosenBaru:
              mapDosen[req.requested_pembimbing_1_id]?.nama || "-",
            alasan: req.alasan || "-",
            tanggal: new Date(req.created_at).toLocaleDateString("id-ID"),
            raw: req,
          }));
          setRequestGantiDosen(normalizedChange);
        }

        // Build recent activities from requests
        const allRequests = [
          ...(initialRes.data || []).map(r => ({ ...r, _type: "request" })),
          ...(changeRes.data || []).map(r => ({ ...r, _type: "change" })),
        ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);

        setRecentActivities(allRequests.map((r, i) => ({
          id: `act-${i}`,
          type: r._type,
          message: r._type === "change"
            ? `${r.mahasiswa?.nama || "Mahasiswa"} mengajukan ganti dosen pembimbing`
            : `${r.mahasiswa?.nama || "Mahasiswa"} mengajukan request dosen pembimbing`,
          time: new Date(r.created_at).toLocaleDateString("id-ID"),
        })));

      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setRequestLoading(false);
      }
    };

    loadAll();
  }, []);

  const riwayatBimbingan = mahasiswaBimbingan.filter(m => m.ttu1 && m.ttu2 && m.ttu3);

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
      alert(`Mahasiswa ${mhs.nama} sudah menyelesaikan seluruh TTU.`);
    } else {
      alert(`Mahasiswa belum menyelesaikan seluruh TTU.`);
    }
  };

  const handleApprove = async (id) => {
    const token = localStorage.getItem("sita_token");
    if (!confirm("Apakah Anda yakin menyetujui request pembimbing ini?")) {
      return;
    }
    
    try {
      const res = await fetch(`${API}/api/kaprodi/pembimbing-requests/${id}/approve`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        alert("✓ Persetujuan kaprodi berhasil. Request kini menunggu persetujuan dosen pembimbing terkait.");
        // Remove from list and reload data
        setRequestDosenBaru((prev) => prev.filter((req) => req.id !== id));
        setRequestGantiDosen((prev) => prev.filter((req) => req.id !== id));
        
        // Reload mahasiswa data to reflect changes
        const mhsRes = await fetch(`${API}/api/kaprodi/mahasiswa`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        const mhsData = await mhsRes.json();
        if (mhsData.success) {
          const dosenRes = await fetch(`${API}/api/kaprodi/dosen-list`, { 
            headers: { Authorization: `Bearer ${token}` } 
          });
          const dosenData = await dosenRes.json();
          const dosenList = dosenData.success ? (dosenData.data || []) : [];
          
          const mhsList = (mhsData.data || []).map(m => {
            const ttu = m.ttu_status || {};
            const p1 = m.pembimbing_1_id ? dosenList.find(d => d._id === m.pembimbing_1_id) : null;
            const p2 = m.pembimbing_2_id ? dosenList.find(d => d._id === m.pembimbing_2_id) : null;
            return {
              id: m._id,
              nama: m.nama || "-",
              nim: m.nim || "-",
              prodi: m.prodi || "-",
              email: m.email || "-",
              dosen: p1 ? p1.nama : "-",
              dosen2: p2 ? p2.nama : "-",
              reviewer: m.reviewer || "-",
              ttu1: ttu.ttu_1?.status === "approved",
              ttu2: ttu.ttu_2?.status === "approved",
              ttu3: ttu.ttu_3?.status === "approved",
              ttu_status: ttu,
              status: m.onboarding_status === "approved" ? "active" : m.onboarding_status,
              onboarding_status: m.onboarding_status,
              pembimbing_1_id: m.pembimbing_1_id,
              pembimbing_2_id: m.pembimbing_2_id,
              reviewer_id: m.reviewer_id,
            };
          });
          setMahasiswaBimbingan(mhsList);
        }
      } else {
        alert("❌ " + (data.message || data.error || "Gagal approve request"));
      }
    } catch (err) {
      console.error(err);
      alert("❌ Gagal menghubungi server");
    }
  };

  const handleReject = async (id) => {
    const token = localStorage.getItem("sita_token");
    const alasan = prompt("Alasan penolakan (opsional):");
    if (alasan === null) return; // User cancelled
    
    try {
      const res = await fetch(`${API}/api/kaprodi/pembimbing-requests/${id}/reject`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ alasan }),
      });
      const data = await res.json();
      if (data.success) {
        alert("✓ Request pembimbing ditolak.");
        setRequestDosenBaru((prev) => prev.filter((req) => req.id !== id));
        setRequestGantiDosen((prev) => prev.filter((req) => req.id !== id));
      } else {
        alert("❌ " + (data.message || data.error || "Gagal reject request"));
      }
    } catch (err) {
      console.error(err);
      alert("❌ Gagal menghubungi server");
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
        return "Dashboard Kaprodi";
      case "request-pembimbing":
        return "Request Pembimbing";
      case "plotting":
        return "Plotting Reviewer";
      case "mahasiswa-bimbingan":
        return "Mahasiswa Bimbingan";
      case "riwayat":
        return "Riwayat Bimbingan";
      case "data-dosen":
        return "Manajemen Dosen";
      case "review":
        return "Review";
      case "deadline":
        return "Deadline TTU";
      case "data-akun":
        return "Data Akun";
      case "panduan":
        return "Panduan";
      default:
        return "Dashboard Kaprodi";
    }
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return <DashboardView stats={dashboardStats} recentActivities={recentActivities} />;
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
            userData={userData}
            onAccept={handleAccept}
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
      case "review":
        return <ReviewView mahasiswaBimbingan={mahasiswaBimbingan} />;
      case "deadline":
        return <KaprodiDeadlineTTU />;
      case "data-akun":
        return <DataAkunKaprodiView userData={userData} />;
      case "panduan":
        return <PanduanKaprodiView />;
      default:
        return <DashboardView recentActivities={recentActivities} />;
    }
  };

  const totalRequests = requestDosenBaru.length + requestGantiDosen.length;

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-sans text-slate-600">
      <SidebarKaprodi
        activeMenu={activeMenu}
        onMenuClick={setActiveMenu}
        onLogout={handleLogout}
        user={userData}
        totalRequests={totalRequests}
      />
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto pb-10">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#0B2F7F]">
              {getPageTitle()}
            </h1>
            {activeMenu === "dashboard" && userData && (
              <p className="text-gray-600 mt-2">
                Selamat datang, {userData.nama || "Kaprodi"}
              </p>
            )}
          </div>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default KaprodiDashboard;

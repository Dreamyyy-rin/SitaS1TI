import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import SidebarKaprodi from "../../components/kaprodi/SidebarKaprodi";
import KaprodiManajemenDosen from "./KaprodiManajemenDosen";
import DashboardView from "../../components/kaprodi/DashboardView";
import RequestDosenView from "../../components/kaprodi/RequestDosenView";
import MahasiswaBimbinganView from "../../components/kaprodi/MahasiswaBimbinganView";
import DataAkunKaprodiView from "../../components/kaprodi/DataAkunKaprodiView";
import PanduanKaprodiView from "../../components/kaprodi/PanduanKaprodiView";
import RiwayatBimbinganView from "../../components/kaprodi/RiwayatBimbinganView";
import PlottingReviewerView from "../../components/kaprodi/PlottingReviewerView";
import ReviewView from "../../components/kaprodi/ReviewView";

const KaprodiDashboard = () => {
  useEffect(() => {
    const token = localStorage.getItem("sita_token");
    // Fetch mahasiswa
    fetch(`${API}/api/kaprodi/mahasiswa`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setMahasiswaBimbingan(res.data || []);
      });

    // Fetch dosen
    fetch(`${API}/api/kaprodi/dosen-list`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setAvailableDosen(res.data || []);
      });
  }, []);
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

  const [modalMsg, setModalMsg] = useState("");
  const [modalType, setModalType] = useState("info");
  const [modalTitle, setModalTitle] = useState("");
  const [showModal, setShowModal] = useState(false);

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

  const handleDosenChange = (requestId, dosenName) => {
    setSelectedDosen((prev) => ({
      ...prev,
      [requestId]: dosenName,
    }));
  };

  const handleReviewerChange = (mahasiswaId, reviewerName) => {
    setSelectedReviewers((prev) => ({
      ...prev,
      [mahasiswaId]: reviewerName,
    }));
  };

  const handleAccept = (id) => {
    const mhs = mahasiswaBimbingan.find((m) => m.id === id);

    if (mhs && mhs.ttu1 && mhs.ttu2 && mhs.ttu3) {
      setModalTitle("Validasi TTU");
      setModalMsg(`Mahasiswa ${mhs.nama} sudah menyelesaikan seluruh TTU.`);
      setModalType("success");
    } else {
      setModalTitle("Validasi TTU");
      setModalMsg("Mahasiswa belum menyelesaikan seluruh TTU.");
      setModalType("error");
    }

    setShowModal(true);
  };

  const handleApprove = (id) => {
    setSelectedRequestId(id);
    setShowApproveModal(true);
  };

  const handleReject = (id) => {
    setSelectedRequestId(id);
    setRejectReason("");
    setShowRejectModal(true);
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
          />
        );

      case "riwayat":
        return (
          <RiwayatBimbinganView
            riwayatBimbingan={mahasiswaBimbingan}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        );

      case "data-dosen":
        return <KaprodiManajemenDosen />;

      case "review":
        return <ReviewView mahasiswaBimbingan={mahasiswaBimbingan} />;

      case "data-akun":
        return <DataAkunKaprodiView userData={userData} />;

      case "panduan":
        return <PanduanKaprodiView />;

      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-sans text-slate-600">
      <SidebarKaprodi
        activeMenu={activeMenu}
        onMenuClick={(key, view) => {
          setActiveMenu(key);
        }}
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowModal(false)}
          ></div>

          <div className="relative bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
            <h3 className="text-lg font-bold mb-2">{modalTitle}</h3>

            <p className="text-gray-600 mb-4">{modalMsg}</p>

            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KaprodiDashboard;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarKaprodi from "../../components/kaprodi/SidebarKaprodi";
import KaprodiManajemenDosen from "./KaprodiManajemenDosen";
import KaprodiDeadlineTTU from "./KaprodiDeadlineTTU";
import DashboardView from "../../components/kaprodi/DashboardView";
import RequestBimbinganView from "../../components/kaprodi/RequestBimbinganView";
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

  useEffect(() => {
    const storedUser = localStorage.getItem("sita_user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

 
  useEffect(() => {
    setSearchQuery("");
  }, [activeMenu]);

  //dummy data untuk dosen yang tersedia
  const availableDosen = [
    "Dr. Ahmad Fauzi, M.Kom",
    "Dr. Sri Wahyuni, M.T",
    "Dr. Budi Hartono, M.Kom",
    "Dr. Siti Aminah, M.Kom",
    "Dr. Rudi Setiawan, M.T",
    "Dr. Dewi Lestari, M.Kom",
    "Dr. Eko Prasetyo, M.T",
    "Dr. Linda Wijaya, M.Kom",
  ];

  //dummy data aktivitas terbaru
  const recentActivities = [
    {
      id: 1,
      type: "request",
      message: "Andi Wijaya mengajukan request dosen pembimbing",
      time: "2 jam yang lalu",
    },
    {
      id: 2,
      type: "change",
      message: "Siti Nurhaliza mengajukan ganti dosen pembimbing",
      time: "5 jam yang lalu",
    },
    {
      id: 3,
      type: "complete",
      message: "Budi Santoso menyelesaikan TTU 3",
      time: "1 hari yang lalu",
    },
    {
      id: 4,
      type: "request",
      message: "Maya Kusuma mengajukan request dosen pembimbing",
      time: "2 hari yang lalu",
    },
  ];

  //dummy data request dosen baru
  const requestDosenBaru = [
    {
      id: 1,
      nama: "Andi Wijaya",
      nim: "200411100001",
      judul: "Sistem Informasi Akademik Berbasis Web",
      dosenDiajukan: "Dr. Ahmad Fauzi, M.Kom",
      tanggal: "2024-01-15",
    },
    {
      id: 2,
      nama: "Maya Kusuma",
      nim: "200411100012",
      judul: "Aplikasi Mobile untuk Manajemen Tugas",
      dosenDiajukan: "",
      tanggal: "2024-01-16",
    },
    {
      id: 4,
      nama: "Budi Santoso",
      nim: "200411100020",
      judul: "Implementasi Blockchain untuk E-Voting",
      dosenDiajukan: "Dr. Sri Wahyuni, M.T",
      tanggal: "2024-01-17",
    },
  ];

  //dummy data untuk ganti dosen
  const requestGantiDosen = [
    {
      id: 3,
      nama: "Siti Nurhaliza",
      nim: "200411100005",
      judul: "Analisis Sentimen Media Sosial",
      dosenLama: "Dr. Budi Hartono, M.Kom",
      dosenBaru: "Dr. Ahmad Fauzi, M.Kom",
      alasan: "Topik penelitian lebih sesuai dengan expertise dosen baru",
      tanggal: "2024-01-14",
    },
  ];

  //dummy data untuk request bimbingan
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

  //dummy data mahasiswa bimbingan
  const mahasiswaBimbingan = [
    {
      id: 1,
      nama: "Rudi Setiawan",
      nim: "200411100003",
      judul: "Implementasi Machine Learning untuk Prediksi",
      dosen: "Dr. Ahmad Fauzi, M.Kom",
      reviewer: "Dr. Sri Wahyuni, M.T",
      ttu1: true,
      ttu2: false,
      ttu3: false,
      status: "active",
    },
    {
      id: 2,
      nama: "Dewi Lestari",
      nim: "200411100007",
      judul: "Sistem E-Commerce dengan React",
      dosen: "Dr. Sri Wahyuni, M.T",
      reviewer: "",
      ttu1: true,
      ttu2: true,
      ttu3: false,
      status: "active",
    },
    {
      id: 3,
      nama: "Eko Prasetyo",
      nim: "200411100009",
      judul: "Aplikasi IoT untuk Smart Home",
      dosen: "Dr. Budi Hartono, M.Kom",
      reviewer: "Dr. Dewi Lestari, M.Kom",
      ttu1: true,
      ttu2: true,
      ttu3: true,
      status: "active",
    },
    {
      id: 4,
      nama: "Linda Wijaya",
      nim: "200411100011",
      judul: "Blockchain untuk Sistem Voting",
      dosen: "Dr. Ahmad Fauzi, M.Kom",
      reviewer: "",
      ttu1: false,
      ttu2: false,
      ttu3: false,
      status: "active",
    },
  ];

  //dummy data riwayat bimbingan
  const riwayatBimbingan = [
    {
      id: 1,
      nama: "Agus Santoso",
      nim: "200411100002",
      judul: "Sistem Pakar Diagnosa Penyakit",
      dosen: "Dr. Ahmad Fauzi, M.Kom",
      ttu1: true,
      ttu2: true,
      ttu3: true,
      tanggalSelesai: "2023-12-20",
    },
    {
      id: 2,
      nama: "Fitri Handayani",
      nim: "200411100006",
      judul: "Aplikasi Augmented Reality Edukasi",
      dosen: "Dr. Sri Wahyuni, M.T",
      ttu1: true,
      ttu2: true,
      ttu3: true,
      tanggalSelesai: "2023-12-18",
    },
    {
      id: 3,
      nama: "Hendra Gunawan",
      nim: "200411100010",
      judul: "Sistem Rekomendasi Berbasis Collaborative Filtering",
      dosen: "Dr. Budi Hartono, M.Kom",
      ttu1: true,
      ttu2: true,
      ttu3: true,
      tanggalSelesai: "2023-12-15",
    },
  ];

  const handleDosenChange = (requestId, dosenName) => {
    setSelectedDosen((prev) => ({
      ...prev,
      [requestId]: dosenName,
    }));
  };

  const handleAccept = (id) => {
    alert(
      `Mahasiswa dengan ID ${id} telah diacc dan dipindahkan ke Riwayat Bimbingan`,
    );
  };

  const handleApprove = (id, type) => {
    alert(`Request ${type} dengan ID ${id} disetujui`);
  };

  const handleReject = (id, type) => {
    alert(`Request ${type} dengan ID ${id} ditolak`);
  };

  const handleAcceptRequestBimbingan = (id) => {
    alert(
      `Request bimbingan dari mahasiswa dengan ID ${id} diterima. Dosen akan menerima notifikasi untuk persetujuan.`,
    );
  };

  const handleRejectRequestBimbingan = (id) => {
    alert(`Request bimbingan dari mahasiswa dengan ID ${id} ditolak.`);
  };

  const handleReviewerChange = (mahasiswaId, reviewerName) => {
    setSelectedReviewers((prev) => ({
      ...prev,
      [mahasiswaId]: reviewerName,
    }));
  };

  const handleSavePlotting = () => {
    alert("Plotting reviewer berhasil disimpan!");
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
      case "request-bimbingan":
        return "Request Bimbingan";
      case "request-dosen":
        return "Request Dosen";
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
        return <DashboardView recentActivities={recentActivities} />;
      case "request-bimbingan":
        return (
          <RequestBimbinganView
            requestBimbingan={requestBimbingan}
            onAccept={handleAcceptRequestBimbingan}
            onReject={handleRejectRequestBimbingan}
          />
        );
      case "request-dosen":
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
            onSavePlotting={handleSavePlotting}
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

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-sans text-slate-600">
      <SidebarKaprodi
        activeMenu={activeMenu}
        onMenuClick={setActiveMenu}
        onLogout={handleLogout}
        user={userData}
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

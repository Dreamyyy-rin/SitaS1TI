import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Users, FileText, CheckCircle, Clock } from "lucide-react";
import SidebarKaprodi from "../components/SidebarKaprodi";

const KaprodiDashboard = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [userData, setUserData] = useState(null);
  const [selectedDosen, setSelectedDosen] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem("sita_user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

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

  //dummy data mahasiswa bimbingan
  const mahasiswaBimbingan = [
    {
      id: 1,
      nama: "Rudi Setiawan",
      nim: "200411100003",
      judul: "Implementasi Machine Learning untuk Prediksi",
      dosen: "Dr. Ahmad Fauzi, M.Kom",
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

  const getPageTitle = () => {
    switch (activeMenu) {
      case "dashboard":
        return "Dashboard Kaprodi";
      case "request-dosen":
        return "Request Dosen";
      case "mahasiswa-bimbingan":
        return "Mahasiswa Bimbingan";
      case "riwayat":
        return "Riwayat Bimbingan";
      case "data-akun":
        return "Data Akun";
      case "panduan":
        return "Panduan";
      default:
        return "Dashboard Kaprodi";
    }
  };

  const DashboardView = () => (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Request</p>
              <p className="text-2xl font-bold text-[#0B2F7F] mt-1">3</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-[#0B2F7F]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Mahasiswa Aktif</p>
              <p className="text-2xl font-bold text-[#0B2F7F] mt-1">4</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">TTU Selesai</p>
              <p className="text-2xl font-bold text-[#0B2F7F] mt-1">3</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Dosen</p>
              <p className="text-2xl font-bold text-[#0B2F7F] mt-1">8</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <FileText className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-[#0B2F7F] mb-4">
          Aktivitas Terbaru
        </h3>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 pb-3 border-b last:border-b-0"
            >
              <div
                className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === "request"
                    ? "bg-blue-500"
                    : activity.type === "change"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                }`}
              ></div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const RequestDosenView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-[#0B2F7F] mb-4">
          Request Dosen Pembimbing
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Nama
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  NIM
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Judul
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Dosen Diajukan
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Tanggal
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {requestDosenBaru.map((req) => (
                <tr key={req.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{req.nama}</td>
                  <td className="px-4 py-3 text-sm">{req.nim}</td>
                  <td className="px-4 py-3 text-sm">{req.judul}</td>
                  <td className="px-4 py-3 text-sm">
                    {req.dosenDiajukan ? (
                      <span className="text-gray-800">{req.dosenDiajukan}</span>
                    ) : (
                      <select
                        value={selectedDosen[req.id] || ""}
                        onChange={(e) =>
                          handleDosenChange(req.id, e.target.value)
                        }
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2F7F]"
                      >
                        <option value="">Belum dipilih</option>
                        {availableDosen.map((dosen, idx) => (
                          <option key={idx} value={dosen}>
                            {dosen}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">{req.tanggal}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleApprove(req.id, "dosen baru")}
                        className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                      >
                        Setuju
                      </button>
                      <button
                        onClick={() => handleReject(req.id, "dosen baru")}
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                      >
                        Tolak
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-[#0B2F7F] mb-4">
          Request Ganti Dosen Pembimbing
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Nama
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  NIM
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Judul
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Dosen Lama
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Dosen Baru
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Alasan
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Tanggal
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {requestGantiDosen.map((req) => (
                <tr key={req.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{req.nama}</td>
                  <td className="px-4 py-3 text-sm">{req.nim}</td>
                  <td className="px-4 py-3 text-sm">{req.judul}</td>
                  <td className="px-4 py-3 text-sm">{req.dosenLama}</td>
                  <td className="px-4 py-3 text-sm">{req.dosenBaru}</td>
                  <td className="px-4 py-3 text-sm">{req.alasan}</td>
                  <td className="px-4 py-3 text-sm">{req.tanggal}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleApprove(req.id, "ganti dosen")}
                        className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                      >
                        Setuju
                      </button>
                      <button
                        onClick={() => handleReject(req.id, "ganti dosen")}
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                      >
                        Tolak
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const MahasiswaBimbinganView = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-[#0B2F7F] mb-4">
        Mahasiswa Bimbingan
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Nama
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                NIM
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Judul
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Dosen Pembimbing
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                TTU 1
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                TTU 2
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                TTU 3
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {mahasiswaBimbingan.map((mhs) => (
              <tr key={mhs.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{mhs.nama}</td>
                <td className="px-4 py-3 text-sm">{mhs.nim}</td>
                <td className="px-4 py-3 text-sm">{mhs.judul}</td>
                <td className="px-4 py-3 text-sm">{mhs.dosen}</td>
                <td className="px-4 py-3 text-center">
                  {mhs.ttu1 ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  ) : (
                    <Clock className="w-5 h-5 text-gray-400 mx-auto" />
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {mhs.ttu2 ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  ) : (
                    <Clock className="w-5 h-5 text-gray-400 mx-auto" />
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {mhs.ttu3 ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  ) : (
                    <Clock className="w-5 h-5 text-gray-400 mx-auto" />
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  <button
                    onClick={() => handleAccept(mhs.id)}
                    className="bg-[#0B2F7F] text-white px-4 py-1 rounded hover:bg-blue-800"
                  >
                    Accept
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const DataAkunKaprodiView = () => {
    const [passwordData, setPasswordData] = useState({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState("");

    const handlePasswordChange = (e) => {
      const { name, value } = e.target;
      setPasswordData((prev) => ({
        ...prev,
        [name]: value,
      }));
      setError("");
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      setError("");

      if (
        !passwordData.oldPassword ||
        !passwordData.newPassword ||
        !passwordData.confirmPassword
      ) {
        setError("Semua field harus diisi");
        return;
      }

      if (passwordData.newPassword.length < 6) {
        setError("Password baru minimal 6 karakter");
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError("Password baru dan konfirmasi tidak cocok");
        return;
      }

      setShowSuccess(true);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    };

    return (
      <div className="space-y-6 animate-fade-in">
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl flex items-center gap-3 shadow-sm animate-fade-in">
            <svg
              className="w-5 h-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">Password berhasil diubah!</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                />
              </svg>
              Profil Kaprodi
            </h3>

            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-lg mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/30">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-blue-200 mb-1">
                    Kepala Program Studi
                  </p>
                  <p className="text-xl font-bold">
                    {userData?.name || "Dr. Kepala Prodi, M.Kom"}
                  </p>
                </div>
              </div>

              <div className="border-t border-white/20 pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-200 text-sm">NIP</span>
                  <span className="font-mono font-semibold text-lg">
                    {userData?.nip || "198012122005011001"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200 text-sm">Program Studi</span>
                  <span className="font-medium">Teknik Informatika</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <svg
                  className="w-5 h-5 text-slate-400 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-xs text-slate-500 mb-1">Email</p>
                  <p className="text-sm font-medium text-slate-700">
                    {userData?.email || "kaprodi@staff.uksw.edu"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <svg
                  className="w-5 h-5 text-slate-400 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-xs text-slate-500 mb-1">Fakultas</p>
                  <p className="text-sm font-medium text-slate-700">
                    Fakultas Teknologi Informasi
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Keamanan Akun
            </h3>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password Lama
                </label>
                <input
                  type="password"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Masukkan password lama"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password Baru
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Masukkan password baru"
                />
                <p className="text-xs text-slate-500 mt-1.5">
                  Minimal 6 karakter
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Ulangi password baru"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 mt-6"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Simpan Perubahan
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-xs font-semibold text-blue-800 mb-2 flex items-center gap-1.5">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Tips Keamanan
              </p>
              <ul className="text-xs text-blue-700 space-y-1 ml-5 list-disc">
                <li>Gunakan kombinasi huruf besar, kecil, dan angka</li>
                <li>
                  Hindari menggunakan informasi pribadi yang mudah ditebak
                </li>
                <li>Ubah password secara berkala</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PanduanKaprodiView = () => {
    const steps = [
      {
        number: "01",
        title: "Dashboard",
        description: "Monitor aktivitas dan statistik program studi",
        details:
          "Halaman utama menampilkan ringkasan aktivitas terkini, jumlah request yang masuk, mahasiswa aktif, TTU yang telah selesai, dan total dosen pembimbing. Pantau perkembangan program studi secara real-time.",
        color: "blue",
      },
      {
        number: "02",
        title: "Request Dosen",
        description: "Kelola pengajuan dan perubahan dosen pembimbing",
        details:
          "Terdapat dua jenis request: (1) Request Dosen Pembimbing - pengajuan dosen pembimbing baru dari mahasiswa, dan (2) Request Ganti Dosen Pembimbing - permohonan pergantian dosen pembimbing beserta alasannya. Setujui atau tolak setiap request sesuai pertimbangan akademik.",
        color: "green",
      },
      {
        number: "03",
        title: "Mahasiswa Bimbingan",
        description: "Lihat progres mahasiswa yang sedang bimbingan",
        details:
          "Monitor progres tugas akhir setiap mahasiswa. Lihat status TTU 1, TTU 2, dan TTU 3 untuk setiap mahasiswa. Gunakan fitur pencarian untuk menemukan mahasiswa tertentu. Tombol Accept untuk memvalidasi penyelesaian bimbingan.",
        color: "purple",
      },
      {
        number: "04",
        title: "Riwayat Bimbingan",
        description: "Arsip mahasiswa yang telah menyelesaikan bimbingan",
        details:
          "Lihat data historis mahasiswa yang telah menyelesaikan seluruh tahapan TTU. Informasi meliputi nama mahasiswa, judul tugas akhir, dosen pembimbing, dan tanggal penyelesaian. Berguna untuk evaluasi dan pelaporan program studi.",
        color: "orange",
      },
    ];

    const colorClasses = {
      blue: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        icon: "text-blue-600",
        number: "text-blue-600",
        gradient: "from-blue-500 to-blue-600",
      },
      green: {
        bg: "bg-green-50",
        border: "border-green-200",
        icon: "text-green-600",
        number: "text-green-600",
        gradient: "from-green-500 to-green-600",
      },
      purple: {
        bg: "bg-purple-50",
        border: "border-purple-200",
        icon: "text-purple-600",
        number: "text-purple-600",
        gradient: "from-purple-500 to-purple-600",
      },
      orange: {
        bg: "bg-orange-50",
        border: "border-orange-200",
        icon: "text-orange-600",
        number: "text-orange-600",
        gradient: "from-orange-500 to-orange-600",
      },
    };

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Panduan Sistem SITA S1 TI untuk Kaprodi
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Panduan lengkap penggunaan sistem informasi tugas akhir untuk
                Kepala Program Studi. Kelola pengajuan dosen pembimbing dan
                monitor progres mahasiswa dengan efisien.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => {
            const colors = colorClasses[step.color];
            return (
              <div
                key={index}
                className={`${colors.bg} ${colors.border} border rounded-2xl p-6 transition-all duration-200 hover:shadow-md`}
              >
                <div className="flex items-start gap-6">
                  <div
                    className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${colors.gradient} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg`}
                  >
                    {step.number}
                  </div>

                  <div className="flex-1">
                    <h3 className={`text-xl font-bold ${colors.number} mb-2`}>
                      {step.title}
                    </h3>
                    <p className="text-slate-600 font-medium mb-3">
                      {step.description}
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                      {step.details}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Informasi Penting
          </h3>
          <ul className="space-y-2 text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>
                Pastikan mengevaluasi setiap request dosen pembimbing dengan
                cermat sebelum menyetujui atau menolak
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>
                Gunakan fitur pencarian pada menu Mahasiswa Bimbingan untuk
                menemukan mahasiswa dengan cepat
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>
                Data riwayat bimbingan dapat digunakan untuk evaluasi dan
                pelaporan kinerja program studi
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>
                Hubungi admin sistem jika mengalami kendala teknis atau
                membutuhkan bantuan
              </span>
            </li>
          </ul>
        </div>
      </div>
    );
  };

  const RiwayatBimbinganView = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-[#0B2F7F] mb-4">
        Riwayat Bimbingan
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Nama
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                NIM
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Judul
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Dosen Pembimbing
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                TTU 1
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                TTU 2
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                TTU 3
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Tanggal Selesai
              </th>
            </tr>
          </thead>
          <tbody>
            {riwayatBimbingan.map((riwayat) => (
              <tr key={riwayat.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{riwayat.nama}</td>
                <td className="px-4 py-3 text-sm">{riwayat.nim}</td>
                <td className="px-4 py-3 text-sm">{riwayat.judul}</td>
                <td className="px-4 py-3 text-sm">{riwayat.dosen}</td>
                <td className="px-4 py-3 text-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                </td>
                <td className="px-4 py-3 text-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                </td>
                <td className="px-4 py-3 text-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                </td>
                <td className="px-4 py-3 text-sm">{riwayat.tanggalSelesai}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return <DashboardView />;
      case "request-dosen":
        return <RequestDosenView />;
      case "mahasiswa-bimbingan":
        return <MahasiswaBimbinganView />;
      case "riwayat":
        return <RiwayatBimbinganView />;
      case "data-akun":
        return <DataAkunKaprodiView />;
      case "panduan":
        return <PanduanKaprodiView />;
      default:
        return (<DashboardView />)();
    }
  };

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-sans text-slate-600">
      <SidebarKaprodi
        activeMenu={activeMenu}
        onMenuClick={(key, viewName) => {
          setActiveMenu(key);
        }}
        onLogout={() => {
          localStorage.removeItem("sita_token");
          localStorage.removeItem("sita_user");
          navigate("/");
        }}
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
                Selamat datang, {userData.name}
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

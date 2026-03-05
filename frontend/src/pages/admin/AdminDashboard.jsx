import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import DosenManagementPage from "./DosenManagementPage";
import MahasiswaManagementPage from "./MahasiswaManagementPage";
import PanduanSuperadminPage from "./PanduanSuperadminPage";
import { UserCheck, Users, CheckCircle } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [stats, setStats] = useState({
    totalDosen: 0,
    totalMahasiswa: 0,
    userAktif: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("sita_token");
    if (!token) {
      navigate("/login?role=superadmin");
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch(`${API}/api/superadmin/users?role=dosen`, { headers })
        .then((r) => r.json())
        .catch(() => ({})),
      fetch(`${API}/api/superadmin/mahasiswa`, { headers })
        .then((r) => r.json())
        .catch(() => ({})),
      fetch(`${API}/api/superadmin/users`, { headers })
        .then((r) => r.json())
        .catch(() => ({})),
    ]).then(([dosenRes, mhsRes, allUsersRes]) => {
      const dosenList = dosenRes.success ? dosenRes.data || [] : [];
      const mhsList = mhsRes.success ? mhsRes.data || [] : [];
      const allUsers = allUsersRes.success ? allUsersRes.data || [] : [];
      const activeUsers =
        allUsers.filter((u) => u.is_active).length +
        mhsList.filter((m) => m.is_active).length;
      setStats({
        totalDosen: dosenList.length,
        totalMahasiswa: mhsList.length,
        userAktif: activeUsers,
      });
    });
  }, []);

  const handleMenuClick = (menuKey) => {
    setActiveMenu(menuKey);
  };

  const handleLogout = () => {
    localStorage.removeItem("sita_token");
    localStorage.removeItem("sita_user");
    navigate("/");
  };

  const totalDosen = stats.totalDosen;
  const totalMahasiswa = stats.totalMahasiswa;
  const userAktif = stats.userAktif;

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard Superadmin
              </h1>
              <p className="text-gray-600 mt-1">
                Selamat datang di panel manajemen pengguna
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Jumlah Dosen
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {totalDosen}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Jumlah Mahasiswa
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {totalMahasiswa}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Pengguna Aktif
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {userAktif}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Akses Cepat
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleMenuClick("dosen")}
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Kelola Dosen</p>
                    <p className="text-sm text-gray-500">
                      Manajemen data dosen
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => handleMenuClick("mahasiswa")}
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Kelola Mahasiswa
                    </p>
                    <p className="text-sm text-gray-500">
                      Manajemen data mahasiswa
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );
      case "dosen":
        return <DosenManagementPage />;
      case "mahasiswa":
        return <MahasiswaManagementPage />;
      case "panduan":
        return <PanduanSuperadminPage />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar
        activeMenu={activeMenu}
        onMenuClick={handleMenuClick}
        onLogout={handleLogout}
        admin={{ name: "Superadmin" }}
      />
      <main className="ml-64 p-8">{renderContent()}</main>
    </div>
  );
};

export default AdminDashboard;

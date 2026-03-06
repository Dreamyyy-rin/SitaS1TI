import React, { useState, useEffect, useMemo } from "react";
import UserTable from "../../components/admin/UserTable";
import UserFormModal from "../../components/admin/UserFormModal";
import {
  UserCheck,
  Plus,
  Trash2,
  AlertTriangle,
  Search,
  CheckCircle,
  XCircle,
} from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const DosenManagementPage = ({ onDataChange }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [deleteType, setDeleteType] = useState("soft");
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "error",
  });

  const fetchDosen = async () => {
    const token = localStorage.getItem("sita_token");
    if (!token) return;
    try {
      const res = await fetch(`${API}/api/superadmin/users?role=dosen`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        const mapped = (data.data || []).map((u) => ({
          id: u._id,
          name: u.nama,
          email: u.email,
          idNumber: u.nidn || "-",
          role: u.role,
          prodi: u.prodi && u.prodi !== "-" ? u.prodi : "Teknik Informatika",
          status: u.is_active ? "active" : "inactive",
        }));
        setUsers(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch dosen", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDosen();
  }, []);

  const handleAddUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = (user) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  const handleSaveUser = async (userData) => {
    const token = localStorage.getItem("sita_token");
    if (!token) return;

    try {
      if (editingUser) {
        const res = await fetch(
          `${API}/api/superadmin/users/${editingUser.id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nama: userData.name,
              nidn: userData.idNumber,
              prodi: userData.prodi,
              is_active: userData.status === "active",
              ...(userData.password ? { password: userData.password } : {}),
            }),
          },
        );
        const data = await res.json();
        if (data.success) {
          await fetchDosen();
          onDataChange?.();
          setNotification({
            show: true,
            message: "Berhasil memperbarui dosen",
            type: "success",
          });
        } else {
          setNotification({
            show: true,
            message: data.error || "Gagal memperbarui dosen",
            type: "error",
          });
          return;
        }
      } else {
        // Create new dosen
        const res = await fetch(`${API}/api/superadmin/register-user`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userData.email,
            password: userData.password,
            nama: userData.name,
            role: "dosen",
            nidn: userData.idNumber,
            prodi: userData.prodi,
          }),
        });
        const data = await res.json();
        if (data.success) {
          await fetchDosen();
          onDataChange?.();
          setNotification({
            show: true,
            message: "Berhasil menambahkan dosen",
            type: "success",
          });
        } else {
          setNotification({
            show: true,
            message: data.error || "Gagal menambahkan dosen",
            type: "error",
          });
          return;
        }
      }
    } catch {
      setNotification({
        show: true,
        message: "Gagal menghubungi server",
        type: "error",
      });
      return;
    }
    setShowModal(false);
    setEditingUser(null);
  };

  const confirmDelete = async () => {
    if (!deletingUser) return;
    const token = localStorage.getItem("sita_token");

    if (deleteType === "hard") {
      try {
        const res = await fetch(
          `${API}/api/superadmin/users/${deletingUser.id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await res.json();
        if (data.success) {
          setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
          onDataChange?.();
          setNotification({
            show: true,
            message: "Berhasil menghapus dosen",
            type: "success",
          });
        } else {
          setNotification({
            show: true,
            message: data.error || "Gagal menghapus dosen",
            type: "error",
          });
        }
      } catch {
        setNotification({
          show: true,
          message: "Gagal menghubungi server",
          type: "error",
        });
      }
    } else {
      // Soft delete - mark inactive locally
      setUsers((prev) =>
        prev.map((u) =>
          u.id === deletingUser.id ? { ...u, status: "inactive" } : u,
        ),
      );
      onDataChange?.();
    }

    setShowDeleteModal(false);
    setDeletingUser(null);
    setDeleteType("soft");
  };

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;

    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.idNumber.toLowerCase().includes(query),
    );
  }, [users, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-blue-600" />
            Manajemen Dosen
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola data dosen dengan mudah dan efisien
          </p>
        </div>
        <button
          onClick={handleAddUser}
          className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Dosen
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari Dosen berdasarkan Nama atau NIP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Jumlah Dosen</p>
            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Dosen Aktif</p>
            <p className="text-2xl font-bold text-green-600">
              {users.filter((u) => u.status === "active").length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Dosen Nonaktif</p>
            <p className="text-2xl font-bold text-gray-400">
              {users.filter((u) => u.status === "inactive").length}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <UserTable
          data={filteredUsers}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          hideProdi={true}
          idLabel="NIP"
        />
      </div>

      <UserFormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
        initialData={editingUser}
        defaultRole="dosen"
      />

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Konfirmasi Hapus
                </h3>
                <p className="text-sm text-gray-500">
                  Pilih jenis penghapusan untuk{" "}
                  <span className="font-semibold">{deletingUser?.name}</span>
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="deleteType"
                  value="soft"
                  checked={deleteType === "soft"}
                  onChange={(e) => setDeleteType(e.target.value)}
                  className="mt-1"
                />
                <div>
                  <p className="font-medium text-gray-900">Nonaktif</p>
                  <p className="text-sm text-gray-500">
                    Pengguna dapat diaktifkan kembali
                  </p>
                </div>
              </label>
              <label className="flex items-start space-x-3 p-3 border border-red-200 rounded-lg cursor-pointer hover:bg-red-50">
                <input
                  type="radio"
                  name="deleteType"
                  value="hard"
                  checked={deleteType === "hard"}
                  onChange={(e) => setDeleteType(e.target.value)}
                  className="mt-1"
                />
                <div>
                  <p className="font-medium text-red-900">Hapus Permanen</p>
                  <p className="text-sm text-red-600">
                    Pengguna tidak dapat diaktifkan kembali
                  </p>
                </div>
              </label>
            </div>

            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingUser(null);
                  setDeleteType("soft");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                  deleteType === "soft"
                    ? "bg-orange-600 hover:bg-orange-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                <Trash2 className="w-4 h-4 inline mr-1" />
                {deleteType === "soft" ? "Nonaktifkan" : "Hapus Permanen"}
              </button>
            </div>
          </div>
        </div>
      )}

      {notification.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-all"
            onClick={() =>
              setNotification({ show: false, message: "", type: "error" })
            }
          ></div>

          <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 border border-slate-100 transform transition-all scale-100">
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ring-4 ${
                  notification.type === "success"
                    ? "bg-green-50 ring-green-50/50"
                    : "bg-red-50 ring-red-50/50"
                }`}
              >
                {notification.type === "success" ? (
                  <CheckCircle
                    className="w-8 h-8 text-green-500"
                    strokeWidth={2}
                  />
                ) : (
                  <XCircle className="w-8 h-8 text-red-500" strokeWidth={2} />
                )}
              </div>

              <h3 className="text-lg font-bold text-slate-800 mb-2">
                {notification.type === "success"
                  ? "Berhasil"
                  : "Terjadi Kesalahan"}
              </h3>

              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                {notification.message}
              </p>

              <button
                onClick={() =>
                  setNotification({ show: false, message: "", type: "error" })
                }
                className={`w-full px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all transform active:scale-95 shadow-lg ${
                  notification.type === "success"
                    ? "bg-green-600 hover:bg-green-700 shadow-green-600/20"
                    : "bg-red-600 hover:bg-red-700 shadow-red-600/20"
                }`}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DosenManagementPage;

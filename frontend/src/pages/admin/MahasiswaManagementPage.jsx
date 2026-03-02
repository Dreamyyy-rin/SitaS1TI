import React, { useState, useEffect, useMemo } from "react";
import UserTable from "../../components/admin/UserTable";
import UserFormModal from "../../components/admin/UserFormModal";
import { Users, Plus, Trash2, AlertTriangle, Search } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const MahasiswaManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [deleteType, setDeleteType] = useState("soft");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMahasiswa = async () => {
    const token = localStorage.getItem("sita_token");
    if (!token) return;
    try {
      const res = await fetch(`${API}/api/superadmin/mahasiswa`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        const mapped = (data.data || []).map(m => ({
          id: m._id,
          name: m.nama,
          email: m.email,
          idNumber: m.nim || "-",
          role: "mahasiswa",
          prodi: m.prodi || "-",
          status: m.is_active ? "active" : "inactive",
        }));
        setUsers(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch mahasiswa", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMahasiswa();
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
        const res = await fetch(`${API}/api/superadmin/mahasiswa/${editingUser.id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nama: userData.name,
            nim: userData.idNumber,
            prodi: userData.prodi,
            is_active: userData.status === "active",
            ...(userData.password ? { password: userData.password } : {}),
          }),
        });
        const data = await res.json();
        if (data.success) {
          await fetchMahasiswa();
        } else {
          alert(data.error || "Gagal memperbarui mahasiswa");
          return;
        }
      } else {
        const res = await fetch(`${API}/api/superadmin/register-mahasiswa`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userData.email,
            password: userData.password,
            nama: userData.name,
            nim: userData.idNumber,
            prodi: userData.prodi,
          }),
        });
        const data = await res.json();
        if (data.success) {
          await fetchMahasiswa();
        } else {
          alert(data.error || "Gagal menambahkan mahasiswa");
          return;
        }
      }
    } catch {
      alert("Gagal menghubungi server");
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
        const res = await fetch(`${API}/api/superadmin/mahasiswa/${deletingUser.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
        } else {
          alert(data.error || "Gagal menghapus mahasiswa");
        }
      } catch {
        alert("Gagal menghubungi server");
      }
    } else {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === deletingUser.id ? { ...u, status: "inactive" } : u
        )
      );
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
        user.idNumber.toLowerCase().includes(query) ||
        user.prodi.toLowerCase().includes(query),
    );
  }, [users, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-green-600" />
            Manajemen Mahasiswa
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola data mahasiswa dengan mudah dan efisien
          </p>
        </div>
        <button
          onClick={handleAddUser}
          className="inline-flex items-center px-4 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Mahasiswa
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari Mahasiswa berdasarkan Nama atau NIM..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Mahasiswa</p>
            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Mahasiswa Aktif</p>
            <p className="text-2xl font-bold text-green-600">
              {users.filter((u) => u.status === "active").length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Mahasiswa Nonaktif</p>
            <p className="text-2xl font-bold text-gray-400">
              {users.filter((u) => u.status === "inactive").length}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <UserTable
          data={filteredUsers}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          idLabel="NIM"
        />
      </div>

      {/* Form Modal */}
      <UserFormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
        initialData={editingUser}
        defaultRole="mahasiswa"
      />

      {/* Delete Confirmation Modal */}
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

            {/* Actions */}
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
    </div>
  );
};

export default MahasiswaManagementPage;

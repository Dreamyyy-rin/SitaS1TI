import React, { useState, useMemo } from "react";
import { mockUsers } from "../../data/mockUsers";
import UserTable from "../../components/admin/UserTable";
import UserFormModal from "../../components/admin/UserFormModal";
import { UserCheck, Plus, Trash2, AlertTriangle, Search } from "lucide-react";

const DosenManagementPage = () => {
  const [users, setUsers] = useState(
    mockUsers.filter((user) => user.role === "dosen"),
  );
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [deleteType, setDeleteType] = useState("soft");
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleSaveUser = (userData) => {
    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                ...userData,

                password: userData.password || u.password,
              }
            : u,
        ),
      );
    } else {
      const newUser = {
        ...userData,
        id: Math.max(...users.map((u) => u.id), 0) + 1,
        role: "dosen",
      };
      setUsers((prev) => [...prev, newUser]);
    }
    setShowModal(false);
    setEditingUser(null);
  };

  const confirmDelete = () => {
    if (!deletingUser) return;

    if (deleteType === "soft") {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === deletingUser.id ? { ...u, status: "inactive" } : u,
        ),
      );
    } else {
      setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
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
            <p className="text-sm text-gray-600">Total Dosen</p>
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
    </div>
  );
};

export default DosenManagementPage;

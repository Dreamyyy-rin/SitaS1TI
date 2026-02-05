import React, { useState } from "react";
import { X, Plus, Trash2, UserCircle, Mail, IdCard, Users } from "lucide-react";

const KaprodiManajemenDosen = () => {
  const [dosenList, setDosenList] = useState([
    {
      id: 1,
      name: "Dr. Budi Santoso, M.Kom",
      nip: "198501152010121001",
      email: "budi.santoso@university.ac.id",
      role: "dosen",
      active_students_count: 8,
    },
    {
      id: 2,
      name: "Dr. Siti Nurhaliza, M.T",
      nip: "199002102015042002",
      email: "siti.nurhaliza@university.ac.id",
      role: "dosen",
      active_students_count: 5,
    },
    {
      id: 3,
      name: "Prof. Dr. Ahmad Dahlan, M.Sc",
      nip: "197812051998031003",
      email: "ahmad.dahlan@university.ac.id",
      role: "dosen",
      active_students_count: 12,
    },
    {
      id: 4,
      name: "Ir. Dewi Lestari, M.Kom",
      nip: "198703222012122004",
      email: "dewi.lestari@university.ac.id",
      role: "dosen",
      active_students_count: 6,
    },
    {
      id: 5,
      name: "Dr. Eng. Rizki Pratama, S.Kom, M.T",
      nip: "199105152017091005",
      email: "rizki.pratama@university.ac.id",
      role: "dosen",
      active_students_count: 3,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedDosen, setSelectedDosen] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    nip: "",
    email: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Nama lengkap harus diisi";
    }
    if (!formData.nip.trim()) {
      newErrors.nip = "NIP harus diisi";
    } else if (!/^\d{18}$/.test(formData.nip)) {
      newErrors.nip = "NIP harus 18 digit angka";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email harus diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddDosen = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const newDosen = {
        id: dosenList.length + 1,
        name: formData.name,
        nip: formData.nip,
        email: formData.email,
        role: "dosen",
        active_students_count: 0,
      };
      setDosenList([...dosenList, newDosen]);
      setShowModal(false);
      setFormData({ name: "", nip: "", email: "" });
      setErrors({});
    }
  };

  const handleDeleteDosen = (dosen) => {
    setSelectedDosen(dosen);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setDosenList(dosenList.filter((d) => d.id !== selectedDosen.id));
    setShowDeleteConfirm(false);
    setSelectedDosen(null);
  };

  const openModal = () => {
    setFormData({ name: "", nip: "", email: "" });
    setErrors({});
    setShowModal(true);
  };


  const filteredDosenList = dosenList.filter((dosen) => {
    const query = searchQuery.toLowerCase();
    return (
      dosen.name.toLowerCase().includes(query) ||
      dosen.nip.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center right justify-between mb-6">
            <button
              onClick={openModal}
              className="flex items-center gap-2 px-6 py-3 bg-[#0B2F7F] text-white rounded-xl font-semibold hover:bg-blue-800 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              Tambah Dosen
            </button>
          </div>


          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Cari berdasarkan nama atau NIP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2F7F] focus:border-transparent"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Dosen</p>
                <p className="text-3xl font-bold text-slate-800">
                  {dosenList.length}
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Bimbingan</p>
                <p className="text-3xl font-bold text-slate-800">
                  {dosenList.reduce(
                    (sum, d) => sum + d.active_students_count,
                    0,
                  )}
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center">
                <UserCircle className="w-7 h-7 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    No
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Nama Dosen
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    NIP
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Jumlah Bimbingan
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDosenList.map((dosen, index) => (
                  <tr
                    key={dosen.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-800">
                      {dosen.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 font-mono">
                      {dosen.nip}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {dosen.email}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-50 text-blue-700">
                        {dosen.active_students_count} Mahasiswa
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDeleteDosen(dosen)}
                        className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 text-sm font-medium"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredDosenList.length === 0 && dosenList.length > 0 && (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">Data tidak ditemukan</p>
              <p className="text-slate-400 text-sm mt-2">
                Tidak ada dosen yang cocok dengan pencarian "{searchQuery}"
              </p>
            </div>
          )}

          {dosenList.length === 0 && (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">Belum ada data dosen</p>
              <p className="text-slate-400 text-sm mt-2">
                Klik tombol "Tambah Dosen" untuk menambah data baru
              </p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 border border-slate-100">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Tambah Dosen Baru
            </h2>

            <form onSubmit={handleAddDosen} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Contoh: Dr. Budi Santoso, M.Kom"
                    className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.name
                        ? "border-red-300 bg-red-50"
                        : "border-slate-200"
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  NIP (18 Digit)
                </label>
                <div className="relative">
                  <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="nip"
                    value={formData.nip}
                    onChange={handleInputChange}
                    placeholder="198501152010121001"
                    maxLength={18}
                    className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono ${
                      errors.nip
                        ? "border-red-300 bg-red-50"
                        : "border-slate-200"
                    }`}
                  />
                </div>
                {errors.nip && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.nip}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="dosen@university.ac.id"
                    className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.email
                        ? "border-red-300 bg-red-50"
                        : "border-slate-200"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#0B2F7F] to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && selectedDosen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border border-slate-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Hapus Data Dosen?
              </h3>
              <p className="text-slate-600 mb-6">
                Anda akan menghapus data <strong>{selectedDosen.name}</strong>.
                Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KaprodiManajemenDosen;

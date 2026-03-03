import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";

const emptyForm = {
  name: "",
  email: "",
  idNumber: "",
  role: "mahasiswa",
  prodi: "Teknik Informatika",
  status: "active",
  password: "",
};

const UserFormModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  defaultRole = "mahasiswa",
}) => {
  const [formData, setFormData] = useState({
    ...emptyForm,
    role: defaultRole,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        idNumber: initialData.idNumber || "",
        role: initialData.role || defaultRole,
        prodi: initialData.prodi || "Teknik Informatika",
        status: initialData.status || "active",
        password: "",
      });
      return;
    }

    setFormData({
      ...emptyForm,
      role: defaultRole,
      prodi: "Teknik Informatika",
    });
  }, [initialData, defaultRole]);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const dataToSave = {
      ...formData,
      role: formData.role.toLowerCase(),
      status: formData.status.toLowerCase(),
    };

    if (initialData && !formData.password) {
      delete dataToSave.password;
    }
    onSave?.(dataToSave);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-100 max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-2xl px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                formData.role === "mahasiswa"
                  ? "bg-green-50 text-green-600"
                  : "bg-blue-50 text-blue-600"
              }`}
            >
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                {initialData
                  ? `Edit Data ${formData.role === "mahasiswa" ? "Mahasiswa" : "Dosen"}`
                  : `Tambah ${formData.role === "mahasiswa" ? "Mahasiswa" : "Dosen"}`}
              </h3>
              <p className="text-sm text-slate-500">
                Lengkapi informasi{" "}
                {formData.role === "mahasiswa" ? "mahasiswa" : "dosen"} di bawah
                ini.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-600">
                Nama
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="Nama lengkap"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="Masukkan email"
                required={!initialData}
                disabled={!!initialData}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-600">
                {formData.role === "mahasiswa" ? "NIM" : "NIDN"}
              </label>
              <input
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder={
                  formData.role === "mahasiswa"
                    ? "Masukkan NIM"
                    : "Masukkan NIDN"
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-600">
                Peran
              </label>
              <div className="relative mt-2">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={!initialData}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-10 text-sm text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 appearance-none cursor-not-allowed"
                >
                  <option value="mahasiswa">Mahasiswa</option>
                  <option value="dosen">Dosen</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600">
                Status
              </label>
              <div className="relative mt-2">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 appearance-none cursor-pointer"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-600">
              Program Studi
            </label>
            <input
              name="prodi"
              value={formData.prodi}
              onChange={handleChange}
              disabled
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
              placeholder="Teknik Informatika"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-600">
              Password Baru
            </label>
            {initialData && (
              <p className="mt-1 text-xs text-slate-500">
                Kosongkan jika tidak ingin mereset password.
              </p>
            )}
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder={
                initialData
                  ? "Kosongkan jika tidak ingin mereset"
                  : "Masukkan password"
              }
              required={!initialData}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className={`px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-lg transition-all ${
                formData.role === "mahasiswa"
                  ? "bg-green-600 hover:bg-green-700 shadow-green-600/20"
                  : "bg-[#2563EB] hover:bg-blue-700 shadow-blue-600/20"
              }`}
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;

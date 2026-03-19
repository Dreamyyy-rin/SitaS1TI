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
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    ...emptyForm,
    role: defaultRole,
  });

  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen, initialData, defaultRole]);

  if (!isOpen) return null;

  const handlePasswordToggle = () => setShowPassword((prev) => !prev);

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
      <style>{`
        input::-ms-reveal,
        input::-ms-clear {
          display: none;
        }
      `}</style>
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>

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
              Kata Sandi Baru
            </label>
            {initialData && (
              <p className="mt-1 text-xs text-slate-500">
                Kosongkan jika tidak ingin mengatur ulang kata sandi.
              </p>
            )}
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-12 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder={
                  initialData
                    ? "Kosongkan jika tidak ingin mengatur ulang"
                    : "Masukkan kata sandi"
                }
                required={!initialData}
              />
              <button
                type="button"
                onClick={handlePasswordToggle}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
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
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
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
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
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

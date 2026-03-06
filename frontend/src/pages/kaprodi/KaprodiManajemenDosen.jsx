import React, { useState, useEffect } from "react";
import { Users, UserCircle, CheckCircle, XCircle } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const KaprodiManajemenDosen = () => {
  const [dosenList, setDosenList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const getToken = () => localStorage.getItem("sita_token");

  const fetchDosenList = async () => {
    const token = getToken();
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/kaprodi/dosen-list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setDosenList(data.data || []);
      } else {
        console.error("Error response:", data);
        setDosenList([]);
      }
    } catch (err) {
      console.error("Failed to load dosen", err);
      setDosenList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDosenList();
  }, []);

  const filteredDosenList = dosenList.filter((dosen) => {
    const query = searchQuery.toLowerCase();
    return (
      (dosen.nama || "").toLowerCase().includes(query) ||
      (dosen.nidn || "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Data Dosen Pembimbing
            </h2>
            <p className="text-slate-600">
              Daftar dosen pembimbing yang dapat dipilih mahasiswa. Pengelolaan
              dosen dilakukan oleh Superadmin.
            </p>
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
                    (sum, d) => sum + (d.active_students_count || 0),
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
                    NIP/NIDN
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Jumlah Bimbingan
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDosenList.map((dosen, index) => (
                  <tr
                    key={dosen._id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-800">
                      {dosen.nama}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 font-mono">
                      {dosen.nidn}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {dosen.email}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {dosen.is_active ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-green-50 text-green-700">
                          <CheckCircle className="w-4 h-4" />
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-red-50 text-red-700">
                          <XCircle className="w-4 h-4" />
                          Non-Aktif
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-50 text-blue-700">
                        {dosen.active_students_count || 0} Mahasiswa
                      </span>
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
                Hubungi Superadmin untuk menambahkan data dosen
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KaprodiManajemenDosen;

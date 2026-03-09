import React, { useState, useEffect, useMemo } from "react";
import {
  FileCheck,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

const TTU3RequirementsPage = () => {
  const [requirements, setRequirements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "error",
  });

  const fetchRequirements = async () => {
    const token = localStorage.getItem("sita_token");
    if (!token) return;
    try {
      const res = await fetch(`${API}/api/superadmin/ttu3-requirements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setRequirements(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch TTU3 requirements", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm("Setujui berkas persyaratan TTU3 ini?")) return;
    const token = localStorage.getItem("sita_token");
    try {
      const res = await fetch(
        `${API}/api/superadmin/ttu3-requirements/${id}/approve`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (data.success) {
        await fetchRequirements();
        setNotification({
          show: true,
          message: "Berhasil menyetujui berkas",
          type: "success",
        });
      } else {
        setNotification({
          show: true,
          message: data.error || "Gagal menyetujui berkas",
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
  };

  const handleReject = async (id) => {
    if (!window.confirm("Tolak berkas persyaratan TTU3 ini?")) return;
    const token = localStorage.getItem("sita_token");
    try {
      const res = await fetch(
        `${API}/api/superadmin/ttu3-requirements/${id}/reject`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (data.success) {
        await fetchRequirements();
        setNotification({
          show: true,
          message: "Berhasil menolak berkas",
          type: "success",
        });
      } else {
        setNotification({
          show: true,
          message: data.error || "Gagal menolak berkas",
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
  };

  const filteredRequirements = useMemo(() => {
    let filtered = requirements;

    if (filterStatus !== "all") {
      filtered = filtered.filter((r) => r.status === filterStatus);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          (r.mahasiswa_nama || "").toLowerCase().includes(query) ||
          (r.mahasiswa_nim || "").toLowerCase().includes(query) ||
          (r.file_name || "").toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [requirements, searchQuery, filterStatus]);

  const statusCounts = useMemo(() => {
    const counts = { submitted: 0, approved: 0, rejected: 0 };
    requirements.forEach((r) => {
      if (counts[r.status] !== undefined) counts[r.status]++;
    });
    return counts;
  }, [requirements]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "submitted":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3" /> Menunggu Tinjauan
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3" /> Disetujui
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3" /> Ditolak
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FileCheck className="w-7 h-7 text-purple-600" />
          Tinjauan Persyaratan TTU 3
        </h1>
        <p className="text-gray-600 mt-1">
          Tinjau dan kelola berkas persyaratan TTU 3 mahasiswa
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Menunggu Tinjauan</p>
              <p className="text-2xl font-bold text-yellow-600">
                {statusCounts.submitted}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Disetujui</p>
              <p className="text-2xl font-bold text-green-600">
                {statusCounts.approved}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ditolak</p>
              <p className="text-2xl font-bold text-red-600">
                {statusCounts.rejected}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama, NIM, atau nama file..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="submitted">Menunggu Tinjauan</option>
            <option value="approved">Disetujui</option>
            <option value="rejected">Ditolak</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Memuat data...</div>
        ) : filteredRequirements.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {requirements.length === 0
                ? "Belum ada berkas persyaratan TTU 3"
                : "Tidak ada berkas yang sesuai filter"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    No
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Mahasiswa
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    File
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Tanggal Unggah
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRequirements.map((req, index) => (
                  <tr key={req._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{index + 1}</td>
                    <td className="px-4 py-3 text-sm">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {req.mahasiswa_nama || "-"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {req.mahasiswa_nim || "-"}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <p className="text-gray-700 truncate max-w-[200px]">
                        {req.file_name || "-"}
                      </p>
                      {req.file_size && (
                        <p className="text-xs text-gray-400">
                          {(req.file_size / 1024).toFixed(1)} KB
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {req.created_at
                        ? new Date(req.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {req.status === "submitted" ? (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleApprove(req._id)}
                            className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-600 transition-colors"
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() => handleReject(req._id)}
                            className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-600 transition-colors"
                          >
                            Tolak
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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

export default TTU3RequirementsPage;

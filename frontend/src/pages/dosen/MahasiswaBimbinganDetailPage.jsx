import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CheckCircle, Clock, AlertCircle } from "lucide-react";
import SidebarDosen from "../../components/dosen/SidebarDosen";
import ReviewChat from "../../components/shared/ReviewChat";

const API = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

const TTU_LABELS = { ttu_1: "TTU 1", ttu_2: "TTU 2", ttu_3: "TTU 3" };

export default function MahasiswaBimbinganDetailPage() {
  const { mahasiswaId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState(null);
  const [mahasiswa, setMahasiswa] = useState(location.state?.mahasiswa || null);
  const [isLoading, setIsLoading] = useState(true);
  const [requestCount, setRequestCount] = useState(() => {
    const cached = localStorage.getItem("dosen_request_count");
    return cached ? parseInt(cached, 10) : 0;
  });

  useEffect(() => {
    const token = localStorage.getItem("sita_token");
    const userData = localStorage.getItem("sita_user");
    if (!token) {
      navigate("/login?role=dosen");
      return;
    }
    try {
      if (userData) setProfile(JSON.parse(userData));
    } catch {
      /* ignore */
    }

    const headers = { Authorization: `Bearer ${token}` };

    // Fetch mahasiswa data (from list) if not passed via navigation state
    const fetchMahasiswa = !mahasiswa
      ? fetch(`${API}/api/dosen/mahasiswa-bimbingan`, { headers })
          .then((r) => r.json())
          .then((res) => {
            if (res.success) {
              const found = (res.data || []).find((m) => m._id === mahasiswaId);
              if (found) {
                const ttu = found.ttu_status || {};
                setMahasiswa({
                  id: found._id,
                  nama: found.nama || "-",
                  nim: found.nim || "-",
                  prodi: found.prodi || "-",
                  email: found.email || "-",
                  judul: found.judul || "-",
                  reviewer: found.reviewer || "-",
                  ttu1: ttu.ttu_1?.status === "approved",
                  ttu2: ttu.ttu_2?.status === "approved",
                  ttu3: ttu.ttu_3?.status === "approved",
                  ttu_status: ttu,
                });
              }
            }
          })
          .catch(() => {})
      : Promise.resolve();

    fetchMahasiswa.finally(() => setIsLoading(false));
  }, [mahasiswaId, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("sita_token");
    localStorage.removeItem("sita_user");
    navigate("/login?role=dosen");
  };

  const user = {
    name: profile?.nama || "Dosen",
    nip: profile?.nip || profile?.nidn || "-",
    email: profile?.email || "-",
  };

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-sans text-slate-600">
      <SidebarDosen
        activeMenu="mahasiswa-bimbingan"
        onMenuClick={(key) => {
          if (key === "dashboard") navigate("/dosen-dashboard");
          else if (key === "request-bimbingan")
            navigate("/dosen-request-bimbingan");
          else if (key === "mahasiswa-bimbingan")
            navigate("/dosen-mahasiswa-bimbingan");
          else if (key === "review") navigate("/dosen-review");
          else if (key === "data-akun") navigate("/data-akun");
          else if (key === "panduan") navigate("/dosen-panduan");
        }}
        onLogout={handleLogout}
        user={user}
        requestCount={requestCount}
      />

      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto pb-10 space-y-6">
          {/* Back + Header */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dosen-mahasiswa-bimbingan")}
              className="flex items-center gap-2 text-slate-500 hover:text-[#0B2F7F] transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </button>
          </div>

          {isLoading && (
            <div className="bg-white rounded-2xl p-8 text-slate-500 text-center border border-slate-100 shadow-sm">
              Memuat data...
            </div>
          )}

          {!isLoading && mahasiswa && (
            <>
              {/* Student info card */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-[#0B2F7F]">
                      {mahasiswa.nama}
                    </h1>
                    <p className="text-slate-500 text-sm">
                      NIM: {mahasiswa.nim} &bull; {mahasiswa.prodi}
                    </p>
                    <p className="text-slate-700 text-sm mt-1">
                      <span className="font-medium">Judul:</span>{" "}
                      {mahasiswa.judul}
                    </p>
                    {mahasiswa.reviewer && (
                      <p className="text-slate-500 text-xs">
                        Reviewer: {mahasiswa.reviewer}
                      </p>
                    )}
                  </div>
                  {/* TTU status badges */}
                  <div className="flex gap-2 flex-shrink-0">
                    {["ttu_1", "ttu_2", "ttu_3"].map((key) => {
                      const st = mahasiswa.ttu_status?.[key]?.status;
                      return (
                        <div
                          key={key}
                          className={`flex flex-col items-center px-3 py-2 rounded-xl border text-xs font-semibold ${
                            st === "approved"
                              ? "bg-green-50 border-green-200 text-green-700"
                              : st
                                ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                                : "bg-slate-50 border-slate-200 text-slate-400"
                          }`}
                        >
                          <span>{TTU_LABELS[key]}</span>
                          {st === "approved" ? (
                            <CheckCircle className="w-4 h-4 mt-1" />
                          ) : (
                            <Clock className="w-4 h-4 mt-1" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Main layout: chat section */}
              <div className="space-y-4">
                {/* Chat panel */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <ReviewChat
                    role="dosen"
                    mahasiswaId={mahasiswaId}
                    currentUserId={profile?._id || profile?.user_id}
                    chatType="bimbingan"
                    showFiles={true}
                    mahasiswaInfo={mahasiswa}
                    fullHeight={true}
                  />
                </div>
              </div>
            </>
          )}

          {!isLoading && !mahasiswa && (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
              <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Data mahasiswa tidak ditemukan</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

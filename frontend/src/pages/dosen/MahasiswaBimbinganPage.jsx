import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, FileText, Download, CheckCircle, XCircle, MessageCircle } from "lucide-react";
import SidebarDosen from "../../components/dosen/SidebarDosen";
import MahasiswaBimbinganView from "../../components/dosen/MahasiswaBimbinganView";
import ReviewChat from "../../components/shared/ReviewChat";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export default function MahasiswaBimbinganPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [mahasiswaBimbingan, setMahasiswaBimbingan] = useState([]);
  const [requestCount, setRequestCount] = useState(() => {
    const cached = localStorage.getItem("dosen_request_count");
    return cached ? parseInt(cached, 10) : 0;
  });
  const [showFileModal, setShowFileModal] = useState(false);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedMahasiswaId, setSelectedMahasiswaId] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [chatMahasiswaId, setChatMahasiswaId] = useState(null);
  const [chatMahasiswaName, setChatMahasiswaName] = useState("");

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

    // Fetch request count
    fetch(`${API}/api/dosen/pembimbing-requests`, { headers })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          // Backend already filters by overall_status = pending, so count all returned data
          const count = (res.data || []).length;
          setRequestCount(count);
          localStorage.setItem("dosen_request_count", count.toString());
        }
      })
      .catch(() => {});

    fetch(`${API}/api/dosen/mahasiswa-bimbingan`, { headers })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          const mapped = (res.data || []).map((m) => {
            const ttu = m.ttu_status || {};
            return {
              id: m._id,
              nama: m.nama || "-",
              nim: m.nim || "-",
              prodi: m.prodi || "-",
              email: m.email || "-",
              judul: m.judul || "-",
              reviewer: m.reviewer || "-",
              ttu1: ttu.ttu_1?.status === "approved",
              ttu2: ttu.ttu_2?.status === "approved",
              ttu3: ttu.ttu_3?.status === "approved",
              ttu_status: ttu,
              status:
                m.onboarding_status === "approved"
                  ? "active"
                  : m.onboarding_status,
            };
          });
          setMahasiswaBimbingan(mapped);
        }
      })
      .catch(() => setError("Gagal memuat data mahasiswa"))
      .finally(() => setIsLoading(false));
  }, [navigate]);

  const user = {
    name: profile?.nama || "Dosen",
    nip: profile?.nip || profile?.nidn || "-",
    email: profile?.email || "-",
  };

  const handlePreviewFile = async (mahasiswa, ttuType) => {
    const token = localStorage.getItem("sita_token");
    setSelectedMahasiswa(mahasiswa);
    setShowFileModal(true);
    setLoadingSubmissions(true);

    try {
      const res = await fetch(
        `${API}/api/dosen/mahasiswa/${mahasiswa.id}/submissions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (data.success) {
        setSubmissions(data.data || []);
      } else {
        setSubmissions([]);
      }
    } catch (err) {
      console.error(err);
      setSubmissions([]);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleDownloadFile = (submissionId) => {
    const token = localStorage.getItem("sita_token");
    window.open(
      `${API}/api/dosen/submissions/${submissionId}/download?token=${token}`,
      "_blank",
    );
  };

  const handleAcceptMahasiswa = (id) => {
    const mhs = mahasiswaBimbingan.find((m) => m.id === id);
    if (!mhs) return;

    // Determine which TTU to approve based on current status
    let ttuToApprove = null;
    const ttu = mhs.ttu_status || {};

    // Check for submitted or reviewed TTU in order
    if (ttu.ttu_1?.status === "submitted" || ttu.ttu_1?.status === "reviewed") {
      ttuToApprove = "ttu_1";
    } else if (
      ttu.ttu_2?.status === "submitted" ||
      ttu.ttu_2?.status === "reviewed"
    ) {
      ttuToApprove = "ttu_2";
    } else if (
      ttu.ttu_3?.status === "submitted" ||
      ttu.ttu_3?.status === "reviewed"
    ) {
      ttuToApprove = "ttu_3";
    }

    if (!ttuToApprove) {
      alert("Tidak ada TTU yang perlu di-ACC saat ini");
      return;
    }

    setSelectedMahasiswaId(id);
    setShowAcceptModal(true);
  };

  const confirmAccept = () => {
    const token = localStorage.getItem("sita_token");
    const mhs = mahasiswaBimbingan.find((m) => m.id === selectedMahasiswaId);
    if (!mhs) return;

    // Determine which TTU to approve
    let ttuToApprove = null;
    const ttu = mhs.ttu_status || {};

    if (ttu.ttu_1?.status === "submitted" || ttu.ttu_1?.status === "reviewed") {
      ttuToApprove = "ttu_1";
    } else if (
      ttu.ttu_2?.status === "submitted" ||
      ttu.ttu_2?.status === "reviewed"
    ) {
      ttuToApprove = "ttu_2";
    } else if (
      ttu.ttu_3?.status === "submitted" ||
      ttu.ttu_3?.status === "reviewed"
    ) {
      ttuToApprove = "ttu_3";
    }

    if (!ttuToApprove) return;

    fetch(`${API}/api/dosen/ttu/${ttuToApprove}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mahasiswa_id: selectedMahasiswaId }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          window.location.reload();
        } else {
          alert(res.message || "Gagal menyetujui TTU");
        }
      })
      .catch(() => alert("Gagal menghubungi server"))
      .finally(() => {
        setShowAcceptModal(false);
        setSelectedMahasiswaId(null);
      });
  };

  const handleRejectMahasiswa = (id) => {
    const mhs = mahasiswaBimbingan.find((m) => m.id === id);
    if (!mhs) return;

    // Determine which TTU to reject
    let ttuToReject = null;
    const ttu = mhs.ttu_status || {};

    if (ttu.ttu_1?.status === "submitted" || ttu.ttu_1?.status === "reviewed") {
      ttuToReject = "ttu_1";
    } else if (
      ttu.ttu_2?.status === "submitted" ||
      ttu.ttu_2?.status === "reviewed"
    ) {
      ttuToReject = "ttu_2";
    } else if (
      ttu.ttu_3?.status === "submitted" ||
      ttu.ttu_3?.status === "reviewed"
    ) {
      ttuToReject = "ttu_3";
    }

    if (!ttuToReject) {
      alert("Tidak ada TTU yang perlu direview saat ini");
      return;
    }

    setSelectedMahasiswaId(id);
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    const token = localStorage.getItem("sita_token");
    const mhs = mahasiswaBimbingan.find((m) => m.id === selectedMahasiswaId);
    if (!mhs) return;

    // Determine which TTU to reject
    let ttuToReject = null;
    const ttu = mhs.ttu_status || {};

    if (ttu.ttu_1?.status === "submitted" || ttu.ttu_1?.status === "reviewed") {
      ttuToReject = "ttu_1";
    } else if (
      ttu.ttu_2?.status === "submitted" ||
      ttu.ttu_2?.status === "reviewed"
    ) {
      ttuToReject = "ttu_2";
    } else if (
      ttu.ttu_3?.status === "submitted" ||
      ttu.ttu_3?.status === "reviewed"
    ) {
      ttuToReject = "ttu_3";
    }

    if (!ttuToReject) return;

    fetch(`${API}/api/dosen/ttu/${ttuToReject}/reject`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mahasiswa_id: selectedMahasiswaId,
        reason: "Ditolak oleh pembimbing",
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          window.location.reload();
        } else {
          alert(res.message || "Gagal menolak TTU");
        }
      })
      .catch(() => alert("Gagal menghubungi server"))
      .finally(() => {
        setShowRejectModal(false);
        setSelectedMahasiswaId(null);
      });
  };

  const handleOpenChat = (mhs) => {
    setChatMahasiswaId(mhs.id);
    setChatMahasiswaName(mhs.nama);
    setShowChat(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("sita_token");
    localStorage.removeItem("sita_user");
    navigate("/login?role=dosen");
  };

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-sans text-slate-600">
      <SidebarDosen
        activeMenu="mahasiswa-bimbingan"
        onMenuClick={(key) => {
          if (key === "dashboard") navigate("/dosen-dashboard");
          else if (key === "request-bimbingan")
            navigate("/dosen-request-bimbingan");
          else if (key === "review") navigate("/dosen-review");
          else if (key === "data-akun") navigate("/data-akun");
          else if (key === "panduan") navigate("/dosen-panduan");
        }}
        onLogout={handleLogout}
        user={user}
        requestCount={requestCount}
      />

      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto pb-10">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#0B2F7F]">
              Mahasiswa Bimbingan
            </h1>
            <p className="text-gray-600 mt-2">
              Daftar mahasiswa yang Anda bimbing
            </p>
          </div>

          {isLoading && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 text-slate-500">
              Memuat data...
            </div>
          )}
          {error && !isLoading && (
            <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-4 text-rose-700">
              {error}
            </div>
          )}
          {!isLoading && (
            <MahasiswaBimbinganView
              mahasiswaBimbingan={mahasiswaBimbingan}
              onPreviewFile={handlePreviewFile}
              onAcceptMahasiswa={handleAcceptMahasiswa}
              onRejectMahasiswa={handleRejectMahasiswa}
              onOpenChat={handleOpenChat}
            />
          )}
        </div>
      </main>

      {/* File Preview Modal */}
      {showFileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-all"
            onClick={() => setShowFileModal(false)}
          ></div>

          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 border border-slate-100 transform transition-all scale-100 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  Pengumpulan File
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {selectedMahasiswa?.nama} ({selectedMahasiswa?.nim})
                </p>
              </div>
              <button
                onClick={() => setShowFileModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {loadingSubmissions && (
              <div className="text-center py-8 text-slate-500">
                Memuat data file...
              </div>
            )}

            {!loadingSubmissions && submissions.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">Belum ada file</p>
                <p className="text-slate-400 text-sm mt-2">
                  Mahasiswa belum mengupload file submission
                </p>
              </div>
            )}

            {!loadingSubmissions && submissions.length > 0 && (
              <div className="space-y-3">
                {submissions.map((sub) => (
                  <div
                    key={sub._id}
                    className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-5 h-5 text-blue-500" />
                          <span className="font-semibold text-slate-800 text-sm uppercase">
                            {sub.ttu_number.replace("_", " ")}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                              sub.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : sub.status === "reviewed"
                                  ? "bg-blue-100 text-blue-700"
                                  : sub.status === "rejected"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {sub.status === "approved"
                              ? "Disetujui"
                              : sub.status === "reviewed"
                                ? "Ditinjau"
                                : sub.status === "rejected"
                                  ? "Ditolak"
                                  : "Diajukan"}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-1">
                          <span className="font-medium">File:</span>{" "}
                          {sub.file_name}
                        </p>
                        <p className="text-xs text-slate-400">
                          Upload:{" "}
                          {new Date(sub.uploaded_at).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDownloadFile(sub._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        <Download className="w-4 h-4" />
                        Lihat
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Accept Confirmation Modal */}
      {showAcceptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => {
              setShowAcceptModal(false);
              setSelectedMahasiswaId(null);
            }}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Setujui TTU?
              </h3>
              <p className="text-slate-600 mb-6">
                Mahasiswa akan dapat melanjutkan ke tahap TTU berikutnya setelah
                disetujui.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => {
                    setShowAcceptModal(false);
                    setSelectedMahasiswaId(null);
                  }}
                  className="flex-1 px-4 py-2.5 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={confirmAccept}
                  className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
                >
                  Ya, Terima
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => {
              setShowRejectModal(false);
              setSelectedMahasiswaId(null);
            }}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Tolak TTU?
              </h3>
              <p className="text-slate-600 mb-6">
                Mahasiswa perlu mengupload file baru untuk tahap yang sama.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setSelectedMahasiswaId(null);
                  }}
                  className="flex-1 px-4 py-2.5 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={confirmReject}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                >
                  Ya, Tolak
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Chat Modal */}
      {showChat && chatMahasiswaId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
            onClick={() => setShowChat(false)}
          ></div>
          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-100 transform transition-all max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  Diskusi Review
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {chatMahasiswaName}
                </p>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 pt-2">
              <ReviewChat
                role="dosen"
                mahasiswaId={chatMahasiswaId}
                currentUserId={profile?._id || profile?.user_id}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

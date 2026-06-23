import React, { useState, useEffect } from "react";
import ConfirmModal from "../../components/shared/ConfirmModal";
import { useNavigate } from "react-router-dom";
import {
  X,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  MessageCircle,
} from "lucide-react";
import SidebarDosen from "../../components/dosen/SidebarDosen";
import MahasiswaBimbinganView from "../../components/dosen/MahasiswaBimbinganView";
import ReviewChat from "../../components/shared/ReviewChat";

const API = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export default function MahasiswaBimbinganPage() {
  const [notif, setNotif] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
  });
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [mahasiswaBimbingan, setMahasiswaBimbingan] = useState([]);
  const [requestCount, setRequestCount] = useState(() => {
    const cached = localStorage.getItem("dosen_request_count");
    return cached ? parseInt(cached, 10) : 0;
  });
  const [mahasiswaBimbinganCount, setMahasiswaBimbinganCount] = useState(() =>
    parseInt(localStorage.getItem("dosen_mahasiswa_upload_count") || "0", 10),
  );
  const [newUploadIds, setNewUploadIds] = useState(new Set());
  const [submissions, setSubmissions] = useState([]);
  const [reviewComments, setReviewComments] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [loadingReviewComments, setLoadingReviewComments] = useState(false);
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
              hasNewUpload:
                ttu.ttu_1?.status === "submitted" ||
                ttu.ttu_2?.status === "submitted" ||
                ttu.ttu_3?.status === "submitted",
              status:
                m.onboarding_status === "approved"
                  ? "active"
                  : m.onboarding_status,
            };
          });
          const uploadIds = new Set(
            mapped.filter((m) => m.hasNewUpload).map((m) => m.id),
          );
          setNewUploadIds(uploadIds);
          setMahasiswaBimbinganCount(uploadIds.size);
          localStorage.setItem(
            "dosen_mahasiswa_upload_count",
            uploadIds.size.toString(),
          );
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

    if (!ttuToApprove) {
      setNotif({
        show: true,
        type: "info",
        title: "Tidak Ada TTU",
        message: "Tidak ada TTU yang perlu di-ACC saat ini.",
      });
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
          setNotif({
            show: true,
            type: "error",
            title: "Gagal Menyetujui TTU",
            message: res.message || "Gagal menyetujui TTU",
          });
        }
      })
      .catch(() =>
        setNotif({
          show: true,
          type: "error",
          title: "Koneksi Gagal",
          message: "Gagal menghubungi server",
        }),
      )
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
      setNotif({
        show: true,
        type: "info",
        title: "Tidak Ada TTU",
        message: "Tidak ada TTU yang perlu ditinjau saat ini.",
      });
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
          setNotif({
            show: true,
            type: "error",
            title: "Gagal Menolak TTU",
            message: res.message || "Gagal menolak TTU",
          });
        }
      })
      .catch(() =>
        setNotif({
          show: true,
          type: "error",
          title: "Koneksi Gagal",
          message: "Gagal menghubungi server",
        }),
      )
      .finally(() => {
        setShowRejectModal(false);
        setSelectedMahasiswaId(null);
      });
  };

  const getSubmissionNotes = (submission, allNotes, allSubmissions) => {
    const notes = allNotes.filter(
      (comment) =>
        comment.sender_role === "pembimbing" ||
        comment.sender_role === "reviewer",
    );

    const sortedSubmissions = [...allSubmissions].sort(
      (a, b) => new Date(a.uploaded_at) - new Date(b.uploaded_at),
    );

    const currentIndex = sortedSubmissions.findIndex(
      (item) => item._id === submission._id,
    );

    if (currentIndex === -1) return [];

    const startTime = new Date(submission.uploaded_at).getTime();
    const nextSubmission = sortedSubmissions[currentIndex + 1];
    const endTime = nextSubmission
      ? new Date(nextSubmission.uploaded_at).getTime()
      : Infinity;

    return notes.filter((note) => {
      const noteTime = new Date(note.created_at).getTime();
      return noteTime >= startTime && noteTime < endTime;
    });
  };

  const handleOpenChat = async (mhs) => {
    const token = localStorage.getItem("sita_token");
    setChatMahasiswaId(mhs.id);
    setChatMahasiswaName(mhs.nama);
    setShowChat(true);
    setLoadingSubmissions(true);
    setLoadingReviewComments(true);

    try {
      const [subRes, commentRes] = await Promise.all([
        fetch(`${API}/api/dosen/mahasiswa/${mhs.id}/submissions`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API}/api/dosen/mahasiswa/${mhs.id}/review-comments`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const subData = await subRes.json().catch(() => ({}));
      const commentData = await commentRes.json().catch(() => ({}));

      if (subData.success) {
        setSubmissions(subData.data || []);
      } else {
        setSubmissions([]);
      }

      if (commentData.success) {
        setReviewComments(commentData.data || []);
      } else {
        setReviewComments([]);
      }
    } catch (err) {
      console.error(err);
      setSubmissions([]);
      setReviewComments([]);
    } finally {
      setLoadingSubmissions(false);
      setLoadingReviewComments(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("sita_token");
    localStorage.removeItem("sita_user");
    navigate("/login?role=dosen");
  };

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-sans text-slate-600">
      <ConfirmModal
        show={notif.show}
        type={notif.type}
        title={notif.title}
        message={notif.message}
        onClose={() => setNotif({ ...notif, show: false })}
      />
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
        mahasiswaBimbinganCount={mahasiswaBimbinganCount}
      />

      <main className="flex-1 ml-16 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen">
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
              onAcceptMahasiswa={handleAcceptMahasiswa}
              onRejectMahasiswa={handleRejectMahasiswa}
              onOpenChat={handleOpenChat}
              newUploadIds={newUploadIds}
            />
          )}
        </div>
      </main>
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
                Mahasiswa perlu mengunggah file baru untuk tahap yang sama.
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
          <div className="relative bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-100 transform transition-all max-h-[85vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  Bimbingan
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

            <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-4 p-6 overflow-hidden flex-1">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">
                      File Pengajuan
                    </h4>
                    <p className="text-xs text-slate-500">
                      Tampilkan file TTU dan status pengajuan.
                    </p>
                  </div>
                </div>

                {loadingSubmissions ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-sm">
                    <div className="animate-spin w-5 h-5 border-2 border-slate-300 border-t-blue-500 rounded-full mb-3"></div>
                    Memuat file...
                  </div>
                ) : submissions.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <FileText className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                    <p className="font-medium">Belum ada pengajuan file</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Mahasiswa belum mengunggah dokumen TTU.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {submissions.map((sub) => {
                      const notes = getSubmissionNotes(
                        sub,
                        reviewComments,
                        submissions,
                      );

                      return (
                        <div
                          key={sub._id}
                          className="rounded-2xl border border-slate-200 bg-white p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-4 h-4 text-blue-500" />
                                <span className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
                                  {sub.ttu_number.replace("_", " ")}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 truncate">
                                {sub.file_name}
                              </p>
                              <p className="text-xs text-slate-400 mt-2">
                                Unggah:{" "}
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
                              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              Unduh
                            </button>
                          </div>
                          <div
                            className={`mt-3 text-[11px] inline-flex px-2 py-1 rounded-full font-semibold uppercase tracking-[0.02em] ${
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
                          </div>

                          <div className="mt-4 border-t border-slate-200 pt-4">
                            <p className="text-sm font-semibold text-slate-800 mb-2">
                              Catatan
                            </p>
                            {loadingReviewComments ? (
                              <p className="text-sm text-slate-500">
                                Memuat catatan...
                              </p>
                            ) : notes.length > 0 ? (
                              <ul className="space-y-2 text-sm text-slate-700">
                                {notes.map((note) => (
                                  <li
                                    key={note._id}
                                    className="leading-relaxed"
                                  >
                                    {note.message}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-slate-500">
                                Belum ada catatan dosen.
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex flex-col overflow-hidden">
                <ReviewChat
                  role="dosen"
                  mahasiswaId={chatMahasiswaId}
                  currentUserId={profile?._id || profile?.user_id}
                  onCommentsUpdated={() => {
                    if (!chatMahasiswaId) return;
                    const token = localStorage.getItem("sita_token");
                    fetch(
                      `${API}/api/dosen/mahasiswa/${chatMahasiswaId}/review-comments`,
                      {
                        headers: { Authorization: `Bearer ${token}` },
                      },
                    )
                      .then((r) => r.json())
                      .then((res) => {
                        if (res.success) {
                          setReviewComments(res.data || []);
                        }
                      })
                      .catch(() => {});
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import ReviewChat from "../../components/shared/ReviewChat";
import { FileText, Download, MessageCircle } from "lucide-react"; // Import icon tambahan

const API = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

const PesanPage = () => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [pembimbing, setPembimbing] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [reviewComments, setReviewComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi untuk me-load ulang data (bisa dipanggil setelah mahasiswa kirim chat)
  const loadData = async (token, isMounted) => {
    try {
      const [profileRes, pembimbingRes, subRes, commentRes] = await Promise.all([
        fetch(`${API}/api/mahasiswa/profile`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json().catch(() => ({}))),
        fetch(`${API}/api/mahasiswa/pembimbing`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json().catch(() => ({}))),
        fetch(`${API}/api/mahasiswa/submissions`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json().catch(() => ({}))),
        fetch(`${API}/api/mahasiswa/review-comments`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json().catch(() => ({})))
      ]);

      if (isMounted) {
        if (profileRes.success && profileRes.data) {
          setCurrentUserId(profileRes.data._id || profileRes.data.id);
        }
        if (pembimbingRes.success && pembimbingRes.data) {
          setPembimbing(pembimbingRes.data.pembimbing_1);
        }
        if (subRes.success) {
          setSubmissions(subRes.data || []);
        }
        if (commentRes.success) {
          setReviewComments(commentRes.data || []);
        }
      }
    } catch (error) {
      console.error("Gagal memuat data:", error);
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem("sita_token");
    loadData(token, isMounted);

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDownloadFile = (submissionId) => {
    const token = localStorage.getItem("sita_token");
    window.open(`${API}/api/mahasiswa/submissions/${submissionId}/download?token=${token}`, "_blank");
  };

  // Fungsi logika untuk memasukkan komentar Dosen ke Card Submission yang sesuai (berdasarkan waktu upload)
  const getSubmissionNotes = (submission, allNotes, allSubmissions) => {
    // Hanya ambil komentar dari dosen (pembimbing / reviewer)
    const notes = allNotes.filter((c) => c.sender_role === "pembimbing" || c.sender_role === "reviewer");
    
    // Urutkan submission dari yang terlama ke terbaru
    const sortedSubmissions = [...allSubmissions].sort((a, b) => new Date(a.uploaded_at) - new Date(b.uploaded_at));
    const currentIndex = sortedSubmissions.findIndex((item) => item._id === submission._id);
    
    if (currentIndex === -1) return [];

    const startTime = new Date(submission.uploaded_at).getTime();
    const nextSubmission = sortedSubmissions[currentIndex + 1];
    const endTime = nextSubmission ? new Date(nextSubmission.uploaded_at).getTime() : Infinity;

    // Filter note yang masuk direntang waktu antara submission ini dan submission berikutnya
    return notes.filter((note) => {
      const noteTime = new Date(note.created_at).getTime();
      return noteTime >= startTime && noteTime < endTime;
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-800">Ruang Bimbingan</h2>
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#0B2F7F] border-t-transparent rounded-full mx-auto"></div>
          <p className="text-slate-500 mt-4">Memuat ruang bimbingan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in h-full flex flex-col">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Ruang Bimbingan</h2>
          <p className="text-sm text-slate-500 mt-1">
            Riwayat pengajuan file dan komunikasi dengan Dosen Pembimbing
          </p>
        </div>
      </div>

      {/* TATA LETAK GRID: KIRI (KARTU SUBMISSION), KANAN (CHAT) */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-4 h-[calc(100vh-12rem)] flex-1">
        
        {/* KOLOM KIRI: Daftar File Submission */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 overflow-y-auto shadow-sm">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-slate-800">File Pengajuan</h4>
            <p className="text-xs text-slate-500">Status berkas dan catatan revisi dosen.</p>
          </div>

          {submissions.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <FileText className="w-10 h-10 mx-auto mb-3 text-slate-300" />
              <p className="font-medium text-sm">Belum ada pengajuan</p>
              <p className="text-xs text-slate-400 mt-1">Anda belum mengunggah file TTU apapun.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Balik urutan agar file yang paling baru (terakhir di-upload) berada di atas */}
              {[...submissions].reverse().map((sub) => {
                const notes = getSubmissionNotes(sub, reviewComments, submissions);

                return (
                  <div key={sub._id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                            {sub.ttu_number.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 truncate" title={sub.file_name}>
                          {sub.file_name}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {new Date(sub.uploaded_at).toLocaleDateString("id-ID", {
                            day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                          })}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDownloadFile(sub._id)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        title="Unduh File"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Badge Status */}
                    <div className="mt-3">
                      <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider ${
                        sub.status === "approved" ? "bg-green-100 text-green-700" :
                        sub.status === "reviewed" ? "bg-blue-100 text-blue-700" :
                        sub.status === "rejected" ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {sub.status === "approved" ? "Disetujui" :
                         sub.status === "reviewed" ? "Ditinjau" :
                         sub.status === "rejected" ? "Ditolak" : "Menunggu"}
                      </span>
                    </div>

                    {/* Area Catatan Dosen di Bawah Label */}
                    <div className="mt-3 border-t border-slate-200 pt-3">
                      <p className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                        <MessageCircle className="w-3 h-3" /> Catatan Dosen
                      </p>
                      {notes.length > 0 ? (
                        <div className="space-y-1.5">
                          {notes.map((note) => (
                            <div key={note._id} className="bg-white border border-slate-200 rounded p-2 text-[11px] text-slate-600 leading-relaxed">
                              {note.message}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-400 italic">Belum ada catatan untuk file ini.</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* KOLOM KANAN: Chat Room */}
        <div className="flex flex-col overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-200">
          {currentUserId && (
            <ReviewChat
              mahasiswaId={currentUserId}
              role="mahasiswa"
              currentUserId={currentUserId}
              chatType="bimbingan"
              showFiles={false} // Dimatikan karena file sudah kita tampilkan di card kiri
              pembimbingInfo={pembimbing}
              fullHeight={true}
              showNotes={true}
              onCommentsUpdated={() => {
                // Ketika mahasiswa mengirim pesan, panggil ulang API agar daftar catatan sinkron
                const token = localStorage.getItem("sita_token");
                loadData(token, true);
              }}
            />
          )}
        </div>

      </div>
    </div>
  );
};

export default PesanPage;
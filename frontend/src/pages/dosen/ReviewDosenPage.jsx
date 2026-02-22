import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarDosen from "../../components/dosen/SidebarDosen";
import ReviewView from "../../components/dosen/ReviewView";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export default function ReviewDosenPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewComments, setReviewComments] = useState({});
  const [mahasiswaBimbingan, setMahasiswaBimbingan] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("sita_token");
    const userData = localStorage.getItem("sita_user");

    if (!token) {
      navigate("/login?role=dosen");
      return;
    }

    try {
      if (userData) setProfile(JSON.parse(userData));
    } catch { /* ignore */ }

    const headers = { Authorization: `Bearer ${token}` };

    fetch(`${API}/api/dosen/mahasiswa-review`, { headers })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          const mapped = (res.data || []).map(m => {
            const ttu = m.ttu_status || {};
            return {
              id: m._id,
              nama: m.nama || "-",
              nim: m.nim || "-",
              prodi: m.prodi || "-",
              email: m.email || "-",
              pembimbing: m.pembimbing_1 || "-",
              ttu1: ["submitted", "reviewed", "approved"].includes(ttu.ttu_1?.status),
              ttu2: ["submitted", "reviewed", "approved"].includes(ttu.ttu_2?.status),
              ttu3: ["submitted", "reviewed", "approved"].includes(ttu.ttu_3?.status),
              ttu_status: ttu,
              submissions: m.submissions || [],
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

  const handleCommentChange = (mahasiswaId, comment) => {
    setReviewComments((prev) => ({
      ...prev,
      [mahasiswaId]: comment,
    }));
  };

  const handlePreviewFile = (mahasiswa, ttuType) => {
    alert(`Preview file ${ttuType} untuk ${mahasiswa.nama}`);
  };

  const handleAcceptReview = (mahasiswa) => {
    const token = localStorage.getItem("sita_token");
    const ttu = mahasiswa.ttu_status || {};

    // Reviewer can only approve TTU 3
    const ttu3Status = ttu.ttu_3?.status;
    if (ttu3Status !== "submitted" && ttu3Status !== "reviewed") {
      alert("TTU 3 belum disubmit atau sudah di-ACC");
      return;
    }
    const ttuToApprove = "ttu_3";

    fetch(`${API}/api/dosen/ttu/${ttuToApprove}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mahasiswa_id: mahasiswa.id }),
    })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          alert(`${ttuToApprove.replace("_", " ").toUpperCase()} untuk ${mahasiswa.nama} berhasil di-ACC`);
          window.location.reload();
        } else {
          alert(res.message || "Gagal ACC TTU");
        }
      })
      .catch(() => alert("Gagal menghubungi server"));
  };

  const handleLogout = () => {
    localStorage.removeItem("sita_token");
    localStorage.removeItem("sita_user");
    navigate("/login?role=dosen");
  };

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-sans text-slate-600">
      <SidebarDosen
        activeMenu="review"
        onMenuClick={(key) => {
          if (key === "dashboard") navigate("/dosen-dashboard");
          else if (key === "request-bimbingan") navigate("/dosen-request-bimbingan");
          else if (key === "mahasiswa-bimbingan") navigate("/dosen-mahasiswa-bimbingan");
          else if (key === "data-akun") navigate("/data-akun");
          else if (key === "panduan") navigate("/dosen-panduan");
        }}
        onLogout={handleLogout}
        user={user}
      />

      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto pb-10">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#0B2F7F]">Review</h1>
            <p className="text-gray-600 mt-2">Review TTU mahasiswa bimbingan Anda</p>
          </div>

          {isLoading && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 text-slate-500">Memuat data...</div>
          )}
          {error && !isLoading && (
            <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-4 text-rose-700">{error}</div>
          )}
          {!isLoading && (
            <ReviewView
              mahasiswaBimbingan={mahasiswaBimbingan}
              reviewComments={reviewComments}
              onCommentChange={handleCommentChange}
              onPreviewFile={handlePreviewFile}
              onAcceptReview={handleAcceptReview}
            />
          )}
        </div>
      </main>
    </div>
  );
}

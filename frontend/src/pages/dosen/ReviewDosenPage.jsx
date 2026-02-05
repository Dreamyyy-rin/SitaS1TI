import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarDosen from "../../components/dosen/SidebarDosen";
import ReviewView from "../../components/dosen/ReviewView";

export default function ReviewDosenPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewComments, setReviewComments] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("sita_token");
    const userData = localStorage.getItem("sita_user");

    if (!token) {
      navigate("/login?role=dosen");
      return;
    }

    try {
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setProfile(parsedUser);
      }
    } catch (err) {
      setError("Error memuat data user");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const user = {
    name: profile?.nama || "Dosen",
    nip: profile?.nip || "-",
    email: profile?.email || "-",
  };

  //dummy mhs review
  const mahasiswaBimbingan = [
    {
      id: 1,
      nama: "Rudi Setiawan",
      nim: "200411100003",
      judul: "Implementasi Machine Learning untuk Prediksi",
      reviewer: "Dr. Sri Wahyuni, M.T",
      ttu1: true,
      ttu2: false,
      ttu3: false,
      status: "active",
    },
    {
      id: 2,
      nama: "Dewi Lestari",
      nim: "200411100007",
      judul: "Sistem E-Commerce dengan React",
      reviewer: "Dr. Budi Hartono, M.Kom",
      ttu1: true,
      ttu2: true,
      ttu3: false,
      status: "active",
    },
  ];

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
    const comment = reviewComments[mahasiswa.id] || "";
    alert(
      `Review untuk ${mahasiswa.nama} diterima!\nKomentar: ${comment || "Tidak ada komentar"}`,
    );
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
          else if (key === "request-bimbingan")
            navigate("/dosen-request-bimbingan");
          else if (key === "mahasiswa-bimbingan")
            navigate("/dosen-mahasiswa-bimbingan");
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
            <p className="text-gray-600 mt-2">
              Review TTU mahasiswa bimbingan Anda
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

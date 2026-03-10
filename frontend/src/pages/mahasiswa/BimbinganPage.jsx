import React, { useState, useEffect } from "react";
import ReviewChat from "../../components/shared/ReviewChat";

const API = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

const PesanPage = () => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [pembimbing, setPembimbing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("sita_token");

    const fetchProfile = fetch(`${API}/api/mahasiswa/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) setCurrentUserId(res.data._id);
      })
      .catch(() => {});

    const fetchPembimbing = fetch(`${API}/api/mahasiswa/pembimbing`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          // Use pembimbing_1 as the main pembimbing for chat
          setPembimbing(res.data.pembimbing_1);
        }
      })
      .catch(() => {});

    Promise.all([fetchProfile, fetchPembimbing]).finally(() =>
      setIsLoading(false),
    );
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-800">Pesan</h2>
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-slate-500 mt-4">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Pesan</h2>
          <p className="text-sm text-slate-500 mt-1">
            Silakan kirim pesan kepada dosen pembimbing Anda
          </p>
        </div>
        <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 font-medium">
          TTU 1 &amp; 2
        </div>
      </div>

      {currentUserId && (
        <ReviewChat
          role="mahasiswa"
          currentUserId={currentUserId}
          chatType="bimbingan"
          showFiles={true}
          pembimbingInfo={pembimbing}
          fullHeight={true}
        />
      )}
    </div>
  );
};

export default PesanPage;

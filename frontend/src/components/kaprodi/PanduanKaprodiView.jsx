import React from "react";

const PanduanKaprodiView = () => {
  const steps = [
    {
      number: "01",
      title: "Dasbor",
      description: "Statistik aktivitas dan perkembangan program studi",
      details:
        "Menampilkan statistik aktivitas, permintaan, mahasiswa aktif, TTU selesai, dan dosen pembimbing.",
      color: "blue",
    },
    {
      number: "02",
      title: "Permintaan Pembimbing",
      description: "Kelola permintaan bimbingan dari mahasiswa ke dosen",
      details: "Kelola permintaan bimbingan dari mahasiswa ke dosen.",
      color: "purple",
    },
    {
      number: "03",
      title: "Mahasiswa Bimbingan",
      description: "Pantau progres tugas akhir mahasiswa, ganti pembimbing",
      details:
        "Pantau progres tugas akhir mahasiswa, ganti pembimbing jika diperlukan.",
      color: "green",
    },
    {
      number: "04",
      title: "Tinjauan",
      description: "Lihat berkas TTU mahasiswa dan status tinjauan",
      details: "Lihat berkas TTU mahasiswa dan status tinjauan.",
      color: "orange",
    },
    {
      number: "05",
      title: "Permintaan Dosen",
      description: "Kelola pengajuan dan perubahan dosen pembimbing",
      details: "Kelola pengajuan dan perubahan dosen pembimbing.",
      color: "indigo",
    },
    {
      number: "06",
      title: "Penentuan Peninjau",
      description: "Tetapkan dosen peninjau untuk TTU 3",
      details: "Tetapkan dosen peninjau untuk TTU 3.",
      color: "slate",
    },
    {
      number: "07",
      title: "Riwayat Bimbingan",
      description: "Arsip mahasiswa yang telah menyelesaikan bimbingan",
      details: "Arsip mahasiswa yang telah menyelesaikan bimbingan.",
      color: "teal",
    },
    {
      number: "08",
      title: "Manajemen Dosen",
      description: "Lihat data dosen pembimbing program studi",
      details: "Lihat data dosen pembimbing program studi.",
      color: "red",
    },
    {
      number: "09",
      title: "Batas Waktu TTU",
      description: "Atur jadwal batas waktu untuk setiap tahap TTU",
      details: "Atur jadwal batas waktu untuk setiap tahap TTU.",
      color: "cyan",
    },
    {
      number: "10",
      title: "Data Akun",
      description: "Kelola informasi akun Kaprodi",
      details: "Kelola informasi akun Kaprodi.",
      color: "pink",
    },
  ];

  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "text-blue-600",
      number: "text-blue-600",
      gradient: "from-blue-500 to-blue-600",
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      icon: "text-green-600",
      number: "text-green-600",
      gradient: "from-green-500 to-green-600",
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      icon: "text-purple-600",
      number: "text-purple-600",
      gradient: "from-purple-500 to-purple-600",
    },
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      icon: "text-orange-600",
      number: "text-orange-600",
      gradient: "from-orange-500 to-orange-600",
    },
    indigo: {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      icon: "text-indigo-600",
      number: "text-indigo-600",
      gradient: "from-indigo-500 to-indigo-600",
    },
    slate: {
      bg: "bg-slate-50",
      border: "border-slate-200",
      icon: "text-slate-600",
      number: "text-slate-600",
      gradient: "from-slate-500 to-slate-600",
    },
    teal: {
      bg: "bg-teal-50",
      border: "border-teal-200",
      icon: "text-teal-600",
      number: "text-teal-600",
      gradient: "from-teal-500 to-teal-600",
    },
    red: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: "text-red-600",
      number: "text-red-600",
      gradient: "from-red-500 to-red-600",
    },
    cyan: {
      bg: "bg-cyan-50",
      border: "border-cyan-200",
      icon: "text-cyan-600",
      number: "text-cyan-600",
      gradient: "from-cyan-500 to-cyan-600",
    },
    pink: {
      bg: "bg-pink-50",
      border: "border-pink-200",
      icon: "text-pink-600",
      number: "text-pink-600",
      gradient: "from-pink-500 to-pink-600",
    },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-4">
        {steps.map((step, index) => {
          const colors = colorClasses[step.color];
          return (
            <div
              key={index}
              className={`${colors.bg} ${colors.border} border rounded-2xl p-6 transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-start gap-6">
                <div
                  className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${colors.gradient} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg`}
                >
                  {step.number}
                </div>

                <div className="flex-1">
                  <h3 className={`text-xl font-bold ${colors.number} mb-2`}>
                    {step.title}
                  </h3>
                  <p className="text-slate-600 font-medium mb-3">
                    {step.description}
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    {step.details}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PanduanKaprodiView;

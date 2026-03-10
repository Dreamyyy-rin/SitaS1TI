import React from "react";

export default function PanduanDosenView() {
  const steps = [
    {
      number: "01",
      title: "Dasbor",
      description: "Statistik bimbingan dan aktivitas mahasiswa",
      details: "Menampilkan statistik bimbingan dan aktivitas mahasiswa.",
      color: "blue",
    },
    {
      number: "02",
      title: "Permintaan Bimbingan",
      description: "Terima atau tolak permintaan bimbingan dari mahasiswa",
      details: "Terima atau tolak permintaan bimbingan dari mahasiswa.",
      color: "purple",
    },
    {
      number: "03",
      title: "Mahasiswa Bimbingan",
      description:
        "Pantau progres tugas akhir mahasiswa, setujui/tolak TTU, diskusi tinjauan",
      details:
        "Pantau progres tugas akhir mahasiswa, setujui/tolak TTU, diskusi tinjauan.",
      color: "green",
    },
    {
      number: "04",
      title: "Tinjauan",
      description: "Tinjau berkas TTU 3 mahasiswa sebagai peninjau",
      details:
        "Tinjau berkas TTU 3 mahasiswa sebagai peninjau, berikan komentar.",
      color: "orange",
    },
    {
      number: "05",
      title: "Data Akun",
      description: "Kelola dan ubah informasi profil dosen",
      details: "Kelola dan ubah informasi profil dosen.",
      color: "cyan",
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
    cyan: {
      bg: "bg-cyan-50",
      border: "border-cyan-200",
      icon: "text-cyan-600",
      number: "text-cyan-600",
      gradient: "from-cyan-500 to-cyan-600",
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
}

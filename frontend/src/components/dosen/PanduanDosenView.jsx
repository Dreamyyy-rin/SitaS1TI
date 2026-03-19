import React from "react";

export default function PanduanDosenView() {
  const steps = [
    {
      number: "01",
      title: "Dasbor",
      description: "Pantau aktivitas bimbingan dan statistik mahasiswa",
      details:
        "Halaman utama menampilkan ringkasan aktivitas terkini, jumlah permintaan bimbingan yang masuk, total mahasiswa bimbingan, dan TTU yang telah selesai. Pantau perkembangan bimbingan mahasiswa secara langsung.",
      color: "blue",
    },
    {
      number: "02",
      title: "Permintaan Bimbingan",
      description: "Terima atau tolak permintaan bimbingan dari mahasiswa",
      details:
        "Lihat daftar mahasiswa yang mengajukan permintaan untuk dibimbing oleh Anda..",
      color: "purple",
    },
    {
      number: "03",
      title: "Mahasiswa Bimbingan",
      description: "Lihat progres mahasiswa yang sedang Anda bimbing",
      details:
        "Pantau progres tugas akhir setiap mahasiswa bimbingan Anda.",
      color: "green",
    },
    {
      number: "04",
      title: "Tinjauan",
      description: "Tinjau berkas TTU 3 mahasiswa sebagai dosen peninjau",
      details:
        "Daftar Mahasiswa yang perlu Anda tinjau akan muncul di halaman ini jika Anda ditunjuk sebagai dosen peninjau/reviewer oleh Kaprodi. Silahkan gunakan fitur komentar untuk memberikan masukan kepada mahasiswa terkait.",
      color: "orange",
    },
    {
      number: "05",
      title: "Data Akun",
      description: "Kelola informasi akun dosen",
      details:
        "Lihat dan ubah informasi profil dosen, seperti nama, NIDN, program studi, dan email. Pastikan data yang tercatat sudah benar dan sesuai dengan data resmi kampus.",
      color: "cyan",
    },
  ];

  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      number: "text-blue-600",
      gradient: "from-blue-500 to-blue-600",
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      number: "text-green-600",
      gradient: "from-green-500 to-green-600",
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      number: "text-purple-600",
      gradient: "from-purple-500 to-purple-600",
    },
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      number: "text-orange-600",
      gradient: "from-orange-500 to-orange-600",
    },
    cyan: {
      bg: "bg-cyan-50",
      border: "border-cyan-200",
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
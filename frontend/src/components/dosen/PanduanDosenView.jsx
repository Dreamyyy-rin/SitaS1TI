import React from "react";

export default function PanduanDosenView() {
  const steps = [
    {
      number: "01",
      title: "Dashboard",
      description: "Monitor aktivitas bimbingan dan statistik mahasiswa",
      details:
        "Halaman utama menampilkan ringkasan aktivitas terkini, jumlah request bimbingan yang masuk, total mahasiswa bimbingan, dan TTU yang telah selesai. Pantau perkembangan bimbingan mahasiswa secara real-time.",
      color: "blue",
    },
    {
      number: "02",
      title: "Request Bimbingan",
      description: "Terima atau tolak request bimbingan dari mahasiswa",
      details:
        "Lihat daftar mahasiswa yang mengajukan request untuk dibimbing oleh Anda. Review judul yang diajukan mahasiswa. Terima request jika topik sesuai dengan keahlian Anda. Mahasiswa akan otomatis menjadi mahasiswa bimbingan Anda setelah mendapat persetujuan dari Kaprodi.",
      color: "purple",
    },
    {
      number: "03",
      title: "Mahasiswa Bimbingan",
      description: "Lihat progres mahasiswa yang sedang Anda bimbing",
      details:
        "Monitor progres tugas akhir setiap mahasiswa bimbingan. Lihat status TTU 1, TTU 2, dan TTU 3 untuk setiap mahasiswa. Preview file yang telah diunggah mahasiswa. Gunakan tombol Accept untuk memvalidasi penyelesaian bimbingan.",
      color: "green",
    },
    {
      number: "04",
      title: "Review",
      description: "Review dan beri komentar pada berkas TTU mahasiswa",
      details:
        "Lihat berkas TTU 2 yang telah diunggah mahasiswa bimbingan. Preview file untuk melihat isi dokumen. Berikan komentar dan feedback pada setiap berkas. Gunakan tombol 'Kirim' untuk mengirim komentar atau 'Accept' untuk menyetujui berkas.",
      color: "orange",
    },
    {
      number: "05",
      title: "Data Akun",
      description: "Kelola informasi akun dosen",
      details:
        "Lihat dan edit informasi profil dosen seperti nama, email, dan nomor telepon. Update foto profil untuk personalisasi akun. Ubah password untuk keamanan akun. Perubahan yang dilakukan akan tersimpan dan dapat diubah kembali kapan saja.",
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

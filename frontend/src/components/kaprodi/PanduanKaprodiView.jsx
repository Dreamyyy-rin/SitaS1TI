import React from "react";

const PanduanKaprodiView = () => {
  const steps = [
    {
      number: "01",
      title: "Dasbor",
      description: "Pantau aktivitas dan statistik program studi",
      details:
        "Halaman utama menampilkan ringkasan aktivitas terkini, jumlah permintaan yang masuk, mahasiswa aktif, TTU yang telah selesai, dan total dosen pembimbing. Pantau perkembangan program studi secara langsung.",
      color: "blue",
    },
    {
      number: "02",
      title: "Permintaan Pembimbing",
      description: "Kelola permintaan bimbingan dan pergantian dosen dari mahasiswa",
      details:
        "Terdapat dua jenis permintaan yang dapat ditangani di sini. Pertama, Permintaan Dosen Pembimbing yaitu pengajuan dosen pembimbing baru dari mahasiswa beserta judul yang diajukan. Kedua, Permintaan Ganti Dosen Pembimbing yaitu permohonan pergantian dosen pembimbing beserta alasannya. Setujui atau tolak setiap permintaan sesuai pertimbangan akademik. Angka notifikasi menunjukkan jumlah permintaan yang menunggu keputusan.",
      color: "purple",
    },
    {
      number: "03",
      title: "Mahasiswa Bimbingan",
      description: "Lihat progres dan kelola pembimbing mahasiswa",
      details:
        "Pantau progres tugas akhir setiap mahasiswa yang dibimbing oleh dosen di program studi. Lihat status TTU 1, TTU 2, dan TTU 3 serta judul tugas akhir setiap mahasiswa. Kaprodi dapat langsung mengganti dosen pembimbing tanpa melalui proses permintaan menggunakan tombol Ganti Pembimbing.",
      color: "green",
    },
    {
      number: "04",
      title: "Penempatan Peninjau",
      description: "Tetapkan dosen peninjau untuk mahasiswa TTU 3",
      details:
        "Pilih dosen peninjau untuk setiap mahasiswa yang akan mengikuti TTU 3. Sistem secara otomatis tidak menampilkan dosen pembimbing pada pilihan peninjau sehingga tidak ada konflik kepentingan. Pastikan peninjau memiliki keahlian yang sesuai dengan topik penelitian mahasiswa. Lihat pula judul tugas akhir mahasiswa sebagai acuan penempatan.",
      color: "indigo",
    },
    {
      number: "05",
      title: "Riwayat Bimbingan",
      description: "Arsip mahasiswa yang telah menyelesaikan seluruh tahapan TTU",
      details:
        "Lihat data historis mahasiswa yang telah menyelesaikan TTU 1, TTU 2, dan TTU 3. Informasi meliputi nama mahasiswa, NIM, judul tugas akhir, dosen pembimbing, dan tanggal penyelesaian. Gunakan fitur pencarian untuk menemukan mahasiswa berdasarkan nama atau NIM. Berguna untuk evaluasi dan pelaporan program studi.",
      color: "teal",
    },
    {
      number: "06",
      title: "Manajemen Dosen",
      description: "Lihat data dosen pembimbing program studi",
      details:
        "Lihat daftar dosen pembimbing dengan informasi lengkap meliputi nama, NIP, email, dan status. Monitor jumlah mahasiswa bimbingan aktif setiap dosen. Status Aktif menandakan dosen tersebut dapat dipilih sebagai pembimbing oleh mahasiswa. Pengelolaan data dosen seperti tambah, hapus, dan ubah status dilakukan oleh Superadmin. Gunakan fitur pencarian untuk menemukan dosen berdasarkan nama atau NIP.",
      color: "red",
    },
    {
      number: "07",
      title: "Data Akun",
      description: "Kelola informasi akun Kaprodi",
      details:
        "Lihat dan ubah informasi profil Kaprodi seperti nama, email, dan nomor telepon. Perbarui kata sandi untuk keamanan akun. Perubahan yang dilakukan akan tersimpan dan dapat diubah kembali kapan saja.",
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
    indigo: {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      icon: "text-indigo-600",
      number: "text-indigo-600",
      gradient: "from-indigo-500 to-indigo-600",
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

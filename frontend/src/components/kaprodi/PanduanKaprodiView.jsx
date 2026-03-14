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
      description: "Kelola permintaan bimbingan dari mahasiswa ke dosen",
      details:
        "Lihat daftar mahasiswa yang mengajukan permintaan untuk dibimbing oleh dosen tertentu. Tinjau judul yang diajukan mahasiswa. Setujui atau tolak permintaan sesuai pertimbangan akademik. Mahasiswa baru dapat masuk ke dasbor setelah disetujui oleh Kaprodi dan dosen pembimbing yang bersangkutan.",
      color: "purple",
    },
    {
      number: "03",
      title: "Mahasiswa Bimbingan",
      description: "Lihat progres dan ganti pembimbing mahasiswa",
      details:
        "Pantau progres tugas akhir setiap mahasiswa yang dibimbing oleh dosen. Lihat status TTU 1, TTU 2, dan TTU 3 untuk setiap mahasiswa. Kaprodi dapat langsung mengganti dosen pembimbing mahasiswa tanpa melalui proses permintaan menggunakan tombol 'Ganti Pembimbing'.",
      color: "green",
    },
    {
      number: "04",
      title: "Tinjauan",
      description: "Tinjau berkas TTU mahasiswa",
      details:
        "Lihat berkas TTU yang telah diunggah mahasiswa. Pantau status tinjauan dan persetujuan dari dosen reviewer. Gunakan fitur pencarian untuk menemukan mahasiswa berdasarkan nama atau NIM.",
      color: "orange",
    },
    {
      number: "05",
      title: "Permintaan Dosen",
      description: "Kelola pengajuan dan perubahan dosen pembimbing",
      details:
        "Terdapat dua jenis permintaan: (1) Permintaan Dosen Pembimbing — pengajuan dosen pembimbing baru dari mahasiswa, dan (2) Permintaan Ganti Dosen Pembimbing — permohonan pergantian dosen pembimbing beserta alasannya. Setujui atau tolak setiap permintaan sesuai pertimbangan akademik.",
      color: "indigo",
    },
    {
      number: "06",
      title: "Penentuan Peninjau",
      description: "Tetapkan dosen peninjau (reviewer) untuk mahasiswa",
      details:
        "Pilih dosen peninjau untuk setiap mahasiswa yang akan mengikuti TTU 3. Sistem secara otomatis tidak menampilkan dosen pembimbing pada pilihan peninjau. Pastikan peninjau memiliki keahlian yang sesuai dengan topik penelitian mahasiswa.",
      color: "slate",
    },
    {
      number: "07",
      title: "Riwayat Bimbingan",
      description: "Arsip mahasiswa yang telah menyelesaikan bimbingan",
      details:
        "Lihat data historis mahasiswa yang telah menyelesaikan seluruh tahapan TTU. Informasi meliputi nama mahasiswa, judul tugas akhir, dosen pembimbing, dan tanggal penyelesaian. Gunakan fitur pencarian untuk menemukan mahasiswa berdasarkan nama atau NIM. Berguna untuk evaluasi dan pelaporan program studi.",
      color: "teal",
    },
    {
      number: "08",
      title: "Manajemen Dosen",
      description: "Lihat data dosen pembimbing program studi",
      details:
        "Lihat daftar dosen pembimbing dengan informasi lengkap (nama, NIP, email, status). Monitor jumlah mahasiswa bimbingan aktif setiap dosen. Status 'Aktif' menandakan dosen tersebut dapat dipilih sebagai pembimbing oleh mahasiswa. Pengelolaan data dosen (tambah/hapus/ubah status) dilakukan oleh Superadmin. Gunakan fitur pencarian untuk menemukan dosen berdasarkan nama atau NIP.",
      color: "red",
    },
    {
      number: "09",
      title: "Batas Waktu TTU",
      description: "Atur jadwal batas waktu untuk setiap tahap TTU",
      details:
        "Tentukan tanggal batas waktu untuk TTU 1 (Ujian Proposal), TTU 2 (Ujian Hasil), dan TTU 3 (Ujian Review). Sistem akan menampilkan status batas waktu (terlewat, mendekati, atau masih lama). Lihat ringkasan semua batas waktu dalam satu tabel.",
      color: "cyan",
    },
    {
      number: "10",
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

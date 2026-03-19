import React from "react";

export default function PanduanPage() {
  const steps = [
    {
      number: "01",
      title: "Dasbor",
      description: "Cek status dan progres terkini",
      details:
        "Halaman utama menampilkan ringkasan status tugas akhir Anda, termasuk tahapan TTU yang sedang berjalan, informasi dosen pembimbing, serta progres timeline. Anda dapat melihat status TTU 1, TTU 2, dan TTU 3 secara langsung dari halaman ini.",
      color: "blue",
    },
    {
      number: "02",
      title: "Unggah TTU",
      description: "Unggah dokumen TTU 1 dan TTU 2",
      details:
        "Unggah dokumen Tugas Talenta Unggul sesuai tahapan yang sedang berjalan. Pastikan format dokumen sesuai ketentuan yang berlaku. TTU 1 harus disetujui oleh dosen pembimbing sebelum TTU 2 dapat diunggah. Setelah TTU 2 disetujui, Anda dapat mengakses menu Daftar Tinjauan untuk mengunggah TTU 3.",
      color: "green",
    },
    {
      number: "03",
      title: "Bimbingan",
      description: "Informasi dosen pembimbing Anda",
      details:
        "Lihat informasi lengkap dosen pembimbing utama dan pembimbing kedua Anda, termasuk nama, email, dan NIDN. Anda juga dapat mengajukan permintaan pergantian dosen pembimbing dari halaman ini. Permintaan harus disetujui oleh kaprodi dan dosen pembimbing yang bersangkutan.",
      color: "purple",
    },
    {
      number: "04",
      title: "Daftar Tinjauan",
      description: "Unggah TTU 3 dan diskusi dengan dosen",
      details:
        "Menu ini dapat diakses setelah TTU 2 disetujui oleh dosen pembimbing. Unggah file TTU 3 untuk ditinjau oleh dosen peninjau yang telah ditentukan kaprodi. Anda juga dapat berkomunikasi dengan dosen peninjau dan dosen pembimbing melalui fitur diskusi tinjauan yang tersedia di halaman ini.",
      color: "orange",
    },
    {
      number: "05",
      title: "Data Akun",
      description: "Kelola informasi akun Anda",
      details:
        "Lihat dan perbarui informasi profil pribadi seperti nama, NIM, program studi, dan email. Pastikan data yang tercatat sudah benar dan sesuai dengan data resmi kampus.",
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
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Panduan Mahasiswa</h2>
        <p className="text-slate-500 mt-1">
          Pelajari cara menggunakan fitur-fitur yang tersedia
        </p>
      </div>
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

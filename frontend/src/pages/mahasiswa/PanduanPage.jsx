import React from "react";

export default function PanduanPage() {
  const steps = [
    {
      number: "01",
      title: "Dashboard",
      description: "Cek status dan progres terkini",
      details:
        "Halaman utama menampilkan ringkasan status tugas akhir Anda, termasuk tahapan TTU yang sedang berjalan, dosen pembimbing, dan timeline progres. Anda juga dapat mengajukan permintaan pergantian dosen pembimbing.",
      color: "blue",
    },
    {
      number: "02",
      title: "Upload TTU",
      description: "Upload draf TTU",
      details:
        "Upload dokumen Tugas Talenta Unggul Anda. Pastikan format dokumen sesuai dengan ketentuan yang berlaku. Setiap tahapan TTU harus disetujui dosen pembimbing sebelum lanjut ke tahap berikutnya.",
      color: "green",
    },
    {
      number: "03",
      title: "Bimbingan",
      description: "Informasi dan komunikasi dengan dosen pembimbing",
      details:
        "Lihat informasi lengkap dosen pembimbing utama dan pembimbing kedua Anda, termasuk nama, email, dan NIDN. Gunakan menu ini untuk melihat detail pembimbing yang ditugaskan untuk membimbing tugas akhir Anda.",
      color: "purple",
    },
    {
      number: "04",
      title: "Daftar Review",
      description: "Upload file TTU yang sudah disetujui",
      details:
        "Menu ini hanya dapat diakses setelah TTU 2 Anda disetujui oleh dosen pembimbing. Upload file Tugas Talenta Unggul yang telah mendapat persetujuan untuk direview oleh tim akademik.",
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
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Panduan Mahasiswa
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Panduan lengkap penggunaan sistem SITA S1 TI untuk mahasiswa.
              Ikuti setiap tahapan dengan benar untuk memastikan proses tugas
              akhir Anda berjalan lancar.
            </p>
          </div>
        </div>
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

import React from "react";

export default function PanduanPage() {
  const steps = [
    {
      number: "01",
      title: "Dashboard",
      description: "Cek status dan progres terkini",
      details:
        "Halaman utama menampilkan ringkasan status tugas akhir Anda, termasuk tahapan TTU yang sedang berjalan, dosen pembimbing, dan timeline progres.",
      color: "blue",
    },
    {
      number: "02",
      title: "Upload TTU",
      description: "Upload draf per bab (TTU 1, 2, 3)",
      details:
        "Upload dokumen Tugas Tulis Usulan sesuai tahapan: TTU 1 (Bab 1-3), TTU 2 (Bab 4), dan TTU 3 (Bab 5). Pastikan format dokumen adalah PDF dengan ukuran maksimal 10 MB.",
      color: "green",
    },
    {
      number: "03",
      title: "Pembimbing",
      description: "Informasi dosen pembimbing Tugas Akhir",
      details:
        "Lihat informasi lengkap dosen pembimbing Anda termasuk nama, email, dan NIDN. Jika diperlukan, ajukan permintaan pergantian dosen pembimbing dengan mengisi formulir disertai alasan yang jelas. Permintaan akan diproses oleh Kaprodi.",
      color: "purple",
    },
    {
      number: "04",
      title: "Upload Berkas",
      description: "Upload syarat sidang setelah lulus TTU",
      details:
        "Setelah menyelesaikan tahapan TTU, upload dokumen persyaratan sidang seperti transkrip nilai, KST, ijasah SMA, lembar pengesahan, pas foto, dan fotocopy KTP. Pastikan semua berkas lengkap sebelum mengirim.",
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

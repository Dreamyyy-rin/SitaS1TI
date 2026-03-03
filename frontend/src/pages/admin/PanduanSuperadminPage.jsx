import React from "react";

const PanduanSuperadminPage = () => {
  const steps = [
    {
      number: "01",
      title: "Dashboard",
      description: "Statistik dan ringkasan sistem",
      details:
        "Dashboard menampilkan ringkasan statistik sistem meliputi Total Dosen, Total Mahasiswa, dan User Aktif. Anda dapat mengakses menu manajemen secara cepat melalui tombol 'Kelola Dosen' dan 'Kelola Mahasiswa' yang tersedia di dashboard untuk navigasi yang lebih efisien.",
      color: "blue",
    },
    {
      number: "02",
      title: "Manajemen Dosen",
      description: "Kelola data dan akun dosen",
      details:
        "Menu untuk mengelola seluruh data dosen. Anda dapat menambah dosen baru dengan mengisi NIDN, nama, email, dan password. Edit data dosen yang sudah ada termasuk mereset password jika diperlukan. Hapus data dengan pilihan Soft Delete (nonaktifkan) atau Hard Delete (hapus permanen). Gunakan fitur pencarian untuk menemukan dosen berdasarkan nama atau NIDN.",
      color: "indigo",
    },
    {
      number: "03",
      title: "Manajemen Mahasiswa",
      description: "Kelola data dan akun mahasiswa",
      details:
        "Menu untuk mengelola seluruh data mahasiswa. Tambah mahasiswa baru dengan mengisi NIM, nama, program studi, email, dan password. Edit data mahasiswa yang sudah terdaftar termasuk update password jika diperlukan. Nonaktifkan atau hapus akun mahasiswa sesuai kebutuhan. Fitur pencarian memudahkan Anda menemukan mahasiswa berdasarkan nama, NIM, atau program studi.",
      color: "green",
    },
  ];

  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      number: "text-blue-600",
      gradient: "from-blue-500 to-blue-600",
    },
    indigo: {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      number: "text-indigo-600",
      gradient: "from-indigo-500 to-indigo-600",
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      number: "text-green-600",
      gradient: "from-green-500 to-green-600",
    },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Panduan Superadmin
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Panduan lengkap penggunaan sistem manajemen SITA S1 TI untuk
              superadmin. Kelola data dosen dan mahasiswa dengan mudah dan
              efisien melalui panel administrasi.
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
};

export default PanduanSuperadminPage;

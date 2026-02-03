import React from "react";

export default function PanduanPage() {
  const steps = [
    {
      number: "01",
      title: "Dashboard",
      description: "Cek status dan progres terkini",
      details:
        "Halaman utama menampilkan ringkasan status tugas akhir Anda, termasuk tahapan TTU yang sedang berjalan, dosen pembimbing, dan timeline progres.",
      icon: <path d="M4 4h6v8H4zM4 16h6v4H4zM14 4h6v4h-6zM14 12h6v8h-6z" />,
      color: "blue",
    },
    {
      number: "02",
      title: "Upload TTU",
      description: "Upload draf per bab (TTU 1, 2, 3)",
      details:
        "Upload dokumen Tugas Tulis Usulan sesuai tahapan: TTU 1 (Bab 1-3), TTU 2 (Bab 4), dan TTU 3 (Bab 5). Pastikan format dokumen adalah PDF dengan ukuran maksimal 10 MB.",
      icon: (
        <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12" />
      ),
      color: "green",
    },
    {
      number: "03",
      title: "Review",
      description: "Diskusi revisi dengan dosen pembimbing",
      details:
        "Fitur chat terintegrasi untuk berkomunikasi dengan dosen pembimbing. Diskusikan feedback, tanyakan revisi yang diperlukan, dan dapatkan arahan langsung dari dosen.",
      icon: (
        <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      ),
      color: "purple",
    },
    {
      number: "04",
      title: "Upload Berkas",
      description: "Upload syarat sidang setelah lulus TTU 2",
      details:
        "Setelah menyelesaikan TTU 2, upload dokumen persyaratan sidang seperti form persetujuan, lembar pengesahan, dan dokumen pendukung lainnya yang dibutuhkan untuk sidang akhir.",
      icon: (
        <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      ),
      color: "orange",
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
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Panduan Sistem SITA S1 TI
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Panduan lengkap penggunaan sistem informasi tugas akhir. Ikuti
              setiap tahapan dengan benar untuk memastikan proses tugas akhir
              Anda berjalan lancar.
            </p>
          </div>
        </div>
      </div>

      {/* Steps Timeline */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const colors = colorClasses[step.color];
          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start p-6 gap-5">
                {/* Step Number & Icon */}
                <div className="flex-shrink-0">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${colors.gradient} rounded-xl flex items-center justify-center shadow-lg mb-2`}
                  >
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {step.icon}
                    </svg>
                  </div>
                  <div
                    className={`text-center text-2xl font-bold ${colors.number} font-mono`}
                  >
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-3 font-medium">
                    {step.description}
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    {step.details}
                  </p>

                  {/* Additional Tips/Info */}
                  {index === 1 && (
                    <div
                      className={`mt-4 p-3 ${colors.bg} border ${colors.border} rounded-lg`}
                    >
                      <p className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                        <svg
                          className={`w-4 h-4 ${colors.icon}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Persyaratan File
                      </p>
                      <ul className="text-xs text-slate-600 space-y-0.5 ml-5 list-disc">
                        <li>Ukuran maksimal: 10 MB</li>
                      </ul>
                    </div>
                  )}

                  {index === 2 && (
                    <div
                      className={`mt-4 p-3 ${colors.bg} border ${colors.border} rounded-lg`}
                    >
                      <p className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                        <svg
                          className={`w-4 h-4 ${colors.icon}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Tips Komunikasi
                      </p>
                      <ul className="text-xs text-slate-600 space-y-0.5 ml-5 list-disc">
                        <li>Gunakan bahasa yang sopan dan profesional</li>
                        <li>Sertakan konteks yang jelas saat bertanya</li>
                        <li>
                          Cek notifikasi secara berkala untuk respons dosen
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Connector Line (except for last item) */}
                {index < steps.length - 1 && (
                  <div className="absolute left-[3.5rem] top-[7rem] w-0.5 h-8 bg-slate-200"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

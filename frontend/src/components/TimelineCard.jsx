import React from "react";

const TimelineCard = ({ student }) => {
  const progress = React.useMemo(() => {
    if (student.stage === "TTU 1") return 35;
    if (student.stage === "TTU 2") return 70;
    return 100;
  }, [student.stage]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">
            Linimasa Tugas Akhir
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Progres pengerjaan tahapan Tugas Talenta Unggul
          </p>
        </div>
      </div>

      <div className="mt-4 relative pt-4 pb-12 px-4">
        <div className="absolute top-[2.5rem] left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full z-0"></div>

        <div className="relative flex justify-between w-full">
          {["TTU 1", "TTU 2", "TTU 3"].map((step, idx) => {
            const stepIndex = ["TTU 1", "TTU 2", "TTU 3"].indexOf(
              student.stage,
            );
            const isCompleted = idx < stepIndex + 1;
            const isCurrent = step === student.stage;

            return (
              <div
                key={step}
                className="flex flex-col items-center gap-4 relative z-10 group w-1/3"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 bg-white ${
                    isCompleted || isCurrent
                      ? "border-[#0B2F7F] text-[#0B2F7F]"
                      : "border-slate-200 text-slate-300"
                  }`}
                >
                  {idx <= stepIndex ? (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span className="text-sm font-bold">{idx + 1}</span>
                  )}
                </div>

                <div className="text-center">
                  <p
                    className={`text-base font-bold ${
                      isCurrent ? "text-[#0B2F7F]" : "text-slate-500"
                    }`}
                  >
                    {step}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {idx < stepIndex
                      ? "Selesai"
                      : isCurrent
                        ? "Sedang Dikerjakan"
                        : "Menunggu"}
                  </p>
                </div>

                {isCurrent && (
                  <div className="absolute -top-10 animate-bounce">
                    <span className="bg-[#0B2F7F] text-white text-xs px-2 py-1 rounded shadow-md">
                      Posisi Saat Ini
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="mt-4 pt-6 border-t border-slate-50">
        <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <svg
            className="w-4 h-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Aktivitas Terbaru
        </h4>
        <div className="space-y-4">
          <div className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="flex-shrink-0 mt-1">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0B2F7F] flex items-center justify-center">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-slate-800">
                  Revisi Bab 2 diserahkan
                </p>
                <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                  2 Hari yang lalu • 14:00
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Anda mengupload dokumen "Revisi_Bab2_V3.docx"
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="flex-shrink-0 mt-1">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-slate-800">
                  Catatan baru dari Pembimbing
                </p>
                <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                  3 Hari yang lalu • 09:30
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                "Perbaiki sitasi pada bagian latar belakang..."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineCard;

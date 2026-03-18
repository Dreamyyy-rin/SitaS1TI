import React from "react";

const TimelineCard = ({ student }) => {
  const ttuStages = ["TTU 1", "TTU 2", "TTU 3"];

  // Compute step index from actual ttu_status
  const getStepIndex = () => {
    const ttu = student.ttu_status || {};
    if (ttu.ttu_3?.status === "approved") return 3; // all done
    if (ttu.ttu_2?.status === "approved") return 2;
    if (ttu.ttu_1?.status === "approved") return 1;
    return 0;
  };

  const stepIndex = getStepIndex();

  const getStepLabel = (idx) => {
    const ttu = student.ttu_status || {};
    const key = `ttu_${idx + 1}`;
    const status = ttu[key]?.status;
    if (status === "approved") return "Selesai";
    if (status === "reviewed") return "Sudah Direview";
    if (status === "submitted") return "Menunggu Review";
    if (status === "open") return "Sedang Dikerjakan";
    return "Terkunci";
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">
            Linimasa Tugas Akhir
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Progres pengerjaan Tugas Talenta Unggul
          </p>
        </div>
      </div>

      <div className="mt-4 relative pt-4 pb-12 px-4">
        <div className="absolute top-[2.5rem] left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full z-0"></div>

        <div className="relative flex justify-between w-full">
          {ttuStages.map((step, idx) => {
            const isCompleted = idx < stepIndex;
            const isCurrent = idx === stepIndex && stepIndex < 3;

            return (
              <div
                key={step}
                className="flex flex-col items-center gap-4 relative z-10 group w-1/3"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 bg-white ${
                    isCompleted
                      ? "border-green-500 text-green-600"
                      : isCurrent
                        ? "border-[#0B2F7F] text-[#0B2F7F]"
                        : "border-slate-200 text-slate-300"
                  }`}
                >
                  {isCompleted ? (
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
                      isCompleted
                        ? "text-green-600"
                        : isCurrent
                          ? "text-[#0B2F7F]"
                          : "text-slate-500"
                    }`}
                  >
                    {step}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {getStepLabel(idx)}
                  </p>
                </div>

                {isCurrent && (
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2">
                    <span className="bg-[#0B2F7F] text-white text-[10px] sm:text-xs px-2 py-1 rounded shadow-md text-center leading-tight max-w-[7.5rem] block animate-bounce">
                      Posisi Saat Ini
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TimelineCard;

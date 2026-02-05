import React from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

const DeadlineSummaryTable = ({
  ttuStages,
  deadlines,
  getDaysUntil,
  isApproaching,
  isPassed,
  formatDate,
  getColorClasses,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
        <h3 className="text-lg font-bold text-slate-800">Ringkasan Deadline</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                Tahap
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                Tanggal Deadline
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ttuStages.map((stage) => {
              const deadline = deadlines[stage.key];
              const daysUntil = getDaysUntil(deadline.date);
              const isWarning = isApproaching(deadline.date);
              const isDanger = isPassed(deadline.date);

              return (
                <tr key={stage.key} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <stage.icon
                        className={`w-5 h-5 ${
                          getColorClasses(stage.color).text
                        }`}
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {stage.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {stage.subtitle}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {deadline.date ? (
                      <span className="text-sm text-slate-700 font-medium">
                        {formatDate(deadline.date)}
                      </span>
                    ) : (
                      <span className="text-sm text-slate-400 italic">
                        Belum ditentukan
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {!deadline.date ? (
                      <span className="inline-flex items-center px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
                        Belum diatur
                      </span>
                    ) : isDanger ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                        <AlertTriangle className="w-3 h-3" />
                        Terlewat
                      </span>
                    ) : isWarning ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">
                        <AlertTriangle className="w-3 h-3" />
                        {daysUntil} hari lagi
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        {daysUntil} hari lagi
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeadlineSummaryTable;

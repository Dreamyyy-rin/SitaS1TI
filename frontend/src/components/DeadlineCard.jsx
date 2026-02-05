import React from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

const DeadlineCard = ({
  stage,
  deadline,
  daysUntil,
  isWarning,
  isDanger,
  colors,
  onDateChange,
  formatDate,
}) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border-2 transition-all hover:shadow-md ${
        isDanger
          ? "border-red-300"
          : isWarning
            ? "border-yellow-300"
            : "border-slate-100"
      }`}
    >
     
      <div
        className={`${colors.bg} p-6 rounded-t-2xl border-b-2 ${colors.border}`}
      >
        <div className="flex items-start justify-between mb-3">
          <div
            className={`w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center`}
          >
            <stage.icon className={`w-6 h-6 ${colors.text}`} />
          </div>
          {deadline.date && (
            <div>
              {isDanger ? (
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
            </div>
          )}
        </div>
        <h3 className={`text-xl font-bold ${colors.text} mb-1`}>
          {stage.title}
        </h3>
        <p className="text-sm text-slate-600 font-medium">{stage.subtitle}</p>
      </div>

    
      <div className="p-6 space-y-5">

        <p className="text-sm text-slate-600 leading-relaxed">
          {stage.description}
        </p>

      
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Tanggal Deadline
          </label>
          <input
            type="date"
            value={deadline.date}
            onChange={(e) => onDateChange(stage.key, e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {deadline.date && (
            <p className="mt-2 text-xs text-slate-500">
              {formatDate(deadline.date)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeadlineCard;

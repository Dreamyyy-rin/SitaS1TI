import React from "react";

const Card = ({ children, className = "", title, subtitle, action }) => (
  <div
    className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-100 ${className}`}
  >
    {(title || action) && (
      <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
        <div>
          {title && (
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
    )}
    {children}
  </div>
);

export default Card;

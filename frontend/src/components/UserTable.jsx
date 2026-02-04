import React from "react";
import { Edit, Trash2 } from "lucide-react";

const getInitials = (name = "") => {
  const parts = name.trim().split(" ");
  if (!parts.length) return "-";
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return `${first}${last}`.toUpperCase();
};

const UserTable = ({
  data,
  onEdit,
  onDelete,
  hideProdi = false,
  idLabel = "NIP/NIM",
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <table className="min-w-full">
        <thead className="bg-slate-50">
          <tr className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
            <th className="px-6 py-4 text-center">No</th>
            <th className="px-6 py-4 text-center">Nama</th>
            <th className="px-6 py-4 text-center">{idLabel}</th>
            {!hideProdi && <th className="px-6 py-4 text-center">Prodi</th>}
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((user, index) => (
            <tr
              key={user.id}
              className={`text-sm text-slate-600 transition-colors ${
                index % 2 === 0 ? "bg-white" : "bg-slate-50/40"
              } hover:bg-blue-50/40`}
            >
              <td className="px-6 py-4 text-center font-medium text-slate-800">
                {index + 1}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                    {getInitials(user.name)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-400 capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 font-mono text-xs text-slate-500 text-center">
                {user.idNumber}
              </td>
              {!hideProdi && (
                <td className="px-6 py-4 text-center">{user.prodi}</td>
              )}
              <td className="px-6 py-4 text-center">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                    user.status === "active"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {user.status === "active" ? "Aktif" : "Nonaktif"}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onEdit?.(user)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50 transition"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete?.(user)}
                    className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {!data.length && (
            <tr>
              <td
                colSpan={hideProdi ? 5 : 6}
                className="px-6 py-10 text-center text-sm text-slate-400"
              >
                Belum ada data pengguna.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;

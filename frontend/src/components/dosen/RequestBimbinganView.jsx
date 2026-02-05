import React from "react";
import { ClipboardList } from "lucide-react";
import RequestBimbinganCard from "../shared/RequestBimbinganCard";

export default function RequestBimbinganView({
  requestBimbingan = [],
  onAccept,
  onReject,
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-[#0B2F7F] mb-4">
          Request Bimbingan Mahasiswa
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Mahasiswa
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Judul yang Diajukan
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Tanggal
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {requestBimbingan.map((req) => (
                <RequestBimbinganCard
                  key={req.id}
                  request={req}
                  onAccept={onAccept}
                  onReject={onReject}
                />
              ))}
            </tbody>
          </table>
        </div>
        {requestBimbingan.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <ClipboardList className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>Belum ada request bimbingan</p>
          </div>
        )}
      </div>
    </div>
  );
}

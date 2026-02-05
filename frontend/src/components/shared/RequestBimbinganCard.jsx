import React from "react";

const RequestBimbinganCard = ({ request, onAccept, onReject }) => {
  return (
    <tr className="border-t hover:bg-gray-50">
      <td className="px-4 py-3 text-sm">
        <div>
          <p className="font-semibold text-slate-800">{request.nama}</p>
          <p className="text-xs text-slate-500">{request.nim}</p>
        </div>
      </td>
      <td className="px-4 py-3 text-sm">{request.judul}</td>
      <td className="px-4 py-3 text-sm">{request.tanggal}</td>
      <td className="px-4 py-3 text-center">
        <div className="flex justify-center gap-2">
          <button
            onClick={() => onAccept(request.id)}
            className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
          >
            Terima
          </button>
          <button
            onClick={() => onReject(request.id)}
            className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
          >
            Tolak
          </button>
        </div>
      </td>
    </tr>
  );
};

export default RequestBimbinganCard;

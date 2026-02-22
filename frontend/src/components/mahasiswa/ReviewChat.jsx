import React from "react";
import { Mail, User } from "lucide-react";

const ReviewChat = ({ pembimbing }) => {
  const pembimbingList = [
    { label: "Pembimbing 1", data: pembimbing?.pembimbing_1 },
    { label: "Pembimbing 2", data: pembimbing?.pembimbing_2 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Review & Bimbingan
            </h2>
            <p className="text-gray-600">
              Informasi dosen pembimbing Anda dan akses cepat ke email
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
          <User className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">Dosen Pembimbing</h3>
        </div>

        <div className="space-y-6">
          {pembimbingList.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-5 border-b border-gray-100 pb-6 last:border-b-0 last:pb-0"
            >
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 font-bold">
                {item.data
                  ? item.data.nama
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                  : "-"}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-700">
                  {item.label}
                </p>
                {item.data ? (
                  <>
                    <p className="text-lg font-semibold text-gray-900">
                      {item.data.nama}
                    </p>
                    {item.data.nidn && (
                      <p className="text-sm text-gray-500 font-mono">
                        NIDN: {item.data.nidn}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4 text-blue-500" />
                      <a
                        href={`mailto:${item.data.email}`}
                        className="text-sm hover:text-blue-600 transition-colors"
                      >
                        {item.data.email}
                      </a>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-400">Belum ditetapkan</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewChat;

import React from "react";
import { ClipboardList, Users, CheckCircle } from "lucide-react";

export default function DashboardView({
  requestBimbingan = [],
  mahasiswaBimbingan = [],
  recentActivities = [],
}) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Request Bimbingan</p>
              <p className="text-2xl font-bold text-[#0B2F7F] mt-1">
                {requestBimbingan.length}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <ClipboardList className="w-6 h-6 text-[#0B2F7F]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Mahasiswa</p>
              <p className="text-2xl font-bold text-[#0B2F7F] mt-1">
                {mahasiswaBimbingan.length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">TTU Selesai</p>
              <p className="text-2xl font-bold text-[#0B2F7F] mt-1">1</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-[#0B2F7F] mb-4">
          Aktivitas Terbaru
        </h3>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 pb-3 border-b last:border-b-0"
            >
              <div
                className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === "request"
                    ? "bg-blue-500"
                    : activity.type === "upload"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                }`}
              ></div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useMemo, useRef, useEffect } from "react";
import SidebarMahasiswa from "../components/SidebarMahasiswa";

export default function MahasiswaDashboard() {
  //data mahasiswa dummy
  const student = {
    name: "Budi Santoso",
    nim: "672022001",
    prodi: "Teknik Informatika",
    email: "budi.santoso@student.uksw.edu",
    stage: "TTU 2",
    supervisor: "Dr. Indonesia Raya, S.Kom., M.T.",
  };

  const [view, setView] = useState("home");
  const [activeMenu, setActiveMenu] = useState("home");

  //logic linimasa
  const progress = useMemo(() => {
    if (student.stage === "TTU 1") return 35;
    if (student.stage === "TTU 2") return 70;
    return 100;
  }, [student.stage]);

  //dummy menu lain
  const [ttuFile, setTtuFile] = useState(null);

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

  const HomeView = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
        <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 font-medium">
          Semester Genap 2025/2026
        </div>
      </div>

      {/*profile card*/}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full -mr-16 -mt-16 opacity-50"></div>

        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="w-24 h-24 rounded-full bg-[#0B2F7F] flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-900/20 border-4 border-white">
            {student.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>

          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            <div>
              <p className="text-sm text-slate-400 mb-1">Nama Lengkap</p>
              <p className="text-lg font-semibold text-slate-800">
                {student.name}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">NIM</p>
              <p className="text-lg font-semibold text-slate-700 font-mono">
                {student.nim}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Program Studi</p>
              <p className="text-base font-medium text-slate-700">
                {student.prodi}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Dosen Pembimbing</p>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-orange-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <p className="text-base font-medium text-slate-700">
                  {student.supervisor}
                </p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-end pl-6">
            <p className="text-sm text-slate-400 mb-2">Tahap Pengerjaan</p>
            <div className="px-4 py-2 bg-blue-50 text-[#0B2F7F] rounded-lg font-bold text-lg border border-blue-100">
              {student.stage}
            </div>
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Sedang Berjalan
            </p>
          </div>
        </div>
      </div>

      {/* linimasa*/}
      <Card
        title="Linimasa Tugas Akhir"
        subtitle="Progres pengerjaan tahapan Tugas Talenta Unggul"
      >
        <div className="mt-4 relative pt-4 pb-12 px-4">
          <div className="absolute top-[2.5rem] left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full z-0"></div>

          <div className="relative flex justify-between w-full">
            {["TTU 1", "TTU 2", "TTU 3"].map((step, idx) => {
              const stepIndex = ["TTU 1", "TTU 2", "TTU 3"].indexOf(
                student.stage
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

        {/*riwayat/ aktivitas tebaru*/}
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
      </Card>
    </div>
  );

  const UploadTTUView = () => (
    <Card
      title="Upload Dokumen TTU (Coming Soon)"
      subtitle={`Silakan upload draf untuk tahap ${student.stage}`}
    >
      <div className="mt-4 border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center hover:border-[#0B2F7F] transition-colors bg-slate-50/50 group">
        <div className="w-16 h-16 bg-white text-slate-400 group-hover:text-[#0B2F7F] group-hover:shadow-md rounded-full flex items-center justify-center mb-4 transition-all duration-300">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        <p className="text-slate-800 font-medium">
          Drag & drop file di sini, atau klik untuk memilih
        </p>
        <p className="text-sm text-slate-400 mt-2 mb-6">
          Mendukung format .PDF, .DOCX (Max 5MB)
        </p>
        <input
          type="file"
          onChange={(e) => setTtuFile(e.target.files[0])}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="px-6 py-2.5 bg-[#0B2F7F] text-white rounded-xl font-medium cursor-pointer hover:bg-indigo-900 transition-colors shadow-lg shadow-blue-900/20 transform hover:-translate-y-1"
        >
          Pilih File
        </label>
        {ttuFile && (
          <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#0B2F7F] bg-blue-50 px-4 py-3 rounded-lg border border-blue-100">
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {ttuFile.name}
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-sans text-slate-600">
      <SidebarMahasiswa
        activeMenu={activeMenu}
        onMenuClick={(key, viewName) => {
          setActiveMenu(key);
          setView(viewName);
        }}
        onLogout={() => {
          setView("home");
          setActiveMenu("home");
        }}
        student={student}
      />

      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto pb-10">
          {view === "home" && <HomeView />}
          {view === "upload-ttu" && <UploadTTUView />}
          {view === "review" && (
            <Card
              title="Review (Coming Soon)"
              subtitle="Riwayat bimbingan dengan dosen"
            >
              <div className="p-12 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                Halaman Review
              </div>
            </Card>
          )}
          {view === "upload-berkas" && (
            <Card
              title="Upload Berkas  (Coming Soon)"
              subtitle="Upload berkas finalisasi"
            >
              <div className="p-12 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                Halaman Upload Berkas
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

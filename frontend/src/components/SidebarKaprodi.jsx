import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SidebarKaprodi = ({ activeMenu, onMenuClick, onLogout, user }) => {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const navigate = useNavigate();

  const menuSections = [
    {
      label: "MENU UTAMA",
      items: [
        {
          key: "dashboard",
          label: "Dashboard",
          view: "dashboard",
          icon: "dashboard",
        },
        {
          key: "mahasiswa-bimbingan",
          label: "Mahasiswa Bimbingan",
          view: "mahasiswa-bimbingan",
          icon: "users",
        },
        {
          key: "review",
          label: "Review",
          view: "review",
          icon: "clipboard-check",
        },
        {
          key: "request-dosen",
          label: "Request Dosen",
          view: "request-dosen",
          icon: "user-plus",
          badge: 3,
        },
        {
          key: "plotting",
          label: "Plotting Reviewer",
          view: "plotting",
          icon: "git-branch",
        },
        {
          key: "riwayat",
          label: "Riwayat Bimbingan",
          view: "riwayat",
          icon: "history",
        },
        {
          key: "data-dosen",
          label: "Manajemen Dosen",
          view: "data-dosen",
          icon: "users-round",
        },
      ],
    },
    {
      label: "PENGATURAN",
      items: [
        {
          key: "deadline",
          label: "Deadline TTU",
          view: "deadline",
          icon: "calendar-clock",
        },
        {
          key: "data-akun",
          label: "Data Akun",
          view: "data-akun",
          icon: "user-cog",
        },
      ],
    },
    {
      label: "BANTUAN",
      items: [
        {
          key: "panduan",
          label: "Panduan",
          view: "panduan",
          icon: "book",
        },
      ],
    },
  ];

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleCancel = () => {
    setShowLogoutDialog(false);
  };

  const handleConfirmLogout = () => {
    if (onLogout) onLogout();

    navigate("/");
  };

  const Icon = ({ name, className }) => {
    const icons = {
      dashboard: (
        <path d="M4 4h6v8H4zM4 16h6v4H4zM14 4h6v4h-6zM14 12h6v8h-6z" />
      ),
      "user-plus": (
        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M8.5 11a4 4 0 100-8 4 4 0 000 8zM20 8v6M23 11h-6" />
      ),
      users: (
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      ),
      history: <path d="M3 12a9 9 0 1018 0 9 9 0 00-18 0zM12 7v5l3 3" />,
      "user-cog": (
        <>
          <path d="M10 9a3 3 0 100-6 3 3 0 000 6z" />
          <path d="M6 21v-2a4 4 0 014-4h2.5M19 21v-1m0-4v-1m-2.121.879l.707-.707m2.828 2.828l.707-.707M19 17.5c-.552 0-1-.224-1-.5s.448-.5 1-.5 1 .224 1 .5-.448.5-1 .5z" />
        </>
      ),
      book: (
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 016.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15zm0 0v-15M9 10h6m-6 4h6" />
      ),
      logout: (
        <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      ),
      user: (
        <path
          fillRule="evenodd"
          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
          clipRule="evenodd"
        />
      ),
    };
    return (
      <svg
        className={className}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        {icons[name]}
      </svg>
    );
  };

  return (
    <>
      <aside className="w-64 bg-white h-screen flex flex-col font-sans border-r border-slate-100 fixed left-0 top-0 z-10 shadow-[2px_0_20px_rgba(0,0,0,0.02)]">
        <div className="px-8 py-8 flex items-center gap-4">
          <img
            src="/fti.png"
            alt="Logo FTI"
            className="w-10 h-10 rounded-full object-cover shadow-md border border-white"
          />

          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            SITA <span className="text-[#0B2F7F]">S1 TI</span>
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {menuSections.map((section, sectionIndex) => (
            <div key={section.label}>
              <div className="px-4 mb-2 mt-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {section.label}
                </span>
              </div>

              {section.items.map((item) => {
                const isActive = activeMenu === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => onMenuClick(item.key, item.view)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                      isActive
                        ? "bg-[#0B2F7F]/10 text-[#0B2F7F]"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 ${
                        isActive
                          ? "text-[#0B2F7F]"
                          : "text-slate-400 group-hover:text-slate-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {item.icon === "dashboard" && (
                        <path d="M4 4h6v8H4zM4 16h6v4H4zM14 4h6v4h-6zM14 12h6v8h-6z" />
                      )}
                      {item.icon === "user-plus" && (
                        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M8.5 11a4 4 0 100-8 4 4 0 000 8zM20 8v6M23 11h-6" />
                      )}
                      {item.icon === "git-branch" && (
                        <path d="M6 3v12M18 9a3 3 0 100-6 3 3 0 000 6zM6 21a3 3 0 100-6 3 3 0 000 6zM18 9l-6 6" />
                      )}
                      {item.icon === "users" && (
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                      )}
                      {item.icon === "users-round" && (
                        <>
                          <path d="M18 21a8 8 0 00-16 0M14 11a4 4 0 11-8 0 4 4 0 018 0zM23 21a8 8 0 00-6.927-7.932" />
                          <path d="M18.5 11a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" />
                        </>
                      )}
                      {item.icon === "history" && (
                        <path d="M3 12a9 9 0 1018 0 9 9 0 00-18 0zM12 7v5l3 3" />
                      )}
                      {item.icon === "clipboard-check" && (
                        <>
                          <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
                          <rect
                            x="8"
                            y="2"
                            width="8"
                            height="4"
                            rx="1"
                            ry="1"
                          />
                          <path d="M9 12l2 2 4-4" />
                        </>
                      )}
                      {item.icon === "calendar-clock" && (
                        <>
                          <path d="M21 7.5V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h3.5M16 2v4M8 2v4M3 10h18" />
                          <circle cx="17.5" cy="17.5" r="5" />
                          <path d="M17.5 15v2.5L19 19" />
                        </>
                      )}
                      {item.icon === "user-cog" && (
                        <>
                          <path d="M10 9a3 3 0 100-6 3 3 0 000 6z" />
                          <path d="M6 21v-2a4 4 0 014-4h2.5M19 21v-1m0-4v-1m-2.121.879l.707-.707m2.828 2.828l.707-.707M19 17.5c-.552 0-1-.224-1-.5s.448-.5 1-.5 1 .224 1 .5-.448.5-1 .5z" />
                        </>
                      )}
                      {item.icon === "book" && (
                        <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 016.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15zm0 0v-15M9 10h6m-6 4h6" />
                      )}
                    </svg>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-auto">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between p-3 rounded-xl  cursor-pointer group border border-transparent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 border-2 border-white shadow-sm">
                <Icon name="user" className="w-6 h-6" />
              </div>

              <div className="text-left overflow-hidden">
                <p className="text-sm font-bold text-slate-700 truncate group-hover:text-[#0B2F7F] transition-colors">
                  {user?.name || "Kaprodi"}
                </p>

                <p className="text-xs text-slate-500 font-mono">
                  {user?.nip || "NIP Kaprodi"}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogoutClick}
              className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"
              title="Keluar"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {showLogoutDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-all"
            onClick={handleCancel}
          ></div>

          <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 border border-slate-100 transform transition-all scale-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 ring-4 ring-red-50/50">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>

              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Apakah Anda Yakin untuk Keluar?
              </h3>

              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Anda akan diarahkan kembali ke halaman utama.
              </p>

              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmLogout}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all transform active:scale-95"
                >
                  Ya, Keluar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarKaprodi;

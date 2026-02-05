import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminSidebar = ({ activeMenu, onMenuClick, onLogout, admin }) => {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const navigate = useNavigate();

  const menuSections = [
    {
      label: "MENU UTAMA",
      items: [
        { key: "dashboard", label: "Dashboard", icon: "dashboard" },
        { key: "dosen", label: "Manajemen Dosen", icon: "user-check" },
        { key: "mahasiswa", label: "Manajemen Mahasiswa", icon: "users" },
      ],
    },
    {
      label: "BANTUAN",
      items: [{ key: "panduan", label: "Panduan", icon: "book" }],
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
      "user-check": (
        <>
          <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <polyline points="17 11 19 13 23 9" />
        </>
      ),
      users: (
        <>
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
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
                    onClick={() => onMenuClick(item.key)}
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
                      {item.icon === "user-check" && (
                        <>
                          <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                          <circle cx="8.5" cy="7" r="4" />
                          <polyline points="17 11 19 13 23 9" />
                        </>
                      )}
                      {item.icon === "users" && (
                        <>
                          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 00-3-3.87" />
                          <path d="M16 3.13a4 4 0 010 7.75" />
                        </>
                      )}
                      {item.icon === "book" && (
                        <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 016.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15zm0 0v-15M9 10h6m-6 4h6" />
                      )}
                    </svg>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>


        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between p-3 rounded-xl cursor-pointer group border border-transparent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 border-2 border-white shadow-sm">
                <Icon name="user" className="w-6 h-6" />
              </div>

              <div className="text-left overflow-hidden">
                <p className="text-sm font-bold text-slate-700 truncate group-hover:text-[#0B2F7F] transition-colors">
                  {admin?.name || "Superadmin"}
                </p>

                <p className="text-xs text-slate-500 font-mono">
                  Administrator
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

export default AdminSidebar;

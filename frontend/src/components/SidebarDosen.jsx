import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  UserCog,
  BookOpen,
  LogOut,
  User,
} from "lucide-react";

const SidebarDosen = ({ activeMenu, onMenuClick, onLogout, user }) => {
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
          icon: LayoutDashboard,
        },
        {
          key: "request-bimbingan",
          label: "Request Bimbingan",
          view: "request-bimbingan",
          icon: ClipboardList,
          badge: 1,
        },
        {
          key: "mahasiswa-saya",
          label: "Mahasiswa Saya",
          view: "mahasiswa-saya",
          icon: Users,
        },
      ],
    },
    {
      label: "PENGATURAN",
      items: [
        {
          key: "data-akun",
          label: "Data Akun",
          view: "data-akun",
          icon: UserCog,
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
          icon: BookOpen,
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
          {menuSections.map((section) => (
            <div key={section.label}>
              <div className="px-4 mb-2 mt-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {section.label}
                </span>
              </div>

              {section.items.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeMenu === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => onMenuClick(item.key, item.view)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group text-left ${
                      isActive
                        ? "bg-[#0B2F7F]/10 text-[#0B2F7F]"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <IconComponent
                      className={`w-5 h-5 ${
                        isActive
                          ? "text-[#0B2F7F]"
                          : "text-slate-400 group-hover:text-slate-600"
                      }`}
                      strokeWidth={2}
                    />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
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
          <div className="flex items-center justify-between p-3 rounded-xl cursor-pointer group border border-transparent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 border-2 border-white shadow-sm">
                <User className="w-6 h-6" />
              </div>

              <div className="text-left overflow-hidden">
                <p className="text-sm font-bold text-slate-700 truncate group-hover:text-[#0B2F7F] transition-colors">
                  {user?.name || "Dosen"}
                </p>
                <p className="text-xs text-slate-500 font-mono">
                  {user?.nip || "Dosen Pembimbing"}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogoutClick}
              className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"
              title="Keluar"
            >
              <LogOut className="w-5 h-5" strokeWidth={2} />
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
                <LogOut className="w-8 h-8 text-red-500" strokeWidth={2} />
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

export default SidebarDosen;

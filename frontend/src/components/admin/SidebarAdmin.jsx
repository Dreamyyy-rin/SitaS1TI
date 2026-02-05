import React from "react";
import { LayoutDashboard, Users, Settings, LogOut, Shield } from "lucide-react";

const AdminSidebar = ({ activeMenu, onMenuClick, onLogout, admin }) => {
  const menuItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      view: "dashboard",
    },
    {
      key: "user-management",
      label: "Manajemen User",
      icon: Users,
      view: "user-management",
    },
    {
      key: "settings",
      label: "Pengaturan",
      icon: Settings,
      view: "settings",
    },
  ];

  return (
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
        <div className="px-4 mb-2 mt-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            MENU UTAMA
          </span>
        </div>

        {menuItems.map((item) => {
          const isActive = activeMenu === item.key;
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => onMenuClick?.(item.key, item.view)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-[#2563EB]/10 text-[#2563EB]"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive
                    ? "text-[#2563EB]"
                    : "text-slate-400 group-hover:text-slate-600"
                }`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between p-3 rounded-xl cursor-pointer group border border-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border-2 border-white shadow-sm">
              <Shield className="w-6 h-6" />
            </div>

            <div className="text-left overflow-hidden">
              <p className="text-sm font-bold text-slate-700 truncate group-hover:text-[#2563EB] transition-colors">
                {admin?.name || "Superadmin"}
              </p>
              <p className="text-xs text-slate-500 font-mono">
                {admin?.id || "ADMIN-001"}
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"
            title="Keluar"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;

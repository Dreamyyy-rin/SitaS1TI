import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * ProtectedRoute - Komponen pembungkus yang memastikan:
 * 1. User sudah login (punya token)
 * 2. User punya role yang sesuai
 * 3. Token masih valid (belum expired)
 *
 * Jika tidak memenuhi syarat, redirect ke halaman login.
 */
export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("sita_token");
    const userData = localStorage.getItem("sita_user");

    if (!token || !userData) {
      // Tidak ada token → redirect ke landing
      localStorage.removeItem("sita_token");
      localStorage.removeItem("sita_user");
      navigate("/", { replace: true });
      return;
    }

    try {
      const user = JSON.parse(userData);
      const role = user?.role;

      // Cek apakah role user ada di daftar yang diizinkan
      if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        // Role tidak cocok → redirect ke login sesuai role user
        const roleLoginMap = {
          mahasiswa: "/login?role=mahasiswa",
          dosen: "/login?role=dosen",
          kaprodi: "/login?role=kaprodi",
          superadmin: "/login?role=superadmin",
        };
        navigate(roleLoginMap[role] || "/", { replace: true });
        return;
      }

      // Cek apakah token belum expired (decode JWT payload)
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const exp = payload.exp;
        if (exp && Date.now() >= exp * 1000) {
          // Token expired
          localStorage.removeItem("sita_token");
          localStorage.removeItem("sita_user");
          navigate("/login?role=" + (role || "mahasiswa"), { replace: true });
          return;
        }
      } catch {
        // Jika gagal decode token → anggap tidak valid
        localStorage.removeItem("sita_token");
        localStorage.removeItem("sita_user");
        navigate("/", { replace: true });
        return;
      }

      setIsAuthorized(true);
    } catch {
      // JSON parse gagal
      localStorage.removeItem("sita_token");
      localStorage.removeItem("sita_user");
      navigate("/", { replace: true });
    } finally {
      setChecking(false);
    }
  }, [navigate, allowedRoles]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return children;
}

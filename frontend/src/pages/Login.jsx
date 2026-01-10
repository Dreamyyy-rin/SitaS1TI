import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const roleConfig = {
    mahasiswa: {
      title: "Login sebagai Mahasiswa",
      usernameLabel: "NIM",
      usernamePlaceholder: "Masukkan NIM Anda",
      buttonColor: "bg-[#0B2F7F] hover:bg-indigo-900",
    },
    dosen: {
      title: "Login sebagai Dosen",
      usernameLabel: "Username",
      usernamePlaceholder: "Masukkan Username / NIP Anda",
      buttonColor: "bg-orange-600 hover:bg-orange-700",
    },
  };

  const config = roleConfig[role] || roleConfig.mahasiswa;

 
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Login attempt:", {
      role: role || "unknown",
      username: formData.username,
      password: formData.password,
    });

   
    if (role === "mahasiswa" || !role) {
      navigate("/mahasiswa");
    }
   
  };
 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!role || !roleConfig[role]) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 font-sans">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            Role tidak valid
          </h2>
          <button
            onClick={() => navigate("/")}
            className="text-[#0B2F7F] hover:underline font-medium transition-colors"
          >
            Kembali ke halaman utama
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12 relative overflow-hidden font-sans">
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>

      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-1/4 -right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 max-w-md w-full">
        <button
          onClick={() => navigate("/")}
          className="mb-6 text-slate-500 hover:text-slate-900 flex items-center gap-2 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Kembali
        </button>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {config.title}
            </h1>
            <p className="text-slate-500">Sistem Informasi Tugas Akhir S1 TI</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                {config.usernameLabel}
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder={config.usernamePlaceholder}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B2F7F] focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan password Anda"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B2F7F] focus:border-transparent outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              className={`w-full ${
                config.buttonColor || "bg-blue-600"
              } text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2`}
            >
              Login
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-slate-400 font-medium">
            © 2026 FTI UKSW Salatiga
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, UserCheck, ArrowRight } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const handleRoleClick = (roleId) => {
    navigate(`/login?role=${roleId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700;900&display=swap');
          .font-outfit { font-family: 'Outfit', sans-serif; }
          
          /* Custom Color: UKSW Blue (Warna Logo) */
          :root {
            --uksw-blue: #0B2F7F; 
            --uksw-blue-light: #1A45A0;
            --fti-orange: #f97316; /* Oranye Terang ala FTI */
            --fti-orange-dark: #ea580c; /* Oranye Gelap buat Hover */
          }

          .text-uksw { color: var(--uksw-blue); }
          .bg-uksw { background-color: var(--uksw-blue); }
          .border-uksw { border-color: var(--uksw-blue); }
          .hover-bg-uksw:hover { background-color: var(--uksw-blue); }
          .hover-text-uksw:hover { color: var(--uksw-blue); }
          .hover-border-uksw:hover { border-color: var(--uksw-blue); }
          
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            animation: marquee 25s linear infinite;
          }
        `}
      </style>

      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-1/4 -right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      {/*main content*/}
      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center text-center font-outfit">
        <h2 className="text-2xl md:text-3xl font-medium text-slate-900 tracking-widest uppercase mb-2">
          Selamat Datang di
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 mb-8 mt-4">
          <div className="group relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
            <div className="absolute inset-0 bg-white rounded-full shadow-xl shadow-slate-200"></div>

            <img
              src="/fti.png"
              alt="Logo UKSW"
              className="relative w-full h-full object-cover rounded-full border-4 border-white"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.classList.add(
                  "bg-uksw",
                  "flex",
                  "items-center",
                  "justify-center"
                );
              }}
            />
          </div>

          <div className="flex flex-col items-center text-center">
            <h1 className="text-6xl md:text-7xl font-bold text-slate-800 leading-none tracking-tighter">
              SITA S1 TI
            </h1>

            <div className="h-2 w-full bg-uksw rounded-full my-2"></div>
            <p className="text-lg md:text-xl font-bold text-uksw tracking-[0.2em] uppercase">
              Sistem Informasi Tugas Akhir S1 TI
            </p>
          </div>
        </div>

        {/*dekorasi running text*/}
        <div className="w-full max-w-3xl overflow-hidden py-3 mb-12 border-y border-slate-200 bg-white/50 backdrop-blur-sm">
          <div className="whitespace-nowrap animate-marquee">
            <span className="text-slate-500 font-medium tracking-wide mx-4">
              Selamat datang di Sistem Informasi Tugas Akhir S1 Teknik
              Informatika FTI UKSW • Silakan login sesuai peran Anda
            </span>
          </div>
        </div>

        {/*button login*/}
        <div className="flex flex-col md:flex-row gap-5 justify-center w-full">
          {/*button login mahasiswa*/}
          <button
            onClick={() => handleRoleClick("mahasiswa")}
            className="group flex items-center justify-center gap-4 px-8 py-4 bg-white border-2 border-slate-200 rounded-2xl shadow-sm hover:bg-[#0B2F7F] hover:border-[#0B2F7F] hover:-translate-y-0.5 transition-all duration-300 min-w-[320px]"
          >
            <GraduationCap
              size={24}
              className="text-uksw group-hover:text-white transition-colors"
            />

            <span className="text-lg font-medium text-slate-700 group-hover:text-white transition-colors">
              Masuk sebagai Mahasiswa
            </span>
          </button>

          {/*button login dosen*/}
          <button
            onClick={() => handleRoleClick("dosen")}
            className="group flex items-center justify-center gap-4 px-8 py-4 bg-white border-2 border-slate-200 rounded-2xl shadow-sm hover:bg-orange-600 hover:border-orange-600 hover:-translate-y-0.5 transition-all duration-300 min-w-[320px]"
          >
            <UserCheck
              size={24}
              className="text-orange-600 group-hover:text-white transition-colors"
            />

            <span className="text-lg font-medium text-slate-700 group-hover:text-white transition-colors">
              Masuk sebagai Dosen
            </span>
          </button>
        </div>

        {/*footer*/}
        <p className="mt-12 text-slate-400 text-sm font-medium">
          © 2026 FTI UKSW Salatiga
        </p>
      </div>
    </div>
  );
};

export default Landing;

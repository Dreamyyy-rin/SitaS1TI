import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/shared/Landing.jsx";
import Login from "./pages/shared/Login.jsx";
import MahasiswaDashboard from "./pages/mahasiswa/MahasiswaDashboard.jsx";
import DosenDashboard from "./pages/dosen/DosenDashboard.jsx";
import RequestBimbinganPage from "./pages/dosen/RequestBimbinganPage.jsx";
import MahasiswaBimbinganPage from "./pages/dosen/MahasiswaBimbinganPage.jsx";
import ReviewDosenPage from "./pages/dosen/ReviewDosenPage.jsx";
import PanduanDosenPage from "./pages/dosen/PanduanDosenPage.jsx";
import DataAkunDosenPage from "./pages/dosen/DataAkunDosenPage.jsx";
import KaprodiDashboard from "./pages/kaprodi/KaprodiDashboard.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mahasiswa" element={<MahasiswaDashboard />} />
        <Route path="/dosen" element={<DosenDashboard />} />
        <Route path="/dosen-dashboard" element={<DosenDashboard />} />
        <Route
          path="/dosen-request-bimbingan"
          element={<RequestBimbinganPage />}
        />
        <Route
          path="/dosen-mahasiswa-bimbingan"
          element={<MahasiswaBimbinganPage />}
        />
        <Route path="/dosen-review" element={<ReviewDosenPage />} />
        <Route path="/dosen-panduan" element={<PanduanDosenPage />} />
        <Route path="/data-akun" element={<DataAkunDosenPage />} />
        <Route path="/kaprodi" element={<KaprodiDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

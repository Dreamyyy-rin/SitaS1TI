import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/shared/Landing.jsx";
import Login from "./pages/shared/Login.jsx";
import ProtectedRoute from "./components/shared/ProtectedRoute.jsx";
import MahasiswaDashboard from "./pages/mahasiswa/MahasiswaDashboard.jsx";
import RequestPembimbingPage from "./pages/mahasiswa/RequestPembimbingPage.jsx";
import DosenDashboard from "./pages/dosen/DosenDashboard.jsx";
import RequestBimbinganPage from "./pages/dosen/RequestBimbinganPage.jsx";
import MahasiswaBimbinganPage from "./pages/dosen/MahasiswaBimbinganPage.jsx";
import MahasiswaBimbinganDetailPage from "./pages/dosen/MahasiswaBimbinganDetailPage.jsx";
import MahasiswaBimbinganKomentarPage from "./pages/dosen/MahasiswaBimbinganKomentarPage.jsx";
import ReviewDosenPage from "./pages/dosen/ReviewDosenPage.jsx";
import PanduanDosenPage from "./pages/dosen/PanduanDosenPage.jsx";
import DataAkunDosenPage from "./pages/dosen/DataAkunDosenPage.jsx";
import KaprodiDashboard from "./pages/kaprodi/KaprodiDashboard.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Mahasiswa routes */}
        <Route
          path="/mahasiswa"
          element={
            <ProtectedRoute allowedRoles={["mahasiswa"]}>
              <MahasiswaDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mahasiswa/request-pembimbing"
          element={
            <ProtectedRoute allowedRoles={["mahasiswa"]}>
              <RequestPembimbingPage />
            </ProtectedRoute>
          }
        />

        {/* Dosen routes */}
        <Route
          path="/dosen"
          element={
            <ProtectedRoute allowedRoles={["dosen"]}>
              <DosenDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dosen-dashboard"
          element={
            <ProtectedRoute allowedRoles={["dosen"]}>
              <DosenDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dosen-request-bimbingan"
          element={
            <ProtectedRoute allowedRoles={["dosen"]}>
              <RequestBimbinganPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dosen-mahasiswa-bimbingan"
          element={
            <ProtectedRoute allowedRoles={["dosen"]}>
              <MahasiswaBimbinganPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dosen-mahasiswa/:mahasiswaId"
          element={
            <ProtectedRoute allowedRoles={["dosen"]}>
              <MahasiswaBimbinganDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dosen-mahasiswa/:mahasiswaId/komentar"
          element={
            <ProtectedRoute allowedRoles={["dosen"]}>
              <MahasiswaBimbinganKomentarPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dosen-review"
          element={
            <ProtectedRoute allowedRoles={["dosen"]}>
              <ReviewDosenPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dosen-panduan"
          element={
            <ProtectedRoute allowedRoles={["dosen"]}>
              <PanduanDosenPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/data-akun"
          element={
            <ProtectedRoute allowedRoles={["dosen"]}>
              <DataAkunDosenPage />
            </ProtectedRoute>
          }
        />

        {/* Kaprodi routes */}
        <Route
          path="/kaprodi"
          element={
            <ProtectedRoute allowedRoles={["kaprodi"]}>
              <KaprodiDashboard />
            </ProtectedRoute>
          }
        />

        {/* Superadmin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import MahasiswaDashboard from "./pages/MahasiswaDashboard.jsx";
import DosenDashboard from "./pages/DosenDashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mahasiswa" element={<MahasiswaDashboard />} />
        <Route path="/dosen" element={<DosenDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

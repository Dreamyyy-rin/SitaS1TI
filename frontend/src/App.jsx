import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import MahasiswaDashboard from "./pages/MahasiswaDashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mahasiswa" element={<MahasiswaDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

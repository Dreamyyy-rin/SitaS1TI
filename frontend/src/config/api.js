// API Configuration
// - Development: gunakan VITE_API_BASE_URL dari .env (default: http://localhost:8000)
// - Docker (nginx proxy): VITE_API_BASE_URL="" agar request ke /api/... lewat nginx
const _envUrl = import.meta.env.VITE_API_BASE_URL;
export const API_BASE_URL =
  _envUrl !== undefined && _envUrl !== null ? _envUrl : "http://localhost:8000";

// Helper function untuk membuat URL lengkap
export const getApiUrl = (endpoint) => {
  // Pastikan endpoint dimulai dengan /
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${path}`;
};

// Export untuk digunakan di fetch calls
export default {
  baseURL: API_BASE_URL,
  getUrl: getApiUrl,
};

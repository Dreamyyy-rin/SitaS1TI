// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

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

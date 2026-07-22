import axios from "axios";

// In dev, Vite's proxy (vite.config.js) forwards "/api" to localhost:5000, so a
// relative baseURL works. In production (Vercel), there is no proxy — the
// frontend and backend are separate deployments, so "/api" would resolve to
// the frontend's own domain and 404/500. Set VITE_API_URL in the frontend's
// Vercel project (Settings -> Environment Variables) to your deployed
// backend's URL, e.g. https://moneywise-backend.vercel.app/api
const baseURL = import.meta.env.VITE_API_URL || "/api";

const axiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
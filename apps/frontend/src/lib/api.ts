import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:8000" : null);

if (!baseURL) {
  console.error("[API] Missing VITE_API_URL in production build!");
}

const api = axios.create({
  baseURL,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

// Debug logging interceptor
api.interceptors.request.use((config) => {
  console.log("[API Request]", config.baseURL, config.url, config.headers);
  return config;
});

export default api;
import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:8000" : null);

if (!baseURL) {
  console.error("[API] Missing VITE_API_URL in production build!");
}

const api = axios.create({
  baseURL,
});

// ✅ Interceptor to enforce correct headers
api.interceptors.request.use((config) => {
  // Always send JSON for write operations
  if (
    config.method === "post" ||
    config.method === "patch" ||
    config.method === "put"
  ) {
    if (!config.headers) config.headers = {};
    config.headers["Content-Type"] = "application/json";
  }

  // Only include ngrok header if baseURL contains ngrok
  if (baseURL?.includes("ngrok")) {
    config.headers["ngrok-skip-browser-warning"] = "true";
  }

  console.log(
    "[API Request]",
    config.method?.toUpperCase(),
    config.url,
    config.headers
  );
  return config;
});

export default api;
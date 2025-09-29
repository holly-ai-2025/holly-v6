import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:8000"
      : import.meta.env.VITE_API_URL,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

export default api;
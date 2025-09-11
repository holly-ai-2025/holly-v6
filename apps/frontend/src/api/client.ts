import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}`,
  },
});

// Logging interceptor
client.interceptors.request.use((config) => {
  console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.data || "");
  return config;
});

client.interceptors.response.use(
  (res) => {
    console.log(`[API] Response ${res.status} ${res.config.url}`, res.data);
    return res;
  },
  (err) => {
    console.error("[API] Error", err);
    return Promise.reject(err);
  }
);

export default client;

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import api from "./lib/api";

// Forward console logs to backend log server
const originalLog = console.log;
console.log = (...args) => {
  originalLog(...args);
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (import.meta.env.VITE_API_URL?.includes("ngrok")) {
      headers["ngrok-skip-browser-warning"] = "true";
    }
    fetch(
      import.meta.env.DEV
        ? "http://localhost:9000/log"
        : import.meta.env.VITE_LOG_SERVER_URL,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ level: "log", message: args }),
      }
    );
  } catch {}
};

const originalError = console.error;
console.error = (...args) => {
  originalError(...args);
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (import.meta.env.VITE_API_URL?.includes("ngrok")) {
      headers["ngrok-skip-browser-warning"] = "true";
    }
    fetch(
      import.meta.env.DEV
        ? "http://localhost:9000/log"
        : import.meta.env.VITE_LOG_SERVER_URL,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ level: "error", message: args }),
      }
    );
  } catch {}
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
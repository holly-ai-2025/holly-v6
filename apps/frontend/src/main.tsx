import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import api from "./lib/api";

// Forward console logs to backend log server
const originalLog = console.log;
console.log = (...args) => {
  originalLog(...args);
  try {
    fetch(
      import.meta.env.DEV
        ? "http://localhost:9000/log"
        : import.meta.env.VITE_LOG_SERVER_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ level: "log", message: args }),
      }
    );
  } catch {}
};

const originalError = console.error;
console.error = (...args) => {
  originalError(...args);
  try {
    fetch(
      import.meta.env.DEV
        ? "http://localhost:9000/log"
        : import.meta.env.VITE_LOG_SERVER_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
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
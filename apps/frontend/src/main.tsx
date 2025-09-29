import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// --- Console log forwarding ---
const origLog = console.log;
const origError = console.error;
const origWarn = console.warn;

// Decide log server dynamically: use localhost in dev, ngrok in Vercel
let logServerUrl: string | undefined;
if (import.meta.env.DEV) {
  logServerUrl = "http://localhost:9000/log";
} else if (typeof window !== "undefined" && window.location.hostname.includes("vercel.app")) {
  // Use ngrok endpoint set via env var at build time
  logServerUrl = import.meta.env.VITE_LOG_SERVER_URL;
}

function sendLog(level: string, message: any, ...optionalParams: any[]) {
  if (!logServerUrl) return;

  fetch(logServerUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Add minimal headers for ngrok
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({
      level,
      message: String(message),
      data: optionalParams,
    }),
  }).catch(() => {});
}

console.log = (message?: any, ...optionalParams: any[]) => {
  origLog(message, ...optionalParams);
  sendLog("info", message, ...optionalParams);
};

console.error = (message?: any, ...optionalParams: any[]) => {
  origError(message, ...optionalParams);
  sendLog("error", message, ...optionalParams);
};

console.warn = (message?: any, ...optionalParams: any[]) => {
  origWarn(message, ...optionalParams);
  sendLog("warn", message, ...optionalParams);
};

// --- App Render ---
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
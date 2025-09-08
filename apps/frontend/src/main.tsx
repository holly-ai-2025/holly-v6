import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// --- Console log forwarding ---
const origLog = console.log;
const origError = console.error;
const origWarn = console.warn;

function sendLog(level: string, message: any, ...optionalParams: any[]) {
  fetch("http://localhost:8000/log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "*.ngrok-free.app",
      /\.ngrok-free\.app$/,
      "*.ngrok.app",
      /\.ngrok\.app$/,
      "*.ngrok.io",
      /\.ngrok\.io$/
    ],
  },
  preview: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "*.ngrok-free.app",
      /\.ngrok-free\.app$/,
      "*.ngrok.app",
      /\.ngrok\.app$/,
      "*.ngrok.io",
      /\.ngrok\.io$/
    ],
  },
});
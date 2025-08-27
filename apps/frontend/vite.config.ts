import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Vite config for Holly v6 frontend
export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname), // ensure apps/frontend is used as root
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
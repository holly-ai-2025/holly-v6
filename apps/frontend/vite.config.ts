import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config for Holly v6 frontend
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",       // build output inside apps/frontend/dist
    emptyOutDir: true,
  },
});
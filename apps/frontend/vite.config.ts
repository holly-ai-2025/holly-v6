import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  root: "./",
  build: {
    outDir: "dist",
    rollupOptions: {
      external: [], // ✅ ensure recharts is bundled, not externalized
    },
  },
  optimizeDeps: {
    include: ["recharts"], // ✅ pre-bundle recharts
  },
});
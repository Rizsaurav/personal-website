import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/portfolio-website/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ],
  assetsInclude: ['**/*.md'], // include .md files
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/portfolio-website/",  
  build: {
    outDir: "dist"               
  },
  plugins: [
    react(),
  ],
  assetsInclude: ['**/*.md'],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

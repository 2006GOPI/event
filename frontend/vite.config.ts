import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5174,
    strictPort: false,
    host: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/vitest.setup.ts",
  },
} as any)

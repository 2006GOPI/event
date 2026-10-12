/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7FAF9",
        card: "#FFFFFF",
        primary: {
          DEFAULT: "#219C85",
          hover: "#1B826F",
          light: "#DDF4E8",
          dark: "#146152",
        },
        mint: {
          50: "#F2FAF6",
          100: "#DDF4E8",
          200: "#BEE8D4",
          300: "#93D6B8",
          400: "#5DBE97",
          500: "#219C85",
        },
        navy: {
          DEFAULT: "#16313B",
          light: "#264855",
          dark: "#0F2027",
        },
        slate: {
          muted: "#64748B",
          border: "#E2E8F0",
          subtle: "#F1F5F9",
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
      boxShadow: {
        soft: "0 1px 3px 0 rgba(16, 24, 40, 0.05), 0 1px 2px 0 rgba(16, 24, 40, 0.03)",
        card: "0 2px 8px -2px rgba(22, 49, 59, 0.05), 0 1px 4px -1px rgba(22, 49, 59, 0.03)",
        elevation: "0 12px 28px -4px rgba(22, 49, 59, 0.08), 0 4px 12px -2px rgba(22, 49, 59, 0.04)",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
}

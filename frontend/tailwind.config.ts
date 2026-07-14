import type { Config } from "tailwindcss";

// Design tokens (memory.md §33 / kickoff §8). Extracted-as-facts, layout built fresh.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#FF8F5C",
          DEFAULT: "#FF6B35",
          dark: "#E55A2B",
        },
        background: {
          DEFAULT: "#FFFFFF",
          alt: "#FAFAFA",
        },
        muted: "#F3F4F6",
        foreground: "#1A1A1A",
        success: "#10B981",
        warning: "#F59E0B",
        destructive: "#EF4444",
        border: "#E7E7E9",
      },
      fontFamily: {
        display: ["var(--font-bebas)", "Bebas Neue", "Impact", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "24px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(16,24,40,0.05)",
        DEFAULT: "0 1px 3px rgba(16,24,40,0.08), 0 1px 2px rgba(16,24,40,0.04)",
        md: "0 4px 12px rgba(16,24,40,0.08)",
        lg: "0 12px 32px rgba(16,24,40,0.12)",
      },
      maxWidth: {
        container: "1280px",
      },
      keyframes: {
        "pulse-live": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
      },
      animation: {
        "pulse-live": "pulse-live 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#050811",
        surface: {
          50: "#0b1120",
          100: "#0f172a",
          200: "#1e293b",
          300: "#334155",
        },
        primary: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6", // Electric Purple
          600: "#7c3aed",
          700: "#6d28d9",
        },
        cyanAccent: {
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
        },
        timeloop: {
          void: "#03060f",
          neonPurple: "#a855f7",
          neonCyan: "#06b6d4",
          amberGold: "#f59e0b",
          crimsonRed: "#ef4444",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-space-grotesk)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "cinema-gradient": "linear-gradient(180deg, rgba(5,8,17,0) 0%, rgba(5,8,17,0.95) 85%, #050811 100%)",
        "cyber-grid": "radial-gradient(circle, rgba(139,92,246,0.15) 1px, transparent 1px)",
      },
      boxShadow: {
        "glow-purple": "0 0 25px -5px rgba(168, 85, 247, 0.4)",
        "glow-cyan": "0 0 25px -5px rgba(6, 182, 212, 0.4)",
        "glow-card": "0 8px 32px 0 rgba(0, 0, 0, 0.45)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 10px rgba(168, 85, 247, 0.3)" },
          "100%": { boxShadow: "0 0 25px rgba(6, 182, 212, 0.6)" },
        }
      }
    },
  },
  plugins: [],
};
export default config;

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f4ff",
          100: "#e0e9ff",
          200: "#c7d7fe",
          300: "#a5b8fc",
          400: "#818cf8",
          500: "#4F46E5",
          600: "#4338CA",
          700: "#3730A3",
          800: "#312e81",
          900: "#1e1b4b",
          950: "#0f0e2e",
        },
        accent: {
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
        },
        warning: {
          400: "#FBBF24",
          500: "#F59E0B",
        },
        danger: {
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
        },
        surface: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          800: "#1e293b",
          850: "#172033",
          900: "#0f172a",
          950: "#080c1a",
        },
      },
      fontFamily: {
        display: ["'Sora'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "mesh-gradient":
          "radial-gradient(at 40% 20%, hsla(248,100%,74%,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,0.05) 0px, transparent 50%)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(79, 70, 229, 0.35)",
        "glow-sm": "0 0 10px rgba(79, 70, 229, 0.2)",
        card: "0 1px 3px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.04)",
        "card-dark": "0 1px 3px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.2)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        shimmer: "shimmer 2s infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: {
          from: { transform: "translateY(16px)", opacity: 0 },
          to: { transform: "translateY(0)", opacity: 1 },
        },
        slideInRight: {
          from: { transform: "translateX(16px)", opacity: 0 },
          to: { transform: "translateX(0)", opacity: 1 },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

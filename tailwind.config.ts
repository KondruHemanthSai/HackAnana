import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "white",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#3674B5",
          foreground: "white",
        },
        secondary: {
          DEFAULT: "#578FCA",
          foreground: "white",
        },
        accent: {
          DEFAULT: "#A1E3F9",
          foreground: "#101419",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#94a3b8",
          foreground: "#64748b",
        },
        popover: {
          DEFAULT: "white",
          foreground: "#101419",
        },
        // User specific additions
        "background-light": "#D1F8EF",
        "background-dark": "#13191f",
        "glass-surface": "rgba(255, 255, 255, 0.45)",
        "glass-border": "rgba(255, 255, 255, 0.6)",
        mint: "#D1F8EF", // Keeping mint alias for backward compatibility
        "text-dark": "#101419",
        "text-muted": "#5a728c",
        card: {
          DEFAULT: "white",
          foreground: "#101419",
        },
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "Noto Sans", "sans-serif"],
        body: ["Noto Sans", "sans-serif"],
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
        "3xl": "2.5rem",
        full: "9999px",
      },
      backgroundImage: {
        "mesh-gradient": "radial-gradient(at 0% 0%, #A1E3F9 0px, transparent 50%), radial-gradient(at 100% 0%, #D1F8EF 0px, transparent 50%), radial-gradient(at 100% 100%, #A1E3F9 0px, transparent 50%), radial-gradient(at 0% 100%, #D1F8EF 0px, transparent 50%)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(1.5)", opacity: "0" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { transform: "scale(0.95)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-ring": "pulse-ring 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
        "slide-up": "slide-up 0.3s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "shimmer": "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

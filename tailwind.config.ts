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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#D4AF37", // Architectural Champagne Gold
          foreground: "#090D16",
          50: "#FAF7EE",
          100: "#F5EED8",
          200: "#EBDDB1",
          300: "#E0CA89",
          400: "#D8B862",
          500: "#D4AF37",
          600: "#C5A880",
          700: "#9A7E56",
        },
        luxury: {
          obsidian: "#090D16",
          card: "#111726",
          cardborder: "#1E293B",
          gold: "#D4AF37",
          brass: "#C5A880",
          muted: "#94A3B8",
        },
        whatsapp: {
          light: "#25D366",
          DEFAULT: "#128C7E",
          dark: "#075E54",
          teal: "#128C7E",
          chatbg: "#EFEAE2",
          chatbubble: "#DCF8C6",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "0.875rem",
        md: "0.625rem",
        sm: "0.375rem",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        display: ["Cinzel", "Playfair Display", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;

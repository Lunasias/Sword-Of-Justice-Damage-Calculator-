import type { Config } from "tailwindcss";

/**
 * Art Deco (The "Gatsby" Aesthetic) Design System
 * 
 * DNA: Opulence, mathematical precision, architectural grandeur.
 * Colors: Obsidian Black, Champagne Cream, Rich Charcoal, Metallic Gold, Midnight Blue.
 * Sharp edges, geometric repetition, Roman numerals, stepped corners, gold glows.
 */
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Art Deco Dark Luxury Palette
        deco: {
          bg: "#0A0A0A", // Obsidian Black
          card: "#141414", // Rich Charcoal
          cardElevated: "#1A1A1A",
          fg: "#F2F0E4", // Champagne Cream
          gold: "#D4AF37", // Metallic Gold
          "gold-light": "#F2E8C4", // Pale Champagne Gold
          "gold-dark": "#AA771C", // Deep Antique Gold
          midnight: "#1E3D59", // Midnight Blue
          muted: "#888888", // Pewter
          border: "rgba(212, 175, 55, 0.4)",
          "border-bright": "#D4AF37",
        },
      },
      borderRadius: {
        // Strictly 0px or 2px max
        none: "0px",
        sm: "2px",
        DEFAULT: "0px",
        md: "2px",
        lg: "2px",
      },
      fontFamily: {
        marcellus: ["var(--font-marcellus)", "Marcellus", "Italiana", "Georgia", "serif"],
        display: ["var(--font-marcellus)", "Marcellus", "Italiana", "Georgia", "serif"],
        josefin: ["var(--font-josefin)", "var(--font-thai)", "Josefin Sans", "Noto Sans Thai", "sans-serif"],
        body: ["var(--font-josefin)", "var(--font-thai)", "Josefin Sans", "Noto Sans Thai", "sans-serif"],
        sans: ["var(--font-josefin)", "var(--font-thai)", "Josefin Sans", "Noto Sans Thai", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        "deco-glow": "0 0 15px rgba(212, 175, 55, 0.2)",
        "deco-glow-hover": "0 0 25px rgba(212, 175, 55, 0.45)",
        "deco-glow-lg": "0 0 35px rgba(212, 175, 55, 0.6)",
        "deco-input": "0 4px 10px rgba(212, 175, 55, 0.25)",
      },
      letterSpacing: {
        widest: "0.2em",
        extrawide: "0.25em",
        theatrical: "0.3em",
      },
      maxWidth: {
        content: "1320px",
      },
      keyframes: {
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "gold-pulse": {
          "0%, 100%": { opacity: "0.8", filter: "drop-shadow(0 0 10px rgba(212, 175, 55, 0.3))" },
          "50%": { opacity: "1", filter: "drop-shadow(0 0 22px rgba(212, 175, 55, 0.65))" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s ease-out both",
        "gold-pulse": "gold-pulse 3s ease-in-out infinite",
        shimmer: "shimmer 4s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;

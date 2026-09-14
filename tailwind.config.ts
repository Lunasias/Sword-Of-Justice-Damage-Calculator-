import type { Config } from "tailwindcss";

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
        obsidian: "#0f1011",
        abyss: "#090a0b",
        graphite: "#2e2e2e",
        steel: "#3f4041",
        silver: "#cacaca",
        pure: "#ffffff",
        cloud: "#f5f5f7",
        ash: "#9f9fa0",
        fog: "#6a6b6b",
        void: "#000000",
        // Accents
        iris: {
          DEFAULT: "#847dff",
          pale: "#d1c9ff",
          deep: "#4b49aa",
        },
        cyan: {
          signal: "#00b3dd",
        },
        orchid: {
          bloom: "#dd90d8",
        },
        periwinkle: "#90b8f0",
      },
      borderRadius: {
        button: "8px",
        input: "8px",
        nav: "8px",
        card: "16px",
        feature: "30px",
      },
      fontFamily: {
        display: ["var(--font-display)", "Playfair Display", "DM Serif Display", "Georgia", "serif"],
        ui: ["var(--font-ui)", "Inter", "Prompt", "Noto Sans Thai", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "Roboto Mono", "JetBrains Mono", "monospace"],
      },
      maxWidth: {
        content: "1200px",
      },
      spacing: {
        section: "80px",
        card: "32px",
      },
    },
  },
  plugins: [],
};

export default config;

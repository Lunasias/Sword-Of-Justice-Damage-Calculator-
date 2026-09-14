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
        // dope.security — Midnight terminal with violet beacons
        "near-black": "#090909",       // page canvas
        "almost-white": "#f7f9fa",     // primary text
        "soft-white": "#f0f0f0",       // section labels
        steel: "#828384",              // muted secondary text
        graphite: "#474747",           // card text / dividers
        iron: "#423738",               // dark borders / separators
        ash: "#6b6b6b",                // nav borders, helper text
        "signal-violet": "#af50ff",   // THE only chromatic accent
        "lavender-mist": "#e1bdff",   // soft violet tint
        // Legacy aliases (kept for components not yet reskinned)
        obsidian: "#090909",
        abyss: "#0d0d0d",
        fog: "#6b6b6b",
        cloud: "#f0f0f0",
        pure: "#f7f9fa",
        void: "#000000",
        silver: "#828384",
        ash2: "#6b6b6b",
        iris: {
          DEFAULT: "#af50ff",
          pale: "#e1bdff",
          deep: "#7b2fd6",
        },
        cyan: {
          signal: "#af50ff", // map to violet in new palette
        },
        orchid: {
          bloom: "#e1bdff",
        },
        periwinkle: "#e1bdff",
      },
      borderRadius: {
        button: "8px",
        input: "8px",
        nav: "8px",
        card: "19.2px",
        feature: "19.2px",
        pill: "1584px",
      },
      fontFamily: {
        // Noto Sans Thai — primary for ALL Thai & body text
        display: ["var(--font-lora)", "Georgia", "serif"],
        ui: ["var(--font-noto)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
        // aliases
        sans: ["var(--font-noto)", "Inter", "system-ui", "sans-serif"],
        serif: ["var(--font-lora)", "Georgia", "serif"],
      },
      maxWidth: {
        content: "1200px",
      },
      spacing: {
        section: "120px",
        card: "40px",
      },
      backdropBlur: {
        nav: "10px",
      },
    },
  },
  plugins: [],
};

export default config;


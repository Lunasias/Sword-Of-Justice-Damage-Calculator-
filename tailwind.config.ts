import type { Config } from "tailwindcss";

/**
 * Neumorphism (Soft UI) design system — single source of truth.
 *
 * The palette is deliberately monochromatic: depth comes from opposed
 * light/dark shadows, never from colour variety or borders.
 * Shadow recipes live in `app/globals.css` as semantic `shadow-neu-*`
 * utilities so components stay readable instead of carrying huge
 * arbitrary-value strings.
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
        // ─── Cool-grey surface ──────────────────────────────────────────
        // Everything is "moulded" from this one base colour.
        "neu-base": "#E0E5EC", // page canvas + every card surface
        "neu-fg": "#3D4852", // primary text — 7.5:1 contrast (WCAG AAA)
        "neu-muted": "#6B7280", // secondary text — 4.6:1 contrast (WCAG AA)
        "neu-placeholder": "#A0AEC0", // input placeholders only — never body text
        "neu-shadow-dark": "#A3B1C6", // dark shadow tone (always applied via rgb())

        // ─── Accents (used sparingly) ───────────────────────────────────
        "neu-accent": "#6C63FF", // primary interactive violet
        "neu-accent-light": "#8B84FF", // gradients + hover states
        "neu-accent-deep": "#4C46CC", // pressed accent
        "neu-teal": "#38B2AC", // success / positive indicators
        "neu-danger": "#E5484D", // destructive actions
      },
      borderRadius: {
        // Containers are heavily pillowed; nothing is sharp.
        card: "32px",
        feature: "32px",
        button: "16px",
        input: "16px",
        well: "20px",
        nav: "12px",
        pill: "9999px",
      },
      fontFamily: {
        // Display: Plus Jakarta Sans (Latin headings)
        display: ["var(--font-display)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        // UI: DM Sans (Latin body) with Noto Sans Thai behind it, because
        // DM Sans ships no Thai glyphs and virtually all copy here is Thai.
        ui: ["var(--font-ui)", "var(--font-thai)", "DM Sans", "Noto Sans Thai", "system-ui", "sans-serif"],
        sans: ["var(--font-ui)", "var(--font-thai)", "DM Sans", "Noto Sans Thai", "system-ui", "sans-serif"],
        // Numeric: tabular figures keep damage columns aligned.
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      maxWidth: {
        content: "1200px",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "fade-in": "fade-in 300ms ease-out both",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0, 0, 0.2, 1)",
      },
      transitionDuration: {
        "300": "300ms",
        "500": "500ms",
      },
    },
  },
  plugins: [],
};

export default config;

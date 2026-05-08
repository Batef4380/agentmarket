import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F5F0E8",
        forest: "#1A2E1A",
        gold: "#C8A84B",
        leaf: "#4ade80",
        "dark-surface": "#0F1F0F",
        "text-muted": "#6B7B6B",
      },
      fontFamily: {
        anton: ["var(--font-anton)", "Anton", "sans-serif"],
        inter: ["var(--font-inter)", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;

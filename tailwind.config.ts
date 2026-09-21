import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#080C14",
          surface: "#0B0F17",
          navy: "#0F172A",
          card: "#131A27",
          cardHover: "#182234",
          border: "rgba(255, 255, 255, 0.08)",
          goldBorder: "rgba(229, 184, 66, 0.3)",
          gold: "#E5B842",
          goldLight: "#F5C84C",
          goldDark: "#D4AF37",
          emerald: "#059669",
          emeraldLight: "#10B981",
          emeraldDark: "#047857",
          amber: "#F59E0B",
          cyan: "#38BDF8",
          text: "#F8FAFC",
          muted: "#94A3B8",
          dim: "#64748B",
        },
      },
      fontFamily: {
        arabic: ["var(--font-cairo)", "Cairo", "sans-serif"],
        latin: ["var(--font-outfit)", "Outfit", "Inter", "sans-serif"],
      },
      boxShadow: {
        gold: "0 4px 20px -2px rgba(229, 184, 66, 0.2)",
        goldGlow: "0 0 30px rgba(229, 184, 66, 0.25)",
        emerald: "0 4px 20px -2px rgba(16, 185, 129, 0.2)",
        card: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #F59E0B 0%, #E5B842 50%, #D4AF37 100%)",
        "gold-gradient-hover": "linear-gradient(135deg, #FBBF24 0%, #F5C84C 50%, #E5B842 100%)",
        "emerald-gradient": "linear-gradient(135deg, #059669 0%, #10B981 100%)",
        "radial-glow": "radial-gradient(circle at 50% 0%, rgba(229, 184, 66, 0.12) 0%, transparent 70%)",
        "radial-emerald": "radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.12) 0%, transparent 70%)",
      },
    },
  },
  plugins: [],
};

export default config;

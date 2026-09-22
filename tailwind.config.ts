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
        paper: "#eee8dc",
        surface: "#e4dac9",
        ink: "#202522",
        inkLight: "#2d342f",
        olive: "#596348",
        oliveLight: "#707c5b",
        rust: "#9b452f",
        rustHover: "#843926",
        amber: "#c38b40",
        rule: "#b9aa95",
        muted: "#70695f",
        stoneDark: "#565047",
        cream: "#f4efe5",
        // Map brand to exact replit palette for seamless component backward compatibility
        brand: {
          dark: "#eee8dc", // paper background
          surface: "#e4dac9", // soft surface
          navy: "#202522", // ink
          card: "#e4dac9", // soft surface
          cardHover: "#dcd1bf",
          border: "#b9aa95", // rule
          goldBorder: "#c38b40",
          gold: "#c38b40", // antique gold
          goldLight: "#d8a452",
          goldDark: "#9b452f", // rust
          emerald: "#596348", // olive
          emeraldLight: "#596348",
          emeraldDark: "#434b36",
          amber: "#c38b40",
          cyan: "#596348",
          text: "#202522",
          muted: "#70695f",
          dim: "#70695f",
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', "sans-serif"],
        serif: ['"Instrument Serif"', "Georgia", "serif"],
        arabic: ["Cairo", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      letterSpacing: {
        kicker: "0.22em",
        tag: "0.16em",
      },
    },
  },
  plugins: [],
};

export default config;

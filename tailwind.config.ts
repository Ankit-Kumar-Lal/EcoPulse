import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          forest: "#12372A",
          emerald: "#16A36A",
          "emerald-dark": "#0E7A4E",
          "emerald-light": "#E8F5EE",
          natural: "#F5F8F2",
          lime: "#D9F99D",
          "lime-dark": "#84cc16",
          surface: "#FFFFFF",
          sage: "#64756B",
          "sage-light": "#EEF2ED",
          border: "#E2E8DE",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;

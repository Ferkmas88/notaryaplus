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
        navy: {
          DEFAULT: "#1B3356",
          light: "#234170",
          dark: "#122338",
        },
        gold: {
          DEFAULT: "#C8A214",
          light: "#E6BC22",
          dark: "#9A7C0F",
        },
        mint: {
          DEFAULT: "#C5E8D5",
          light: "#EAF7EF",
          dark: "#9ED4B5",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

import { wedgesTW } from "./src/tw-plugin/plugin.ts";

/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./.storybook/preview.{js,ts,jsx,tsx,mdx}"],
  tailwindFunctions: ["clsx", "cn", "cva"],
  darkMode: ["class", '[data-theme="dark"]'],
  plugins: [wedgesTW()],
  theme: {
    extend: {
      colors: {
      },
    },
  },
};

export default config;

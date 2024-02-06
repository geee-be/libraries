import { twui } from './src/tw-plugin/plugin.ts';

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './.storybook/preview.{js,ts,jsx,tsx,mdx}'],
  tailwindFunctions: ['clsx', 'cn', 'cva'],
  // darkMode: ['variant', () => ['&:hover']],
  // darkMode: false, // ['class', '[data-theme="dark"]'],
  plugins: [twui()],
  theme: {
    extend: {
      colors: {},
    },
  },
};

export default config;

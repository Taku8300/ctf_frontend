import type { Config } from "tailwindcss";
import lineClamp from "@tailwindcss/line-clamp"; // Import the plugin

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  safelist: ['w-[300px]', 'h-[280px]'], // Example safelist (add more if needed)
  plugins: [
    lineClamp, // Use the imported plugin
  ],
};

export default config;

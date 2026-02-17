/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        print: { raw: "print" },
        screen: { raw: "screen" },
      },
    },
    fontFamily: {
      sans: ["Space Grotesk", "sans-serif"],
      serif: ["Merriweather", "serif"],
      mono: ["JetBrains Mono", "monospace"],
    },
  },
  plugins: [],
};

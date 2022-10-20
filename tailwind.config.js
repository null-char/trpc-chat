/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#212130",
        "darker-background": "#101017",
        "background-secondary": "#4b4b5c",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};

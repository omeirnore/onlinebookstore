/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fdf7f0",
          100: "#f8ebdb",
          200: "#f0d3ae",
          300: "#e6b57a",
          400: "#d9924a",
          500: "#c67328",
          600: "#a3591d",
          700: "#82441c",
          800: "#6a381c",
          900: "#582f1b",
        },
      },
    },
  },
  plugins: [],
};

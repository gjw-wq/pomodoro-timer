/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#0f172a",
          900: "#1e293b",
          800: "#334155",
        },
      },
    },
  },
  plugins: [],
};

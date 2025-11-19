module.exports = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          50: "#fdf8f5",
          100: "#fbefe6",
          200: "#f5d7c7",
          300: "#eebaa1",
          400: "#e4936f",
          500: "#dd6f41",
          600: "#b84f30",
          700: "#903823",
        },
      },
      fontFamily: {
        serif: ["Merriweather", "serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
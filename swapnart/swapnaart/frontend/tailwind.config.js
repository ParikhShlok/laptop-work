/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6C3BFF",
        secondary: "#FF4D8D",
        accent: "#00D2FF",
        bgColor: "#F8F9FC",
        darkObsidian: "#161616"
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        inter: ["Inter", "sans-serif"]
      },
      boxShadow: {
        premium: "0 10px 30px -10px rgba(108, 59, 255, 0.15)",
        hoverGlow: "0 15px 40px -10px rgba(255, 77, 141, 0.35)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.08)"
      }
    },
  },
  plugins: [],
}

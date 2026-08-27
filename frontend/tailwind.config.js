/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        industrial: {
          900: '#000000', // Pure black background
          800: '#1C1C1E', // Apple dark mode surface
          700: '#2C2C2E', // Secondary Surface
          600: '#3A3A3C', // Borders
          400: '#86868B', // Soft text (Apple style gray)
          100: '#F5F5F7', // Main Text (Apple style white)
        },
        status: {
          green: '#32D74B', // iOS Green
          amber: '#FF9F0A', // iOS Orange
          red: '#FF453A',   // iOS Red
          blue: '#0A84FF',  // iOS Blue
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}

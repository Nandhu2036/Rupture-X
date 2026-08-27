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
          950: '#070708',
          900: '#0c0c0e',
          800: '#131416',
          700: '#1d1e21',
          600: '#2c2e33',
          500: '#40434b',
          400: '#737780',
          300: '#a0a3ac',
          100: '#eaebed',
        },
        status: {
          green: '#10b981', 
          amber: '#f59e0b',
          red: '#ef4444',
          blue: '#3b82f6',
          cyan: '#06b6d4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', '"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'xxs': '0.65rem',
      }
    },
  },
  plugins: [],
}

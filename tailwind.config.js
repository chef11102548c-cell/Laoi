/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        party: {
          50: '#fef2f4',
          100: '#fde6e9',
          500: '#f43f5e',
          600: '#e11d48',
          900: '#4c0519',
        },
        night: {
          800: '#1a1d2e',
          900: '#0f111a',
          950: '#090a10'
        }
      }
    },
  },
  plugins: [],
}

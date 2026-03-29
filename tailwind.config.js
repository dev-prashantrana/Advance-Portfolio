/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0f0f1b',
          800: '#181825',
          700: '#1a1a2e',
        },
        rose: '#f43f5e',
        yellow: '#fcd34d',
        purple: '#a78bfa',
        'hot-pink': '#f472b6',
      },
    },
  },
  plugins: [],
}
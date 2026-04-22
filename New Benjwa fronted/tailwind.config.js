/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cbre: {
          green: '#006A4D',
          dark: '#1a1a1a',
          gray: '#4A4A4A',
          light: '#F4F4F4',
        }
      }
    },
  },
  plugins: [],
}

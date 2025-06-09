/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'print': { 'raw': 'print' },
      },
      spacing: {
        'a4-width': '210mm',
        'a4-height': '297mm',
      },
    },
  },
  plugins: [],
}
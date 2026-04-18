
// tailwind.config.js
import tailwindcss from '@tailwindcss/vite'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // می‌توانید رنگ‌های سفارشی اضافه کنید
      },
      transitionProperty: {
        'colors': 'colors'
      }
    },
  },
  plugins: [],
}
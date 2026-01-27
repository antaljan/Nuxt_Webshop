/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{vue,js}',
    './composables/**/*.{js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './error.vue',
    './app.vue'
  ],

  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f4f0ff',
          100: '#e0d9ff',
          200: '#c1b3ff',
          300: '#a38cff',
          400: '#8566ff',
          500: '#673fff',
          600: '#5432cc',
          700: '#402699',
          800: '#2c1966',
          900: '#180d33'
        }
      }
    }
  },

  plugins: [
    require('@tailwindcss/typography')
  ]
}

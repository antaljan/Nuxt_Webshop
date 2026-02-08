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
        primary: "var(--primary)",
        background: "var(--background)",
        text: "var(--text)",
        accent: "var(--accent)"
      },

      fontFamily: {
        sans: ["var(--font-family)", "sans-serif"]
      }
    },

    ontSize: {
        base: ['0.95rem', { lineHeight: '1.35' }]
    }
  }
}


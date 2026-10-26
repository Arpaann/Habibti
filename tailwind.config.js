/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        habibti: {
          bg: '#F3EFE6',
          surface: '#E9E2D5',
          'surface-light': '#F8F6F0',
          'surface-border': '#DCD3C4',
          primary: '#242320',
          secondary: '#777168',
          accent: '#B5A68C',
          'accent-dark': '#8E7D62',
          dark: '#171715',
          'dark-surface': '#21211E',
          'dark-border': '#2E2D29',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 4px 20px -2px rgba(36, 35, 32, 0.06)',
        'art': '0 20px 40px -15px rgba(23, 23, 21, 0.12)',
        'inner-veil': 'inset 0 0 40px rgba(0,0,0,0.15)',
      }
    },
  },
  plugins: [],
}

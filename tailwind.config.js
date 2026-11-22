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
        civic: {
          blue: '#1D4ED8',
          navy: '#0F172A',
          emerald: '#059669',
          saffron: '#D97706',
          amber: '#F59E0B',
        },
        amoled: {
          bg: '#000000',
          card: '#0a0a0a',
          cardElevated: '#121212',
          border: '#1f1f1f',
          borderSubtle: '#141414',
          hover: '#171717',
          input: '#0d0d0d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#003769',
          light: '#0f5292',
          dark: '#002548',
        },
        brand: {
          blue:   '#2F7DF6',
          green:  '#186900',
          coral:  '#FF6B4A',
          mist:   '#EEF3F8',
          soft:   '#F7FAFD',
          gray:   '#6F8093',
          border: '#DCE6F0',
          text:   '#16324D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out',
      },
    },
  },
  plugins: [],
}

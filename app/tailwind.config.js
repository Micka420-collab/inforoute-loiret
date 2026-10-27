/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        night: '#0B1F3A',
        signal: '#FFC400',
        danger: '#E5322D',
        works: '#FF8A00',
        clear: '#2BB673',
      },
    },
  },
  plugins: [],
};

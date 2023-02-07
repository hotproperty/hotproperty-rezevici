/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/*.{js,jsx}',
    './src/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': '"Bebas Neue Pro"'
      },
      colors: {
        red: '#ff0000',
        gray: {
          DEFAULT: '#eee',
          hover: '#dfdfdf',
          light: '#f5f5f5'
        }
      }
    },
  },
  plugins: [
    require('tailwindcss-fully-fluid')({
      useMediaReset: false
    })
  ],
}

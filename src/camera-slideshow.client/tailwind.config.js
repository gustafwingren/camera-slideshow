/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    colors: {
      'green': {
        100: '#b9c789',
        200: '#a1b483',
        300: '#8ca159',
        400: '#9ba64d',
        500: '#809747',
        600: '#597945',
        900: '#869980',
      },
      'yellow': {
        100: '#ede39e',
        200: '#f2db7f',
        300: '#f6ce51',
        400: '#e0ad40',
      },
      'brown': {
        100: '#e1b26b',
        200: '#956b58',
        300: '#764223',
        400: '#664925',
      },
      'red': '#9b4423',
      'white': '#ffffff',
      'off-white': '#fdf6e3',
    },
    fontFamily: {
      sans: ['Playlist', 'sans-serif'],
      serif: ['Montserrat', 'serif'],
    },
    extend: {},
  },
  plugins: [],
}


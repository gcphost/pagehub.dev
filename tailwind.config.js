module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    height: theme => ({
      auto: 'auto',
      ...theme('spacing'),
      full: '100%',
      screen: 'calc(var(--vh) * 100)',
    }),
    extend: {
      colors: {
        primary: '#2680eb',
        'dar-gray': '#4b4b4b',
        'light-gray-0': '#eaeaea',
        'light-gray-1': 'rgb(75,75,75)',
        'light-gray-2': 'rgb(128,128,128)',
        'renderer-gray': 'rgb(224, 224, 224)',
        red: '#e34850',
        'green-400': '#2d9d78',
        'green-500': '#268e6c',
      },
    },
  },
  variants: {},
  content: [
    "./pages/**/*.{ts,tsx}",
    "./public/**/*.html",
  ]
};
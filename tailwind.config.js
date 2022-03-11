const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  content: ["index.html", "./src/**/*.jsx"],
  theme: {
    extend: {
      fontFamily:{
        sans:['Oswald', ...defaultTheme.fontFamily.sans],
        fancy: ['Oswald'],
      },     
    },
  },
  plugins: [],
}

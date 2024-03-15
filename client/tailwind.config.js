/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/*.pug", "./assets/js/*.js", "./assets/js/ui/*.js", './node_modules/flowbite-react/lib/esm/**/*.js'],
  theme: {
    extend: {
      colors: {
        'sunrise': '#f4ede4',
      },
    },



  },
  plugins: [
    require('flowbite/plugin')
  ]
}


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nature: {
          green: '#2d6a4f',
          lightGreen: '#40916c',
          brown: '#8b5a2b',
          lightBrown: '#cd853f',
          sand: '#f4a460',
        }
      }
    },
  },
  plugins: [],
}

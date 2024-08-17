/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'
export default {
  content: ["./src/**/*.{html,js,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui
  ],
  daisyui: {
    themes: ["dark"]
  }
}


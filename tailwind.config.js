/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        glow: {
          '0%, 100%': {
            'box-shadow': '0 0 20px rgba(74, 222, 128, 0.4)'
          },
          '50%': {
            'box-shadow': '0 0 30px rgba(74, 222, 128, 0.6)'
          }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      },
      backgroundColor: {
        'app-bg': '#1f1f1f',
      }
    },
  },
  plugins: [],
}
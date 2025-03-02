/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vibe-dark': '#1f1f1f',
        'vibe-accent': '#8A2BE2', // Vibrant purple
        'vibe-text': 'rgba(255, 255, 255, 0.92)',
        'vibe-text-secondary': 'rgba(255, 255, 255, 0.64)',
        'vibe-glass': 'rgba(60, 60, 60, 0.8)',
      },
      animation: {
        'gradient-flow': 'gradientFlow 8s ease infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        gradientFlow: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        }
      },
      backgroundImage: {
        'rainbow-gradient': 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8f00ff)',
      },
      backgroundSize: {
        'gradient-size': '200% 200%',
      },
    },
  },
  plugins: [],
}

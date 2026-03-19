/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          green: '#39ff14',
          blue: '#00f3ff',
        },
        vault: {
          bg: '#0a0a0a',
          panel: '#111111',
          border: '#1a1a1a',
        }
      },
      boxShadow: {
        'neon-green': '0 0 10px #39ff14, 0 0 20px #39ff14, inset 0 0 10px #39ff14',
        'neon-blue': '0 0 10px #00f3ff, 0 0 20px #00f3ff, inset 0 0 10px #00f3ff',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

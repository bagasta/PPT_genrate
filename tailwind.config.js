/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00F0FF', // Neon Cyan
        secondary: '#7000FF', // Neon Purple
        accent: '#FF003C', // Cyber Red
        background: '#0B0C15', // Deep Space
        surface: '#151621', // Dark Panel
        text: '#E0E6ED', // Holographic White
      },
      fontFamily: {
        sans: ['Rajdhani', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'],
      },
      boxShadow: {
        'neon-cyan': '0 0 10px rgba(0, 240, 255, 0.5), 0 0 20px rgba(0, 240, 255, 0.3)',
        'neon-purple': '0 0 10px rgba(112, 0, 255, 0.5), 0 0 20px rgba(112, 0, 255, 0.3)',
      }
    },
  },
  plugins: [],
}

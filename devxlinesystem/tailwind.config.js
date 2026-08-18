/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0f2b4e', // Deepened blue for contrast
          light: '#63b3ed', // Brighter blue for highlights
          accent: '#90cdf4', // Lighter accent for glow
        }
      },
      fontFamily: {
        'mono': ['"Fira Code"', 'monospace'], // Added a coding font
      },
      boxShadow: {
        'glow-brand': '0 0 15px rgba(99, 179, 237, 0.5)',
        'glow-strong': '0 0 25px rgba(144, 205, 244, 0.7)',
      },
      animation: {
        // Immersive background
        'circuit-pulse': 'circuitPulse 4s ease-in-out infinite',
        // Geometric Core
        'core-rotate': 'coreRotate 10s linear infinite',
        // Data Ring
        'data-spin': 'dataSpin 6s linear infinite',
        // Terminal Text
        'typing': 'typing 3.5s steps(30, end) infinite alternate',
        'blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        circuitPulse: {
          '0%, 100%': { opacity: '0.15', transform: 'scale(1)' },
          '50%': { opacity: '0.35', transform: 'scale(1.05)' },
        },
        coreRotate: {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.1)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
        dataSpin: {
          '0%': { transform: 'rotate(360deg) scale(1)' },
          '50%': { transform: 'rotate(0deg) scale(0.9)' },
          '100%': { transform: 'rotate(-360deg) scale(1)' },
        },
        typing: {
          from: { width: '0' },
          to: { width: '100%' },
        },
        blink: {
          '0%, 100%': { borderColor: 'transparent' },
          '50%': { borderColor: 'var(--tw-colors-brand-accent)' },
        },
      }
    },
  },
  plugins: [],
}
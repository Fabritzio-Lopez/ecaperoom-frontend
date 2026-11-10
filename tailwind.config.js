/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Colores temáticos ODS 8 (Rojo Borgoña ODS 8 + Acentos Tecnológicos Verde/Cian)
        ods: {
          burgundy: '#A21942',
          wine: '#871435',
          gold: '#E5A93C',
        },
      },
      fontFamily: {
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)' },
          '100%': { boxShadow: '0 0 25px rgba(16, 185, 129, 0.7)' },
        },
      },
    },
  },
  plugins: [],
};

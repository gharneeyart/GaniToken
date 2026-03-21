/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        surface: {
          0: '#080A0E',
          1: '#0D1017',
          2: '#121620',
          3: '#181D28',
          4: '#1E2432',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.07)',
          subtle: 'rgba(255,255,255,0.04)',
          strong: 'rgba(255,255,255,0.12)',
        },
        emerald: {
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
        },
        amber: {
          400: '#FBBF24',
          500: '#F59E0B',
        },
        violet: {
          400: '#A78BFA',
          500: '#8B5CF6',
        },
        text: {
          primary: '#E8EAF0',
          secondary: '#8892A4',
          tertiary: '#4A5568',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'shimmer': 'shimmer 1.5s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'count-tick': 'countTick 0.15s ease',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        countTick: {
          '0%': { transform: 'translateY(-4px)', opacity: '0.4' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-surface': '#0A0A0F',
        'dark-card': '#141419',
        'neon-cyan': '#00FFF5',
        'neon-teal': '#0FF0FF',
        'card-header': '#1A1A21',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A0A0B0',
        'red-alert': '#FF4444',
        'green-success': '#44FF88',
        'yellow-warning': '#FFD700',
        'orange-alert': '#FF8800',
        'purple-info': '#9966FF',
      },
      boxShadow: {
        'neon': '0 0 10px theme(colors.neon-cyan), 0 0 20px rgba(0, 255, 245, 0.3)',
        'card': '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 12px rgba(0, 255, 245, 0.1), 0 2px 4px rgba(0, 255, 245, 0.08)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle, rgba(20, 20, 25, 0.9) 0%, rgba(10, 10, 15, 1) 100%)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px theme(colors.neon-cyan)' },
          '100%': { boxShadow: '0 0 20px theme(colors.neon-cyan), 0 0 30px theme(colors.neon-cyan)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
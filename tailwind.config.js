export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      borderRadius: {
        'card': '28px',
        '28': '28px',
        '20': '20px',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Inter"',
          'system-ui',
          'sans-serif',
        ],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.06)',
        'glass-hover': '0 12px 40px 0 rgba(0, 0, 0, 0.1)',
        'card': '0 4px 24px -2px rgba(0, 0, 0, 0.04), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'card-dark': '0 8px 30px rgba(0, 0, 0, 0.35)',
        'glow-blue': '0 0 24px -2px rgba(37, 99, 235, 0.35)',
        'glow-green': '0 0 24px -2px rgba(16, 185, 129, 0.35)',
        'glow-amber': '0 0 24px -2px rgba(245, 158, 11, 0.35)',
        'glow-red': '0 0 24px -2px rgba(239, 68, 68, 0.35)',
        'glow-purple': '0 0 24px -2px rgba(168, 85, 247, 0.35)',
      },
    },
  },
  plugins: [],
}

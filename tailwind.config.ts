import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-dark':     '#f8fafc',
        'bg-surface':  '#f1f5f9',
        'bg-card':     '#ffffff',
        'accent':      '#3b82f6',
        'accent-hover':'#2563eb',
        'text-primary':'#0f172a',
        'text-secondary': '#64748b',
        border:        '#e2e8f0',
        // Legacy compat
        background: '#f8fafc',
        surface:    '#f1f5f9',
        card:       '#ffffff',
        ink:        '#0f172a',
        'ink-muted': '#64748b',
        'ink-dim':  '#94a3b8',
        status: {
          captured:  '#F59E0B',
          submitted: '#3b82f6',
          approved:  '#22C55E',
          paid:      '#6366F1',
          disputed:  '#EF4444',
        },
      },
      fontFamily: {
        sans:       ['DM Sans', 'sans-serif'],
        'dm-sans':  ['DM Sans', 'sans-serif'],
        'space-mono': ['Space Mono', 'monospace'],
        mono:       ['Space Mono', 'monospace'],
      },
      animation: {
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        'fade-up':   'fadeInUp 0.6s ease both',
      },
      keyframes: {
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.3' },
        },
        'fadeInUp': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config

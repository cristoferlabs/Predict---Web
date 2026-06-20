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
        brand: {
          blue:   '#4f95d6',
          green:  '#34d399',
          yellow: '#fbbf24',
          orange: '#f0a868',
          red:    '#f87171',
          gray:   '#8b93a0',
          gold:   '#fbbf24',
        },
        surface: {
          900: '#0a0c0f',  // main bg
          800: '#0d1015',  // alt bg
          700: '#14171c',  // card bg
          600: '#101318',  // card deep
          500: '#232830',  // border strong
          400: '#1c2127',  // border light
        },
        terminal: {
          blue: '#3aa0ff',
          green: '#34d399',
          yellow: '#fbbf24',
          red: '#f87171',
          text: {
            primary: '#f3f5f7',
            secondary: '#94a3b8',
          }
        }
      },
      fontFamily: {
        sans: ['Public Sans', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      animation: {
        'ticker': 'ticker 30s linear infinite',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
export default config

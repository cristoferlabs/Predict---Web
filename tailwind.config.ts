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
          gold:   '#fbbf24',  // backward-compat alias
        },
        surface: {
          900: '#0a0c0f',  // main bg
          800: '#0d1015',  // sidebar/nav bg
          700: '#14171c',  // card bg
          600: '#101318',  // card deep / inner sections
          500: '#232830',  // border strong
          400: '#1c2127',  // border light
        },
      },
      fontFamily: {
        sans: ['Public Sans', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config

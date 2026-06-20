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
          blue: '#4f95d6',
          gold: '#fbbf24',
        },
        surface: {
          900: '#0d1015',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      backgroundImage: {
        'noise-texture': "url('https://images.unsplash.com/photo-1602475063211-3d98d60e3b1f?auto=format&w=1440&q=20&fit=crop')",
      }
    },
  },
  plugins: [],
}
export default config

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
          gold: '#F5A623',
          green: '#00C853',
          red: '#FF3D57',
          blue: '#1A8FFF',
        },
        surface: {
          900: '#0A0E1A',
          800: '#111827',
          700: '#1C2333',
          600: '#252D3D',
          500: '#2E384D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': "url('/stadium-bg.svg')",
      },
    },
  },
  plugins: [],
}
export default config

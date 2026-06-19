import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'PitchIQ · Predict WC 2026',
  description: 'Predicciones del Mundial 2026 con IA, modelo Poisson+Elo y XGBoost',
  openGraph: {
    title: 'PitchIQ · Predict WC 2026',
    description: 'Predicciones inteligentes para el Mundial 2026',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface-900 min-h-screen">
        <Navbar />
        <main className="pt-16">{children}</main>
        <footer
          className="mt-16 py-8 text-center text-sm"
          style={{ borderTop: '1px solid #1c2127', color: '#6b727c' }}
        >
          <p>PitchIQ · Modelo XGBoost + Poisson + Elo · Solo informativo</p>
        </footer>
      </body>
    </html>
  )
}

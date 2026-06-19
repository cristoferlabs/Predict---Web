import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Predict WC 2026 | Bot Predictivo Mundial',
  description: 'Predicciones del Mundial 2026 con IA, modelo Poisson+Elo y XGBoost',
  openGraph: {
    title: 'Predict WC 2026',
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface-900 min-h-screen">
        <Navbar />
        <main className="pt-16">{children}</main>
        <footer className="border-t border-surface-700 mt-16 py-8 text-center text-sm text-slate-500">
          <p>Predict WC 2026 · Modelo XGBoost + Poisson + Elo · Solo informativo</p>
        </footer>
      </body>
    </html>
  )
}

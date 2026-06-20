import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Ticker from '@/components/Ticker'

export const metadata: Metadata = {
  title: 'PitchIQ · Match Predictor Terminal',
  description: 'Sistema de predicciones de fútbol avanzado con modelos matemáticos',
  openGraph: {
    title: 'PitchIQ · Match Predictor Terminal',
    description: 'Predicciones inteligentes para fútbol profesional',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-terminal-bg text-terminal-text-primary min-h-screen relative overflow-x-hidden">
        <div className="isometric-grid" />
        
        <Ticker />
        <Navbar />
        
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}

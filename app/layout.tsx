import type { Metadata } from 'next'
import './globals.css'
import FloatingDock from '@/components/Dashboard/FloatingDock'

export const metadata: Metadata = {
  title: 'PitchIQ · Quantum Analytics',
  description: 'Sistema de predicciones de fútbol avanzado con estética Premium Glass',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface-900 text-[#f3f5f7] min-h-screen relative selection:bg-brand-blue/30 selection:text-white">
        {/* Background Layering */}
        <div className="ambient-glow top-[-100px] left-[-100px]" />
        <div className="ambient-glow bottom-[-100px] right-[-100px]" />
        <div className="noise-overlay" />
        
        {/* Background Abstract Video */}
        <div className="fixed inset-0 -z-10 overflow-hidden opacity-30 pointer-events-none">
          <video 
            src="https://videos.pexels.com/video-files/7235106/7235106-hd_1080_1920_30fps.mp4" 
            poster="https://images.pexels.com/videos/7235106/abstract-abstraction-acrylic-art-7235106.jpeg"
            autoPlay 
            muted 
            loop 
            playsInline 
            preload="metadata" 
            className="w-full h-full object-cover blur-[100px]"
          />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>

        <FloatingDock />
      </body>
    </html>
  )
}

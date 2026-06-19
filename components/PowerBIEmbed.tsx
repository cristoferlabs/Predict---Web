'use client'

interface PowerBIEmbedProps {
  embedUrl?: string
  title?: string
  height?: number
}

export default function PowerBIEmbed({
  embedUrl,
  title = 'Dashboard de Predicciones',
  height = 600,
}: PowerBIEmbedProps) {
  const url = embedUrl || process.env.NEXT_PUBLIC_POWERBI_EMBED_URL

  if (!url) {
    return (
      <div
        className="flex flex-col items-center justify-center bg-surface-700 border border-dashed border-surface-500 rounded-2xl text-slate-500"
        style={{ height }}
      >
        <span className="text-4xl mb-3">📊</span>
        <p className="font-semibold text-slate-400">Power BI no configurado</p>
        <p className="text-sm mt-1 text-center max-w-xs">
          Agrega <code className="text-brand-gold">NEXT_PUBLIC_POWERBI_EMBED_URL</code> en tus variables de entorno
        </p>
        <a
          href="https://app.powerbi.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 text-xs bg-brand-gold text-surface-900 font-bold px-4 py-2 rounded-lg hover:opacity-90"
        >
          Ir a Power BI →
        </a>
      </div>
    )
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-surface-500 bg-surface-700">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-surface-500">
        <span className="text-brand-gold font-bold text-sm">📊</span>
        <span className="text-sm font-semibold text-slate-300">{title}</span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-xs text-slate-500 hover:text-brand-gold transition-colors"
        >
          Abrir en Power BI ↗
        </a>
      </div>
      <iframe
        title={title}
        src={url}
        style={{ height, width: '100%' }}
        frameBorder="0"
        allowFullScreen
      />
    </div>
  )
}

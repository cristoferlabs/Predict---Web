import PowerBIEmbed from '@/components/PowerBIEmbed'

export default function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white mb-2">📊 Analytics & Power BI</h1>
        <p className="text-slate-400 max-w-2xl">
          Dashboard ejecutivo conectado a Supabase. Configura tu reporte en Power BI Desktop conectando
          a la base de datos PostgreSQL de Supabase, publícalo en Power BI Service, y pega la URL
          de embed en tus variables de entorno.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { step: '1', title: 'Power BI Desktop', desc: 'Conecta a tu base de datos Supabase vía PostgreSQL. Host: db.xxxx.supabase.co, puerto 5432.', icon: '💻' },
          { step: '2', title: 'Publicar reporte', desc: 'En Power BI Desktop: File → Publish → Publish to Power BI. Selecciona tu workspace.', icon: '☁️' },
          { step: '3', title: 'Obtener embed URL', desc: 'En app.powerbi.com: abre el reporte → File → Embed report → Website or portal. Copia la URL.', icon: '🔗' },
        ].map((s) => (
          <div key={s.step} className="bg-surface-700 border border-surface-500 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-7 h-7 rounded-full bg-brand-gold text-surface-900 text-sm font-black flex items-center justify-center">{s.step}</span>
              <span className="text-lg">{s.icon}</span>
              <p className="font-semibold text-white text-sm">{s.title}</p>
            </div>
            <p className="text-xs text-slate-400">{s.desc}</p>
          </div>
        ))}
      </div>

      <PowerBIEmbed height={650} title="Predict WC 2026 — Dashboard Ejecutivo" />

      <div className="mt-8 bg-surface-700 border border-surface-500 rounded-2xl p-5">
        <h3 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">🔌 Cadena de conexión PostgreSQL (Supabase)</h3>
        <code className="block bg-surface-900 rounded-lg p-4 text-sm text-green-400 font-mono whitespace-pre">
{`Host: db.[PROJECT-REF].supabase.co
Port: 5432
Database: postgres
User: postgres
Password: [tu password de Supabase]
SSL Mode: Require`}
        </code>
        <p className="text-xs text-slate-500 mt-3">
          Encuentra estos datos en: supabase.com → tu proyecto → Settings → Database → Connection string
        </p>
      </div>
    </div>
  )
}

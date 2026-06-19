export default function ComoFuncionaPage() {
  const steps = [
    {
      icon: '📡',
      title: 'Recopilación de datos',
      color: 'border-blue-500/50 bg-blue-900/10',
      accent: 'text-blue-400',
      items: [
        'API-Football: estadísticas WC 2026 en tiempo real (corners, tiros, amarillas)',
        'Football-Data.org: resultados históricos WC 2018 y 2022',
        'The Odds API: cuotas de 40+ casas de apuestas',
        'GNews + NewsAPI: noticias de lesiones y bajas',
      ],
    },
    {
      icon: '⚙️',
      title: 'Modelo Matemático: Poisson + Elo',
      color: 'border-yellow-500/50 bg-yellow-900/10',
      accent: 'text-yellow-400',
      items: [
        'Calcula λ (goles esperados) para cada equipo usando fuerza histórica normalizada',
        'Shrinkage bayesiano: evita que 1 partido domina toda la estimación (PRIOR_N=3)',
        'Elo rating: ajuste por calidad relativa de los equipos',
        'Distribución de Poisson: convierte λ en probabilidades P(0), P(1), P(2)... goles',
        'Combina: P(X gana) = ΣΣ P(X=i, Y=j) para i > j',
      ],
    },
    {
      icon: '🤖',
      title: 'XGBoost: Machine Learning',
      color: 'border-green-500/50 bg-green-900/10',
      accent: 'text-green-400',
      items: [
        '45,000 partidos históricos de torneos internacionales como datos de entrenamiento',
        'Features: Elo, forma reciente, goles en WC, H2H, ranking FIFA',
        'Predice probabilidad directa de victoria/empate/derrota',
        'Blend final: 60% XGBoost + 40% Poisson+Elo',
        'Confianza calibrada: Alta >55%, Media 40-55%, Baja <40%',
      ],
    },
    {
      icon: '🧠',
      title: 'IA (Claude): Analista',
      color: 'border-purple-500/50 bg-purple-900/10',
      accent: 'text-purple-400',
      items: [
        'Recibe el resumen completo: modelo + cuotas + forma + H2H + noticias',
        'Aplica reglas estrictas: Resultado = opción con mayor % (nunca Empate por defecto)',
        'Detecta divergencias modelo vs mercado y explica cuál es más confiable',
        'Genera TOP 5 apuestas alternativas (corners, amarillas, BTTS) con nivel de riesgo',
        'Conclusión siempre consistente con la predicción matemática',
      ],
    },
    {
      icon: '📊',
      title: 'Publicación y Analytics',
      color: 'border-orange-500/50 bg-orange-900/10',
      accent: 'text-orange-400',
      items: [
        'Resultados guardados en Supabase (PostgreSQL)',
        'Esta web los muestra en tiempo real con gráficos interactivos',
        'Power BI conectado a Supabase para dashboards ejecutivos',
        'Tracker de precisión: mide aciertos por nivel de confianza',
        'Export PDF disponible en cada predicción',
      ],
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="text-2xl font-black text-white mb-2">📖 Cómo funciona el modelo</h1>
        <p className="text-slate-400">
          Pipeline completo desde los datos hasta la predicción final
        </p>
      </div>

      {/* Pipeline visual */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10">
        {['Datos', 'Poisson+Elo', 'XGBoost', 'IA Analista', 'Web'].map((step, i, arr) => (
          <div key={step} className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-surface-700 border border-surface-500 rounded-lg px-3 py-2 text-sm font-semibold text-white">
              {step}
            </div>
            {i < arr.length - 1 && (
              <span className="text-brand-gold text-lg font-black">→</span>
            )}
          </div>
        ))}
      </div>

      {/* Steps */}
      <div className="space-y-6">
        {steps.map((s) => (
          <div key={s.title} className={`border rounded-2xl p-6 ${s.color}`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{s.icon}</span>
              <h2 className={`font-bold text-lg ${s.accent}`}>{s.title}</h2>
            </div>
            <ul className="space-y-2">
              {s.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className={`mt-0.5 flex-shrink-0 ${s.accent}`}>›</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Lambda explainer */}
      <div className="mt-10 bg-surface-700 border border-surface-500 rounded-2xl p-6">
        <h3 className="text-brand-gold font-bold text-lg mb-4">🔢 ¿Qué es λ (lambda)?</h3>
        <p className="text-slate-300 text-sm mb-4">
          Lambda es la <strong className="text-white">tasa de goles esperados por partido</strong>. Si λ=1.2,
          el modelo espera que ese equipo marque 1.2 goles en promedio.
        </p>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { label: 'λ &lt; 0.9', desc: 'Equipo defensivo / baja forma', color: 'text-red-400' },
            { label: 'λ 0.9 – 1.5', desc: 'Equipo equilibrado', color: 'text-yellow-400' },
            { label: 'λ &gt; 1.5', desc: 'Equipo ofensivo / alta forma', color: 'text-green-400' },
          ].map((r) => (
            <div key={r.label} className="bg-surface-600 rounded-xl p-3">
              <p className={`font-bold text-sm ${r.color}`} dangerouslySetInnerHTML={{ __html: r.label }} />
              <p className="text-xs text-slate-500 mt-1">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 bg-surface-700 border border-yellow-800/40 rounded-2xl p-4">
        <p className="text-xs text-yellow-600">
          ⚠️ <strong>Aviso:</strong> Este sistema es puramente informativo y educativo. Las predicciones son probabilísticas,
          no certezas. No constituyen asesoramiento de apuestas. Usa responsablemente.
        </p>
      </div>
    </div>
  )
}

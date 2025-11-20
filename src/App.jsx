import { useState, useMemo } from 'react'

const messages = {
  es: {
    title: 'Revelia.life',
    subtitle: 'Descifra tus sueños con IA — claridad, intuición y guía práctica',
    ctaAnalyze: 'Analizar mi sueño',
    placeholder: 'Describe tu sueño con el mayor detalle posible...',
    leadTitle: 'Recibe un informe detallado en tu correo',
    leadCta: 'Quiero mi informe',
    pricingTitle: 'Elige tu nivel',
    free: { name: 'Gratis', features: ['Análisis instantáneo', 'Etiquetas temáticas', 'Recomendaciones básicas'], cta: 'Empezar' },
    pro: { name: 'Pro', features: ['Todo lo Gratis', 'Quiz de contexto personal', 'Historial de sueños'], cta: 'Probar Pro' },
    premium: { name: 'Premium', features: ['Todo Pro', 'Sube audio de tu sueño', 'Prioridad y reportes avanzados'], cta: 'Ir Premium' },
    lang: 'Idioma',
    seoHero: 'Interprete de sueños con IA | Revelia.life',
  },
  en: {
    title: 'Revelia.life',
    subtitle: 'Decode your dreams with AI — clarity, intuition, and practical guidance',
    ctaAnalyze: 'Analyze my dream',
    placeholder: 'Describe your dream in as much detail as possible...',
    leadTitle: 'Get a detailed report to your email',
    leadCta: 'Send me the report',
    pricingTitle: 'Choose your plan',
    free: { name: 'Free', features: ['Instant analysis', 'Theme tagging', 'Basic recommendations'], cta: 'Start' },
    pro: { name: 'Pro', features: ['Everything in Free', 'Personal context quiz', 'Dream history'], cta: 'Try Pro' },
    premium: { name: 'Premium', features: ['Everything in Pro', 'Upload dream audio', 'Priority + advanced reports'], cta: 'Go Premium' },
    lang: 'Language',
    seoHero: 'AI Dream Interpreter | Revelia.life',
  },
  pt: {
    title: 'Revelia.life',
    subtitle: 'Decifre seus sonhos com IA — clareza, intuição e orientação prática',
    ctaAnalyze: 'Analisar meu sonho',
    placeholder: 'Descreva seu sonho com o máximo de detalhes...',
    leadTitle: 'Receba um relatório detalhado por e‑mail',
    leadCta: 'Quero o relatório',
    pricingTitle: 'Escolha seu plano',
    free: { name: 'Grátis', features: ['Análise instantânea', 'Tags de tema', 'Recomendações básicas'], cta: 'Começar' },
    pro: { name: 'Pro', features: ['Tudo do Grátis', 'Quiz de contexto pessoal', 'Histórico de sonhos'], cta: 'Testar Pro' },
    premium: { name: 'Premium', features: ['Tudo do Pro', 'Enviar áudio do sonho', 'Prioridade + relatórios avançados'], cta: 'Ir Premium' },
    lang: 'Idioma',
    seoHero: 'Intérprete de Sonhos com IA | Revelia.life',
  }
}

const apiBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function PlanCard({ title, price, features, highlight, cta }) {
  return (
    <div className={`rounded-2xl border p-6 bg-white/5 backdrop-blur-sm ${highlight ? 'border-indigo-400 shadow-lg shadow-indigo-500/20' : 'border-white/10'}`}>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-3xl font-bold text-white mt-2">{price}</p>
      <ul className="mt-4 space-y-2 text-indigo-100/90">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> {f}
          </li>
        ))}
      </ul>
      <button className={`w-full mt-6 py-2 rounded-lg font-medium transition ${highlight ? 'bg-indigo-500 hover:bg-indigo-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}>{cta}</button>
    </div>
  )
}

export default function App() {
  const [lang, setLang] = useState('es')
  const t = useMemo(() => messages[lang], [lang])
  const [dream, setDream] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [leadMsg, setLeadMsg] = useState('')

  const analyze = async () => {
    if (!dream.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch(`${apiBase}/api/dream/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: dream, language: lang, user_email: email || undefined })
      })
      const data = await res.json()
      setResult(data.analysis)
    } catch (e) {
      setResult({ error: 'Error' })
    } finally {
      setLoading(false)
    }
  }

  const captureLead = async () => {
    if (!email) return
    setLeadMsg('')
    try {
      const res = await fetch(`${apiBase}/api/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, language: lang })
      })
      if (res.ok) setLeadMsg('¡Gracias! Revisa tu bandeja pronto.')
    } catch {}
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <header className="relative z-10">
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 shadow-lg shadow-indigo-500/30" />
            <span className="text-xl font-semibold tracking-tight">Revelia.life</span>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-indigo-100/80">{t.lang}</label>
            <select value={lang} onChange={(e)=>setLang(e.target.value)} className="bg-white/10 rounded-md px-3 py-1.5 text-sm">
              <option value="es">ES</option>
              <option value="en">EN</option>
              <option value="pt">PT</option>
            </select>
          </div>
        </nav>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-100px,rgba(99,102,241,0.3),transparent)]" />
          <div className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">{t.subtitle}</h1>
              <p className="mt-4 text-indigo-100/90">SEO: {t.seoHero}</p>
              <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-4">
                <textarea value={dream} onChange={(e)=>setDream(e.target.value)} rows={5} placeholder={t.placeholder} className="w-full bg-transparent outline-none placeholder:text-indigo-200/60" />
                <div className="flex flex-col sm:flex-row gap-3 mt-3">
                  <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="email@ejemplo.com" className="flex-1 bg-white/10 rounded-lg px-3 py-2" />
                  <button onClick={analyze} className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition font-medium">{loading ? 'Analizando…' : t.ctaAnalyze}</button>
                </div>
              </div>
              {result && (
                <div className="mt-6 space-y-2 text-indigo-100/90">
                  <div className="text-lg font-semibold">Resumen</div>
                  <p>{result?.summary?.[lang]}</p>
                  <div className="text-sm opacity-80">Temas: {(result.themes||[]).join(', ')}</div>
                  <div className="text-sm opacity-80">Tips: {(result.recommendations?.[lang]||[]).join(' • ')}</div>
                </div>
              )}
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold">{t.leadTitle}</h3>
              <div className="mt-3 flex gap-3">
                <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="email@ejemplo.com" className="flex-1 bg-white/10 rounded-lg px-3 py-2" />
                <button onClick={captureLead} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20">{t.leadCta}</button>
              </div>
              {leadMsg && <p className="text-sm text-indigo-200 mt-2">{leadMsg}</p>}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <PlanCard title={`${t.free.name}`} price="$0" features={t.free.features} cta={t.free.cta} />
                <PlanCard title={`${t.pro.name}`} price="$9" features={t.pro.features} cta={t.pro.cta} highlight />
                <PlanCard title={`${t.premium.name}`} price="$29" features={t.premium.features} cta={t.premium.cta} />
              </div>
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">
            {[{
              title: 'Autoridad', text: 'Metodología clara, referencias oníricas y ética profesional.'
            }, {
              title: 'Lead Magnets', text: 'Plantillas de diario, checklist de higiene del sueño y minicursos.'
            }, {
              title: 'SEO & IA', text: 'Etiquetas estructuradas, sitemap y textos multilenguaje listos.'
            }].map((b, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="text-lg font-semibold mb-1">{b.title}</div>
                <p className="text-indigo-100/80">{b.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="py-10 text-center text-sm text-indigo-100/60">© {new Date().getFullYear()} Revelia.life</footer>
    </div>
  )
}

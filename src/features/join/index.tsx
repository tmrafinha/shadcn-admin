// src/features/join/Join.tsx
import { useMemo, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { GoDevLogo } from '@/assets/godev-logo'
import {
  Lock,
  ArrowLeft,
  ArrowRight,
  Star,
  Check,
  Globe,
  Zap,
  Sparkles,
  Info,
  Briefcase,
  Bell,
  Target,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  XCircle,
  MapPin,
  Users,
  Clock,
  Shield,
  Flame,
  ChevronRight,
  Lightbulb,
  TrendingUp,
  Rocket,
} from 'lucide-react'

type Choice = { id: string; label: string; emoji?: string; sub?: string; feedback?: string }

type StepId =
  | 'welcome'
  | 'why_remote'
  | 'we_got_you'
  | 'current_situation'
  | 'situation_mirror'
  | 'how_long'
  | 'how_long_feedback'
  | 'the_problem'
  | 'tried_what'
  | 'linkedin_truth'
  | 'timing_matters'
  | 'hardest_part'
  | 'hardest_validation'
  | 'english_reality'
  | 'salary_goal'
  | 'salary_reality'
  | 'where_from'
  | 'job_kind'
  | 'profile_build'
  | 'results_preview'
  | 'email'
  | 'pricing'

type AnswerMap = Record<string, any>

// ─── Data ─────────────────────────────────────────────────────────────────────
const COUNTRIES = [
  'Brasil', 'Portugal', 'Estados Unidos', 'Canadá', 'Reino Unido', 'Alemanha',
  'França', 'Espanha', 'Holanda', 'Irlanda', 'Suíça', 'Suécia', 'Noruega',
  'Dinamarca', 'Finlândia', 'Austrália', 'Nova Zelândia', 'Japão', 'Coreia do Sul',
  'Singapura', 'Índia', 'México', 'Argentina', 'Chile', 'Colômbia',
]

const JOB_CATEGORIES = [
  'Software Development', 'Customer Service', 'Design', 'Marketing',
  'Sales / Business', 'Product', 'Project Management', 'AI / ML',
  'Data Analysis', 'Devops / Sysadmin', 'Finance', 'Human Resources',
  'QA', 'Writing', 'Legal', 'Medical', 'Education', 'All Others',
]

const FAKE_JOBS = [
  { title: 'Senior Full-Stack Engineer', company: 'Deloitte Digital', region: 'Américas, Europa', salary: 'R$ 22k–35k/mês', applicants: 12, posted: '2h atrás' },
  { title: 'Staff Backend Engineer', company: 'Accenture', region: 'Worldwide', salary: 'R$ 18k–28k/mês', applicants: 7, posted: '5h atrás' },
  { title: 'Senior React Engineer', company: 'BCG X', region: 'Américas', salary: 'R$ 20k–30k/mês', applicants: 19, posted: '1d atrás' },
  { title: 'Product Designer — Remote', company: 'Shopify', region: 'Worldwide', salary: 'R$ 15k–22k/mês', applicants: 9, posted: '3h atrás' },
]

const REVIEWS = [
  { name: 'Luana Ferreira', role: 'Frontend • React / TypeScript', text: 'Eu tava cansada de passar horas no linkedin procurando vaga e nunca ser respondida... aqui quase todas as vagas que apliquei eu tive pelo menos um retorno, gostei bastante', date: '20 Jan, 2026', salary: 'R$ 19k/mês', initials: 'LF' },
  { name: 'Rafael Menezes', role: 'Backend • NestJS / PostgreSQL', text: 'Pra mim virou o melhor lugar pra procurar vaga porque eu não fico pulando de site em site. Já consegui 2 projetos pj que me pagaram mais de 20k/mes', date: '16 Jan, 2026', salary: 'R$ 23k/mês', initials: 'RM' },
  { name: 'Paulo Rocha', role: 'Frontend • Angular', text: 'Eu tava achando que trabalho na gringa era só pra quem já mora fora. Mas os caras realmente têm somente vagas que aceita brasileiros, achei muito foda', date: '13 Jan, 2026', salary: 'R$ 17k/mês', initials: 'PR' },
  { name: 'Gustavo Lima', role: 'Fullstack • React / Nest', text: 'Com 3 anos de experiencia consegui um trabalho numa consultoria de RPA, ganhando 17k... hoje com 5 anos de experiencia, meu salário já aumentou muito', date: '10 Jan, 2026', salary: 'R$ 24k/mês', initials: 'GL' },
  { name: 'Mariana Costa', role: 'Frontend • React', text: 'Eu gosto porque não tem aquele caos de anúncio repetido. Parece que alguém já fez a triagem por você e deixou só o que presta.', date: '7 Jan, 2026', salary: 'R$ 16k/mês', initials: 'MC' },
]

const LIVE_NAMES = ['Carlos S.', 'Ana P.', 'Diego M.', 'Julia R.', 'Thiago K.', 'Fernanda L.', 'Bruno T.', 'Camila V.']
const LIVE_CITIES = ['São Paulo', 'Curitiba', 'Recife', 'Fortaleza', 'Porto Alegre', 'Florianópolis', 'Brasília', 'Belo Horizonte']

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useLiveActivity() {
  const [n, setN] = useState<{ name: string; city: string } | null>(null)
  useEffect(() => {
    const show = () => {
      setN({ name: LIVE_NAMES[~~(Math.random() * LIVE_NAMES.length)], city: LIVE_CITIES[~~(Math.random() * LIVE_CITIES.length)] })
      setTimeout(() => setN(null), 4500)
    }
    const t1 = setTimeout(show, 5000)
    const iv = setInterval(show, 13000)
    return () => { clearTimeout(t1); clearInterval(iv) }
  }, [])
  return n
}

function useCountdown(sec: number) {
  const [r, setR] = useState(sec)
  useEffect(() => { const t = setInterval(() => setR(v => Math.max(0, v - 1)), 1000); return () => clearInterval(t) }, [])
  return { m: String(~~(r / 60)).padStart(2, '0'), s: String(r % 60).padStart(2, '0') }
}

// ─── ProfileBuildStep ────────────────────────────────────────────────────────
function ProfileBuildStep({ category, country, onDone }: { category: string; country: string; onDone: () => void }) {
  const [phase, setPhase] = useState(0)
  const phases = [
    { label: 'Analisando suas respostas...', icon: '🔍', pct: 18 },
    { label: `Buscando vagas de ${category}...`, icon: '⚙️', pct: 42 },
    { label: `Filtrando vagas por ${country}...`, icon: '🌎', pct: 64 },
    { label: 'Verificando empresas e salários...', icon: '✅', pct: 84 },
    { label: 'Perfil pronto!', icon: '🎉', pct: 100 },
  ]
  useEffect(() => {
    if (phase >= phases.length - 1) { const t = setTimeout(onDone, 900); return () => clearTimeout(t) }
    const t = setTimeout(() => setPhase(p => p + 1), 850)
    return () => clearTimeout(t)
  }, [phase])
  const cur = phases[phase]
  return (
    <div className="text-center py-4">
      <div className="text-5xl mb-5">{cur.icon}</div>
      <h2 className="text-2xl font-bold tracking-tight text-foreground">Preparando seu perfil</h2>
      <p className="mt-2 text-sm text-muted-foreground">{cur.label}</p>
      <div className="mt-7 mx-auto max-w-xs">
        <div className="relative h-2 overflow-hidden rounded-full bg-muted/40">
          <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-700" style={{ width: `${cur.pct}%` }} />
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">{cur.pct}%</p>
      </div>
      <div className="mt-6 mx-auto max-w-xs space-y-1.5 text-left">
        {phases.slice(0, phase + 1).map((p, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <CheckCircle2 className={['h-3.5 w-3.5 flex-shrink-0', i === phase ? 'text-emerald-500' : 'text-emerald-400'].join(' ')} />
            <span className={i === phase ? 'font-semibold text-foreground' : 'text-muted-foreground'}>{p.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export function Join() {
  const [step, setStep] = useState<StepId>('welcome')
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [countryQuery, setCountryQuery] = useState('')
  const [country, setCountry] = useState('')
  const [categoryQuery, setCategoryQuery] = useState('')
  const [category, setCategory] = useState('Software Development')
  const [email, setEmail] = useState('')
  const [plan, setPlan] = useState<'annual' | 'monthly'>('annual')
  const live = useLiveActivity()

  const filteredCountries = useMemo(() => {
    const q = countryQuery.trim().toLowerCase()
    return q ? COUNTRIES.filter(c => c.toLowerCase().includes(q)) : COUNTRIES
  }, [countryQuery])

  const filteredCategories = useMemo(() => {
    const q = categoryQuery.trim().toLowerCase()
    return q ? JOB_CATEGORIES.filter(c => c.toLowerCase().includes(q)) : JOB_CATEGORIES
  }, [categoryQuery])

  const stepsOrder: StepId[] = [
    'welcome',
    'why_remote', 'we_got_you',
    'current_situation', 'situation_mirror',
    'how_long', 'how_long_feedback',
    'the_problem',
    'tried_what', 'linkedin_truth',,
    'timing_matters',
    'hardest_part', 'hardest_validation',
    'english_reality',
    'salary_goal', 'salary_reality',
    'where_from', 'job_kind',
    'profile_build',
    'results_preview',
    'email', 'pricing',
  ]

  const currentIndex = stepsOrder.indexOf(step)
  const progressPct = Math.max(3, Math.round(((currentIndex) / (stepsOrder.length - 1)) * 100))

  function goBack() {
    const idx = stepsOrder.indexOf(step)
    if (idx <= 0) return
    setStep(stepsOrder[idx - 1])
  }

  function goNext(nextStep?: StepId) {
    if (nextStep) { setStep(nextStep); return }
    const idx = stepsOrder.indexOf(step)
    if (idx < stepsOrder.length - 1) setStep(stepsOrder[idx + 1])
  }

  function ans(key: string, val: any, next?: StepId) {
    setAnswers(a => ({ ...a, [key]: val }))
    goNext(next)
  }

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [step])

  const canContinueEmail = /^\S+@\S+\.\S+$/.test(email)

  // ─── choices ────────────────────────────────────────────────────────────────
  const whyRemoteChoices: Choice[] = [
    { id: 'family', label: 'Mais tempo com a família', emoji: '🧡', sub: 'Trabalhar de casa, perto de quem amo' },
    { id: 'me', label: 'Mais liberdade pra mim', emoji: '🤓', sub: 'Horário flexível, sem chefe no pescoço' },
    { id: 'commute', label: 'Menos deslocamento e stress', emoji: '🚗', sub: 'Chega de horas no trânsito todo dia' },
    { id: 'salary', label: 'Ganhar muito mais', emoji: '💰', sub: 'Salário internacional morando no Brasil' },
    { id: 'now', label: 'Preciso de um emprego AGORA', emoji: '😅', sub: 'Situação urgente, preciso de renda rápido' },
  ]

  const situationChoices: Choice[] = [
    { id: 'employed_unhappy', label: 'Tenho emprego mas quero mudar', emoji: '😐', sub: 'Insatisfeito ou mal pago' },
    { id: 'employed_ok', label: 'Tenho emprego e quero algo melhor', emoji: '🙂', sub: 'Estou bem, mas posso ganhar mais' },
    { id: 'unemployed', label: 'Estou desempregado', emoji: '🔍', sub: 'Precisando de renda urgente' },
    { id: 'freelancer', label: 'Freelancer / PJ / autônomo', emoji: '💻', sub: 'Trabalho por conta, quero mais estabilidade' },
    { id: 'student', label: 'Estudante ou recém-formado', emoji: '🎓', sub: 'Buscando minha primeira oportunidade' },
  ]

  const howLongChoices: Choice[] = [
    { id: 'just_started', label: 'Acabei de começar', emoji: '⚙️', sub: 'Menos de 2 semanas' },
    { id: 'weeks', label: 'Algumas semanas', emoji: '🚧', sub: '2 a 8 semanas' },
    { id: 'months', label: 'Alguns meses', emoji: '📆', sub: '2 a 6 meses' },
    { id: 'long', label: 'Tempo demais', emoji: '😔', sub: 'Mais de 6 meses tentando' },
  ]

  const triedChoices: Choice[] = [
    { id: 'linkedin', label: 'LinkedIn', emoji: '🔵' },
    { id: 'indeed', label: 'Indeed / Glassdoor', emoji: '🔎' },
    { id: 'remote_sites', label: 'Sites remotos (Remote.co etc)', emoji: '🌐' },
    { id: 'referral', label: 'Indicação de amigos', emoji: '👥' },
    { id: 'recruiter', label: 'Fui contactado por recrutador', emoji: '📧' },
    { id: 'nothing', label: 'Ainda não tentei muito', emoji: '🤷' },
  ]

  const hardestChoices: Choice[] = [
    { id: 'no_jobs', label: 'Não acho vagas relevantes pra mim', emoji: '🔬', sub: 'Procuro e não encontro nada que faça sentido', feedback: 'No lugar errado, parece que não existe vaga. No lugar certo, aparecem dezenas por semana.' },
    { id: 'no_reply', label: 'Aplico e ninguém responde', emoji: '👻', sub: 'Ghosting eterno de recrutadores', feedback: 'Ghosting quase sempre é vaga errada ou timing ruim. Com 12 concorrentes ao invés de 500, o cenário muda.' },
    { id: 'no_interview', label: 'Não consigo entrevistas', emoji: '🦗', sub: 'Currículo não está gerando interesse', feedback: 'Menos concorrência significa mais atenção do recrutador. Você não precisa de currículo perfeito — precisa aparecer quando há espaço.' },
    { id: 'competition', label: 'A concorrência parece impossível', emoji: '🏙️', sub: 'Sinto que não consigo me destacar', feedback: 'Com 500 candidatos, destacar é quase impossível. Com 12, qualquer profissional decente tem chance real.' },
    { id: 'english', label: 'Meu inglês me trava', emoji: '🗣️', sub: 'Tenho medo de não ser bom o suficiente', feedback: 'Temos vagas que aceitam inglês intermediário — e algumas até em português. Você não precisa ser fluente pra começar.' },
  ]

  const salaryChoices: Choice[] = [
    { id: 'up_to_8k', label: 'Até R$ 8.000 / mês', emoji: '📊', sub: 'Primeiro emprego remoto ou retomada' },
    { id: '8k_15k', label: 'R$ 8.000 – R$ 15.000 / mês', emoji: '📈', sub: 'Faixa pleno — mercado mais aquecido' },
    { id: '15k_25k', label: 'R$ 15.000 – R$ 25.000 / mês', emoji: '🚀', sub: 'Faixa sênior — empresas top' },
    { id: 'above_25k', label: 'Acima de R$ 25.000 / mês', emoji: '💎', sub: 'Staff, principal, liderança' },
  ]

  // ─── Dynamic content ─────────────────────────────────────────────────────────
  const weGotYouContent: Record<string, { kicker: string; title: string; body: string }> = {
    family: { kicker: 'Faz todo sentido. 🧡', title: 'Trabalhar remoto muda a dinâmica familiar completamente.', body: 'Buscar filho na escola, almoçar em casa, estar presente nos momentos que importam — e ganhar bem ao mesmo tempo. Totalmente possível.' },
    me: { kicker: 'Liberdade é tudo. 🤓', title: 'Sem chefe olhando por cima do ombro, com horário que respeita sua vida.', body: 'Você entrega resultado, e o resto é vida sua. Sem justificar por que chegou 5 minutos atrasado.' },
    commute: { kicker: 'Isso cansa demais. 🚗', title: 'Horas no trânsito são horas da sua vida que você nunca recupera.', body: 'Imagina usar esse tempo pra aprender algo novo, malhar ou simplesmente descansar. Com trabalho remoto, esse tempo volta pra você.' },
    salary: { kicker: 'Decisão inteligente. 💰', title: 'Empresas internacionais pagam em dólar — e você mora no Brasil.', body: 'O câmbio trabalha a seu favor. Profissionais que a gente acompanha chegam a 3x o salário que teriam numa empresa local.' },
    now: { kicker: 'Sem problema. 😅', title: 'Situação urgente pede a estratégia mais eficiente, não a mais óbvia.', body: 'A maioria vai direto pro LinkedIn quando está com urgência. O problema é que lá você concorre com 500 pessoas pela mesma vaga. A gente vai mudar isso.' },
  }

  const situationMirrorContent: Record<string, { kicker: string; title: string; body: string; insight: string }> = {
    employed_unhappy: { kicker: 'A gente entende bem isso.', title: 'Saber que merece mais — e estar preso no mesmo lugar — é frustrante.', body: 'O padrão é tentar um novo emprego local e o salário continuar igual. O salto de verdade costuma vir quando você abre pra mercado internacional.', insight: '💡 Profissionais nessa transição relatam média de 2.4x de aumento salarial.' },
    employed_ok: { kicker: 'Bom ponto de partida.', title: 'Buscar enquanto ainda empregado é a estratégia mais inteligente.', body: 'Você não tem pressão, pode escolher com calma e negociar de igual pra igual. O mercado internacional adora quem está ativo e seguro.', insight: '💡 Candidatos empregados têm 40% mais chance de receber oferta.' },
    unemployed: { kicker: 'Entendemos a pressão.', title: 'Desemprego não é falta de competência — é falta de acesso ao mercado certo.', body: 'A boa notícia: vagas remotas internacionais costumam ter processos mais rápidos do que empresas locais.', insight: '💡 Membros nessa situação costumam receber primeira resposta em até 2 semanas.' },
    freelancer: { kicker: 'Você já tem a mentalidade certa.', title: 'Autonomia, entrega por resultado, comunicação remota — você já vive isso.', body: 'Agora é escalar com empresas maiores que pagam o que você merece por isso.', insight: '💡 Ex-freelancers têm adaptação acima da média em vagas de consultoria e produto.' },
    student: { kicker: 'Momento ideal pra começar.', title: 'Os primeiros anos de carreira definem a trajetória dos próximos dez.', body: 'A curva salarial de quem começa em empresas internacionais é completamente diferente. Os primeiros 2 anos são decisivos.', insight: '💡 Temos vagas específicas pra profissionais com 0-3 anos de experiência.' },
  }

  const howLongFeedbackContent: Record<string, { kicker: string; title: string; body: string }> = {
    just_started: { kicker: 'Timing perfeito. ⚡', title: 'Você está chegando antes de desperdiçar meses na abordagem errada.', body: 'A maioria gasta meses no LinkedIn antes de descobrir que 70% das vagas remotas nem aparecem lá. Você vai pular essa fase.' },
    weeks: { kicker: 'Ainda bem que você está aqui. 🚧', title: 'Algumas semanas é tempo suficiente pra perceber que a abordagem padrão não funciona.', body: 'Não é falta de esforço — é o canal. Você está competindo com 500 pessoas quando deveria estar onde tem 12.' },
    months: { kicker: 'Meses sem resultado são exaustivos. 📆', title: 'Isso não é falta de competência — é falta da ferramenta certa.', body: 'Você provavelmente está aplicando nas mesmas vagas que 500 outras pessoas. A diferença está em acessar onde a maioria não está olhando.' },
    long: { kicker: 'Mais de 6 meses. Isso pesa. 😔', title: 'Esse tempo corrói a autoconfiança de qualquer um.', body: 'Em 90% dos casos que vimos, o problema era o canal, não o profissional. Vamos mudar o canal.' },
  }

  const salaryExamples: Record<string, { title: string; items: { role: string; range: string; co: string }[] }> = {
    up_to_8k: { title: 'Vagas nessa faixa que passam pelo GoDev:', items: [{ role: 'Junior Frontend Dev', range: 'R$ 6k–10k', co: 'Startups EUA/Europa' }, { role: 'Customer Support (EN B1)', range: 'R$ 5k–9k', co: 'SaaS Internacional' }, { role: 'Junior QA / Tester', range: 'R$ 7k–11k', co: 'Consultorias globais' }] },
    '8k_15k': { title: 'Vagas nessa faixa que passam pelo GoDev:', items: [{ role: 'Mid Full-Stack Engineer', range: 'R$ 10k–18k', co: 'Scale-ups EUA/CA' }, { role: 'Product Designer', range: 'R$ 9k–15k', co: 'SaaS B2B' }, { role: 'Data Analyst', range: 'R$ 8k–14k', co: 'Fintechs internacionais' }] },
    '15k_25k': { title: 'Vagas nessa faixa que passam pelo GoDev:', items: [{ role: 'Senior Backend Engineer', range: 'R$ 18k–28k', co: 'Deloitte / Accenture / BCG' }, { role: 'Staff Product Designer', range: 'R$ 16k–24k', co: 'Scale-ups série B/C' }, { role: 'Senior Data Scientist', range: 'R$ 17k–25k', co: 'Big Tech / Consultorias' }] },
    above_25k: { title: 'Vagas nessa faixa que passam pelo GoDev:', items: [{ role: 'Staff/Principal Engineer', range: 'R$ 25k–45k', co: 'Big Tech / Series C+' }, { role: 'Engineering Manager', range: 'R$ 28k–50k', co: 'Tech companies globais' }, { role: 'VP of Engineering', range: 'R$ 35k+', co: 'Scale-ups internacionais' }] },
  }

  const weGotYou = weGotYouContent[answers.why_remote] ?? weGotYouContent.now
  const situationMirror = situationMirrorContent[answers.current_situation] ?? situationMirrorContent.unemployed
  const howLongFeedback = howLongFeedbackContent[answers.how_long] ?? howLongFeedbackContent.weeks
  const salaryEx = salaryExamples[answers.salary_goal] ?? salaryExamples['8k_15k']
  const hardestPicked = hardestChoices.find(x => x.id === answers.hardest_part)

  return (
    <div className="min-h-screen bg-background">
      {/* BG suave */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-0 top-0 h-80 w-full bg-[radial-gradient(circle_at_18%_18%,rgba(52,211,153,0.18),transparent_55%)]" />
        <div className="absolute right-0 top-0 h-80 w-full bg-[radial-gradient(circle_at_80%_10%,rgba(45,212,191,0.16),transparent_55%)]" />
        <div className="absolute bottom-0 left-1/2 h-96 w-[60rem] -translate-x-1/2 bg-[radial-gradient(circle_at_50%_80%,rgba(16,185,129,0.10),transparent_60%)]" />
      </div>

      {live && (
        <div className="fixed bottom-6 left-4 z-50" style={{ animation: 'slideUp 0.4s ease' }}>
          <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>
          <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/95 px-4 py-3 shadow-2xl backdrop-blur-md">
            <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-xs font-bold text-white">{live.name[0]}</div>
            <div>
              <p className="text-xs font-semibold text-foreground">{live.name} de {live.city}</p>
              <p className="text-[11px] text-emerald-600">acabou de criar a conta 🎉</p>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-10">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button onClick={goBack} className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </button>
          <GoDevLogo collapsed={false} />
          <div className="w-[86px]" />
        </div>

        {/* Card */}
        <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-border/60 bg-card/60 shadow-xl backdrop-blur-sm">

          {/* Progress bar — linha corrida, sem divisões */}
          {step !== 'welcome' && (
            <div className="border-b border-border/40">
              <div className="relative h-1 w-full bg-muted/40">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-700 ease-out"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}

          <div className="p-8">

            {/* ══ WELCOME ══════════════════════════════════════════════════ */}
            {step === 'welcome' && (
              <StepWelcome onPrimary={() => goNext('why_remote')} />
            )}

            {/* ══ POR QUE REMOTO ═══════════════════════════════════════════ */}
            {step === 'why_remote' && (
              <StepQuestion
                title="Por que você quer trabalhar remoto?"
                choices={whyRemoteChoices}
                selected={answers.why_remote}
                onSelect={c => ans('why_remote', c.id, 'we_got_you')}
                canContinue={!!answers.why_remote}
                primaryLabel="Continuar"
                onPrimary={() => goNext('we_got_you')}
              />
            )}

            {/* ══ VALIDAÇÃO EMOCIONAL ═══════════════════════════════════════ */}
            {step === 'we_got_you' && (
              <StepInfo
                kicker={weGotYou.kicker}
                icon={<Sparkles className="h-5 w-5" />}
                title={weGotYou.title}
                body={weGotYou.body}
                primaryLabel="Continuar"
                onPrimary={() => goNext('current_situation')}
              />
            )}

            {/* ══ SITUAÇÃO ATUAL ════════════════════════════════════════════ */}
            {step === 'current_situation' && (
              <StepQuestion
                title="Qual é a sua situação hoje no trabalho?"
                subtitle="Sem julgamento — queremos entender seu ponto de partida"
                choices={situationChoices}
                selected={answers.current_situation}
                onSelect={c => ans('current_situation', c.id, 'situation_mirror')}
                canContinue={!!answers.current_situation}
                primaryLabel="Continuar"
                onPrimary={() => goNext('situation_mirror')}
              />
            )}

            {/* ══ ESPELHO DA SITUAÇÃO ════════════════════════════════════════ */}
            {step === 'situation_mirror' && (
              <StepInfo
                kicker={situationMirror.kicker}
                icon={<Lightbulb className="h-5 w-5" />}
                title={situationMirror.title}
                body={situationMirror.body}
                highlight={
                  <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-left">
                    <p className="text-sm text-foreground">{situationMirror.insight}</p>
                  </div>
                }
                primaryLabel="Continuar"
                onPrimary={() => goNext('how_long')}
              />
            )}

            {/* ══ HÁ QUANTO TEMPO BUSCA ═════════════════════════════════════ */}
            {step === 'how_long' && (
              <StepQuestion
                title="Há quanto tempo você está buscando emprego remoto?"
                choices={howLongChoices}
                selected={answers.how_long}
                onSelect={c => ans('how_long', c.id, 'how_long_feedback')}
                canContinue={!!answers.how_long}
                primaryLabel="Continuar"
                onPrimary={() => goNext('how_long_feedback')}
              />
            )}

            {/* ══ FEEDBACK TEMPO ════════════════════════════════════════════ */}
            {step === 'how_long_feedback' && (
              <StepInfo
                kicker={howLongFeedback.kicker}
                icon={<Target className="h-5 w-5" />}
                title={howLongFeedback.title}
                body={howLongFeedback.body}
                primaryLabel="Continuar"
                onPrimary={() => goNext('the_problem')}
              />
            )}

            {/* ══ O PROBLEMA REAL ══════════════════════════════════════════ */}
            {step === 'the_problem' && (
              <StepInfo
                kicker="Antes de qualquer coisa 👇"
                icon={<Info className="h-5 w-5" />}
                title="O motivo real pelo qual a maioria não consegue vaga remota não é o currículo"
                body="É onde estão procurando. Quem busca no lugar errado concorre com 500 pessoas. Quem busca no lugar certo concorre com poucas pessoas."
                highlight={
                  <div className="mt-5 grid grid-cols-2 gap-3 text-left">
                    <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-4">
                      <p className="text-xs font-bold text-red-600 mb-2">❌ LinkedIn</p>
                      <p className="text-sm text-muted-foreground">400–700 candidatos por vaga</p>
                    </div>
                    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                      <p className="text-xs font-bold text-emerald-600 mb-2">✅ GoDev</p>
                      <p className="text-sm text-muted-foreground">~20 candidatos por vaga</p>
                    </div>
                  </div>
                }
                primaryLabel="Ver os números"
                onPrimary={() => goNext('tried_what')}
              />
            )}

            {/* ══ O QUE JÁ TENTOU ══════════════════════════════════════════ */}
            {step === 'tried_what' && (
              <StepMulti
                title="O que você já tentou até agora?"
                subtitle="Pode marcar mais de uma"
                choices={triedChoices}
                selected={answers.tried_what ?? []}
                onToggle={id => {
                  const prev: string[] = answers.tried_what ?? []
                  setAnswers(a => ({ ...a, tried_what: prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id] }))
                }}
                primaryLabel="Continuar"
                onPrimary={() => goNext('linkedin_truth')}
                canContinue={(answers.tried_what ?? []).length > 0}
              />
            )}

            {/* ══ GRÁFICO LINKEDIN VS GODEV ═════════════════════════════════ */}
            {step === 'linkedin_truth' && (
              <div>
                <p className="text-center text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {(answers.tried_what ?? []).includes('linkedin') ? 'Agora faz sentido o silêncio, né? 😬' : 'Olha esse número. 😬'}
                </p>
                <h2 className="mt-3 text-center text-2xl font-bold tracking-tight text-foreground">
                  Não era o seu currículo. Era a concorrência.
                </h2>
                <p className="mx-auto mt-3 max-w-lg text-center text-sm text-muted-foreground">
                  Veja a diferença real de candidatos por vaga entre as plataformas:
                </p>

                <div className="mt-6 rounded-2xl border border-border/60 bg-background/60 p-5">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Candidatos médios por vaga remota
                  </p>

                  {/* LinkedIn */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-sm bg-red-400 flex-shrink-0" />
                        <span className="text-sm font-semibold text-foreground">LinkedIn Jobs</span>
                      </div>
                      <span className="text-sm font-bold text-red-500">400–700 candidatos</span>
                    </div>
                    <div className="relative h-8 w-full overflow-hidden rounded-xl bg-muted/30">
                      <div className="absolute inset-y-0 left-0 flex items-center justify-end pr-3 rounded-xl bg-gradient-to-r from-red-500 to-red-400" style={{ width: '96%' }}>
                        <span className="text-xs font-bold text-white">96%</span>
                      </div>
                    </div>
                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 flex-shrink-0" /> Sua chance de ser notado: <strong>muito baixa</strong>
                    </p>
                  </div>

                  <div className="my-4 flex items-center gap-3">
                    <div className="flex-1 h-px bg-border/40" />
                    <span className="text-[11px] text-muted-foreground font-medium">vs</span>
                    <div className="flex-1 h-px bg-border/40" />
                  </div>

                  {/* GoDev */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-sm bg-emerald-400 flex-shrink-0" />
                        <span className="text-sm font-semibold text-foreground">GoDev</span>
                      </div>
                      <span className="text-sm font-bold text-emerald-600">~12 candidatos</span>
                    </div>
                    <div className="relative h-8 w-full overflow-hidden rounded-xl bg-muted/30">
                      <div className="absolute inset-y-0 left-0 flex items-center justify-end pr-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400" style={{ width: '14%' }}>
                        <span className="text-[10px] font-bold text-white">14%</span>
                      </div>
                    </div>
                    <p className="mt-1.5 text-xs text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 flex-shrink-0" /> Sua chance de ser notado: <strong>muito alta</strong>
                    </p>
                  </div>

                  <div className="mt-5 rounded-xl bg-foreground/5 px-4 py-3">
                    <p className="text-xs text-center text-muted-foreground">
                      Aplicar no lugar certo é <strong className="text-foreground">40x mais eficiente</strong> do que mandar mais currículos no LinkedIn.
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2.5">
                  {[{ v: '500+', l: 'candidatos/vaga no LinkedIn' }, { v: '12', l: 'candidatos/vaga no GoDev' }, { v: '40x', l: 'mais eficiente' }].map(x => (
                    <div key={x.l} className="rounded-2xl border border-border/60 bg-background/60 p-3 text-center">
                      <p className="text-lg font-bold text-foreground">{x.v}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{x.l}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-7">
                  <Button size="lg" className="h-12 w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500" onClick={() => goNext('timing_matters')}>
                    Continuar <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* ══ MATEMÁTICA DO LINKEDIN ════════════════════════════════════ */}
            {/* {step === 'linkedin_math' && (
              <StepInfo
                kicker="A conta é simples 🧮"
                icon={<Rocket className="h-5 w-5" />}
                title="Com 500 candidatos você precisa de sorte. Com 12, você precisa de competência."
                body="E a competência você já tem. O que estava faltando era o acesso certo."
                highlight={
                  <div className="mt-5 space-y-2.5 text-left">
                    {[
                      { n: '01', t: 'Você aplica no LinkedIn', d: '500 pessoas fazem o mesmo nas próximas 24h' },
                      { n: '02', t: 'O recrutador lê os primeiros 20', d: 'Se você não aplicou cedo, provavelmente não está nesses 20' },
                      { n: '03', t: 'Você não recebe retorno', d: 'Não porque você não presta — porque foi soterrado pela quantidade' },
                      { n: '04', t: 'Você pensa que é o currículo', d: 'Faz curso, atualiza o perfil, tenta de novo. Mesmo resultado.' },
                    ].map((item, i) => (
                      <div key={item.n} className="flex items-start gap-3">
                        <div className={['h-7 w-7 flex-shrink-0 rounded-lg flex items-center justify-center text-xs font-bold', i === 3 ? 'bg-red-500/10 text-red-600' : 'bg-muted/60 text-muted-foreground'].join(' ')}>
                          {item.n}
                        </div>
                        <div className="rounded-2xl border border-border/50 bg-background/60 px-4 py-3 flex-1">
                          <p className="text-sm font-semibold text-foreground">{item.t}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                }
                primaryLabel="Continuar"
                onPrimary={() => goNext('timing_matters')}
              />
            )} */}

            {/* ══ TIMING IMPORTA ════════════════════════════════════════════ */}
            {step === 'timing_matters' && (
              <StepInfo
                kicker="Pro tip 🏆"
                icon={<Bell className="h-5 w-5" />}
                title="Aplicar nas primeiras 24h aumenta MUITO suas chances."
                body="Recrutadores internacionais leem os primeiros candidatos com muito mais atenção. Depois de 48h, a maioria nem abre mais."
                highlight={
                  <div className="mt-5 space-y-2 text-left">
                    {[
                      { time: '0–48h', label: '🟢 Janela de ouro', desc: 'Poucos candidatos, recrutador animado' },
                      { time: '48-72h', label: '🟡 Ainda bom', desc: 'Competição crescendo, mas vale' },
                      { time: '+1 semana', label: '🟠 Difícil', desc: 'Centenas de candidatos já na frente' },
                      { time: '+1 mês', label: '🔴 Quase impossível', desc: 'A vaga provavelmente já tem finalistas' },
                    ].map(row => (
                      <div key={row.time} className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/60 p-3">
                        <div className="w-12 flex-shrink-0 text-xs font-bold text-foreground">{row.time}</div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">{row.label}</p>
                          <p className="text-[11px] text-muted-foreground">{row.desc}</p>
                        </div>
                      </div>
                    ))}
                    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-start gap-2">
                      <Bell className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground">Membros GoDev recebem alerta assim que a vaga é publicada — em média <strong>4h antes do LinkedIn</strong>.</p>
                    </div>
                  </div>
                }
                primaryLabel="Continuar"
                onPrimary={() => goNext('hardest_part')}
              />
            )}

            {/* ══ PARTE MAIS DIFÍCIL ════════════════════════════════════════ */}
            {step === 'hardest_part' && (
              <StepQuestion
                title="Qual tem sido o maior obstáculo na sua busca?"
                subtitle="Isso personaliza o que você vai ver"
                choices={hardestChoices}
                selected={answers.hardest_part}
                onSelect={c => {
                  setAnswers(a => ({ ...a, hardest_part: c.id }))
                  setTimeout(() => goNext('hardest_validation'), 300)
                }}
                canContinue={!!answers.hardest_part}
                primaryLabel="Continuar"
                onPrimary={() => goNext('hardest_validation')}
                secondaryLabel="Pular"
                onSecondary={() => goNext('hardest_validation')}
              />
            )}

            {/* ══ VALIDAÇÃO DO OBSTÁCULO ════════════════════════════════════ */}
            {step === 'hardest_validation' && (
              <StepInfo
                kicker="Entendido. ✅"
                icon={<Info className="h-5 w-5" />}
                title={hardestPicked?.feedback ?? 'A gente vai resolver exatamente isso.'}
                body="Quase todos os membros que entraram aqui tinham o mesmo obstáculo. A diferença foi mudar o canal de busca."
                highlight={
                  <div className="mt-5 space-y-3 text-left">
                    {/* {REVIEWS.slice(0, 2).map(r => (
                      <div key={r.name} className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background/60 p-4">
                        <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-xs font-bold text-white">{r.initials}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-xs font-semibold text-foreground">{r.name}</p>
                            <span className="text-amber-400 text-[10px]">★★★★★</span>
                            <Badge className="ml-auto bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-bold">{r.salary}</Badge>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground italic">"{r.text.slice(0, 90)}..."</p>
                        </div>
                      </div>
                    ))} */}
                  </div>
                }
                primaryLabel="Continuar"
                onPrimary={() => goNext('english_reality')}
              />
            )}

            {/* ══ REALIDADE DO INGLÊS ══════════════════════════════════════ */}
            {step === 'english_reality' && (
              <StepInfo
                kicker="Uma coisa que muita gente erra 🗣"
                icon={<Globe className="h-5 w-5" />}
                title="Você não precisa ter inglês perfeito para começar"
                body="A maioria dos brasileiros que trabalha remotamente hoje começou com inglês funcional — não fluente."
                highlight={
                  <div className="mt-5 space-y-2 text-left">
                    {[
                      { level: 'Inglês básico (A2)', vagas: 'Suporte, análise, design', cor: 'border-amber-500/20 bg-amber-500/5 text-amber-700' },
                      { level: 'Inglês intermediário (B1/B2)', vagas: 'Maioria das vagas de tech, produto, marketing', cor: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-700' },
                      { level: 'Inglês avançado/fluente', vagas: 'Todas as vagas — salários mais altos', cor: 'border-teal-500/20 bg-teal-500/5 text-teal-700' },
                    ].map(row => (
                      <div key={row.level} className={['rounded-xl border p-3', row.cor].join(' ')}>
                        <p className="text-sm font-bold">{row.level}</p>
                        <p className="text-xs opacity-80 mt-0.5">{row.vagas}</p>
                      </div>
                    ))}
                  </div>
                }
                primaryLabel="Continuar"
                onPrimary={() => goNext('salary_goal')}
              />
            )}

            {/* ══ META SALARIAL ════════════════════════════════════════════ */}
            {step === 'salary_goal' && (
              <StepQuestion
                title="Qual faixa salarial você está buscando?"
                subtitle="Isso filtra as vagas certas pro seu momento"
                choices={salaryChoices}
                selected={answers.salary_goal}
                onSelect={c => ans('salary_goal', c.id, 'salary_reality')}
                canContinue={!!answers.salary_goal}
                primaryLabel="Continuar"
                onPrimary={() => goNext('salary_reality')}
              />
            )}

            {/* ══ EXEMPLOS SALARIAIS ═══════════════════════════════════════ */}
            {step === 'salary_reality' && (
              <div>
                <p className="text-center text-sm font-semibold text-emerald-600 dark:text-emerald-400">Vagas reais que passam aqui 💼</p>
                <h2 className="mt-3 text-center text-2xl font-bold tracking-tight text-foreground">{salaryEx.title}</h2>
                <div className="mt-6 space-y-3">
                  {salaryEx.items.map(item => (
                    <div key={item.role} className="flex items-center gap-4 rounded-2xl border border-border/60 bg-background/60 p-4">
                      <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300">
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground">{item.role}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.co}</p>
                      </div>
                      <Badge variant="outline" className="flex-shrink-0 border-emerald-500/20 bg-emerald-500/5 text-xs font-bold text-emerald-700 dark:text-emerald-400">{item.range}</Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <Button size="lg" className="h-12 w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500" onClick={() => goNext('where_from')}>
                    Continuar <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* ══ DE ONDE VAI TRABALHAR ════════════════════════════════════ */}
            {step === 'where_from' && (
              <StepCountry
                title="De onde você vai trabalhar?"
                subtitle="Filtramos vagas que aceitam profissionais do seu país"
                countryQuery={countryQuery}
                setCountryQuery={setCountryQuery}
                countries={filteredCountries}
                country={country}
                setCountry={v => { setCountry(v); setAnswers(a => ({ ...a, country: v })) }}
                primaryLabel="Continuar"
                onPrimary={() => goNext('job_kind')}
                canContinue={!!country}
              />
            )}

            {/* ══ ÁREA DE ATUAÇÃO ══════════════════════════════════════════ */}
            {step === 'job_kind' && (
              <StepCategory
                title="Qual é a sua área de atuação?"
                subtitle="Última pergunta técnica 🎯"
                categoryQuery={categoryQuery}
                setCategoryQuery={setCategoryQuery}
                categories={filteredCategories}
                selected={category}
                onPick={v => { setCategory(v); setAnswers(a => ({ ...a, category: v })) }}
                primaryLabel="Montar meu perfil"
                onPrimary={() => goNext('profile_build')}
                canContinue={!!category}
              />
            )}

            {/* ══ LOADING — CONSTRUINDO PERFIL ══════════════════════════════ */}
            {step === 'profile_build' && (
              <ProfileBuildStep
                category={category}
                country={country || 'Brasil'}
                onDone={() => goNext('results_preview')}
              />
            )}

            {/* ══ PREVIEW DE RESULTADOS ════════════════════════════════════ */}
            {step === 'results_preview' && (
              <div>
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <Sparkles className="h-3.5 w-3.5" /> Perfil pronto
                  </div>
                  <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
                    Encontramos{' '}
                    <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent text-3xl">2.124+</span>
                    {' '}vagas
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    de <strong className="text-foreground">{category}</strong> para <strong className="text-foreground">{country || 'seu país'}</strong>
                  </p>
                </div>

                {/* 1 vaga visível */}
                <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-background/60 p-4 ring-2 ring-emerald-500/10">
                  <div className="flex items-center gap-4">
                    <div className="grid h-14 w-14 flex-shrink-0 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <p className="font-semibold text-foreground">{FAKE_JOBS[0].title}</p>
                          <p className="text-xs text-muted-foreground">{FAKE_JOBS[0].company}</p>
                        </div>
                        <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/5 text-xs font-bold text-emerald-700 dark:text-emerald-400 flex-shrink-0">{FAKE_JOBS[0].salary}</Badge>
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{FAKE_JOBS[0].region}</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{FAKE_JOBS[0].applicants} candidatos</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{FAKE_JOBS[0].posted}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vagas bloqueadas */}
                <div className="mt-3 relative">
                  <div className="space-y-2">
                    {FAKE_JOBS.slice(1).map(j => (
                      <div key={j.title} className="flex items-center gap-4 rounded-2xl border border-border/50 bg-background/40 p-4 blur-[4px] opacity-40 pointer-events-none select-none">
                        <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-2xl bg-muted"><Briefcase className="h-5 w-5 text-muted-foreground" /></div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">{j.title}</p>
                          <p className="text-xs text-muted-foreground">{j.company} · {j.salary}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-card/98 via-card/70 to-transparent rounded-2xl">
                    <div className="rounded-2xl border border-border/60 bg-card/90 px-6 py-4 text-center shadow-xl">
                      <Lock className="h-5 w-5 text-muted-foreground mx-auto mb-1.5" />
                      <p className="text-sm font-bold text-foreground">+2.121 vagas bloqueadas</p>
                      <p className="text-xs text-muted-foreground">Crie sua conta para ver todas</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Button size="lg" className="h-12 w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500" onClick={() => goNext('email')}>
                    Continuar <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* ══ EMAIL ════════════════════════════════════════════════════ */}
            {step === 'email' && (
              <StepEmail
                title="Qual seu e-mail?"
                email={email}
                setEmail={v => { setEmail(v); setAnswers(a => ({ ...a, email: v })) }}
                primaryLabel="Continuar"
                onPrimary={() => goNext('pricing')}
                canContinue={canContinueEmail}
              />
            )}

            {/* ══ PRICING ══════════════════════════════════════════════════ */}
            {step === 'pricing' && (
              <StepPricing
                plan={plan}
                setPlan={setPlan}
                onPrimary={() => {
                  const links = { monthly: 'https://pay.kiwify.com.br/xkegg6v', annual: 'https://pay.kiwify.com.br/b2OvKMY' } as const
                  window.location.href = links[plan]
                }}
                reviews={REVIEWS}
              />
            )}

          </div>
        </div>

        <div className="mx-auto mt-6 max-w-2xl text-center text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Globe className="h-4 w-4" /> GoDev • onboarding /join • pt-BR
          </span>
        </div>
      </div>
    </div>
  )
}

/* ─── Reusable blocks ────────────────────────────────────────────────────────── */

function StepWelcome({ onPrimary }: { onPrimary: () => void }) {
  return (
    <div className="text-center">
      <div className="mt-5 flex justify-center">
        <div className="grid h-14 w-14 place-items-center rounded-3xl bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300">
          <Globe className="h-6 w-6" />
        </div>
      </div>
      <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
        Vagas internacionais{' '}
        <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">selecionadas</span>
        <br />
        que aceitam brasileiros e pagam{' '}
        <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">a partir de R$ 15.000/mês</span>
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
        Responda algumas perguntas rápidas e a gente filtra as oportunidades pro seu perfil — sem spam e sem vaga fake.
      </p>
      <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-left">
        <p className="text-sm font-semibold text-foreground">O que você destrava agora:</p>
        <div className="mt-3 space-y-2 text-sm text-foreground">
          {['Vagas remotas reais (curadas)', 'Aplicação direto na empresa (sem intermediário)', 'Alertas pra você aplicar nas primeiras 24h'].map(b => (
            <div key={b} className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" />{b}</div>
          ))}
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">*Valores variam por país, senioridade e empresa.</p>
      </div>
      <div className="mt-8">
        <Button size="lg" className="h-12 w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500" onClick={onPrimary}>
          Começar (leva menos de 2 min) <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function StepQuestion({ title, subtitle, choices, selected, onSelect, primaryLabel, onPrimary, canContinue, secondaryLabel, onSecondary }: {
  title: string; subtitle?: string; choices: Choice[]; selected?: string; onSelect: (c: Choice) => void
  primaryLabel: string; onPrimary: () => void; canContinue: boolean; secondaryLabel?: string; onSecondary?: () => void
}) {
  return (
    <div>
      <h2 className="text-center text-2xl font-bold tracking-tight text-foreground">{title}</h2>
      {subtitle && <p className="mt-2 text-center text-sm text-muted-foreground">{subtitle}</p>}
      <div className="mt-7 space-y-3">
        {choices.map(c => {
          const active = selected === c.id
          return (
            <button key={c.id} onClick={() => onSelect(c)}
              className={['w-full rounded-2xl border px-4 py-4 text-left transition bg-background/60 hover:bg-background', active ? 'border-emerald-500/40 ring-2 ring-emerald-500/15' : 'border-border/60'].join(' ')}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-foreground">{c.label}</p>
                  {c.sub && <p className="text-xs text-muted-foreground mt-0.5">{c.sub}</p>}
                </div>
                {c.emoji && <span className="text-lg flex-shrink-0">{c.emoji}</span>}
              </div>
            </button>
          )
        })}
      </div>
      <div className="mt-7 flex flex-col gap-3">
        <Button size="lg" className="h-12 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500" disabled={!canContinue} onClick={onPrimary}>
          {primaryLabel} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        {secondaryLabel && onSecondary && (
          <Button variant="outline" size="lg" className="h-12 rounded-2xl" onClick={onSecondary}>{secondaryLabel}</Button>
        )}
      </div>
    </div>
  )
}

function StepMulti({ title, subtitle, choices, selected, onToggle, primaryLabel, onPrimary, canContinue }: {
  title: string; subtitle?: string; choices: Choice[]; selected: string[]; onToggle: (id: string) => void
  primaryLabel: string; onPrimary: () => void; canContinue: boolean
}) {
  return (
    <div>
      <h2 className="text-center text-2xl font-bold tracking-tight text-foreground">{title}</h2>
      {subtitle && <p className="mt-2 text-center text-sm text-muted-foreground">{subtitle}</p>}
      <div className="mt-7 space-y-3">
        {choices.map(c => {
          const active = selected.includes(c.id)
          return (
            <button key={c.id} onClick={() => onToggle(c.id)}
              className={['w-full rounded-2xl border px-4 py-3.5 text-left transition bg-background/60 hover:bg-background', active ? 'border-emerald-500/40 ring-2 ring-emerald-500/15' : 'border-border/60'].join(' ')}>
              <div className="flex items-center gap-3">
                <div className={['h-4 w-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition', active ? 'border-emerald-500 bg-emerald-500' : 'border-muted-foreground/30'].join(' ')}>
                  {active && <Check className="h-2.5 w-2.5 text-white" />}
                </div>
                <span className="text-base font-semibold text-foreground">{c.label}</span>
                {c.emoji && <span className="ml-auto text-lg">{c.emoji}</span>}
              </div>
            </button>
          )
        })}
      </div>
      <div className="mt-7">
        <Button size="lg" className="h-12 w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500" disabled={!canContinue} onClick={onPrimary}>
          {primaryLabel} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function StepInfo({ kicker, icon, title, body, highlight, primaryLabel, onPrimary }: {
  kicker?: string; icon?: React.ReactNode; title: string; body?: string
  highlight?: React.ReactNode; primaryLabel: string; onPrimary: () => void
}) {
  return (
    <div className="text-center">
      {kicker && <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{kicker}</p>}
      {icon && (
        <div className="mt-4 flex justify-center">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300">{icon}</div>
        </div>
      )}
      <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground">{title}</h2>
      {body && <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">{body}</p>}
      {highlight}
      <div className="mt-8">
        <Button size="lg" className="h-12 w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500" onClick={onPrimary}>
          {primaryLabel} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function StepCountry({ title, subtitle, countryQuery, setCountryQuery, countries, country, setCountry, primaryLabel, onPrimary, canContinue }: {
  title: string; subtitle?: string; countryQuery: string; setCountryQuery: (v: string) => void
  countries: string[]; country: string; setCountry: (v: string) => void
  primaryLabel: string; onPrimary: () => void; canContinue: boolean
}) {
  return (
    <div>
      <h2 className="text-center text-2xl font-bold tracking-tight text-foreground">{title}</h2>
      {subtitle && <p className="mt-2 text-center text-sm text-muted-foreground">{subtitle}</p>}
      <div className="mt-6">
        <Input value={countryQuery} onChange={e => setCountryQuery(e.target.value)} placeholder="Buscar país..." className="h-12 rounded-2xl" />
      </div>
      <div className="mt-4 max-h-56 overflow-auto rounded-2xl border border-border/60 bg-background/50 p-2">
        {countries.map(c => (
          <button key={c} onClick={() => setCountry(c)}
            className={['w-full rounded-xl px-3 py-2 text-left text-sm transition', country === c ? 'bg-emerald-500/10 text-foreground font-medium' : 'hover:bg-muted/40'].join(' ')}>
            {c}
          </button>
        ))}
      </div>
      <div className="mt-7">
        <Button size="lg" className="h-12 w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500" disabled={!canContinue} onClick={onPrimary}>
          {primaryLabel} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function StepCategory({ title, subtitle, categoryQuery, setCategoryQuery, categories, selected, onPick, primaryLabel, onPrimary, canContinue }: {
  title: string; subtitle?: string; categoryQuery: string; setCategoryQuery: (v: string) => void
  categories: string[]; selected: string; onPick: (v: string) => void
  primaryLabel: string; onPrimary: () => void; canContinue: boolean
}) {
  return (
    <div>
      <h2 className="text-center text-2xl font-bold tracking-tight text-foreground">{title}</h2>
      {subtitle && <p className="mt-2 text-center text-sm text-muted-foreground">{subtitle}</p>}
      <div className="mt-6">
        <Input value={categoryQuery} onChange={e => setCategoryQuery(e.target.value)} placeholder="Buscar área..." className="h-12 rounded-2xl" />
      </div>
      <div className="mt-4 max-h-64 overflow-auto rounded-2xl border border-border/60 bg-background/50 p-2">
        {categories.map(c => (
          <button key={c} onClick={() => onPick(c)}
            className={['w-full rounded-xl px-3 py-2 text-left text-sm transition', selected === c ? 'bg-emerald-500/10 text-foreground font-medium' : 'hover:bg-muted/40'].join(' ')}>
            {c}
          </button>
        ))}
      </div>
      <div className="mt-7">
        <Button size="lg" className="h-12 w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500" disabled={!canContinue} onClick={onPrimary}>
          {primaryLabel} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function StepEmail({ title, email, setEmail, primaryLabel, onPrimary, canContinue }: {
  title: string; email: string; setEmail: (v: string) => void
  primaryLabel: string; onPrimary: () => void; canContinue: boolean
}) {
  return (
    <div>
      <h2 className="text-center text-2xl font-bold tracking-tight text-foreground">{title}</h2>
      <div className="mt-6">
        <Input value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && canContinue) onPrimary() }} placeholder="voce@email.com" type="email" className="h-12 rounded-2xl" autoFocus />
      </div>
      <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-left">
        <p className="text-base font-semibold text-foreground">Pronto pra realmente conseguir uma dessas vagas?</p>
        <p className="mt-1 text-sm text-muted-foreground">Desbloqueie essas e mais 2.124+ vagas:</p>
        <div className="mt-4 space-y-2 text-sm text-foreground">
          {['Aplique antes de todo mundo', 'Novas vagas adicionadas diariamente', 'Sem golpes ou vagas fake', 'Alertas por e-mail personalizados'].map(b => (
            <div key={b} className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" />{b}</div>
          ))}
        </div>
      </div>
      <div className="mt-8">
        <Button size="lg" className="h-12 w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500" disabled={!canContinue} onClick={onPrimary}>
          {primaryLabel} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function StepPricing({ plan, setPlan, onPrimary, reviews }: {
  plan: 'annual' | 'monthly'; setPlan: (p: 'annual' | 'monthly') => void
  onPrimary: () => void; reviews: typeof REVIEWS
}) {
  const { m, s } = useCountdown(19 * 60 + 47)
  return (
    <div>
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1 text-sm text-foreground">
          <span className="font-semibold">4.9</span>
          <span className="text-amber-500">★★★★★</span>
          <span className="text-muted-foreground">de 500+ reviews</span>
        </div>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
          Desbloqueie vagas internacionais<br />
          <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">que pagam a partir de R$ 15.000/mês</span>
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Para todos os níveis com contratos <strong>CLT ou PJ</strong>. Aplique direto na empresa em vagas com poucos candidatos que aceitam brasileiros.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
          <Clock className="h-3.5 w-3.5" /> Oferta expira em {m}:{s}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <PlanRow active={plan === 'annual'} onClick={() => setPlan('annual')} title="Plano Anual" subtitle="R$ 238,80 cobrado uma vez por ano" priceMonthly="R$ 19,90 / mês" badge="ECONOMIZE 33%" />
        <PlanRow active={plan === 'monthly'} onClick={() => setPlan('monthly')} title="Plano Mensal" subtitle="R$ 29,90" priceMonthly="R$ 29,90 / mês" />
      </div>

      <div className="mt-5 rounded-2xl border border-border/60 bg-background/60 p-4">
        <div className="flex items-center gap-2 text-sm text-foreground">
          <Shield className="h-4 w-4 text-emerald-600" />
          <span className="font-medium">Sem fidelidade</span> — cancele quando quiser
        </div>
      </div>

      <div className="mt-6">
        <Button size="lg" className="h-12 w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500" onClick={onPrimary}>
          <Lock className="mr-2 h-4 w-4" /> Continuar <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <Separator className="my-7" />

      <div className="grid gap-3 md:grid-cols-2">
        {reviews.map(r => (
          <div key={r.name} className="rounded-2xl border border-border/60 bg-background/60 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.role}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-xs font-bold">{r.salary}</Badge>
                <span className="text-amber-500 text-sm">★★★★★</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-foreground">{r.text}</p>
            <p className="mt-2 text-xs text-muted-foreground">{r.date}</p>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="mt-7 space-y-2">
        {[
          { q: 'Preciso ter inglês fluente?', a: 'Não. Temos vagas que aceitam inglês intermediário, e algumas em português.' },
          { q: 'Como cancelo?', a: 'Direto no painel, sem burocracia. Você cancela em menos de 1 minuto.' },
          { q: 'As vagas são verificadas?', a: 'Sim. Toda vaga passa por triagem antes de aparecer. Sem fake, sem duplicado.' },
          { q: 'Preciso de CNPJ?', a: 'Não. Temos vagas para CLT, PJ e freelance.' },
        ].map(item => (
          <details key={item.q} className="rounded-2xl border border-border/60 bg-background/60 group">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3.5 text-sm font-medium text-foreground">
              {item.q} <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
            </summary>
            <p className="px-4 pb-4 text-sm text-muted-foreground">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  )
}

function PlanRow({ active, onClick, title, subtitle, priceMonthly, badge }: {
  active: boolean; onClick: () => void; title: string; subtitle: string; priceMonthly: string; badge?: string
}) {
  return (
    <button onClick={onClick}
      className={['w-full rounded-2xl border p-4 text-left transition', active ? 'border-emerald-500/40 bg-emerald-500/5 ring-2 ring-emerald-500/10' : 'border-border/60 bg-background/60 hover:bg-background'].join(' ')}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className={['h-3 w-3 rounded-full border', active ? 'border-emerald-500 bg-emerald-500' : 'border-muted-foreground/40'].join(' ')} />
            <p className="text-sm font-semibold text-foreground">{title}</p>
            {badge && <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[11px] font-semibold text-white">{badge}</span>}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-foreground">{priceMonthly}</p>
        </div>
      </div>
    </button>
  )
}
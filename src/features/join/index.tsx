// src/features/join/Join.tsx
import { useMemo, useState } from 'react'
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
} from 'lucide-react'

type Choice = { id: string; label: string; emoji?: string; feedback?: string }
type StepId =
  | 'welcome'
  | 'why_remote'
  | 'we_got_you'
  | 'how_long'
  | 'pro_tip'
  | 'hardest_part'
  | 'hardest_feedback'
  | 'did_you_know'
  | 'we_help'
  | 'where_from'
  | 'apply_direct'
  | 'job_kind'
  | 'results'
  | 'email'
  | 'pricing'

type AnswerMap = Record<string, any>

const COUNTRIES = [
  'Brasil',
  'Estados Unidos',
  'Canadá',
  'Reino Unido',
  'Alemanha',
  'França',
  'Portugal',
  'Espanha',
  'Holanda',
  'Irlanda',
  'Suíça',
  'Suécia',
  'Noruega',
  'Dinamarca',
  'Finlândia',
  'Austrália',
  'Nova Zelândia',
  'Japão',
  'Coreia do Sul',
  'Singapura',
  'Índia',
  'México',
  'Argentina',
  'Chile',
  'Colômbia',
]

const JOB_CATEGORIES = [
  'Software Development',
  'Customer Service',
  'Design',
  'Marketing',
  'Sales / Business',
  'Product',
  'Project Management',
  'AI / ML',
  'Data Analysis',
  'Devops / Sysadmin',
  'Finance',
  'Human Resources',
  'QA',
  'Writing',
  'Legal',
  'Medical',
  'Education',
  'All Others',
]

const fakeJobs = [
  {
    title: 'Senior Full-Stack Engineer • Deloitte Digital',
    region: 'Américas, Europa',
    category: 'Software Development',
  },
  {
    title: 'Staff Backend Engineer • Accenture',
    region: 'Worldwide',
    category: 'Software Development',
  },
  {
    title: 'Senior React Engineer • BCG X',
    region: 'Américas',
    category: 'Software Development',
  },
]

const reviews = [
  {
    name: 'Luana Ferreira',
    role: 'Frontend • React / TypeScript',
    text:
      'Eu tava cansada de passar horas no linkedin procurando vaga e nunca ser respondida... aqui quase todas as vagas que apliquei eu tive pelo menos um retorno, gostei bastante',
    date: '20 Jan, 2026',
  },
  {
    name: 'Rafael Menezes',
    role: 'Backend • NestJS / PostgreSQL',
    text:
      'Pra mim virou o melhor lugar pra procurar vaga porque eu não fico pulando de site em site. Já consegui 2 projetos pj q me pagaram +20k/mes',
    date: '16 Jan, 2026',
  },
  {
    name: 'Paulo Rocha',
    role: 'Frontend • Angular',
    text:
      'Eu tava achando que trabalho na gringa era só pra quem já mora fora. Mas os caras realmente tem somente vagas que aceita brasileiros, achei mt foda',
    date: '13 Jan, 2026',
  },
  {
    name: 'Gustavo Lima',
    role: 'Fullstack • React / Nest',
    text:
      'Com 3 anos de experiencia consegui um trabalho numa consultoria de RPA, ganhando 17k... hoje com tenho 5 anos de experiencia, meu salário já aumentou',
    date: '10 Jan, 2026',
  },
  {
    name: 'Mariana Costa',
    role: 'Frontend • React',
    text:
      'Eu gosto porque não tem aquele caos de anúncio repetido. Parece que alguém já fez a triagem por você e deixou só o que presta.',
    date: '7 Jan, 2026',
  },
]

export function Join() {
  const [step, setStep] = useState<StepId>('why_remote')
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null)

  // inputs
  const [countryQuery, setCountryQuery] = useState('')
  const [country, setCountry] = useState<string>('')
  const [categoryQuery, setCategoryQuery] = useState('')
  const [category, setCategory] = useState<string>('Software Development')
  const [email, setEmail] = useState('')

  // pricing
  const [plan, setPlan] = useState<'annual' | 'quarterly' | 'monthly'>('annual')

  const filteredCountries = useMemo(() => {
    const q = countryQuery.trim().toLowerCase()
    if (!q) return COUNTRIES
    return COUNTRIES.filter((c) => c.toLowerCase().includes(q))
  }, [countryQuery])

  const filteredCategories = useMemo(() => {
    const q = categoryQuery.trim().toLowerCase()
    if (!q) return JOB_CATEGORIES
    return JOB_CATEGORIES.filter((c) => c.toLowerCase().includes(q))
  }, [categoryQuery])

  const stepsOrder: StepId[] = [
    'welcome',
    'why_remote',
    'we_got_you',
    'how_long',
    'pro_tip',
    'hardest_part',
    'did_you_know',
    'we_help',
    'where_from',
    'apply_direct',
    'job_kind',
    'results',
    'email',
    'pricing',
  ]

  const currentIndex = stepsOrder.indexOf(step)
  const progressPct = Math.max(6, Math.round(((currentIndex + 1) / stepsOrder.length) * 100))

  // “progress segments” (fica mais moderno, estilo onboarding)
  const segments = 18
  const filled = Math.round((progressPct / 100) * segments)

  function goBack() {
    if (step === 'hardest_feedback') {
      setStep('hardest_part')
      return
    }
    const idx = stepsOrder.indexOf(step)
    if (idx <= 0) return
    setStep(stepsOrder[idx - 1])
  }

  function goNext(nextStep?: StepId) {
    if (nextStep) {
      setStep(nextStep)
      return
    }
    const idx = stepsOrder.indexOf(step)
    if (idx < stepsOrder.length - 1) setStep(stepsOrder[idx + 1])
  }

  // ----------------------------
  // Step definitions
  // ----------------------------
  const whyRemoteChoices: Choice[] = [
    { id: 'family', label: 'Mais tempo com a família', emoji: '🧡' },
    { id: 'me', label: 'Mais tempo pra mim', emoji: '🤓' },
    { id: 'commute', label: 'Menos deslocamento!', emoji: '🚗' },
    { id: 'now', label: 'Preciso de um emprego AGORA!', emoji: '😅' },
  ]

  const howLongChoices: Choice[] = [
    { id: 'started', label: 'Acabei de começar', emoji: '⚙️' },
    { id: 'weeks', label: 'Algumas semanas', emoji: '🚧' },
    { id: 'months', label: 'Alguns meses', emoji: '📆' },
    { id: 'long', label: 'Tempo demais!', emoji: '🙂‍↕️' },
  ]

  const hardestChoices: Choice[] = [
    {
      id: 'not_enough',
      label: 'Não tem vaga suficiente',
      emoji: '🔬',
      feedback: 'Entendo demais… quando parece que “acabou vaga”, bate aquele desânimo. 😮‍💨',
    },
    {
      id: 'no_reply',
      label: 'Recrutadores não respondem',
      emoji: '🙊',
      feedback: 'Ghosting é real… e é frustrante. A gente vai reduzir isso com aplicações mais certeiras. 👻',
    },
    {
      id: 'no_interviews',
      label: 'Não consigo entrevistas',
      emoji: '🦗',
      feedback: 'Vamos melhorar seu “timing” e relevância por filtro — isso costuma destravar entrevistas. ✅',
    },
    {
      id: 'competition',
      label: 'Muita concorrência',
      emoji: '🏙️',
      feedback: 'Quando a vaga lota, quem aplica cedo e certo sai na frente. Vamos te dar essa vantagem. 🏆',
    },
  ]

  const canContinueEmail = /^\S+@\S+\.\S+$/.test(email)

  return (
    <div className="min-h-screen bg-background">
      {/* BG suave (GoDev vibe) */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-0 top-0 h-80 w-full bg-[radial-gradient(circle_at_18%_18%,rgba(52,211,153,0.18),transparent_55%)]" />
        <div className="absolute right-0 top-0 h-80 w-full bg-[radial-gradient(circle_at_80%_10%,rgba(45,212,191,0.16),transparent_55%)]" />
        <div className="absolute bottom-0 left-1/2 h-96 w-[60rem] -translate-x-1/2 bg-[radial-gradient(circle_at_50%_80%,rgba(16,185,129,0.10),transparent_60%)]" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-10">
        {/* Header (logo + back) */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={goBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span> Voltar</span>
          </button>

          <div className="flex items-center gap-2">
            <GoDevLogo collapsed={false} />
          </div>

          {/* spacer */}
          <div className="w-[86px]" />
        </div>

        {/* Card */}
        <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-border/60 bg-card/60 shadow-xl backdrop-blur-sm">
          {/* Progress (melhorada) */}
          <div className="border-b border-border/50 bg-background/40 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-muted-foreground">
                Etapa <span className="text-foreground">{currentIndex + 1}</span> de{' '}
                <span className="text-foreground">{stepsOrder.length}</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{progressPct}%</span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-18 gap-1">
              {Array.from({ length: segments }).map((_, i) => {
                const on = i < filled
                return (
                  <div
                    key={i}
                    className={[
                      'h-1.5 rounded-full transition-all',
                      on
                        ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
                        : 'bg-muted/40',
                    ].join(' ')}
                  />
                )
              })}
            </div>
          </div>

          <div className="p-8">
            {/* Steps */}
            {step === 'welcome' && (
              <StepWelcome
                primaryLabel="Começar (leva menos de 2 min)"
                onPrimary={() => goNext('why_remote')}
              />
            )}
            {step === 'why_remote' && (
              <StepQuestion
                title="Por que você quer trabalhar remoto?"
                choices={whyRemoteChoices}
                selected={selectedChoice?.id}
                onSelect={(c) => {
                  setSelectedChoice(c)
                  setAnswers((a) => ({ ...a, why_remote: c.id }))
                }}
                primaryLabel="Continuar"
                onPrimary={() => goNext('we_got_you')}
                canContinue={!!answers.why_remote}
              />
            )}

            {step === 'we_got_you' && (
              <StepInfo
                icon={<Sparkles className="h-5 w-5" />}
                kicker="Boa."
                title="A gente vai te colocar na frente da fila."
                body="Sem spam. Sem vaga fake. Só oportunidades que fazem sentido pro seu perfil."
                primaryLabel="Continuar"
                onPrimary={() => goNext('how_long')}
              />
            )}

            {step === 'how_long' && (
              <StepQuestion
                title="Há quanto tempo você está buscando emprego?"
                choices={howLongChoices}
                selected={selectedChoice?.id}
                onSelect={(c) => {
                  setSelectedChoice(c)
                  setAnswers((a) => ({ ...a, how_long: c.id }))
                }}
                primaryLabel="Continuar"
                onPrimary={() => goNext('pro_tip')}
                canContinue={!!answers.how_long}
              />
            )}

            {step === 'pro_tip' && (
              <StepInfo
                icon={<Zap className="h-5 w-5" />}
                kicker="Pro tip"
                title="Aplicar nas primeiras 24h aumenta MUITO suas chances."
                body="Você entra cedo no funil — e evita disputar com 500 pessoas."
                primaryLabel="Continuar"
                onPrimary={() => goNext('hardest_part')}
              />
            )}

            {step === 'hardest_part' && (
              <StepQuestion
                title="Qual tem sido a parte mais difícil da sua busca?"
                subtitle="(Pode pular, se quiser)"
                choices={hardestChoices}
                selected={selectedChoice?.id}
                onSelect={(c) => {
                  setSelectedChoice(c)
                  setAnswers((a) => ({ ...a, hardest_part: c.id }))
                }}
                primaryLabel="Continuar"
                onPrimary={() => {
                  const picked = hardestChoices.find((x) => x.id === answers.hardest_part)
                  if (picked?.feedback) {
                    setSelectedChoice(picked)
                    setStep('hardest_feedback')
                    return
                  }
                  goNext('did_you_know')
                }}
                secondaryLabel="Pular"
                onSecondary={() => goNext('did_you_know')}
                canContinue={!!answers.hardest_part}
              />
            )}

            {step === 'hardest_feedback' && (
              <StepInfo
                icon={<Info className="h-5 w-5" />}
                kicker="Entendido."
                title={selectedChoice?.feedback ?? 'Boa — vamos ajustar isso agora.'}
                body="A próxima parte vai te mostrar como ganhar vantagem real."
                primaryLabel="Continuar"
                onPrimary={() => goNext('did_you_know')}
              />
            )}

            {step === 'did_you_know' && (
              <StepInfo
                icon={<Globe className="h-5 w-5" />}
                kicker="Você sabia?"
                title="Até 70% das vagas remotas não aparecem no LinkedIn 😬"
                body="E as que aparecem ficam LOTADAS de candidatos. A ideia aqui é fugir desse bolo."
                primaryLabel="Continuar"
                onPrimary={() => goNext('we_help')}
              />
            )}

            {step === 'we_help' && (
              <StepInfo
                icon={<Sparkles className="h-5 w-5" />}
                kicker="GoDev"
                title="Nossos robôs filtram e destacam oportunidades remotas de verdade 🤖"
                body="Menos ruído, mais vaga boa — e alertas pra você aplicar cedo."
                highlight={
                  <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-left">
                    <p className="text-sm font-semibold text-foreground">
                      Empresas onde candidatos costumam conseguir entrevistas:
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {['Stripe', 'Square', 'Shopify', 'Zapier'].map((x) => (
                        <Badge key={x} variant="outline" className="border-emerald-500/20 bg-white/50">
                          {x}
                        </Badge>
                      ))}
                    </div>
                  </div>
                }
                primaryLabel="Continuar"
                onPrimary={() => goNext('where_from')}
              />
            )}

            {step === 'where_from' && (
              <StepCountry
                title="De onde você vai trabalhar?"
                subtitle="Selecione seu país"
                countryQuery={countryQuery}
                setCountryQuery={setCountryQuery}
                countries={filteredCountries}
                country={country}
                setCountry={(v) => {
                  setCountry(v)
                  setAnswers((a) => ({ ...a, country: v }))
                }}
                primaryLabel="Continuar"
                onPrimary={() => goNext('apply_direct')}
                canContinue={!!answers.country}
              />
            )}

            {step === 'apply_direct' && (
              <StepInfo
                icon={<ArrowRight className="h-5 w-5" />}
                kicker="Do jeito certo"
                title="Aqui você aplica direto na empresa 🏹"
                body="…antes de todo mundo 🏆 — e sem perder tempo com vaga fake."
                primaryLabel="Continuar"
                onPrimary={() => goNext('job_kind')}
              />
            )}

            {step === 'job_kind' && (
              <StepCategory
                title="Última pergunta: qual tipo de vaga remota você quer?"
                categoryQuery={categoryQuery}
                setCategoryQuery={setCategoryQuery}
                categories={filteredCategories}
                selected={category}
                onPick={(v) => {
                  setCategory(v)
                  setAnswers((a) => ({ ...a, category: v }))
                }}
                primaryLabel="Buscar minha vaga remota"
                onPrimary={() => goNext('results')}
                canContinue={!!answers.category}
              />
            )}

            {step === 'results' && (
              <StepResults
                title={`Para vagas remotas de ${category} que podem ser aplicadas a partir de ${
                  country || 'seu país'
                }, encontramos:`}
                subtitle="2.124+ vagas pra você (exemplo)"
                jobs={fakeJobs}
                review={{
                  stars: 5,
                  text: '4 Anos de experiência em react, consegui minha terceira vaga já pagando 17k mes.”',
                  name: 'Victor Rocha',
                  meta: 'Florianópolis, Brasil',
                }}
                primaryLabel="Continuar"
                onPrimary={() => goNext('email')}
              />
            )}

            {step === 'email' && (
              <StepEmail
                title="Qual seu e-mail?"
                email={email}
                setEmail={(v) => {
                  setEmail(v)
                  setAnswers((a) => ({ ...a, email: v }))
                }}
                totalJobsLabel="134.421+"
                primaryLabel="Continuar"
                onPrimary={() => goNext('pricing')}
                canContinue={canContinueEmail}
              />
            )}

            {step === 'pricing' && (
              <StepPricing
                plan={plan}
                setPlan={setPlan}
                onPrimary={() => {
                  const links = {
                    monthly: 'https://pay.kiwify.com.br/xkegg6v',
                    annual: 'https://pay.kiwify.com.br/b2OvKMY',
                    quarterly: 'https://pay.kiwify.com.br/xkegg6v', // fallback se não usar
                  } as const

                  const url = links[plan] ?? links.monthly

                  // mesma aba:
                  window.location.href = url

                  // se quiser abrir em nova aba, troca por:
                  // window.open(url, '_blank', 'noopener,noreferrer')
                }}
                reviews={reviews}
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

/* ---------------------------------- */
/* Reusable blocks                     */
/* ---------------------------------- */

function StepWelcome(props: { primaryLabel: string; onPrimary: () => void }) {
  return (
    <div className="text-center">

      {/* icon */}
      <div className="mt-5 flex justify-center">
        <div className="grid h-14 w-14 place-items-center rounded-3xl bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300">
          <Globe className="h-6 w-6" />
        </div>
      </div>

      {/* headline */}
      <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
        Vagas internacionais{" "}
        <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
          selecionadas
        </span>
        <br />
        que aceitam brasileiros e pagam{" "}
        <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
          a partir de R$ 15.000/mês
        </span>
      </h2>

      <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
        Responda algumas perguntas rápidas e a gente filtra as oportunidades pro seu perfil — sem spam e sem vaga fake.
      </p>

      {/* benefits */}
      <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-left">
        <p className="text-sm font-semibold text-foreground">O que você destrava agora:</p>

        <div className="mt-3 space-y-2 text-sm text-foreground">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600" />
            Vagas remotas reais (curadas)
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600" />
            Aplicação direto na empresa (sem intermediário)
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600" />
            Alertas pra você aplicar nas primeiras 24h
          </div>
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          *Valores variam por país, senioridade e empresa.
        </p>
      </div>

      {/* CTA */}
      <div className="mt-8">
        <Button
          size="lg"
          className="h-12 w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500"
          onClick={props.onPrimary}
        >
          {props.primaryLabel} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

      </div>
    </div>
  )
}

function StepQuestion(props: {
  title: string
  subtitle?: string
  choices: Choice[]
  selected?: string
  onSelect: (c: Choice) => void
  primaryLabel: string
  onPrimary: () => void
  canContinue: boolean
  secondaryLabel?: string
  onSecondary?: () => void
}) {
  return (
    <div>
      <h2 className="text-center text-2xl font-bold tracking-tight text-foreground">
        {props.title}
      </h2>
      {props.subtitle ? (
        <p className="mt-2 text-center text-sm text-muted-foreground">{props.subtitle}</p>
      ) : null}

      <div className="mt-7 space-y-3">
        {props.choices.map((c) => {
          const active = props.selected === c.id
          return (
            <button
              key={c.id}
              onClick={() => props.onSelect(c)}
              className={[
                'w-full rounded-2xl border px-4 py-4 text-left transition',
                'bg-background/60 hover:bg-background',
                active
                  ? 'border-emerald-500/40 ring-2 ring-emerald-500/15'
                  : 'border-border/60',
              ].join(' ')}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-base font-semibold text-foreground">
                  {c.label}
                </div>
                <div className="text-lg">{c.emoji}</div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-7 flex flex-col gap-3">
        <Button
          size="lg"
          className="h-12 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500"
          disabled={!props.canContinue}
          onClick={props.onPrimary}
        >
          {props.primaryLabel} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        {props.secondaryLabel && props.onSecondary ? (
          <Button
            variant="outline"
            size="lg"
            className="h-12 rounded-2xl"
            onClick={props.onSecondary}
          >
            {props.secondaryLabel}
          </Button>
        ) : null}
      </div>
    </div>
  )
}

function StepInfo(props: {
  kicker?: string
  icon?: React.ReactNode
  title: string
  body?: string
  highlight?: React.ReactNode
  primaryLabel: string
  onPrimary: () => void
}) {
  return (
    <div className="text-center">
      {props.kicker ? (
        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
          {props.kicker}
        </p>
      ) : null}

      <div className="mt-4 flex justify-center">
        {props.icon ? (
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300">
            {props.icon}
          </div>
        ) : null}
      </div>

      <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
        {props.title}
      </h2>

      {props.body ? (
        <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
          {props.body}
        </p>
      ) : null}

      {props.highlight}

      <div className="mt-8">
        <Button
          size="lg"
          className="h-12 w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500"
          onClick={props.onPrimary}
        >
          {props.primaryLabel} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function StepCountry(props: {
  title: string
  subtitle?: string
  countryQuery: string
  setCountryQuery: (v: string) => void
  countries: string[]
  country: string
  setCountry: (v: string) => void
  primaryLabel: string
  onPrimary: () => void
  canContinue: boolean
}) {
  return (
    <div>
      <h2 className="text-center text-2xl font-bold tracking-tight text-foreground">
        {props.title}
      </h2>
      {props.subtitle ? (
        <p className="mt-2 text-center text-sm text-muted-foreground">{props.subtitle}</p>
      ) : null}

      <div className="mt-6">
        <Input
          value={props.countryQuery}
          onChange={(e) => props.setCountryQuery(e.target.value)}
          placeholder="Buscar país..."
          className="h-12 rounded-2xl"
        />
      </div>

      <div className="mt-4 max-h-56 overflow-auto rounded-2xl border border-border/60 bg-background/50 p-2">
        {props.countries.map((c) => {
          const active = props.country === c
          return (
            <button
              key={c}
              onClick={() => props.setCountry(c)}
              className={[
                'w-full rounded-xl px-3 py-2 text-left text-sm transition',
                active ? 'bg-emerald-500/10 text-foreground' : 'hover:bg-muted/40',
              ].join(' ')}
            >
              {c}
            </button>
          )
        })}
      </div>

      <div className="mt-7">
        <Button
          size="lg"
          className="h-12 w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500"
          disabled={!props.canContinue}
          onClick={props.onPrimary}
        >
          {props.primaryLabel} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function StepCategory(props: {
  title: string
  categoryQuery: string
  setCategoryQuery: (v: string) => void
  categories: string[]
  selected: string
  onPick: (v: string) => void
  primaryLabel: string
  onPrimary: () => void
  canContinue: boolean
}) {
  return (
    <div>
      <h2 className="text-center text-2xl font-bold tracking-tight text-foreground">
        {props.title}
      </h2>

      <div className="mt-6">
        <Input
          value={props.categoryQuery}
          onChange={(e) => props.setCategoryQuery(e.target.value)}
          placeholder="Buscar área..."
          className="h-12 rounded-2xl"
        />
      </div>

      <div className="mt-4 max-h-64 overflow-auto rounded-2xl border border-border/60 bg-background/50 p-2">
        {props.categories.map((c) => {
          const active = props.selected === c
          return (
            <button
              key={c}
              onClick={() => props.onPick(c)}
              className={[
                'w-full rounded-xl px-3 py-2 text-left text-sm transition',
                active ? 'bg-emerald-500/10 text-foreground' : 'hover:bg-muted/40',
              ].join(' ')}
            >
              {c}
            </button>
          )
        })}
      </div>

      <div className="mt-7">
        <Button
          size="lg"
          className="h-12 w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500"
          disabled={!props.canContinue}
          onClick={props.onPrimary}
        >
          {props.primaryLabel} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function StepResults(props: {
  title: string
  subtitle: string
  jobs: { title: string; region: string; category: string }[]
  review: { stars: number; text: string; name: string; meta: string }
  primaryLabel: string
  onPrimary: () => void
}) {
  return (
    <div>
      <h2 className="text-center text-xl font-bold tracking-tight text-foreground">
        {props.title}
      </h2>
      <p className="mt-2 text-center text-sm text-muted-foreground">{props.subtitle}</p>

      <div className="mt-6 space-y-3">
        {props.jobs.map((j) => (
          <div
            key={j.title}
            className="flex items-center gap-4 rounded-2xl border border-border/60 bg-background/60 p-4"
          >
            {/* ícone maleta (maior + centralizado) */}
            <div className="grid h-14 w-14 flex-shrink-0 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300">
              <Briefcase className="h-6 w-6" />
            </div>

            {/* conteúdo */}
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-foreground">{j.title}</div>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>{j.region}</span>
                <span className="text-muted-foreground/50">•</span>
                <span>{j.category}</span>
              </div>

              <div className="mt-2">
                <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/5">
                  {j.category}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
        <div className="flex items-center gap-1 text-amber-500">
          {Array.from({ length: props.review.stars }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-current" />
          ))}
        </div>
        <p className="mt-2 text-sm text-foreground">{props.review.text}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          {props.review.name} • {props.review.meta}
        </p>
      </div>

      <div className="mt-8">
        <Button
          size="lg"
          className="h-12 w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500"
          onClick={props.onPrimary}
        >
          {props.primaryLabel} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function StepEmail(props: {
  title: string
  email: string
  setEmail: (v: string) => void
  totalJobsLabel: string
  primaryLabel: string
  onPrimary: () => void
  canContinue: boolean
}) {
  return (
    <div>
      <h2 className="text-center text-2xl font-bold tracking-tight text-foreground">
        {props.title}
      </h2>

      <div className="mt-6">
        <Input
          value={props.email}
          onChange={(e) => props.setEmail(e.target.value)}
          placeholder="voce@email.com"
          className="h-12 rounded-2xl"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-left">
        <p className="text-base font-semibold text-foreground">
          Pronto pra realmente conseguir uma dessas vagas?
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Desbloqueie essas vagas e mais {props.totalJobsLabel}:
        </p>

        <div className="mt-4 space-y-2 text-sm text-foreground">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600" />
            Aplique antes de todo mundo
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600" />
            Novas vagas adicionadas diariamente
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600" />
            Sem golpes ou vagas fake
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600" />
            Alertas por e-mail personalizados
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Button
          size="lg"
          className="h-12 w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500"
          disabled={!props.canContinue}
          onClick={props.onPrimary}
        >
          {props.primaryLabel} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function StepPricing(props: {
  plan: 'annual' | 'quarterly' | 'monthly'
  setPlan: (p: 'annual' | 'quarterly' | 'monthly') => void
  onPrimary: () => void
  reviews: { name: string; role: string; text: string; date: string }[]
}) {
  return (
    <div>
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1 text-sm text-foreground">
          <span className="font-semibold">4.9</span>
          <span className="text-amber-500">★★★★★</span>
          <span className="text-muted-foreground">de 500+ reviews</span>
        </div>

        <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
          Desbloqueie vagas internacionais{" "} <br />
          <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
            que pagam a partir de R$ 15.000/mês
          </span>
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Para todos os níveis com contratos{" "}
          <strong>CLT ou PJ</strong>. Aplique direto na empresa em vagas com poucos candidatos e que aceitam brasileiros.
        </p>

        <p className="mt-3 text-xs text-muted-foreground">
          *Valores variam por país, senioridade e empresa.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        <PlanRow
          active={props.plan === 'annual'}
          onClick={() => props.setPlan('annual')}
          title="Plano Anual"
          subtitle="R$ 238,80"
          priceMonthly="R$ 19,90 / mês"
          badge="ECONOMIZE 33%"
        />

        <PlanRow
          active={props.plan === 'monthly'}
          onClick={() => props.setPlan('monthly')}
          title="Plano Mensal"
          subtitle="R$ 29,90"
          priceMonthly="R$ 29,90 / mês"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-border/60 bg-background/60 p-4">
        <div className="flex items-center gap-2 text-sm text-foreground">
          <Check className="h-4 w-4 text-emerald-600" />
          <span className="font-medium">Sem fidelidade</span> — cancele quando quiser
        </div>
      </div>

      <div className="mt-6">
        <Button
          size="lg"
          className="h-12 w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500"
          onClick={props.onPrimary}
        >
          <Lock className="mr-2 h-4 w-4" />
          Continuar <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <Separator className="my-7" />

      <div className="grid gap-3 md:grid-cols-2">
        {props.reviews.slice(0, 4).map((r) => (
          <div key={r.name} className="rounded-2xl border border-border/60 bg-background/60 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.role}</p>
              </div>
              <span className="text-amber-500">★★★★★</span>
            </div>
            <p className="mt-3 text-sm text-foreground">{r.text}</p>
            <p className="mt-2 text-xs text-muted-foreground">{r.date}</p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        (Reviews exemplo — pluga os reais depois)
      </p>
    </div>
  )
}

function PlanRow(props: {
  active: boolean
  onClick: () => void
  title: string
  subtitle: string
  priceMonthly: string
  badge?: string
}) {
  return (
    <button
      onClick={props.onClick}
      className={[
        'w-full rounded-2xl border p-4 text-left transition',
        props.active
          ? 'border-emerald-500/40 bg-emerald-500/5 ring-2 ring-emerald-500/10'
          : 'border-border/60 bg-background/60 hover:bg-background',
      ].join(' ')}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={[
                'h-3 w-3 rounded-full border',
                props.active ? 'border-emerald-500 bg-emerald-500' : 'border-muted-foreground/40',
              ].join(' ')}
            />
            <p className="text-sm font-semibold text-foreground">{props.title}</p>
            {props.badge ? (
              <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[11px] font-semibold text-white">
                {props.badge}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{props.subtitle}</p>
        </div>

        <div className="text-right">
          <p className="text-lg font-bold text-foreground">{props.priceMonthly}</p>
        </div>
      </div>
    </button>
  )
}
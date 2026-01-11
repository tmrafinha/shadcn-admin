// src/features/pricing/Pricing.tsx
import {
  BadgeCheck,
  Briefcase,
  Check,
  Crown,
  Globe,
  Lock,
  ShieldCheck,
  Sparkles,
  Timer,
  TrendingUp,
  X,
  Zap,
  Route,
  Target,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

export function Pricing() {
  // TODO: plugar no retorno real do usuário
  const isUserPremium = false
  const CHECKOUT_URL = 'https://pay.kiwify.com.br/J4oFiud'

  // Premium (verde da plataforma) — degradê + leve textura/glow
  const PREMIUM_BADGE_CLASS =
    'gap-1 whitespace-nowrap border border-emerald-300/40 bg-gradient-to-r from-lime-400 via-emerald-400 to-emerald-500 text-white shadow-sm dark:border-emerald-400/20'
  const PREMIUM_CARD_STRIPE_CLASS =
    'pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-emerald-400/90 to-transparent'
  const PREMIUM_GLOW_CLASS =
    'shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_14px_40px_rgba(16,185,129,0.10)] dark:shadow-[0_0_0_1px_rgba(16,185,129,0.12),0_14px_40px_rgba(16,185,129,0.12)]'
  const PREMIUM_TEXTURE_CLASS =
    'pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(16,185,129,0.18),transparent_60%)]'

  const stats = [
    { value: '2.500+', label: 'Devs Premium' },
    { value: '150+', label: 'Vagas por mês' },
    { value: '72%', label: 'Taxa de sucesso' },
  ]

  // Free: bem restrito (1 vaga/dia, sem treinos/certificações)
  const freeIncluded = [
    'Acesso ao feed de vagas (básico)',
    '1 candidatura por dia',
    'Acompanhamento do status das candidaturas',
  ]

  const freeBlocked = [
    'Preparação para entrevistas (simulados + trilhas)',
    'Certificações por tecnologia (React, Node, Java, etc.)',
    'Vagas PJ premium',
    'Projetos internacionais',
    'Prioridade no fluxo',
  ]

  const premiumIncluded = [
    'Candidaturas ilimitadas (sem limite diário)',
    'Simulados cronometrados (modo entrevista)',
    'Trilhas com checkpoints (do básico ao avançado)',
    'Certificações por tecnologia (React, Node, Java, etc.)',
    'Vagas PJ premium (curadas)',
    'Projetos internacionais (remoto)',
    'Prioridade no fluxo (mais visibilidade)',
  ]

  // Sessão “O que você leva” — mais rica + copy melhor
  const highlights = [
    {
      icon: Timer,
      title: 'Simulados cronometrados',
      description:
        'Sessões no ritmo de entrevista: tempo real, pressão controlada e foco em consistência.',
    },
    {
      icon: Route,
      title: 'Trilhas com checkpoints',
      description:
        'Sequência clara (básico → avançado). Você sabe exatamente o que vem depois e por quê.',
    },
    {
      icon: BadgeCheck,
      title: 'Certificações por tecnologia',
      description:
        'Valide seu nível por stack (React/Node/Java etc.) e transforme estudo em prova de competência.',
    },
    {
      icon: Briefcase,
      title: 'Vagas PJ premium',
      description:
        'Curadoria com foco em projetos que pagam bem — e com espaço para crescimento.',
    },
    {
      icon: Globe,
      title: 'Projetos internacionais',
      description:
        'Pipeline de oportunidades remotas fora do Brasil, com seleção e organização.',
    },
    {
      icon: Target,
      title: 'Prioridade no fluxo',
      description:
        'Mais visibilidade e acesso antes — você chega cedo nas melhores oportunidades.',
    },
    {
      icon: TrendingUp,
      title: 'Efeito composto (volume + consistência)',
      description:
        'Premium é feito para rotina: treino frequente, evolução rastreável e menos fricção.',
    },
  ]

  return (
    <>
      <Header>
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="space-y-10">
          {/* Hero Section (sem CTA) */}
          <div className="text-center space-y-4 py-12">
            <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Plano Único - Tudo Incluso
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Acelere sua carreira dev
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para se preparar, certificar e conquistar as
              melhores oportunidades PJ do mercado.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 pt-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Cards
              ✅ FIX: Premium estava “mais baixo” por causa do mt-3 no Card.
              Agora removi o mt-3 e alinhei com items-start + h-full.
          */}
          <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
            {/* FREE */}
            <Card className="flex h-full flex-col border-border/60 bg-card/50 backdrop-blur">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle className="text-lg">Free</CardTitle>
                    <CardDescription>
                      Explore vagas e teste o fluxo antes de evoluir.
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">Plano atual</Badge>
                </div>

                <div className="mt-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-3xl font-bold">R$ 0</p>
                    <p className="text-xs text-muted-foreground">gratuito</p>
                  </div>

                  <Button variant="outline" className="gap-2" disabled>
                    <Lock className="h-4 w-4" />
                    Free ativo
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col space-y-5">
                <div className="rounded-lg border border-border/60 bg-background/40 p-4">
                  <p className="text-sm font-semibold">Inclui</p>
                  <p className="text-xs text-muted-foreground">
                    O básico para começar a se movimentar.
                  </p>

                  <div className="mt-3 space-y-2">
                    {freeIncluded.map((f) => (
                      <div key={f} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">{f}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-semibold">Bloqueado no Free</p>
                  <div className="space-y-2">
                    {freeBlocked.map((f) => (
                      <div key={f} className="flex items-start gap-3 opacity-70">
                        <X className="mt-0.5 h-4 w-4 text-muted-foreground/60" />
                        <p className="text-sm text-muted-foreground">{f}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto" />
              </CardContent>
            </Card>

            {/* PREMIUM (✅ alinhado no topo) */}
            <Card
              className={`relative flex h-full flex-col overflow-hidden border-2 border-primary/40 bg-card/50 backdrop-blur ${PREMIUM_GLOW_CLASS}`}
            >
              <div className={PREMIUM_CARD_STRIPE_CLASS} />
              <div className={PREMIUM_TEXTURE_CLASS} />

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle className="text-lg">Premium</CardTitle>
                    <CardDescription>
                      Treine, valide e aplique com vantagem (PJ + internacional).
                    </CardDescription>
                  </div>

                  <Badge variant="secondary" className={PREMIUM_BADGE_CLASS}>
                    <Zap className="h-3.5 w-3.5" />
                    Tudo incluso
                  </Badge>
                </div>

                <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-3xl font-bold text-primary">R$ 97,00</p>
                    <p className="text-xs text-muted-foreground">
                      pagamento único
                    </p>
                  </div>

                  {isUserPremium ? (
                    <Button className="gap-2" disabled>
                      <Crown className="h-4 w-4" />
                      Premium ativo
                    </Button>
                  ) : (
                    <a href={CHECKOUT_URL} className="w-full sm:w-auto">
                      <Button className="w-full gap-2 sm:w-auto">
                        <Crown className="h-4 w-4" />
                        Ativar Premium
                      </Button>
                    </a>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col space-y-5">
                {/* ✅ Garantia (mais explícita e visual) */}
                <div className="flex items-start gap-3 rounded-lg border border-emerald-400/30 bg-emerald-500/5 p-3">
                  <div className="rounded-md bg-emerald-500/10 p-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">
                      Garantia: 1 projeto PJ ou dinheiro de volta
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Você treina com segurança: se não bater o resultado, você não fica no prejuízo.
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-border/60 bg-background/40 p-4">
                  <p className="text-sm font-semibold">Tudo incluso</p>
                  <p className="text-xs text-muted-foreground">
                    Preparação + certificação + oportunidades (sem travas).
                  </p>

                  <div className="mt-3 space-y-2">
                    {premiumIncluded.map((f) => (
                      <div key={f} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-4 w-4 text-primary" />
                        <p className="text-sm">{f}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    No Free: 1 candidatura/dia • No Premium: ilimitado.
                  </span>
                </div>

                <div className="mt-auto" />
              </CardContent>
            </Card>
          </div>

          {/* Highlights (melhorado + mais itens + garantia repetida no fim) */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight md:text-2xl">
                O que você leva com o Premium
              </h2>
              <p className="text-sm text-muted-foreground">
                Um pacote completo para virar o jogo: treinar bem, validar nível e
                acessar oportunidades melhores.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {highlights.map((b) => {
                const Icon = b.icon
                return (
                  <Card
                    key={b.title}
                    className="border-border/60 bg-card/50 backdrop-blur"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="rounded-lg bg-primary/10 p-3">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-semibold">{b.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {b.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Garantia também aqui embaixo (reforço visual) */}
            <Card className="border-emerald-400/30 bg-emerald-500/5 mb-12">
              <CardContent className="">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="rounded-md bg-emerald-500/10 p-2">
                      <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">
                        Garantia: 1 projeto ou dinheiro de volta
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Compromisso com resultado — você investe com tranquilidade.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    Pagamento único • acesso vitalício
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>
    </>
  )
}
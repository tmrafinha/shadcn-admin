// src/features/prepare/Prepare.tsx
import { useMemo, useState } from 'react'
import {
  Award,
  BookOpen,
  Brain,
  Code2,
  Crown,
  Database,
  Layout,
  Lock,
  Target,
  Timer,
  TrendingUp,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Clock,
  Lightbulb,
  Sparkles,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

import { PremiumAccessBanner } from '@/components/premium-access-banner'

type TabKey = 'interview' | 'learning'

const mockUser = {
  isPremium: false,
  level: 'Iniciante',
}

const PREMIUM_BADGE_CLASS =
  'gap-1 whitespace-nowrap border border-emerald-300/40 bg-gradient-to-r from-lime-400 via-emerald-400 to-emerald-500 text-white shadow-sm dark:border-emerald-400/20'

const PREMIUM_CARD_STRIPE_CLASS =
  'pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-emerald-400/90 to-transparent'

const PREMIUM_GLOW_CLASS =
  'shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_14px_40px_rgba(16,185,129,0.10)] dark:shadow-[0_0_0_1px_rgba(16,185,129,0.12),0_14px_40px_rgba(16,185,129,0.12)]'

const PREMIUM_TEXTURE_CLASS =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(16,185,129,0.18),transparent_60%)]'

const interviewPaths = [
  { id: 1, title: 'Software Engineer', subtitle: 'Problem Solving', duration: '60 min', difficulty: 'Medium' as const, icon: Code2, isPremium: true, completed: 0, total: 15 },
  { id: 2, title: 'Frontend Developer', subtitle: 'React + UI', duration: '60 min', difficulty: 'Medium' as const, icon: Layout, isPremium: true, completed: 0, total: 12 },
  { id: 3, title: 'Backend Developer', subtitle: 'Node + APIs', duration: '60 min', difficulty: 'Medium' as const, icon: Database, isPremium: true, completed: 0, total: 18 },
  { id: 4, title: 'System Design', subtitle: 'Architecture', duration: '90 min', difficulty: 'Hard' as const, icon: Brain, isPremium: true, completed: 0, total: 20 },
  { id: 5, title: 'Mobile Engineer', subtitle: 'React Native', duration: '60 min', difficulty: 'Medium' as const, icon: Layout, isPremium: true, completed: 0, total: 14 },
  { id: 6, title: 'DevOps Engineer', subtitle: 'CI/CD + Cloud', duration: '75 min', difficulty: 'Hard' as const, icon: Database, isPremium: true, completed: 0, total: 16 },
]

const learningPaths = [
  { id: 1, title: 'Fundamentos de Algoritmos', description: 'Domine os conceitos básicos de algoritmos e complexidade.', progress: 0, totalModules: 12, completedModules: 0, isPremium: true, difficulty: 'Easy' as const },
  { id: 2, title: 'Estruturas de Dados Avançadas', description: 'Árvores, grafos, heaps e muito mais.', progress: 0, totalModules: 15, completedModules: 0, isPremium: true, difficulty: 'Medium' as const },
  { id: 3, title: 'System Design para Entrevistas', description: 'Aprenda a projetar sistemas escaláveis.', progress: 0, totalModules: 20, completedModules: 0, isPremium: true, difficulty: 'Hard' as const },
  { id: 4, title: 'React do Zero ao Avançado', description: 'Components, hooks, performance e padrões.', progress: 0, totalModules: 18, completedModules: 0, isPremium: true, difficulty: 'Medium' as const },
  { id: 5, title: 'Node.js e Backend', description: 'APIs, autenticação, bancos de dados.', progress: 0, totalModules: 16, completedModules: 0, isPremium: true, difficulty: 'Medium' as const },
]

function levelBadge(level: 'Easy' | 'Medium' | 'Hard') {
  if (level === 'Hard') {
    return 'border-emerald-400/60 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
  }
  if (level === 'Medium') {
    return 'border-green-400/60 bg-green-500/10 text-green-700 dark:text-green-300'
  }
  return 'border-lime-400/60 bg-lime-500/10 text-lime-700 dark:text-lime-300'
}

export function Prepare() {
  const [activeTab, setActiveTab] = useState<TabKey>('interview')

  const isUserPremium = false

  const tabButtonClass = (key: TabKey) =>
    `inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      activeTab === key
        ? 'bg-muted text-foreground'
        : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
    }`

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
        {/* Heading */}
        <div className="mb-4 flex items-center justify-between space-y-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Preparação para Entrevista
            </h1>
            <p className="text-sm text-muted-foreground">
              Tenha até 70% a mais de chance de passar numa entrevista com nossa ajuda
            </p>
          </div>
        </div>

        {/* Value props */}
        <Card className="mb-6 overflow-hidden border-muted bg-muted/30">
          <CardContent className="grid gap-4 p-6 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <div className="rounded-md bg-background p-2.5">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold">Simulados reais</p>
                <p className="text-sm text-muted-foreground">
                  Pratique com tempo e estrutura de entrevista.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-md bg-background p-2.5">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold">Trilhas guiadas</p>
                <p className="text-sm text-muted-foreground">
                  Conteúdo estruturado com checkpoints.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-md bg-background p-2.5">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold">Feedback imediato</p>
                <p className="text-sm text-muted-foreground">
                  Saiba onde melhorar após cada sessão.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              type="button"
              className={tabButtonClass('interview')}
              onClick={() => setActiveTab('interview')}
            >
              <Target className="h-4 w-4" />
              Simulados
              <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 text-xs">
                {interviewPaths.length}
              </Badge>
            </button>

            <button
              type="button"
              className={tabButtonClass('learning')}
              onClick={() => setActiveTab('learning')}
            >
              <BookOpen className="h-4 w-4" />
              Trilhas
              <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 text-xs">
                {learningPaths.length}
              </Badge>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary">{mockUser.level}</Badge>
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs" disabled>
              <TrendingUp className="h-3.5 w-3.5" />
              Ver ranking
              <Lock className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Layout principal */}
        <div className="grid grid-cols-1 gap-4">
          {/* Conteúdo principal */}
          <div className="space-y-4">
            {/* SIMULADOS */}
            {activeTab === 'interview' && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {interviewPaths.map((p) => {
                  const Icon = p.icon
                  const locked = !isUserPremium

                  return (
                    <Card
                      key={p.id}
                      className={`group relative overflow-hidden border-border/60 bg-card/50 backdrop-blur transition-all duration-200 ease-out hover:scale-[1.02] ${
                        locked ? PREMIUM_GLOW_CLASS : 'hover:shadow-lg'
                      }`}
                    >
                      {locked && (
                        <>
                          <div className={PREMIUM_CARD_STRIPE_CLASS} />
                          <div className={PREMIUM_TEXTURE_CLASS} />
                        </>
                      )}

                      <CardContent className="p-6">
                        <div className="flex flex-col gap-4">
                          <div className="flex items-start gap-3">
                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border border-border/50 bg-background/80">
                              <Icon className="h-6 w-6 text-primary" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h3 className="text-base font-bold leading-tight group-hover:text-primary transition-colors">
                                    {p.title}
                                  </h3>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {p.subtitle}
                                  </p>
                                </div>

                                {p.isPremium && (
                                  <Badge variant="secondary" className={PREMIUM_BADGE_CLASS}>
                                    <Crown className="h-3 w-3" />
                                    Premium
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline" className={levelBadge(p.difficulty)}>
                              {p.difficulty}
                            </Badge>
                            <span className="inline-flex items-center gap-1.5">
                              <Clock className="h-4 w-4" />
                              {p.duration}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <CheckCircle2 className="h-4 w-4" />
                              {p.completed}/{p.total} completos
                            </span>
                          </div>

                          <Separator />

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Progresso</span>
                              <span>{p.completed > 0 ? Math.round((p.completed / p.total) * 100) : 0}%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full bg-primary transition-all"
                                style={{ width: `${p.completed > 0 ? (p.completed / p.total) * 100 : 0}%` }}
                              />
                            </div>
                          </div>

                          <Button
                            className={`w-full gap-2 transition-all ${
                              locked
                                ? 'cursor-not-allowed'
                                : 'group-hover:-translate-y-[1px] group-hover:shadow-lg'
                            }`}
                            variant={locked ? 'outline' : 'default'}
                            disabled={locked}
                            size="lg"
                          >
                            {locked ? (
                              <>
                                <Lock className="h-4 w-4" />
                                Bloqueado no plano atual
                              </>
                            ) : (
                              <>
                                <Target className="h-4 w-4" />
                                Iniciar simulado
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            {/* TRILHAS */}
            {activeTab === 'learning' && (
              <div className="grid gap-4 sm:grid-cols-2">
                {learningPaths.map((p) => {
                  const locked = !isUserPremium

                  return (
                    <Card
                      key={p.id}
                      className={`group relative overflow-hidden border-border/60 bg-card/50 backdrop-blur transition-all duration-200 ease-out hover:scale-[1.01] ${
                        locked ? PREMIUM_GLOW_CLASS : 'hover:shadow-lg'
                      }`}
                    >
                      {locked && (
                        <>
                          <div className={PREMIUM_CARD_STRIPE_CLASS} />
                          <div className={PREMIUM_TEXTURE_CLASS} />
                        </>
                      )}

                      <CardContent className="p-6">
                        <div className="flex flex-col gap-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                                {p.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {p.description}
                              </p>
                            </div>

                            {p.isPremium && (
                              <Badge variant="secondary" className={PREMIUM_BADGE_CLASS}>
                                <Crown className="h-3 w-3" />
                                Premium
                              </Badge>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline" className={levelBadge(p.difficulty)}>
                              {p.difficulty}
                            </Badge>
                            <span className="inline-flex items-center gap-1.5">
                              <BookOpen className="h-4 w-4" />
                              {p.completedModules}/{p.totalModules} módulos
                            </span>
                          </div>

                          <Separator />

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Progresso da trilha</span>
                              <span>{p.progress}%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full bg-primary transition-all"
                                style={{ width: `${p.progress}%` }}
                              />
                            </div>
                          </div>

                          <Button
                            className={`w-full gap-2 transition-all ${
                              locked
                                ? 'cursor-not-allowed'
                                : 'group-hover:-translate-y-[1px] group-hover:shadow-lg'
                            }`}
                            variant={locked ? 'outline' : 'default'}
                            disabled={locked}
                            size="lg"
                          >
                            {locked ? (
                              <>
                                <Lock className="h-4 w-4" />
                                Bloqueado no plano atual
                              </>
                            ) : (
                              <>
                                <BookOpen className="h-4 w-4" />
                                Continuar trilha
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </Main>
    </>
  )
}
// src/features/certifications/Certifications.tsx
import { useMemo, useState } from 'react'
import {
  BadgeCheck,
  Brain,
  Code2,
  Crown,
  Database,
  GraduationCap,
  Layout,
  Lock,
  Sparkles,
  Target,
  TrendingUp,
  UserCheck,
  Zap,
  CheckCircle2,
  Clock,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

type TabKey = 'roles' | 'skills'

type Certification = {
  id: number
  kind: TabKey
  title: string
  subtitle: string
  level: 'Basic' | 'Intermediate' | 'Advanced'
  duration: string
  icon: React.ElementType
  isPremium: boolean
  questions: number
  passingScore: number
  topSkills: string[]
}

const PREMIUM_BADGE_CLASS =
  'gap-1 whitespace-nowrap border border-emerald-300/40 bg-gradient-to-r from-lime-400 via-emerald-400 to-emerald-500 text-white shadow-sm dark:border-emerald-400/20'

const PREMIUM_CARD_STRIPE_CLASS =
  'pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-emerald-400/90 to-transparent'

const PREMIUM_GLOW_CLASS =
  'shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_14px_40px_rgba(16,185,129,0.10)] dark:shadow-[0_0_0_1px_rgba(16,185,129,0.12),0_14px_40px_rgba(16,185,129,0.12)]'

const PREMIUM_TEXTURE_CLASS =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(16,185,129,0.18),transparent_60%)]'

const certifications: Certification[] = [
  // ===== Skills / Tech =====
  {
    id: 10,
    kind: 'skills',
    title: 'React',
    subtitle: 'Componentização + hooks',
    level: 'Intermediate',
    duration: '40–55 min',
    icon: Layout,
    isPremium: true,
    questions: 35,
    passingScore: 70,
    topSkills: ['JSX', 'useState', 'useEffect', 'Custom Hooks'],
  },
  {
    id: 11,
    kind: 'skills',
    title: 'Node.js',
    subtitle: 'APIs + async + patterns',
    level: 'Intermediate',
    duration: '45–60 min',
    icon: Database,
    isPremium: true,
    questions: 40,
    passingScore: 70,
    topSkills: ['Express', 'Async/Await', 'Middleware', 'Error Handling'],
  },
  {
    id: 12,
    kind: 'skills',
    title: 'Java',
    subtitle: 'OOP + collections',
    level: 'Intermediate',
    duration: '45–60 min',
    icon: Code2,
    isPremium: true,
    questions: 40,
    passingScore: 70,
    topSkills: ['Classes', 'Interfaces', 'Collections', 'Streams'],
  },
  {
    id: 13,
    kind: 'skills',
    title: 'Python',
    subtitle: 'Problemas + estruturas',
    level: 'Basic',
    duration: '35–50 min',
    icon: Code2,
    isPremium: true,
    questions: 30,
    passingScore: 65,
    topSkills: ['Syntax', 'Lists/Dicts', 'Functions', 'Comprehensions'],
  },
  {
    id: 14,
    kind: 'skills',
    title: 'SQL',
    subtitle: 'Queries + joins + agregações',
    level: 'Basic',
    duration: '30–45 min',
    icon: Database,
    isPremium: true,
    questions: 25,
    passingScore: 65,
    topSkills: ['SELECT', 'JOINs', 'GROUP BY', 'Subqueries'],
  },
  {
    id: 15,
    kind: 'skills',
    title: 'System Design',
    subtitle: 'Arquitetura + trade-offs',
    level: 'Advanced',
    duration: '60–90 min',
    icon: Brain,
    isPremium: true,
    questions: 45,
    passingScore: 75,
    topSkills: ['Scalability', 'CAP Theorem', 'Caching', 'Load Balancing'],
  },
  {
    id: 16,
    kind: 'skills',
    title: 'TypeScript',
    subtitle: 'Tipagem + generics',
    level: 'Intermediate',
    duration: '40–55 min',
    icon: Code2,
    isPremium: true,
    questions: 35,
    passingScore: 70,
    topSkills: ['Types', 'Interfaces', 'Generics', 'Utility Types'],
  },
  {
    id: 17,
    kind: 'skills',
    title: 'JavaScript',
    subtitle: 'ES6+ + async + DOM',
    level: 'Basic',
    duration: '35–50 min',
    icon: Code2,
    isPremium: true,
    questions: 30,
    passingScore: 65,
    topSkills: ['ES6+', 'Promises', 'DOM', 'Event Loop'],
  },
  {
    id: 18,
    kind: 'skills',
    title: 'Docker',
    subtitle: 'Containers + orchestration',
    level: 'Intermediate',
    duration: '40–55 min',
    icon: Database,
    isPremium: true,
    questions: 35,
    passingScore: 70,
    topSkills: ['Dockerfile', 'Images', 'Volumes', 'Docker Compose'],
  },
  {
    id: 19,
    kind: 'skills',
    title: 'Git',
    subtitle: 'Versionamento + workflows',
    level: 'Basic',
    duration: '30–45 min',
    icon: Code2,
    isPremium: true,
    questions: 25,
    passingScore: 65,
    topSkills: ['Commits', 'Branches', 'Merge', 'Rebase'],
  },
  {
    id: 20,
    kind: 'skills',
    title: 'AWS',
    subtitle: 'Cloud + services',
    level: 'Advanced',
    duration: '60–90 min',
    icon: Database,
    isPremium: true,
    questions: 45,
    passingScore: 75,
    topSkills: ['EC2', 'S3', 'Lambda', 'RDS'],
  },
  {
    id: 21,
    kind: 'skills',
    title: 'MongoDB',
    subtitle: 'NoSQL + aggregation',
    level: 'Intermediate',
    duration: '40–55 min',
    icon: Database,
    isPremium: true,
    questions: 35,
    passingScore: 70,
    topSkills: ['CRUD', 'Aggregation', 'Indexes', 'Schema Design'],
  },

  // ===== Roles =====
  {
    id: 1,
    kind: 'roles',
    title: 'Frontend Developer',
    subtitle: 'React + UI Engineering',
    level: 'Intermediate',
    duration: '45–60 min',
    icon: Layout,
    isPremium: true,
    questions: 40,
    passingScore: 70,
    topSkills: ['Components', 'Hooks', 'State Management', 'Performance'],
  },
  {
    id: 2,
    kind: 'roles',
    title: 'Software Engineer',
    subtitle: 'DSA + Problem Solving',
    level: 'Intermediate',
    duration: '60–75 min',
    icon: Code2,
    isPremium: true,
    questions: 50,
    passingScore: 75,
    topSkills: ['Algorithms', 'Data Structures', 'Complexity', 'Problem Solving'],
  },
  {
    id: 3,
    kind: 'roles',
    title: 'Software Engineer Intern',
    subtitle: 'Fundamentos + lógica',
    level: 'Basic',
    duration: '35–45 min',
    icon: GraduationCap,
    isPremium: true,
    questions: 30,
    passingScore: 65,
    topSkills: ['Syntax', 'Logic', 'Basic DS', 'OOP Basics'],
  },
  {
    id: 4,
    kind: 'roles',
    title: 'Backend Developer',
    subtitle: 'APIs + databases + performance',
    level: 'Intermediate',
    duration: '50–65 min',
    icon: Database,
    isPremium: true,
    questions: 45,
    passingScore: 70,
    topSkills: ['REST APIs', 'SQL/NoSQL', 'Authentication', 'Caching'],
  },
  {
    id: 5,
    kind: 'roles',
    title: 'Full Stack Developer',
    subtitle: 'Frontend + Backend + DevOps',
    level: 'Advanced',
    duration: '70–90 min',
    icon: Code2,
    isPremium: true,
    questions: 55,
    passingScore: 75,
    topSkills: ['React/Node', 'Databases', 'CI/CD', 'Cloud'],
  },
  {
    id: 6,
    kind: 'roles',
    title: 'DevOps Engineer',
    subtitle: 'Infrastructure + automation',
    level: 'Advanced',
    duration: '60–75 min',
    icon: Database,
    isPremium: true,
    questions: 50,
    passingScore: 75,
    topSkills: ['CI/CD', 'Docker/K8s', 'AWS/Azure', 'Monitoring'],
  },
]

function levelBadge(level: Certification['level']) {
  if (level === 'Advanced') {
    return 'border-emerald-400/60 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
  }
  if (level === 'Intermediate') {
    return 'border-green-400/60 bg-green-500/10 text-green-700 dark:text-green-300'
  }
  return 'border-lime-400/60 bg-lime-500/10 text-lime-700 dark:text-lime-300'
}

function tabButtonClass(active: boolean) {
  return `inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    active
      ? 'bg-muted text-foreground'
      : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
  }`
}

/**
 * ✅ Garante SEMPRE 5 tópicos, pra cards ficarem iguais.
 * - Se tiver menos: completa com placeholders “Extras”
 * - Se tiver mais: corta em 5
 */
function getFixedTopics(topics: string[], total = 5) {
  const base = topics.slice(0, total)
  if (base.length >= total) return base

  const missing = total - base.length
  const fillers = Array.from({ length: missing }, (_, i) => `Extra ${i + 1}`)
  return [...base, ...fillers]
}

function CertificationCard({
  cert,
  locked,
}: {
  cert: Certification
  locked: boolean
}) {
  const Icon = cert.icon
  const topics = getFixedTopics(cert.topSkills, 5)

  return (
    <Card
      className={`group relative flex h-full overflow-hidden border-border/60 bg-card/50 backdrop-blur transition-all duration-200 ease-out hover:scale-[1.02] ${
        locked ? PREMIUM_GLOW_CLASS : 'hover:shadow-lg'
      }`}
    >
      {locked && (
        <>
          <div className={PREMIUM_CARD_STRIPE_CLASS} />
          <div className={PREMIUM_TEXTURE_CLASS} />
        </>
      )}

      <CardContent className="flex w-full flex-col p-6">
        <div className="flex flex-1 flex-col gap-4">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border border-border/50 bg-background/80">
              <Icon className="h-6 w-6 text-primary" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                    {cert.title}
                  </h3>
                  <p className="truncate text-sm text-muted-foreground mt-0.5">
                    {cert.subtitle}
                  </p>
                </div>

                {cert.isPremium && (
                  <Badge variant="secondary" className={PREMIUM_BADGE_CLASS}>
                    <Crown className="h-3 w-3" />
                    Premium
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline" className={levelBadge(cert.level)}>
              {cert.level}
            </Badge>

            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {cert.duration}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              {cert.questions} questões
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Target className="h-4 w-4" />
              Mínimo {cert.passingScore}%
            </span>
          </div>

          <Separator />

          {/* ✅ O que cai na prova (estilo antigo com ícone) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">O que cai na prova</p>
              <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Zap className="h-4 w-4" />
                5 tópicos
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {topics.map((skill, idx) => {
                // placeholders ficam mais "neutros" pra não parecer conteúdo real
                const isFiller = skill.startsWith('Extra ')
                return (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className={
                      isFiller
                        ? 'border-border/40 bg-muted/60 text-muted-foreground'
                        : 'border-primary/20 bg-primary/5 text-primary'
                    }
                    title={isFiller ? 'Mais tópicos aparecem ao liberar a prova' : skill}
                  >
                    {skill}
                  </Badge>
                )
              })}
            </div>

            <p className="text-xs text-muted-foreground">
              Tópicos principais cobrados na certificação.
            </p>
          </div>

          <div className="mt-auto" />
        </div>

        <Separator className="my-4" />

        {/* CTA */}
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
              <BadgeCheck className="h-4 w-4" />
              Iniciar certificação
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

export function Certifications() {
  const [activeTab, setActiveTab] = useState<TabKey>('skills')

  const isUserPremium = false
  const locked = !isUserPremium

  const filtered = useMemo(
    () => certifications.filter((c) => c.kind === activeTab),
    [activeTab],
  )

  const stats = useMemo(
    () => ({
      roles: certifications.filter((c) => c.kind === 'roles').length,
      skills: certifications.filter((c) => c.kind === 'skills').length,
    }),
    [],
  )

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
              Certificações
            </h1>
            <p className="text-sm text-muted-foreground">
              Certificações por cargo e por tecnologia — do básico ao avançado.
            </p>
          </div>
        </div>

        {/* Value props */}
        <Card className="mb-6 overflow-hidden border-muted bg-muted/30">
          <CardContent className="grid gap-4 p-6 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <div className="rounded-md bg-background p-2.5">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold">Sinal forte de competência</p>
                <p className="text-sm text-muted-foreground">
                  Recrutadores priorizam perfis certificados.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-md bg-background p-2.5">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold">Validação objetiva</p>
                <p className="text-sm text-muted-foreground">
                  Comprove habilidades com nota verificável.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-md bg-background p-2.5">
                <UserCheck className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold">Diferencial no LinkedIn</p>
                <p className="text-sm text-muted-foreground">
                  Destaque-se entre candidatos similares.
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
              className={tabButtonClass(activeTab === 'skills')}
              onClick={() => setActiveTab('skills')}
            >
              <Code2 className="h-4 w-4" />
              Por tecnologia
              <Badge
                variant="secondary"
                className="ml-1 h-5 min-w-5 px-1.5 text-xs"
              >
                {stats.skills}
              </Badge>
            </button>

            <button
              type="button"
              className={tabButtonClass(activeTab === 'roles')}
              onClick={() => setActiveTab('roles')}
            >
              <Crown className="h-4 w-4" />
              Por cargo
              <Badge
                variant="secondary"
                className="ml-1 h-5 min-w-5 px-1.5 text-xs"
              >
                {stats.roles}
              </Badge>
            </button>
          </div>

          <Button variant="ghost" size="sm" className="gap-1.5 text-xs" disabled>
            <TrendingUp className="h-3.5 w-3.5" />
            Ver rankings
            <Lock className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Grid */}
        <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((cert) => (
            <CertificationCard key={cert.id} cert={cert} locked={locked} />
          ))}
        </div>
      </Main>
    </>
  )
}
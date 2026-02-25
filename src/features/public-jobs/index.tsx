// src/features/jobs/PublicJobs.tsx
import { useEffect, useMemo, useState, ChangeEvent, JSX } from 'react'
import {
  Search,
  MapPin,
  Briefcase,
  ExternalLink,
  Crown,
  Lock,
  Sparkles,
  TrendingUp,
  Zap,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

import { useJobsStore } from '@/stores/jobs-store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { EmploymentType, SeniorityLevel, WorkModel } from '@/features/jobs/jobs.types'
import { GoDevLogo } from '@/assets/godev-logo'
import { countryFlags } from './data/allJobs'

const EMPLOYMENT_LABELS: Record<EmploymentType, string> = {
  CLT: 'CLT',
  PJ: 'PJ',
  FREELANCE: 'Freelancer',
  INTERNSHIP: 'Estágio',
}

const WORK_MODEL_LABELS: Record<WorkModel, string> = {
  REMOTE: '100% Remoto',
  HYBRID: 'Híbrido',
  ON_SITE: 'Presencial',
}

const SENIORITY_OPTIONS: { label: string; value: SeniorityLevel }[] = [
  { label: 'Júnior', value: 'JUNIOR' },
  { label: 'Pleno', value: 'PLENO' },
  { label: 'Sênior', value: 'SENIOR' },
]

const getCompanyInitials = (name?: string | null) => {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

function formatSalary(min?: number | null, max?: number | null) {
  if (min == null && max == null) return 'A combinar'
  const fmt = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  if (min != null && max != null) return `${fmt(min)} - ${fmt(max)}`
  if (min != null) return `A partir de ${fmt(min)}`
  return `Até ${fmt(max!)}`
}

function getCountryFlag(country?: string | null): string {
  if (!country) return '🌍'
  return countryFlags[country] || '🌍'
}

/** ---------- Skeletons ---------- */
function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-muted/60 ${className}`} />
}

function JobCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/50 p-4 backdrop-blur-sm">
      <div className="flex items-start gap-4">
        <SkeletonBlock className="h-14 w-14 rounded-xl" />
        <div className="flex-1 space-y-2">
          <SkeletonBlock className="h-4 w-2/3" />
          <SkeletonBlock className="h-3 w-1/3" />
          <div className="flex flex-wrap gap-2 pt-1">
            <SkeletonBlock className="h-6 w-16 rounded-full" />
            <SkeletonBlock className="h-6 w-28 rounded-full" />
            <SkeletonBlock className="h-6 w-24 rounded-full" />
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <SkeletonBlock className="h-6 w-16 rounded-full" />
            <SkeletonBlock className="h-6 w-20 rounded-full" />
            <SkeletonBlock className="h-6 w-14 rounded-full" />
            <SkeletonBlock className="h-6 w-18 rounded-full" />
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-end gap-2">
          <SkeletonBlock className="h-3 w-20" />
          <SkeletonBlock className="h-8 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

function ListSkeleton({ rows = 7 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  )
}

function TopBarSkeleton() {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <SkeletonBlock className="h-4 w-56" />
        <SkeletonBlock className="h-3 w-40" />
      </div>
      <div className="hidden lg:flex items-center gap-2">
        <SkeletonBlock className="h-3 w-14" />
        <SkeletonBlock className="h-10 w-64 rounded-xl" />
      </div>
    </div>
  )
}

/** ---------- Component ---------- */
export function PublicJobs() {
  const { jobs, loading, error, filters, pagination, setFilters, fetchJobs, loadMore } =
    useJobsStore()

  const navigate = useNavigate()
  const goJoin = () => navigate({ to: '/join' })

  const [searchTerm, setSearchTerm] = useState(filters.search ?? '')
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [selectedSeniority, setSelectedSeniority] = useState<SeniorityLevel[]>([])
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState<EmploymentType[]>([])
  const [selectedWorkModels, setSelectedWorkModels] = useState<WorkModel[]>([])
  const [selectedTechs, _setSelectedTechs] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'recent' | 'salary-high' | 'salary-low'>('recent')

  // mobile filters drawer
  const [filtersOpen, setFiltersOpen] = useState(false)

  // limitador do "carregar mais"
  const MAX_LOAD_MORE_CLICKS = 5
  const [loadMoreClicks, setLoadMoreClicks] = useState(0)
  const loadMoreLocked = loadMoreClicks >= MAX_LOAD_MORE_CLICKS

  // UX: skeleton no "load more" até de fato chegar mais item
  const [loadingMoreUI, setLoadingMoreUI] = useState(false)
  const [lastVisibleCount, setLastVisibleCount] = useState(0)

  // contadores inflados
  const displayTotalJobs = Math.max(0, Number(pagination.total || 0) * 5)
  const displayNewJobsThisWeek = Math.floor(displayTotalJobs * 0.087)
  const displayJobsPostedToday = Math.floor(displayTotalJobs * 0.011)

  useEffect(() => {
    fetchJobs(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    setFilters({ search: value || undefined })
    fetchJobs(false)
  }

  const toggleCountry = (country: string) => {
    setSelectedCountries((prev) => {
      const next = prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]
      setFilters({ country: next.length ? next : undefined })
      fetchJobs(false)
      return next
    })
  }

  const toggleWorkModel = (model: WorkModel) => {
    setSelectedWorkModels((prev) => {
      const next: WorkModel[] = prev.includes(model) ? prev.filter((m) => m !== model) : [...prev, model]
      // backend hoje aceita só 1
      setFilters({ workModel: next.length === 1 ? next[0] : undefined })
      fetchJobs(false)
      return next
    })
  }

  const toggleSeniority = (level: SeniorityLevel) => {
    setSelectedSeniority((prev) => {
      const next: SeniorityLevel[] = prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
      setFilters({ seniorityLevel: next.length ? next : undefined })
      fetchJobs(false)
      return next
    })
  }

  const toggleEmploymentType = (type: EmploymentType) => {
    setSelectedEmploymentTypes((prev) => {
      const next: EmploymentType[] = prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
      // backend hoje aceita só 1
      setFilters({ employmentType: next.length === 1 ? next[0] : undefined })
      fetchJobs(false)
      return next
    })
  }

  const handleSortChange = (value: 'recent' | 'salary-high' | 'salary-low') => {
    setSortBy(value)

    if (value === 'recent') {
      setFilters({ sortBy: 'createdAt', sortOrder: 'desc' })
    } else if (value === 'salary-high') {
      setFilters({ sortBy: 'salaryMax', sortOrder: 'desc' })
    } else if (value === 'salary-low') {
      setFilters({ sortBy: 'salaryMin', sortOrder: 'asc' })
    }

    fetchJobs(false)
  }

  const filteredByTech = useMemo(() => {
    if (selectedTechs.length === 0) return jobs
    return jobs.filter((job) => selectedTechs.some((tech) => job.techStack.includes(tech)))
  }, [jobs, selectedTechs])

  const visibleJobs = filteredByTech
  const hasMoreJobs = pagination.page < pagination.totalPages

  // controla o "glitch": só remove skeleton do load more quando a lista crescer
  useEffect(() => {
    if (!loadingMoreUI) {
      setLastVisibleCount(visibleJobs.length)
      return
    }
    if (visibleJobs.length > lastVisibleCount) {
      setLoadingMoreUI(false)
      setLastVisibleCount(visibleJobs.length)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleJobs.length])

  const handleLoadMore = () => {
    if (loadMoreLocked || loadingMoreUI) return

    setLastVisibleCount(visibleJobs.length)
    setLoadingMoreUI(true)
    setLoadMoreClicks((c) => c + 1)
    loadMore()

    // safety: se por algum motivo não chegar nada, tira o skeleton após um teto
    window.setTimeout(() => setLoadingMoreUI(false), 4500)
  }

  const JobCard = ({ job, index }: { job: any; index: number }) => {
    const isPremium = index < 3

    return (
      <div
        className={`group relative overflow-hidden rounded-2xl border transition-all hover:shadow-xl ${
          isPremium
            ? 'border-emerald-500/30 bg-gradient-to-r from-emerald-500/5 to-emerald-400/5 shadow-lg shadow-emerald-500/10'
            : 'border-border/60 bg-card/50 backdrop-blur-sm'
        }`}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(52,211,153,0.15),transparent_50%)]" />

        {/* MOBILE friendly */}
        <div className="relative flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex items-start gap-3 sm:items-center sm:gap-4">
            <div className="border-border/50 bg-background flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border shadow-sm sm:h-14 sm:w-14">
              {job.company.logoUrl ? (
                <img src={job.company.logoUrl} alt={job.company.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-foreground text-base font-bold sm:text-lg">
                  {getCompanyInitials(job.company.name)}
                </span>
              )}
            </div>

            {/* IMPORTANT: min-w-0 evita overflow horizontal */}
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex min-w-0 items-start gap-2">
                <h3 className="min-w-0 flex-1 truncate font-bold text-foreground group-hover:text-primary">
                  {job.title}
                </h3>

                {isPremium && (
                  <Badge className="hidden shrink-0 gap-1 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white shadow-md shadow-emerald-500/30 sm:inline-flex">
                    <Crown className="h-3 w-3" />
                    Premium
                  </Badge>
                )}
              </div>

              <p className="text-muted-foreground mb-2 truncate text-sm font-medium">{job.company.name}</p>

              {/* IMPORTANT: min-w-0 + break/ellipsis */}
              <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
                <Badge variant="outline" className="border-border bg-accent/50">
                  {EMPLOYMENT_LABELS[job.employmentType as EmploymentType]}
                </Badge>

                <Badge variant="outline" className="border-border bg-accent/50">
                  {formatSalary(job.salaryMin, job.salaryMax)}
                </Badge>

                <span className="flex min-w-0 items-center gap-1">
                  <span className="text-base">{getCountryFlag(job.country)}</span>
                  <MapPin className="h-3 w-3" />
                  <span className="min-w-0 truncate">{job.country ?? 'Worldwide'}</span>
                </span>

                <span className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  {WORK_MODEL_LABELS[job.workModel as WorkModel]}
                </span>

                {isPremium && (
                  <Badge className="shrink-0 gap-1 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white shadow-md shadow-emerald-500/30 sm:hidden">
                    <Crown className="h-3 w-3" />
                    Premium
                  </Badge>
                )}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                {job.techStack.slice(0, 4).map((tech: any) => (
                  <Badge
                    key={tech}
                    variant="outline"
                    className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 sm:ml-auto sm:flex-col sm:items-end sm:justify-center sm:gap-2">
            <p className="text-muted-foreground shrink-0 text-xs">
              {new Date(job.publishedAt).toLocaleDateString('pt-BR')}
            </p>

            <Button
              size="sm"
              variant="outline"
              onClick={goJoin}
              className="shrink-0 border-primary/30 text-primary hover:bg-primary/10 gap-1"
            >
              Ver Vaga
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const StatsBanner = () => (
    <div className="mb-3 overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-400 to-emerald-500 p-4 shadow-xl shadow-emerald-500/20">
      <div className="flex flex-col gap-3 text-white sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <Sparkles className="h-6 w-6 shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold">
              ⚡ {displayNewJobsThisWeek.toLocaleString('pt-BR')} vagas internacionais adicionadas esta semana
            </p>
            <p className="text-sm text-white/90">
              Você está vendo{' '}
              {displayTotalJobs ? ((visibleJobs.length / displayTotalJobs) * 100).toFixed(1) : '0.0'}% das vagas
              disponíveis
            </p>
          </div>
        </div>

        <Button
          size="lg"
          onClick={goJoin}
          className="w-full gap-2 bg-gradient-to-r from-emerald-400 to-emerald-500 font-semibold text-white shadow-lg shadow-emerald-500/30 hover:from-emerald-500 hover:to-emerald-600 sm:w-auto"
        >
          <span className="flex items-center space-x-1.5">
            {['🇺🇸', '🇬🇧', '🇩🇪', '🇨🇦', '🇫🇷', '🇧🇷'].map((flag) => (
              <span
                key={flag}
                className="grid h-6 w-6 place-items-center rounded-full bg-white/15 text-base shadow-sm ring-2 ring-white/25"
                aria-hidden="true"
              >
                {flag}
              </span>
            ))}
          </span>
          <span className="truncate">+1000 Vagas Internacionais</span>
        </Button>
      </div>
    </div>
  )

  const PromoBanner = () => (
    <div className="my-3 overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-xl dark:from-emerald-950/20 dark:to-teal-950/20">
      <div className="grid grid-cols-3 gap-3 bg-gradient-to-r from-emerald-700 to-teal-700 p-4 text-white">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Zap className="h-5 w-5" />
            <span className="text-xl font-bold sm:text-2xl">{displayTotalJobs.toLocaleString('pt-BR')}</span>
          </div>
          <p className="text-[11px] text-white/80 sm:text-xs">vagas aguardando</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <TrendingUp className="h-5 w-5" />
            <span className="text-xl font-bold sm:text-2xl">{displayNewJobsThisWeek.toLocaleString('pt-BR')}</span>
          </div>
          <p className="text-[11px] text-white/80 sm:text-xs">esta semana</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl sm:text-2xl">●</span>
            <span className="text-xl font-bold sm:text-2xl">{displayJobsPostedToday.toLocaleString('pt-BR')}</span>
          </div>
          <p className="text-[11px] text-white/80 sm:text-xs">hoje</p>
        </div>
      </div>

      <div className="p-6 text-center sm:p-8">
        <h3 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">
          Você está vendo{' '}
          <span className="text-emerald-600 dark:text-emerald-400">
            {displayTotalJobs ? ((visibleJobs.length / displayTotalJobs) * 100).toFixed(1) : '0.0'}%
          </span>{' '}
          das vagas disponíveis
        </h3>

        <p className="text-muted-foreground mb-4 text-sm">Desbloqueie acesso total para se candidatar antes de todos</p>

        <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
            <span className="text-base leading-none">🌍</span>
            Remoto global
          </span>

          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
            <span className="text-base leading-none">💸</span>
            Vagas pagando <strong>+R$ 20.000/mês</strong>
          </span>

          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
            <span className="text-base leading-none">⚡</span>
            Atualizações diárias
          </span>
        </div>

        <div className="mx-auto mb-6 max-w-md space-y-2 text-left">
          <div className="flex items-start gap-2 text-sm">
            <span className="mt-0.5 text-emerald-600 dark:text-emerald-400">✓</span>
            <span className="text-foreground">
              Acesse todas as <strong>{displayTotalJobs.toLocaleString('pt-BR')}</strong> vagas remotas selecionadas
            </span>
          </div>

          <div className="flex items-start gap-2 text-sm">
            <span className="mt-0.5 text-emerald-600 dark:text-emerald-400">✓</span>
            <span className="text-foreground">
              Vagas de <strong>+15 países</strong>, tanto na Europa quanto na América
            </span>
          </div>

          <div className="flex items-start gap-2 text-sm">
            <span className="mt-0.5 text-emerald-600 dark:text-emerald-400">✓</span>
            <span className="text-foreground">
              <strong>Alertas personalizados</strong> para sua vaga dos sonhos
            </span>
          </div>

          <div className="flex items-start gap-2 text-sm">
            <span className="mt-0.5 text-emerald-600 dark:text-emerald-400">✓</span>
            <span className="text-foreground">
              🇺🇸 <strong>EUA</strong> é o país com mais contratações
            </span>
          </div>
        </div>

        <Button
          size="lg"
          onClick={goJoin}
          className="group relative w-full gap-2 overflow-hidden bg-gradient-to-r from-emerald-400 to-emerald-500 px-8 py-6 text-base font-semibold text-white shadow-2xl shadow-emerald-500/30 hover:from-emerald-500 hover:to-emerald-600 sm:w-auto sm:text-lg"
        >
          <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="absolute -left-10 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-white/25 blur-2xl" />
            <span className="absolute right-0 top-0 h-24 w-24 rounded-full bg-emerald-200/20 blur-2xl" />
          </span>

          <Lock className="relative h-5 w-5" />
          <span className="relative truncate">Desbloqueie todas as {displayTotalJobs.toLocaleString('pt-BR')} Vagas →</span>
        </Button>

        <p className="text-muted-foreground mt-4 text-sm">
          ⭐⭐⭐⭐⭐ Amado por <strong>100,000+</strong> profissionais remotos
        </p>

        <p className="mt-2 text-[11px] text-muted-foreground">
          *Faixas e disponibilidade variam por empresa, país e senioridade.
        </p>
      </div>
    </div>
  )

  const renderJobsList = () => {
    const elements: JSX.Element[] = []

    visibleJobs.forEach((job, index) => {
      elements.push(<JobCard key={job.id} job={job} index={index} />)

      const position = index + 1
      if (position % 7 === 0) {
        const groupIndex = Math.floor(position / 7) - 1
        if (groupIndex % 2 === 0) {
          elements.push(<PromoBanner key={`banner-after-${position}`} />)
        } else {
          elements.push(<StatsBanner key={`banner-after-${position}`} />)
        }
      }
    })

    return elements
  }

  const FiltersContent = () => (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-sm">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Localidade da vaga</h3>
        <div className="space-y-2.5">
          {['USA', 'GERMANY', 'UK', 'CANADA', 'FRANCE', 'POLAND'].map((country) => (
            <div key={country} className="flex items-center gap-2">
              <Checkbox
                id={`m-${country}`}
                checked={selectedCountries.includes(country)}
                onCheckedChange={() => toggleCountry(country)}
              />
              <Label htmlFor={`m-${country}`} className="text-muted-foreground text-sm font-normal">
                {country}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-sm">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Nível</h3>
        <div className="space-y-2.5">
          {SENIORITY_OPTIONS.map(({ label, value }) => (
            <div key={value} className="flex items-center gap-2">
              <Checkbox
                id={`m-${value}`}
                checked={selectedSeniority.includes(value)}
                onCheckedChange={() => toggleSeniority(value)}
              />
              <Label htmlFor={`m-${value}`} className="text-muted-foreground text-sm font-normal">
                {label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-sm">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Tipo de Contrato</h3>
        <div className="space-y-2.5">
          {(Object.keys(EMPLOYMENT_LABELS) as EmploymentType[]).map((type) => (
            <div key={type} className="flex items-center gap-2">
              <Checkbox
                id={`m-${type}`}
                checked={selectedEmploymentTypes.includes(type)}
                onCheckedChange={() => toggleEmploymentType(type)}
              />
              <Label htmlFor={`m-${type}`} className="text-muted-foreground text-sm font-normal">
                {EMPLOYMENT_LABELS[type]}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-sm">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Modelo de Trabalho</h3>
        <div className="space-y-2.5">
          {(Object.keys(WORK_MODEL_LABELS) as WorkModel[]).map((model) => (
            <div key={model} className="flex items-center gap-2">
              <Checkbox
                id={`m-${model}`}
                checked={selectedWorkModels.includes(model)}
                onCheckedChange={() => toggleWorkModel(model)}
              />
              <Label htmlFor={`m-${model}`} className="text-muted-foreground text-sm font-normal">
                {WORK_MODEL_LABELS[model]}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-sm">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Ordenar</h3>
        <div className="grid grid-cols-3 gap-2">
          <Button
            type="button"
            size="sm"
            variant={sortBy === 'recent' ? 'default' : 'outline'}
            onClick={() => handleSortChange('recent')}
            className="rounded-xl"
          >
            Recentes
          </Button>
          <Button
            type="button"
            size="sm"
            variant={sortBy === 'salary-high' ? 'default' : 'outline'}
            onClick={() => handleSortChange('salary-high')}
            className="rounded-xl"
          >
            Salário ↑
          </Button>
          <Button
            type="button"
            size="sm"
            variant={sortBy === 'salary-low' ? 'default' : 'outline'}
            onClick={() => handleSortChange('salary-low')}
            className="rounded-xl"
          >
            Salário ↓
          </Button>
        </div>
      </div>
    </div>
  )

  const showInitialLoading = loading && visibleJobs.length === 0

  return (
    // IMPORTANT: overflow-x-hidden + w-full evita “quebrar pro lado” no mobile
    <div className="min-h-screen w-full overflow-x-hidden bg-background">
      {/* Header */}
      <header className="border-border/60 bg-card/50 border-b backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          {/* IMPORTANT: min-w-0 para não estourar */}
          <div className="min-w-0">
            <GoDevLogo collapsed={false} />
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2 lg:hidden"
              onClick={() => setFiltersOpen(true)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
            </Button>

            <Button
              size="lg"
              onClick={goJoin}
              className="gap-2 bg-gradient-to-r from-emerald-400 to-emerald-500 font-semibold text-white shadow-lg shadow-emerald-500/30 hover:from-emerald-500 hover:to-emerald-600"
            >
              👀 Ver todas as vagas
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile filters drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setFiltersOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm overflow-y-auto border-l border-border bg-background p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-foreground">Filtros</div>
                <div className="text-xs text-muted-foreground">Ajuste e volte pra lista</div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setFiltersOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <FiltersContent />

            <div className="sticky bottom-0 mt-5 bg-background pt-3">
              <Button
                className="w-full bg-gradient-to-r from-emerald-400 to-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-500 hover:to-emerald-600"
                onClick={() => setFiltersOpen(false)}
              >
                Ver resultados
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
        <div className="text-center">
          <h1 className="mb-3 text-3xl font-bold text-foreground sm:mb-4 sm:text-4xl md:text-5xl">
            Candidate-se às melhores <br />
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              Vagas Internacionais{' '}
            </span>
            do mercado
          </h1>

          <p className="text-muted-foreground mx-auto mb-6 max-w-2xl text-base sm:mb-8 sm:text-lg">
            Navegue por {displayTotalJobs.toLocaleString('pt-BR')}+ vagas internacionais de empresas verificadas e
            consiga mais entrevistas.
          </p>

          <div className="mx-auto mb-2 max-w-3xl">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform" />
              <Input
                type="text"
                placeholder="Buscar por cargo, empresa ou tecnologia..."
                className="border-border bg-card h-12 rounded-2xl border-2 pl-12 text-base shadow-lg focus:border-primary focus:ring-primary/20 sm:h-14"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>

          {/* Mobile quick sort chips */}
          <div className="mt-3 flex flex-wrap justify-center gap-2 lg:hidden">
            <Button
              type="button"
              size="sm"
              variant={sortBy === 'recent' ? 'default' : 'outline'}
              onClick={() => handleSortChange('recent')}
              className="rounded-full"
            >
              Recentes
            </Button>
            <Button
              type="button"
              size="sm"
              variant={sortBy === 'salary-high' ? 'default' : 'outline'}
              onClick={() => handleSortChange('salary-high')}
              className="rounded-full"
            >
              Salário ↑
            </Button>
            <Button
              type="button"
              size="sm"
              variant={sortBy === 'salary-low' ? 'default' : 'outline'}
              onClick={() => handleSortChange('salary-low')}
              className="rounded-full"
            >
              Salário ↓
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 pb-16">
        <div className="flex gap-8">
          {/* Sidebar (desktop) */}
          <aside className="hidden w-80 flex-shrink-0 lg:block">
            <div className="sticky top-8 space-y-6">
              <div className="border-border/50 bg-card/60 rounded-2xl border p-6 shadow-sm backdrop-blur-sm">
                <h3 className="mb-4 text-sm font-semibold text-foreground">Localidade da vaga</h3>
                <div className="space-y-2.5">
                  {['USA', 'GERMANY', 'UK', 'CANADA', 'FRANCE', 'POLAND'].map((country) => (
                    <div key={country} className="flex items-center gap-2">
                      <Checkbox
                        id={country}
                        checked={selectedCountries.includes(country)}
                        onCheckedChange={() => toggleCountry(country)}
                      />
                      <Label htmlFor={country} className="text-muted-foreground text-sm font-normal">
                        {country}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-border/50 bg-card/60 rounded-2xl border p-6 shadow-sm backdrop-blur-sm">
                <h3 className="mb-4 text-sm font-semibold text-foreground">Nível</h3>
                <div className="space-y-2.5">
                  {SENIORITY_OPTIONS.map(({ label, value }) => (
                    <div key={value} className="flex items-center gap-2">
                      <Checkbox
                        id={value}
                        checked={selectedSeniority.includes(value)}
                        onCheckedChange={() => toggleSeniority(value)}
                      />
                      <Label htmlFor={value} className="text-muted-foreground text-sm font-normal">
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-border/50 bg-card/60 rounded-2xl border p-6 shadow-sm backdrop-blur-sm">
                <h3 className="mb-4 text-sm font-semibold text-foreground">Tipo de Contrato</h3>
                <div className="space-y-2.5">
                  {(Object.keys(EMPLOYMENT_LABELS) as EmploymentType[]).map((type) => (
                    <div key={type} className="flex items-center gap-2">
                      <Checkbox
                        id={type}
                        checked={selectedEmploymentTypes.includes(type)}
                        onCheckedChange={() => toggleEmploymentType(type)}
                      />
                      <Label htmlFor={type} className="text-muted-foreground text-sm font-normal">
                        {EMPLOYMENT_LABELS[type]}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-border/50 bg-card/60 rounded-2xl border p-6 shadow-sm backdrop-blur-sm">
                <h3 className="mb-4 text-sm font-semibold text-foreground">Modelo de Trabalho</h3>
                <div className="space-y-2.5">
                  {(Object.keys(WORK_MODEL_LABELS) as WorkModel[]).map((model) => (
                    <div key={model} className="flex items-center gap-2">
                      <Checkbox
                        id={model}
                        checked={selectedWorkModels.includes(model)}
                        onCheckedChange={() => toggleWorkModel(model)}
                      />
                      <Label htmlFor={model} className="text-muted-foreground text-sm font-normal">
                        {WORK_MODEL_LABELS[model]}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0">
            {/* Top bar (com skeleton) */}
            {showInitialLoading ? (
              <TopBarSkeleton />
            ) : (
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-muted-foreground text-sm">
                    <span className="font-bold text-primary">{displayTotalJobs.toLocaleString('pt-BR')}</span>{' '}
                    vagas internacionais encontradas
                  </p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    ● {displayNewJobsThisWeek.toLocaleString('pt-BR')} adicionadas esta semana
                  </p>
                </div>

                {/* Desktop sort */}
                <div className="hidden items-center gap-2 lg:flex">
                  <span className="text-xs text-muted-foreground">Ordenar:</span>
                  <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/60 p-1">
                    <Button
                      type="button"
                      size="sm"
                      variant={sortBy === 'recent' ? 'default' : 'ghost'}
                      onClick={() => handleSortChange('recent')}
                      className="h-8 rounded-lg px-3"
                    >
                      Recentes
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={sortBy === 'salary-high' ? 'default' : 'ghost'}
                      onClick={() => handleSortChange('salary-high')}
                      className="h-8 rounded-lg px-3"
                    >
                      Salário ↑
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={sortBy === 'salary-low' ? 'default' : 'ghost'}
                      onClick={() => handleSortChange('salary-low')}
                      className="h-8 rounded-lg px-3"
                    >
                      Salário ↓
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Jobs */}
            <div className="space-y-3">
              {showInitialLoading ? (
                <>
                  <div className="mb-3 overflow-hidden rounded-2xl border border-border/60 bg-card/50 p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <SkeletonBlock className="h-10 w-10 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <SkeletonBlock className="h-4 w-3/4" />
                        <SkeletonBlock className="h-3 w-1/2" />
                      </div>
                      <SkeletonBlock className="h-10 w-36 rounded-xl" />
                    </div>
                  </div>
                  <ListSkeleton rows={9} />
                </>
              ) : error ? (
                <div className="rounded-2xl border border-red-500/50 bg-red-500/10 p-12 text-center shadow-sm backdrop-blur-sm">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              ) : filteredByTech.length === 0 ? (
                <div className="border-border/50 bg-card/60 rounded-2xl border p-12 text-center shadow-sm backdrop-blur-sm">
                  <p className="text-muted-foreground">Nenhuma vaga encontrada</p>
                </div>
              ) : (
                <>
                  <StatsBanner />
                  {renderJobsList()}

                  {/* Skeleton do load more: só sai quando a lista crescer */}
                  {loadingMoreUI && <ListSkeleton rows={4} />}

                  {hasMoreJobs && (
                    <div className="mt-8 text-center">
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={handleLoadMore}
                        disabled={loadMoreLocked || loadingMoreUI}
                        className="border-primary/30 text-primary hover:bg-primary/10 gap-2 px-8 disabled:opacity-60"
                      >
                        {loadMoreLocked
                          ? 'Limite atingido — desbloqueie para ver tudo'
                          : loadingMoreUI
                            ? 'Carregando...'
                            : 'Carregar Mais Vagas'}
                        <ExternalLink className="h-4 w-4" />
                      </Button>

                      {!loadMoreLocked ? (
                        <p className="text-muted-foreground mt-2 text-sm">
                          Mostrando {visibleJobs.length} de {filteredByTech.length} vagas
                        </p>
                      ) : (
                        <div className="mt-3">
                          <p className="text-muted-foreground text-sm">
                            Você chegou no limite da versão gratuita. Quer ver as vagas completas (e se candidatar antes
                            de todo mundo)?
                          </p>
                          <Button
                            size="lg"
                            onClick={goJoin}
                            className="mt-3 gap-2 bg-gradient-to-r from-emerald-400 to-emerald-500 px-8 py-6 text-lg font-semibold text-white shadow-2xl shadow-emerald-500/30 hover:from-emerald-500 hover:to-emerald-600"
                          >
                            <Lock className="h-5 w-5" />
                            🔓 Desbloquear agora →
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Sticky mobile bottom CTA */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 p-3 lg:hidden">
        <div className="pointer-events-auto mx-auto max-w-3xl rounded-2xl border border-emerald-500/25 bg-background/80 p-3 shadow-xl backdrop-blur">
          <Button
            onClick={goJoin}
            className="w-full gap-2 bg-gradient-to-r from-emerald-400 to-emerald-500 font-semibold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-500 hover:to-emerald-600"
          >
            🔓 Desbloquear e ver tudo
          </Button>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-20 lg:hidden" />
    </div>
  )
}
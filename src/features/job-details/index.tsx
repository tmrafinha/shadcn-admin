// src/features/jobs/JobDetails.tsx
import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  Briefcase,
  Building2,
  CheckCircle2,
  ExternalLink,
  Heart,
  Share2,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
  Code2,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from '@tanstack/react-router'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ApplyNow } from '../errors/apply-now'
import { QuickApplyDialog } from '@/components/jobs/quick-apply-dialog'

import type {
  Job,
  EmploymentType,
  WorkModel,
  CompanySize,
} from '@/features/jobs/jobs.types'
import { fetchJobById, fetchJobs } from '@/services/jobs.service'

interface JobDetailsViewModel {
  id: string
  title: string
  company: string
  logoUrl?: string | null
  logoInitial: string
  location: string
  type: string
  salary: string
  remote: string
  posted: string
  tags: string[]
  featured: boolean
  description: string
  responsibilities: string[]
  requirements: string[]
  niceToHave: string[]
  benefits: string[]
  companyDescription: string
  companySize: string
  companyIndustry: string
  companyWebsite: string
}

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

const COMPANY_SIZE_LABELS: Record<CompanySize, string> = {
  SMALL: '1–50 colaboradores',
  MEDIUM: '51–250 colaboradores',
  LARGE: '251–1000 colaboradores',
  ENTERPRISE: '1000+ colaboradores',
}

function formatSalary(min?: number | null, max?: number | null) {
  if (min == null && max == null) return 'A combinar'

  const fmt = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  if (min != null && max != null) return `${fmt(min)} - ${fmt(max)}`
  if (min != null) return `A partir de ${fmt(min)}`
  return `Até ${fmt(max!)}`
}

function formatPublishedAt(dateStr: string) {
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return 'Data não informada'

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays <= 0) return 'Hoje'
  if (diffDays === 1) return 'Ontem'
  if (diffDays < 7) return `${diffDays} dias atrás`

  return date.toLocaleDateString('pt-BR')
}

function transformJob(job: Job): JobDetailsViewModel {
  const company = job.company

  return {
    id: job.id,
    title: job.title,
    company: company.name,
    logoUrl: company.logoUrl ?? null,
    logoInitial: company.name.charAt(0).toUpperCase(),
    location: job.location ?? 'Não informado',
    type: EMPLOYMENT_LABELS[job.employmentType],
    salary: formatSalary(job.salaryMin ?? undefined, job.salaryMax ?? undefined),
    remote: WORK_MODEL_LABELS[job.workModel],
    posted: formatPublishedAt(job.publishedAt),
    tags: job.techStack,
    featured: job.applicationsCount > 0 || job.viewsCount > 50,
    description: job.description,
    responsibilities: job.responsibilities,
    requirements: job.requirementsMust,
    niceToHave: job.requirementsNice,
    benefits: job.benefits,
    companyDescription:
      company.description ??
      'Descrição da empresa não informada. Em breve atualizaremos essa seção.',
    companySize: company.size
      ? COMPANY_SIZE_LABELS[company.size]
      : 'Tamanho não informado',
    companyIndustry: company.industry ?? 'Indústria não informada',
    companyWebsite: company.website ?? '',
  }
}

export function JobDetails() {
  const { jobId } = useParams({ from: '/_authenticated/job-details/$jobId' })
  const [hasApplied, setHasApplied] = useState(false)

  async function handleShare() {
    try {
      const url = window.location.href
      await navigator.clipboard.writeText(url)
      toast.success('Link copiado! Agora é só colar no WhatsApp 😉')
    } catch (err) {
      // fallback simples
      try {
        const ok = document.execCommand?.('copy')
        if (!ok) throw new Error('copy failed')
        toast.success('Link copiado!')
      } catch {
        toast.error('Não foi possível copiar o link. Copie manualmente pela barra do navegador.')
      }
    }
  }

  // Vaga principal
  const {
    data: job,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => fetchJobById(jobId),
  })

  // Se já se candidatou (considera tanto o que vem da API quanto o clique atual)
  const isApplied =
    hasApplied ||
    !!(job?.appliedByCurrentUser ?? (job as any)?.appliedByCurrentUser)

  const jobData = useMemo(
    () => (job ? transformJob(job) : null),
    [job],
  )

  // Vagas similares da base (mesma empresa, excluindo a vaga atual)
  const { data: similarJobs } = useQuery({
    queryKey: ['similar-jobs', job?.companyId, jobId],
    enabled: !!job?.companyId,
    queryFn: async () => {
      if (!job) throw new Error('Job not loaded')
      const { items } = await fetchJobs({
        page: 1,
        limit: 4,
        companyId: job.companyId,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      })

      return items.filter((j) => j.id !== job.id)
    },
  })

  return (
    <>
      <Header>
        <Search />
        <div className="ms-auto flex items-center gap-4">
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="space-y-6 pb-20">
          {/* Back Button */}
          <Button
            asChild
            variant="ghost"
          >
            <Link to="/jobs">
              <ArrowLeft className="h-4 w-4" />
              Voltar para vagas
            </Link>
          </Button>

          {/* Loading / Error / Not found states */}
          {isLoading && (
            <Card className="bg-card/50 p-8 text-center">
              <p>Carregando vaga...</p>
            </Card>
          )}

          {isError && !isLoading && (
            <Card className="bg-card/50 p-8 text-center">
              <p className="text-destructive">
                Não foi possível carregar os dados da vaga.
              </p>
            </Card>
          )}

          {!isLoading && !isError && !jobData && (
            <Card className="bg-card/50 p-8 text-center">
              <p>Vaga não encontrada.</p>
            </Card>
          )}

          {jobData && (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Content */}
              <div className="space-y-6 lg:col-span-2">
                {/* Job Header */}
                <Card className="bg-card/50 overflow-hidden border-primary/30 backdrop-blur">
                  <CardContent className="space-y-6 p-6 md:p-8">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        {jobData.logoUrl ? (
                          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-border/50 bg-background/80 md:h-16 md:w-16">
                            <img
                              src={jobData.logoUrl}
                              alt={jobData.company}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border/50 bg-background/80 text-2xl font-bold md:h-16 md:w-16 md:text-3xl">
                            {jobData.logoInitial}
                          </div>
                        )}
                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="flex flex-wrap items-start gap-2">
                            <h1 className="text-2xl leading-tight font-bold md:text-3xl">
                              {jobData.title}
                            </h1>
                            {jobData.featured && (
                              <Badge className="shrink-0 border-0 bg-primary/10 text-primary-dark dark:text-primary hover:bg-primary/20">
                                <Sparkles className="mr-1 h-3 w-3" />
                                Destaque
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-lg font-semibold md:text-xl">
                            {jobData.company}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant="outline"
                          className="border-border/50 bg-background/50 px-3 py-1.5"
                        >
                          📍 {jobData.location}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-border/50 bg-background/50 px-3 py-1.5"
                        >
                          💼 {jobData.remote}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-border/50 bg-background/50 px-3 py-1.5"
                        >
                          ⏰ {jobData.posted}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-border/50 bg-background/50 px-3 py-1.5"
                        >
                          {jobData.type}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-linear-to-r from-primary/10 to-primary/5 p-4 md:p-5">
                        <div className="space-y-1">
                          <div className="text-muted-foreground text-sm">
                            Faixa salarial
                          </div>
                          <div className="text-2xl font-bold text-primary-dark dark:text-primary md:text-3xl">
                            {jobData.salary}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            💰 por mês
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {/* Exemplo de "salvar vaga" se quiser usar depois */}
                          {/* <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setIsSaved(!isSaved)}
                            className="h-10 w-10 hover:border-primary/50"
                          >
                            <Bookmark
                              className={`h-5 w-5 ${
                                isSaved ? 'fill-primary text-primary' : ''
                              }`}
                            />
                          </Button> */}
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 hover:border-primary/50"
                            onClick={handleShare}
                          >
                            <Share2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <Code2 className="h-4 w-4 text-primary-dark dark:text-primary" />
                          <span>Stack Tecnológico</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {jobData.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="border-0 bg-primary/10 px-3 py-1 text-primary-dark dark:text-primary hover:bg-primary/20"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* CTA principal (mobile) */}
                    {isApplied ? (
                      <Button
                        size="lg"
                        className="h-12 w-full gap-2 lg:hidden"
                        disabled
                        variant="outline"
                      >
                        <CheckCircle2 className="h-5 w-5" />
                        Já candidatado
                      </Button>
                    ) : (
                      <QuickApplyDialog
                        jobId={jobData.id}
                        jobTitle={jobData.title}
                        onApplied={() => setHasApplied(true)}
                      >
                        <Button
                          size="lg"
                          className="h-12 w-full gap-2 lg:hidden"
                        >
                          <Sparkles className="h-5 w-5" />
                          Candidatar-se Agora
                        </Button>
                      </QuickApplyDialog>
                    )}
                  </CardContent>
                </Card>

                {/* About the Role */}
                <Card className="bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Briefcase className="h-5 w-5 text-primary-dark dark:text-primary" />
                      </div>
                      Sobre a Vaga
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {jobData.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Responsibilities */}
                <Card className="bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Target className="h-5 w-5 text-primary-dark dark:text-primary" />
                      </div>
                      Responsabilidades
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {jobData.responsibilities.map((item, idx) => (
                        <li
                          key={idx}
                          className="hover:bg-background/50 flex items-start gap-3 rounded-lg p-3 transition-colors"
                        >
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-dark dark:text-primary" />
                          <span className="text-muted-foreground flex-1">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Requirements */}
                <Card className="bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Zap className="h-5 w-5 text-primary-dark dark:text-primary" />
                      </div>
                      Requisitos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="mb-4 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary-dark dark:text-primary" />
                        <h4 className="font-semibold">Obrigatórios</h4>
                      </div>
                      <ul className="space-y-3">
                        {jobData.requirements.map((item, idx) => (
                          <li
                            key={idx}
                            className="hover:bg-background/50 flex items-start gap-3 rounded-lg p-3 transition-colors"
                          >
                            <div className="shrink-0 rounded-md bg-primary/10 p-1">
                              <CheckCircle2 className="h-4 w-4 text-primary-dark dark:text-primary" />
                            </div>
                            <span className="text-muted-foreground flex-1">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Separator />
                    <div>
                      <div className="mb-4 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary-dark dark:text-primary" />
                        <h4 className="font-semibold">Diferenciais</h4>
                      </div>
                      <ul className="space-y-3">
                        {jobData.niceToHave.map((item, idx) => (
                          <li
                            key={idx}
                            className="hover:bg-background/50 flex items-start gap-3 rounded-lg p-3 transition-colors"
                          >
                            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-primary/50">
                              <div className="h-2 w-2 rounded-full bg-primary/50" />
                            </div>
                            <span className="text-muted-foreground flex-1">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Benefits */}
                <Card className="bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Heart className="h-5 w-5 text-primary-dark dark:text-primary" />
                      </div>
                      Benefícios
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {jobData.benefits.map((benefit, idx) => (
                        <div
                          key={idx}
                          className="bg-background/50 border-border/50 flex items-center gap-3 rounded-lg border p-3 transition-colors hover:border-primary/30"
                        >
                          <div className="text-xl">✨</div>
                          <span className="flex-1 text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* About Company */}
                <Card className="bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Building2 className="h-5 w-5 text-primary-dark dark:text-primary" />
                      </div>
                      Sobre a {jobData.company}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {jobData.companyDescription}
                    </p>
                    <div className="bg-background/50 border-border/50 grid grid-cols-2 gap-4 rounded-lg border p-4">
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-xs">
                          👥 Tamanho
                        </p>
                        <p className="text-sm font-semibold">
                          {jobData.companySize}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-xs">
                          🏢 Indústria
                        </p>
                        <p className="text-sm font-semibold">
                          {jobData.companyIndustry}
                        </p>
                      </div>
                    </div>
                    {jobData.companyWebsite && (
                      <Button
                        variant="outline"
                        className="w-full gap-2 hover:border-primary/50"
                        asChild
                      >
                        <a
                          href={
                            jobData.companyWebsite.startsWith('http')
                              ? jobData.companyWebsite
                              : `https://${jobData.companyWebsite}`
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Visitar site da empresa
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6 lg:block">
                <div className="space-y-6">
                  <ApplyNow
                    jobId={jobData.id}
                    jobTitle={jobData.title}
                    applicationsCount={job?.applicationsCount}
                    viewsCount={job?.viewsCount}
                    publishedLabel={jobData.posted}
                    isApplied={isApplied}
                    onApplied={() => setHasApplied(true)}
                  />

                  {/* Similar Jobs - agora vindo da API */}
                  {similarJobs && similarJobs.length > 0 && (
                    <Card className="bg-card/50 backdrop-blur">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between gap-2 text-lg">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-primary-dark dark:text-primary" />
                            <span>Vagas Similares</span>
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">
                            {similarJobs.length} vaga
                            {similarJobs.length > 1 && 's'}
                          </span>
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="flex flex-col gap-3">
                          {similarJobs.map((similar) => (
                            <Link
                              key={similar.id}
                              to="/job-details/$jobId"
                              params={{ jobId: similar.id }}
                              className="group block"
                            >
                              <div className="rounded-lg border border-border/60 bg-background/40 p-3 transition-all hover:-translate-y-px hover:border-primary/60 hover:bg-background/80">
                                <div className="flex items-start gap-3">
                                  <div className="bg-background/80 border-border/60 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border text-xs font-bold">
                                    {similar.company.logoUrl ? (
                                      <img
                                        src={similar.company.logoUrl}
                                        alt={similar.company.name}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      similar.company.name
                                        .slice(0, 2)
                                        .toUpperCase()
                                    )}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <h4 className="truncate text-sm font-semibold transition-colors group-hover:text-primary-dark dark:group-hover:text-primary">
                                      {similar.title}
                                    </h4>
                                    <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">
                                      {similar.company.name}
                                    </p>
                                  </div>
                                </div>

                                <div className="mt-3 flex items-center justify-between gap-2 text-xs">
                                  <div className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      📍 {similar.location ?? 'Não informado'}
                                    </span>
                                    <span>
                                      {WORK_MODEL_LABELS[similar.workModel]}
                                    </span>
                                  </div>

                                  <span className="text-right text-sm font-semibold text-primary-dark dark:text-primary">
                                    {formatSalary(
                                      similar.salaryMin ?? undefined,
                                      similar.salaryMax ?? undefined,
                                    )}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>

                        <Button
                          variant="outline"
                          className="w-full gap-2 hover:border-primary/60"
                          asChild
                        >
                          <Link to="/jobs">
                            <ExternalLink className="h-4 w-4" />
                            Ver mais vagas
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Share Card */}
                  <Card className="bg-card/50 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Share2 className="h-4 w-4 text-primary-dark dark:text-primary" />
                        Compartilhar
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-muted-foreground text-sm">
                        Conhece alguém perfeito para esta vaga?
                      </p>
                      <Button
                        variant="outline"
                        className="w-full gap-2 hover:border-primary/50"
                        onClick={handleShare}
                      >
                        <Share2 className="h-4 w-4" />
                        Compartilhar vaga
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </Main>
    </>
  )
}
import { useEffect, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ListChecks, MessageCircle, Clock, Target } from 'lucide-react'

import { Overview } from './components/overview'
import { useDashboardApplicationsStore } from '@/stores/dashboard-store'
import type { WorkModel } from '@/features/jobs/jobs.types'
import type { ApplicationStatusApi } from '@/features/job-application/job-application.types'

import { PremiumAccessBanner } from '@/components/premium-access-banner'

// ===== Mapeamentos auxiliares =====

const MONTH_LABELS = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
]

const WORK_MODEL_LABELS: Record<WorkModel, string> = {
  REMOTE: 'Remoto',
  HYBRID: 'Híbrido',
  ON_SITE: 'Presencial',
}

type UiStatus =
  | 'candidatado'
  | 'em_analise'
  | 'entrevista'
  | 'oferta'
  | 'reprovado'
  | 'cancelado'

const statusLabel: Record<UiStatus, string> = {
  candidatado: 'Candidatado',
  em_analise: 'Em análise',
  entrevista: 'Entrevista',
  oferta: 'Oferta',
  reprovado: 'Reprovado',
  cancelado: 'Cancelado',
}

const statusColor: Record<UiStatus, string> = {
  candidatado: 'bg-primary/70',
  em_analise: 'bg-accent',
  entrevista: 'bg-primary',
  oferta: 'bg-primary-dark',
  reprovado: 'bg-destructive',
  cancelado: 'bg-muted-foreground/60',
}

function mapStatus(apiStatus: ApplicationStatusApi): UiStatus {
  switch (apiStatus) {
    case 'PENDING':
      return 'candidatado'
    case 'UNDER_REVIEW':
      return 'em_analise'
    case 'INTERVIEW':
      return 'entrevista'
    case 'APPROVED':
      return 'oferta'
    case 'REJECTED':
      return 'reprovado'
    case 'WITHDRAWN':
      return 'cancelado'
    default:
      return 'candidatado'
  }
}

// ===== TopNav =====

const topNav = [
  {
    title: 'Overview',
    href: '/',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Vagas',
    href: '/jobs',
    isActive: false,
    disabled: false,
  },
]

export function Dashboard() {
  const { overview, loading, error, fetchOverview } =
    useDashboardApplicationsStore()

  useEffect(() => {
    void fetchOverview()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // TODO: plugar no retorno real do usuário (ex: auth.user.isPremium)
  const isUserPremium = false

  const kpis = overview?.kpis

  const chartData = useMemo(
    () =>
      MONTH_LABELS.map((name, index) => {
        const monthNumber = index + 1
        const found = overview?.monthlyApplications.find(
          (m) => m.month === monthNumber,
        )
        return {
          name,
          total: found?.total ?? 0,
        }
      }),
    [overview],
  )

  const lastApplications = overview?.lastApplications ?? []

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} />
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
              Seu painel de candidaturas
            </h1>
            <p className='text-sm text-muted-foreground'>
              Acompanhe suas candidaturas, entrevistas e mensagens com as
              empresas.
            </p>
          </div>
        </div>

        {/* Banner Premium (full width dentro do container) */}
        <div className='mb-4'>
          <PremiumAccessBanner
            isUserPremium={isUserPremium}
            priceLabel='R$ 67,90'
            onSubscribeClick={() => {
              // TODO: plugar checkout/rota (ex: /pricing, /checkout)
            }}
          />
        </div>

        {/* Mensagem de erro simples */}
        {error && <p className='mb-4 text-sm text-destructive'>{error}</p>}

        {/* KPIs (4 cards) */}
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Candidaturas ativas
              </CardTitle>
              <ListChecks className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {kpis?.totalActive ?? (loading ? '...' : 0)}
              </div>
              <p className='text-muted-foreground text-xs'>
                Em andamento (exclui aprovadas e rejeitadas)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Em análise</CardTitle>
              <Target className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {kpis?.underReview ?? (loading ? '...' : 0)}
              </div>
              <p className='text-muted-foreground text-xs'>
                Empresas revisando seu currículo agora
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Entrevistas</CardTitle>
              <Clock className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {kpis?.interviews ?? (loading ? '...' : 0)}
              </div>
              <p className='text-muted-foreground text-xs'>
                Entrevistas marcadas ou em andamento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Novas mensagens
              </CardTitle>
              <MessageCircle className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{kpis?.newMessages ?? 0}</div>
              <p className='text-muted-foreground text-xs'>
                Mensagens recentes de empresas e recrutadores
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Overview + Últimas candidaturas */}
        <div className='mt-4 grid grid-cols-1 gap-4 lg:grid-cols-7'>
          <Card className='col-span-1 lg:col-span-4'>
            <CardHeader>
              <CardTitle>Candidaturas / mês</CardTitle>
            </CardHeader>
            <CardContent className='ps-2'>
              <Overview data={chartData} />
            </CardContent>
          </Card>

          <Card className='col-span-1 lg:col-span-3'>
            <CardHeader>
              <CardTitle>Últimas candidaturas</CardTitle>
              <CardDescription>
                Seus processos mais recentes e o status de cada um.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              {lastApplications.length ? (
                <div className='space-y-2'>
                  {lastApplications.map((app) => {
                    const uiStatus = mapStatus(app.status)
                    const label = statusLabel[uiStatus]
                    const color = statusColor[uiStatus]

                    const appliedAt = new Date(app.appliedAt)
                    const workModelLabel = app.workModel
                      ? WORK_MODEL_LABELS[app.workModel]
                      : 'Modelo não informado'

                    return (
                      <button
                        key={app.id}
                        type='button'
                        className='group flex w-full flex-col gap-1 rounded-md px-2 py-2 text-left transition-colors hover:bg-muted/60 md:flex-row md:items-center md:justify-between'
                      >
                        {/* Info principal */}
                        <div className='flex min-w-0 flex-col gap-0.5'>
                          <p className='truncate text-sm font-medium'>
                            {app.jobTitle}
                          </p>

                          {app.companyName && (
                            <p className='truncate text-xs text-muted-foreground'>
                              {app.companyName}
                            </p>
                          )}

                          <p className='text-[11px] text-muted-foreground'>
                            {(app.location ?? 'Localização não informada') +
                              ' • ' +
                              workModelLabel +
                              ' • ' +
                              appliedAt.toLocaleDateString('pt-BR')}
                          </p>
                        </div>

                        {/* Status pill */}
                        <span className='mt-1 inline-flex items-center gap-1.5 self-start rounded-full bg-muted px-2 py-0.5 text-[11px] transition-colors group-hover:bg-background md:mt-0 md:self-auto'>
                          <span className={`h-1.5 w-1.5 rounded-full ${color}`} />
                          <span className='whitespace-nowrap'>{label}</span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <p className='text-sm text-muted-foreground'>
                  {loading
                    ? 'Carregando suas candidaturas...'
                    : 'Você ainda não se candidatou a nenhuma vaga.'}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
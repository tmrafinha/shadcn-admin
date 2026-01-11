// src/features/tasks/index.tsx (ou o path que você estiver usando)
import { useEffect } from 'react'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { TasksDialogs } from './components/tasks-dialogs'
import { TasksProvider } from './components/tasks-provider'
import { TasksTable } from './components/tasks-table'
import { useApplicationsStore } from '@/stores/applications-store'

export function Tasks() {
  const { items, loading, error, fetchApplications } = useApplicationsStore()

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  // TODO: plugar no retorno real do usuário (ex: auth.user.isPremium)
  const isUserPremium = false

  return (
    <TasksProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Candidaturas</h2>
            <p className='text-muted-foreground'>
              Monitore o progresso das suas candidaturas em tempo real.
            </p>
          </div>
        </div>

        {/* estados de carregando / erro simples */}
        {loading && (
          <div className='rounded-md border bg-card/60 p-4 text-sm text-muted-foreground'>
            Carregando candidaturas...
          </div>
        )}

        {error && !loading && (
          <div className='rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive'>
            {error}
          </div>
        )}

        {/* tabela */}
        {!loading && !error && <TasksTable data={items} />}
      </Main>

      <TasksDialogs />
    </TasksProvider>
  )
}
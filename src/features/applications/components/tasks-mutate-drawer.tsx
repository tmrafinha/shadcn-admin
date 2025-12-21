// components/tasks-mutate-drawer.tsx
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Briefcase,
  Building2,
  CalendarDays,
  DollarSign,
  MapPin,
} from 'lucide-react'
import { type Task } from '../data/schema'

type TaskMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Task
}

type ApplicationStatus =
  | 'candidatado'
  | 'em_analise'
  | 'entrevista'
  | 'oferta'
  | 'reprovado'
  | string

const statusLabel: Record<ApplicationStatus, string> = {
  candidatado: 'Candidatado',
  em_analise: 'Em análise',
  entrevista: 'Entrevista',
  oferta: 'Oferta',
  reprovado: 'Reprovado',
}

const statusColor: Record<ApplicationStatus, string> = {
  candidatado: 'bg-primary/10 text-primary border-primary/30',
  em_analise: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
  entrevista: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
  oferta: 'bg-primary/10 text-primary border-primary/30',
  reprovado: 'bg-destructive/10 text-destructive border-destructive/30',
}

export function TasksMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: TaskMutateDrawerProps) {
  if (!currentRow) return null

  const task = currentRow as Task & {
    company?: string
    location?: string
    model?: string
    type?: string
    level?: string
    appliedAt?: Date
    lastUpdate?: Date
    salaryRange?: string
    source?: string
  }

  const statusKey = task.status as ApplicationStatus
  const status = statusLabel[statusKey] ?? task.status
  const statusBadgeClass =
    statusColor[statusKey] ?? 'bg-muted text-muted-foreground border-muted'

  const formatDate = (date?: Date) =>
    date ? date.toLocaleDateString('pt-BR') : '—'

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
      }}
    >
      <SheetContent className='flex max-w-md flex-col gap-4 border-l bg-background/95 backdrop-blur'>
        <SheetHeader className='text-start'>
          <SheetTitle className='flex flex-col gap-1'>
            <span className='text-xs font-medium uppercase text-muted-foreground'>
              Detalhes da candidatura
            </span>
            <span>{task.title}</span>
          </SheetTitle>
          <SheetDescription className='flex items-center gap-2 text-sm'>
            <Building2 className='h-4 w-4 text-muted-foreground' />
            <span className='font-medium'>{task.company ?? '—'}</span>
          </SheetDescription>
        </SheetHeader>

        {/* Badges (status, nível, modelo, tipo) */}
        <div className='flex flex-wrap gap-2 px-4'>
          <Badge
            variant='outline'
            className={statusBadgeClass}
          >
            {status}
          </Badge>
          {task.level && (
            <Badge variant='outline' className='text-xs'>
              {task.level}
            </Badge>
          )}
          {task.model && (
            <Badge variant='outline' className='text-xs'>
              {task.model}
            </Badge>
          )}
          {task.type && (
            <Badge variant='outline' className='text-xs'>
              {task.type}
            </Badge>
          )}
        </div>

        <Separator />

        <div className='flex-1 space-y-6 overflow-y-auto px-4 pb-4'>
          {/* Informações da vaga */}
          <section className='space-y-3'>
            <h3 className='text-xs font-semibold uppercase text-muted-foreground'>
              Informações da vaga
            </h3>
            <div className='space-y-2 rounded-lg border bg-muted/30 p-3 text-sm'>
              <div className='flex items-start gap-2'>
                <Briefcase className='mt-0.5 h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='font-medium'>{task.title}</p>
                  <p className='text-xs text-muted-foreground'>
                    {task.level ?? '—'} {task.type ?? '—'}
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-2'>
                <MapPin className='mt-0.5 h-4 w-4 text-muted-foreground' />
                <p className='text-sm text-muted-foreground'>
                  {task.location ?? '—'}{' '}
                  {task.model && (
                    <span className='text-xs text-muted-foreground/80'>
                      {task.model}
                    </span>
                  )}
                </p>
              </div>
              <div className='flex items-start gap-2'>
                <DollarSign className='mt-0.5 h-4 w-4 text-muted-foreground' />
                <p className='text-sm'>
                  <span className='font-semibold'>
                    {task.salaryRange ?? '—'}
                  </span>
                </p>
              </div>
            </div>
          </section>

          {/* Linha do tempo */}
          <section className='space-y-3'>
            <h3 className='text-xs font-semibold uppercase text-muted-foreground'>
              Linha do tempo
            </h3>
            <div className='grid grid-cols-1 gap-3 text-sm sm:grid-cols-2'>
              <div className='space-y-1 rounded-lg border bg-muted/10 p-3'>
                <div className='flex items-center gap-2 text-xs font-medium text-muted-foreground'>
                  <CalendarDays className='h-4 w-4' />
                  Candidatado em
                </div>
                <p className='text-sm font-medium'>
                  {formatDate(task.appliedAt)}
                </p>
              </div>
              <div className='space-y-1 rounded-lg border bg-muted/10 p-3'>
                <div className='flex items-center gap-2 text-xs font-medium text-muted-foreground'>
                  <CalendarDays className='h-4 w-4' />
                  Última atualização
                </div>
                <p className='text-sm font-medium'>
                  {formatDate(task.lastUpdate)}
                </p>
              </div>
            </div>
          </section>

          {/* Origem da candidatura */}

        </div>

        <SheetFooter className='gap-2 border-t pt-3'>
          <SheetClose asChild>
            <Button variant='outline' className='w-full'>
              Fechar
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

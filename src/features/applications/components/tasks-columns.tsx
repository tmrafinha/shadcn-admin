// src/features/tasks/components/tasks-columns.tsx
import { type ColumnDef, type Row } from '@tanstack/react-table'
import { Briefcase, Eye, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/data-table'
import { cn } from '@/lib/utils'
import { type Task } from '../data/schema'
import { useTasks } from './tasks-provider'

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

const statusDotColor: Record<ApplicationStatus, string> = {
  candidatado: 'bg-emerald-500',     // verde base
  em_analise: 'bg-amber-500',
  entrevista: 'bg-sky-500',
  oferta: 'bg-emerald-600',
  reprovado: 'bg-red-500',
}

function ViewApplicationCell({ row }: { row: Row<Task> }) {
  const { setOpen, setCurrentRow } = useTasks()
  const task = row.original

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={() => {
        setCurrentRow(task)
        setOpen('view')
      }}
    >
      <Eye className="h-4 w-4" />
      <span className="sr-only">Ver detalhes da candidatura</span>
    </Button>
  )
}

export const tasksColumns: ColumnDef<Task>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vaga" />
    ),
    meta: { className: 'ps-1', tdClassName: 'ps-4' },
    cell: ({ row }) => {
      const title = row.getValue<string>('title')
      const company = (row.original as any).company as string | undefined
      const companyLogoUrl = (row.original as any)
        .companyLogoUrl as string | null | undefined
      const location = (row.original as any).location as string | undefined
      const model = (row.original as any).model as string | undefined

      const initials = company
        ? company
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((p) => p[0])
            .join('')
            .toUpperCase()
        : '??'

      return (
        <div className="flex items-center gap-3">
          {/* 👇 Avatar da empresa (logoUrl ou iniciais) */}
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-md border border-border/60 bg-muted/40">
            {companyLogoUrl ? (
              <img
                src={companyLogoUrl}
                alt={company ?? 'Empresa'}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                {initials || <Briefcase className="h-4 w-4 text-muted-foreground" />}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="max-w-52 truncate text-sm font-medium sm:max-w-72 md:max-w-[18rem]">
              {title}
            </span>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
              {company && <span className="font-semibold">{company}</span>}
              {location && (
                <>
                  <span className="hidden text-xs text-muted-foreground/70 sm:inline">
                    •
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {location}
                  </span>
                </>
              )}
              {model && (
                <Badge
                  variant="outline"
                  className="border-primary/30 bg-primary/5 text-[10px] uppercase tracking-wide"
                >
                  {model}
                </Badge>
              )}
            </div>
          </div>
        </div>
      )
    },
  },

  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    meta: { className: 'ps-1', tdClassName: 'ps-4' },
    cell: ({ row }) => {
      const raw = row.getValue<string>('status') as ApplicationStatus
      const label = statusLabel[raw] ?? raw
      const dot = statusDotColor[raw] ?? 'bg-muted-foreground/50'

      return (
        <div className="flex w-[160px] items-center gap-2">
          <span className={cn('h-2 w-2 rounded-full', dot)} />
          <span className="text-xs font-medium">{label}</span>
        </div>
      )
    },
  },

  {
    accessorKey: 'appliedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Candidatado em" />
    ),
    cell: ({ row }) => {
      const date = (row.original as any).appliedAt as Date | undefined
      return (
        <span className="text-xs text-muted-foreground">
          {date ? date.toLocaleDateString('pt-BR') : '—'}
        </span>
      )
    },
    sortingFn: (rowA, rowB) => {
      const a =
        ((rowA.original as any).appliedAt as Date | undefined)?.getTime() ?? 0
      const b =
        ((rowB.original as any).appliedAt as Date | undefined)?.getTime() ?? 0
      return a === b ? 0 : a > b ? 1 : -1
    },
  },

  {
    accessorKey: 'salaryRange',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Faixa salarial" />
    ),
    meta: { className: 'ps-1', tdClassName: 'ps-3' },
    cell: ({ row }) => {
      const salary = (row.original as any).salaryRange as string | undefined
      return (
        <span className="text-xs font-semibold text-primary">
          {salary ?? '—'}
        </span>
      )
    },
  },

  {
    id: 'actions',
    header: () => null,
    meta: { className: 'w-[40px] text-right', tdClassName: 'pr-4 text-right' },
    cell: ({ row }) => <ViewApplicationCell row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
]
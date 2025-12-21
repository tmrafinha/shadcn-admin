// src/features/errors/apply-now.tsx
import { Sparkles, CheckCircle2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@radix-ui/react-separator'

import { QuickApplyDialog } from '@/components/jobs/quick-apply-dialog'

interface ApplyNowProps {
  jobId: string
  jobTitle: string
  applicationsCount?: number
  viewsCount?: number
  publishedLabel?: string
  isApplied?: boolean
  onApplied?: () => void
}

export function ApplyNow({
  jobId,
  jobTitle,
  applicationsCount = 127,
  viewsCount = 2400,
  publishedLabel = '10 dias',
  isApplied = false,
  onApplied,
}: ApplyNowProps) {
  const safeApplications = applicationsCount ?? 0
  const safeViews = viewsCount ?? 0

  // Se já se candidatou, mostra apenas estado "já candidatado" e bloqueia ação
  if (isApplied) {
    return (
      <Card className="border-primary/50 bg-card/50 backdrop-blur shadow-lg shadow-primary/10">
        <CardContent className="space-y-4 p-6">
          <Button
            size="lg"
            className="h-12 w-full gap-2 text-lg"
            variant="outline"
            disabled
          >
            <CheckCircle2 className="h-5 w-5" />
            Você já se candidatou
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Acompanhe o andamento dessa candidatura pelo painel de processos.
          </p>

          <Separator />

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-lg bg-background/50 p-2">
              <span className="text-muted-foreground">👥 Candidatos</span>
              <span className="font-semibold">
                {safeApplications.toLocaleString('pt-BR')} pessoas
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-background/50 p-2">
              <span className="text-muted-foreground">👁️ Visualizações</span>
              <span className="font-semibold">
                {safeViews.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-background/50 p-2">
              <span className="text-muted-foreground">📅 Publicado</span>
              <span className="font-semibold">{publishedLabel}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Estado padrão: ainda não aplicou
  return (
    <Card className="border-primary/50 bg-card/50 backdrop-blur shadow-lg shadow-primary/10">
      <CardContent className="space-y-4 p-6">
        {/* Botão que abre o modal de candidatura rápida */}
        <QuickApplyDialog
          jobId={jobId}
          jobTitle={jobTitle}
          onApplied={onApplied}
        >
          <Button size="lg" className="h-12 w-full gap-2 text-lg">
            <Sparkles className="h-5 w-5" />
            Candidatar-se Agora
          </Button>
        </QuickApplyDialog>

        <p className="text-center text-xs text-muted-foreground">
          ⚡ Candidatura rápida em menos de 2 minutos
        </p>

        <Separator />

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between rounded-lg bg-background/50 p-2">
            <span className="text-muted-foreground">👥 Candidatos</span>
            <span className="font-semibold">
              {safeApplications.toLocaleString('pt-BR')} pessoas
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-background/50 p-2">
            <span className="text-muted-foreground">👁️ Visualizações</span>
            <span className="font-semibold">
              {safeViews.toLocaleString('pt-BR')}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-background/50 p-2">
            <span className="text-muted-foreground">📅 Publicado</span>
            <span className="font-semibold">{publishedLabel}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
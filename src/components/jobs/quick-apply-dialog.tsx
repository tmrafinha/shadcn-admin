// src/components/jobs/quick-apply-dialog.tsx
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { FileText, Sparkles, Loader2, Crown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

import { useResumesStore } from '@/stores/resumes-store'
import { createApplication } from '@/services/applications.service'
import { Resume } from '@/features/settings/curriculum/resumes.types'

type QuickApplyDialogProps = {
  jobId: string
  jobTitle: string
  children: React.ReactNode
  onApplied?: () => void
}

type ResumeOption = {
  id: string
  displayName: string
  fileName: string
  fileSize: string
  uploadedAt: string
}

/**
 * ✅ MVP LocalStorage limiter (fácil remover depois)
 * - Limita 1 candidatura/dia (FREE)
 * - Reseta automaticamente quando muda o dia
 *
 * Para desacoplar depois:
 * - canApply() pode virar checagem real (API/userPlan)
 * - registerApply() pode virar update do backend ou ser removida
 */
const applyLimiter = (() => {
  const STORAGE_KEY = 'quick_apply_limit_v1'
  const DAILY_LIMIT_FREE = 1

  type StoreShape = {
    dateKey: string // YYYY-MM-DD
    count: number
  }

  function getLocalDateKey() {
    const now = new Date()
    const yyyy = now.getFullYear()
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }

  function safeRead(): StoreShape {
    const today = getLocalDateKey()

    if (typeof window === 'undefined') {
      return { dateKey: today, count: 0 }
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return { dateKey: today, count: 0 }

      const parsed = JSON.parse(raw) as Partial<StoreShape>
      if (!parsed.dateKey || typeof parsed.count !== 'number') {
        return { dateKey: today, count: 0 }
      }

      if (parsed.dateKey !== today) {
        return { dateKey: today, count: 0 }
      }

      return { dateKey: parsed.dateKey, count: Math.max(0, parsed.count) }
    } catch {
      return { dateKey: today, count: 0 }
    }
  }

  function safeWrite(data: StoreShape) {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      // ignore
    }
  }

  function canApply(args?: { isPremium?: boolean }) {
    if (args?.isPremium) return { ok: true as const }

    const state = safeRead()
    const remaining = DAILY_LIMIT_FREE - state.count
    if (remaining <= 0) return { ok: false as const }

    return { ok: true as const }
  }

  function registerApply(args?: { isPremium?: boolean }) {
    if (args?.isPremium) return

    const state = safeRead()
    const next = { ...state, count: state.count + 1 }
    safeWrite(next)
  }

  return {
    canApply,
    registerApply,
  }
})()

function formatSize(bytes: number): string {
  if (!bytes) return ''
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(0)} KB`
  return `${(kb / 1024).toFixed(2)} MB`
}

function mapResumeToOption(resume: Resume): ResumeOption {
  return {
    id: resume.id,
    displayName: resume.originalName || resume.filename,
    fileName: resume.filename,
    fileSize: formatSize(resume.size),
    uploadedAt: new Date(resume.uploadedAt).toLocaleDateString('pt-BR'),
  }
}

export function QuickApplyDialog({
  jobId,
  jobTitle,
  children,
  onApplied,
}: QuickApplyDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { resumes, loading, error, fetchResumes, fetchedOnce } = useResumesStore()

  // MVP: sem premium ainda
  const isUserPremium = false

  useEffect(() => {
    if (open && !fetchedOnce) {
      fetchResumes()
    }
  }, [open, fetchedOnce, fetchResumes])

  const resumeOptions = useMemo(() => resumes.map(mapResumeToOption), [resumes])

  async function handleSubmit() {
    if (!selectedResumeId) {
      toast.error('Selecione um currículo para enviar.')
      return
    }

    if (isSubmitting) return

    // ✅ valida só no submit (bem simples)
    const allowed = applyLimiter.canApply({ isPremium: isUserPremium })
    if (!allowed.ok) {
      toast.error('No plano Free, você pode se candidatar apenas em 1 vaga por dia.', {
      })
      return
    }

    try {
      setIsSubmitting(true)

      await createApplication({
        jobId,
        resumeId: selectedResumeId,
        coverLetter: coverLetter.trim() || undefined,
      })

      // ✅ só registra após sucesso
      applyLimiter.registerApply({ isPremium: isUserPremium })

      toast.success('Candidatura enviada com sucesso!')
      onApplied?.()

      setOpen(false)
      setCoverLetter('')
      setSelectedResumeId(null)
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error(err)
      toast.error('Não foi possível enviar sua candidatura.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        className={cn(
          'w-[calc(100vw-24px)] max-w-xl',
          'p-4 sm:p-6',
          'max-h-[calc(100svh-24px)] overflow-hidden',
        )}
      >
        <div className="flex max-h-[calc(100svh-24px)] flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>Candidatura rápida</DialogTitle>
            <DialogDescription>
              Selecione um dos seus currículos e, se quiser, adicione uma mensagem curta
              para a empresa.
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pt-2">
            {/* Lista de currículos */}
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Escolha o currículo</p>
                <p className="text-xs text-muted-foreground">
                  Esses são os currículos cadastrados na sua conta.
                </p>
              </div>

              {loading && (
                <div className="rounded-md border bg-card/60 p-3 text-sm text-muted-foreground">
                  Carregando currículos...
                </div>
              )}

              {error && !loading && (
                <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                  Erro ao carregar currículos. Tente novamente mais tarde.
                </div>
              )}

              {!loading && !error && resumeOptions.length === 0 && (
                <div>
                  <div className="rounded-md border bg-card/60 p-3 text-sm text-muted-foreground mb-2">
                    Você ainda não cadastrou nenhum currículo.
                  </div>
                  <a href="/settings/curriculum">
                    <Button className="w-full">Cadastrar Currículo</Button>
                  </a>
                </div>
              )}

              {resumeOptions.length > 0 && (
                <ScrollArea className={cn('h-[220px] pr-3 sm:h-[280px]')}>
                  <RadioGroup
                    value={selectedResumeId ?? ''}
                    onValueChange={(value) => setSelectedResumeId(value)}
                    className="space-y-3 pr-1"
                  >
                    {resumeOptions.map((cv) => (
                      <Label
                        key={cv.id}
                        htmlFor={`quick-cv-${cv.id}`}
                        className={cn(
                          'flex cursor-pointer items-start gap-3 rounded-lg border bg-card/70 p-3 text-sm transition-colors hover:border-primary/60 hover:bg-card/90',
                          selectedResumeId === cv.id && 'border-primary bg-primary/5',
                        )}
                      >
                        <RadioGroupItem
                          id={`quick-cv-${cv.id}`}
                          value={cv.id}
                          className="mt-1"
                        />

                        <div className="flex flex-1 items-start gap-3">
                          <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-md border bg-background/80">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1 space-y-1">
                            <p className="truncate text-sm font-medium">{cv.displayName}</p>
                            <p className="text-xs text-muted-foreground">
                              {cv.fileName} • {cv.fileSize} • {cv.uploadedAt}
                            </p>
                          </div>
                        </div>
                      </Label>
                    ))}
                  </RadioGroup>
                </ScrollArea>
              )}
            </div>

            {/* Mensagem opcional */}
            <div className="space-y-2 pt-3">
              <Label htmlFor="quick-cover-letter" className="text-sm font-medium">
                Mensagem para a empresa (opcional)
              </Label>
              <Textarea
                id="quick-cover-letter"
                placeholder={`Explique em poucas linhas por que você é uma boa pessoa para a vaga "${jobTitle}".`}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="min-h-[90px] max-h-[200px] resize-none whitespace-pre-wrap break-all"
              />
              <p className="text-xs text-muted-foreground">
                Isso será enviado como carta de apresentação junto com o currículo selecionado.
              </p>
            </div>
          </div>

          <DialogFooter className="mt-4 gap-2 border-t pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={loading || resumeOptions.length === 0 || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Enviar candidatura
                </>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
// src/components/jobs/quick-apply-dialog.tsx
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { FileText, Sparkles } from 'lucide-react'

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

  const { resumes, loading, error, fetchResumes, fetchedOnce } = useResumesStore()

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

    try {
      await createApplication({
        jobId,
        resumeId: selectedResumeId,
        coverLetter: coverLetter.trim() || undefined,
      })

      toast.success('Candidatura enviada com sucesso!')
      onApplied?.()

      setOpen(false)
      setCoverLetter('')
      setSelectedResumeId(null)
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error(err)
      toast.error('Não foi possível enviar sua candidatura.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        className={cn(
          // ✅ mobile: não gruda nas laterais + limita altura pra não estourar
          'w-[calc(100vw-24px)] max-w-xl',
          'p-4 sm:p-6',
          'max-h-[calc(100svh-24px)] overflow-hidden',
        )}
      >
        {/* ✅ conteúdo rolável quando necessário (mobile) */}
        <div className="flex max-h-[calc(100svh-24px)] flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>Candidatura rápida</DialogTitle>
            <DialogDescription>
              Selecione um dos seus currículos e, se quiser, adicione uma mensagem curta
              para a empresa.
            </DialogDescription>
          </DialogHeader>

          {/* corpo scrollável */}
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
                <div className="rounded-md border bg-card/60 p-3 text-sm text-muted-foreground">
                  Você ainda não cadastrou nenhum currículo.
                </div>
              )}

              {resumeOptions.length > 0 && (
                <ScrollArea
                  className={cn(
                    // ✅ mobile: altura menor pra sobrar espaço pro textarea + footer
                    'h-[220px] pr-3 sm:h-[280px]',
                  )}
                >
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

          {/* footer fixo (não “some” no mobile) */}
          <DialogFooter className="mt-4 gap-2 border-t pt-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={loading || resumeOptions.length === 0}>
              <Sparkles className="mr-2 h-4 w-4" />
              Enviar candidatura
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
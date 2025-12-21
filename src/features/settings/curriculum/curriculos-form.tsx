import {
  useState,
  DragEvent,
  ChangeEvent,
  useEffect,
} from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  FileText,
  Trash2,
  UploadCloud,
  Lock,
  Plus,
  Download,
} from 'lucide-react'
import { toast } from 'sonner' // 👈 novo

import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormLabel,
} from '@/components/ui/form'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

import { useResumesStore } from '@/stores/resumes-store'
import {
  deleteResume,
  getResumeDownloadUrl,
} from '@/services/resumes.service'
import type { Resume } from '@/features/settings/curriculum/resumes.types'
import { ConfirmDialog } from '@/components/confirm-dialog'

// Schema vazio (usamos o form só pra submit/estado, sem campos de texto)
const curriculumFormSchema = z.object({})

type CurriculumFormValues = z.infer<typeof curriculumFormSchema>

function formatSize(bytes: number | null | undefined): string {
  if (!bytes) return ''
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(0)} KB`
  return `${(kb / 1024).toFixed(2)} MB`
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function CurriculumForm() {
  const {
    resumes,
    loading,
    error,
    fetchedOnce,
    fetchResumes,
    uploadResume
  } = useResumesStore()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [resumeToDelete, setResumeToDelete] = useState<Resume | null>(null)

  const form = useForm<CurriculumFormValues>({
    resolver: zodResolver(curriculumFormSchema),
    defaultValues: {},
    mode: 'onChange',
  })

  // Carregar currículos ao montar
  useEffect(() => {
    if (!fetchedOnce) {
      fetchResumes()
    }
  }, [fetchedOnce, fetchResumes])

  function validateFile(selected: File | null): boolean {
    if (!selected) return false

    // Backend: FileTypeValidator({ fileType: "application/pdf" })
    const validTypes = ['application/pdf']

    if (!validTypes.includes(selected.type)) {
      setFileError('Apenas arquivos PDF são permitidos.')
      return false
    }

    // Backend libera até 15MB
    if (selected.size > 15 * 1024 * 1024) {
      setFileError('O arquivo deve ter no máximo 15 MB.')
      return false
    }

    return true
  }

  function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (!selected) return

    if (!validateFile(selected)) {
      setFile(null)
      return
    }

    setFile(selected)
    setFileError(null)
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const dropped = e.dataTransfer.files?.[0]
    if (!dropped) return

    if (!validateFile(dropped)) {
      setFile(null)
      return
    }

    setFile(dropped)
    setFileError(null)
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

const handleCreateCurriculum = async () => {
  if (!file) return setFileError('Envie ou arraste um arquivo de currículo (PDF).')

  try {
    setUploading(true)
    setFileError(null)

    await uploadResume(file) // ✅ via store
    // opcional: se você já atualizou otimisticamente, nem precisa fetchResumes()
    // await fetchResumes()

    toast.success('Currículo enviado com sucesso!')
    form.reset({})
    setFile(null)
    setDialogOpen(false)
  } catch (err: any) {
    const message = err?.response?.data?.message ?? err?.message ?? 'Erro ao enviar currículo.'
    setFileError(message)
    toast.error(message)
  } finally {
    setUploading(false)
  }
}

  const openDeleteConfirm = (resume: Resume) => {
    setResumeToDelete(resume)
    setConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!resumeToDelete) return

    try {
      setDeletingId(resumeToDelete.id)
      await deleteResume(resumeToDelete.id)
      await fetchResumes()
      setConfirmOpen(false)
      setResumeToDelete(null)
      toast.success('Currículo removido com sucesso.')
    } catch (err) {
      console.error('Erro ao excluir currículo', err)
      toast.error('Erro ao excluir currículo.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleDownload = async (resume: Resume) => {
    try {
      const url = await getResumeDownloadUrl(resume.id)
      window.open(url, '_blank')
    } catch (err) {
      console.error('Erro ao obter URL de download', err)
      toast.error('Erro ao baixar currículo.')
    }
  }

  const isEmpty = !loading && resumes.length === 0

  return (
    <>
      <div className="space-y-8">
        {/* Header + botão de adicionar */}
        <div className="flex flex-col  sm:justify-between">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4" />
                Adicionar currículo
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Adicionar currículo</DialogTitle>
                <DialogDescription>
                  Envie um arquivo PDF com até 15 MB.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleCreateCurriculum)}
                  className="space-y-6"
                >
                  {/* Área de upload / drag & drop */}
                  <div className="space-y-2">
                    <FormLabel>Arquivo do currículo *</FormLabel>
                    <FormControl>
                      <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={cn(
                          'flex flex-col items-center justify-center rounded-md border border-dashed px-4 py-6 text-center text-sm transition-colors',
                          isDragging
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/60 hover:bg-muted/40',
                          uploading && 'opacity-70 pointer-events-none',
                        )}
                      >
                        <UploadCloud className="w-6 h-6 mb-2 text-muted-foreground" />
                        {file ? (
                          <>
                            <p className="font-medium break-all text-sm">
                              {file.name}
                            </p>
                            {file.size > 0 && (
                              <p className="text-xs text-muted-foreground">
                                {formatSize(file.size)}
                              </p>
                            )}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="mt-2 h-7 text-xs"
                              onClick={() => {
                                setFile(null)
                              }}
                              disabled={uploading}
                            >
                              Trocar arquivo
                            </Button>
                          </>
                        ) : (
                          <>
                            <p className="text-sm">
                              Arraste e solte o PDF aqui
                            </p>
                            <p className="text-xs text-muted-foreground mb-3">
                              Apenas arquivos PDF, até 15 MB
                            </p>

                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              disabled={uploading}
                              asChild
                            >
                              <label
                                htmlFor="cv-file-input"
                                className="flex cursor-pointer items-center gap-2"
                              >
                                <UploadCloud className="w-4 h-4" />
                                Escolher arquivo
                              </label>
                            </Button>

                            <input
                              id="cv-file-input"
                              type="file"
                              className="hidden"
                              accept=".pdf,application/pdf"
                              onChange={handleFileSelect}
                            />
                          </>
                        )}
                      </div>
                    </FormControl>
                    {fileError && (
                      <p className="text-xs text-destructive mt-1">{fileError}</p>
                    )}
                  </div>

                  <DialogFooter className="gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-border bg-background hover:bg-muted hover:text-foreground"
                      onClick={() => {
                        setDialogOpen(false)
                        form.reset({})
                        setFile(null)
                        setFileError(null)
                      }}
                      disabled={uploading}
                    >
                      Cancelar
                    </Button>

                    <Button type="submit" disabled={uploading}>
                      {uploading ? 'Enviando...' : 'Salvar currículo'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista de currículos */}
        <Card className="border-dashed border-border/70">
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <CardTitle className="text-base">Currículos cadastrados</CardTitle>
                <CardDescription>
                  Esses arquivos poderão ser usados nas suas candidaturas.
                </CardDescription>
              </div>
              <Badge variant="outline" className="self-start sm:self-auto text-xs">
                {resumes.length} currículo
                {resumes.length !== 1 && 's'}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {error && (
              <div className="mb-3 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                {error}
              </div>
            )}

            {loading && resumes.length === 0 ? (
              <div className="py-10 text-center text-sm text-muted-foreground">
                Carregando seus currículos...
              </div>
            ) : isEmpty ? (
              <div className="py-10 text-center text-sm text-muted-foreground">
                Você ainda não cadastrou nenhum currículo.
                <br />
                Clique em{' '}
                <span className="font-medium">“Adicionar currículo”</span> para
                começar.
              </div>
            ) : (
              <ScrollArea className="h-[340px] sm:h-[380px] pr-1 sm:pr-2">
                <div className="space-y-3">
                  {resumes.map((cv) => (
                    <Card
                      key={cv.id}
                      className="group border-border/70 bg-card/70 hover:border-primary/60 hover:bg-card/90 transition-colors"
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background/80 shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>

                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                              <div className="min-w-0 space-y-1">
                                <p className="font-medium text-sm break-all">
                                  {cv.originalName}
                                </p>
                                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                  {cv.size && <span>{formatSize(cv.size)}</span>}
                                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
                                    <span>
                                      Enviado em {formatDate(cv.uploadedAt)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-2 shrink-0 mt-1 sm:mt-0">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleDownload(cv)}
                                >
                                  <Download className="w-4 h-4" />
                                </Button>

                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openDeleteConfirm(cv)}
                                  disabled={deletingId === cv.id}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>

          <CardFooter className="pt-3 text-xs text-muted-foreground flex items-center gap-2">
            <Lock className="w-3 h-3" />
            Seus currículos são privados. Apenas você e os recrutadores das vagas
            às quais você se candidatar terão acesso.
          </CardFooter>
        </Card>
      </div>

      {/* Dialog de confirmação de remoção */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open)
          if (!open) {
            setResumeToDelete(null)
          }
        }}
        title="Remover currículo"
        desc={
          <>
            Tem certeza que deseja remover o currículo{' '}
            <span className="font-semibold">
              {resumeToDelete?.originalName ?? 'selecionado'}
            </span>
            ?
            <br />
            Essa ação não poderá ser desfeita.
          </>
        }
        destructive
        confirmText={deletingId ? 'Removendo...' : 'Remover'}
        cancelBtnText="Cancelar"
        handleConfirm={handleConfirmDelete}
        isLoading={deletingId !== null}
      />
    </>
  )
}
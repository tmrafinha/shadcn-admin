import { useState } from 'react'
import {
  HelpCircle,
  BookOpen,
  ChevronRight,
  MessageCircle,
  CalendarClock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

type GuideId =
  | 'applications'
  | 'resumes'
  | 'filters'
  | 'interviews'
  | 'messages'
  | 'profile'
  | 'notifications'

type GuideConfig = {
  id: GuideId
  title: string
  subtitle: string
}

const guides: GuideConfig[] = [
  {
    id: 'applications',
    title: 'Como acompanhar minhas candidaturas?',
    subtitle:
      'Entenda o painel de candidaturas e o significado de cada status.',
  },
  {
    id: 'resumes',
    title: 'Enviando e gerenciando meus currículos',
    subtitle:
      'Veja como cadastrar vários currículos e escolher o ideal para cada vaga.',
  },
  {
    id: 'filters',
    title: 'Filtros de vagas e recomendações',
    subtitle: 'Use filtros para achar oportunidades alinhadas ao seu perfil.',
  },
  {
    id: 'interviews',
    title: 'Organizando entrevistas e próximos passos',
    subtitle:
      'Dicas para acompanhar entrevistas e se preparar melhor para cada etapa.',
  },
  {
    id: 'messages',
    title: 'Mensagens com empresas e recrutadores',
    subtitle: 'Como centralizar e acompanhar a comunicação com as empresas.',
  },
  {
    id: 'profile',
    title: 'Perfil do candidato',
    subtitle:
      'Mantenha seus dados atualizados para receber vagas mais relevantes.',
  },
  {
    id: 'notifications',
    title: 'Alertas e notificações',
    subtitle:
      'Configure como você prefere ser avisado sobre novidades e mudanças.',
  },
]

export function HelpCenter() {
  const [openGuide, setOpenGuide] = useState<GuideId | null>(null)

  const closeDialog = () => setOpenGuide(null)

  return (
    <div className='mx-auto flex max-w-5xl flex-col gap-6 py-6 md:py-10'>
      {/* Header */}
      <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
        <div className='flex items-start gap-3'>
          <div className='bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full'>
            <HelpCircle className='h-5 w-5' />
          </div>
          <div>
            <h1 className='text-2xl font-semibold tracking-tight md:text-3xl'>
              Central de ajuda
            </h1>
            <p className='text-muted-foreground text-sm'>
              Guias rápidos para tirar o máximo da plataforma sem complicação.
            </p>
          </div>
        </div>

        <a href='https://wa.me/47996542706' target='_blank'>
          <Button variant='outline' size='sm' className='gap-2'>
            <MessageCircle className='h-4 w-4' />
            Falar com suporte
          </Button>
        </a>
      </div>

      {/* Card principal de guias */}
      <Card>
        <CardHeader className='pb-4'>
          <CardTitle className='flex items-center gap-2 text-base md:text-lg'>
            <BookOpen className='text-primary h-4 w-4' />
            Guias rápidos
          </CardTitle>
          <CardDescription>
            Conceitos principais para entender suas vagas, candidaturas e o
            fluxo da plataforma.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className='grid gap-2 md:grid-cols-2'>
            {guides.map((guide) => (
              <button
                key={guide.id}
                type='button'
                onClick={() => setOpenGuide(guide.id)}
                className='group border-border/60 bg-card/60 hover:bg-muted/60 flex h-full w-full flex-col items-start rounded-md border px-3 py-2 text-left text-sm transition-colors'
              >
                <span className='mb-0.5 flex w-full items-center justify-between gap-2'>
                  <span className='font-medium'>{guide.title}</span>
                  <ChevronRight className='text-muted-foreground h-4 w-4 transition-transform group-hover:translate-x-0.5' />
                </span>
                <span className='text-muted-foreground text-xs'>
                  {guide.subtitle}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bloco extra simples, só texto, pra ocupar melhor a tela */}
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='flex items-center gap-2 text-base'>
            <CalendarClock className='text-primary h-4 w-4' />
            Dicas rápidas para o dia a dia
          </CardTitle>
          <CardDescription>
            Pequenas ações que aumentam suas chances de ser chamado para
            entrevistas.
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-3 md:grid-cols-3'>
          <div className='space-y-1'>
            <p className='text-sm font-medium'>Atualize seu perfil</p>
            <p className='text-muted-foreground text-xs'>
              Revise seu nome, localização, senioridade e áreas de interesse com
              frequência.
            </p>
          </div>
          <div className='space-y-1'>
            <p className='text-sm font-medium'>Use o currículo certo</p>
            <p className='text-muted-foreground text-xs'>
              Tenha versões diferentes do currículo para áreas específicas (por
              exemplo: backend, QA, liderança).
            </p>
          </div>
          <div className='space-y-1'>
            <p className='text-sm font-medium'>Acompanhe os status</p>
            <p className='text-muted-foreground text-xs'>
              Use o painel de candidaturas diariamente para saber onde focar seu
              esforço.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs dos guias */}
      <GuideDialog
        open={openGuide === 'applications'}
        onOpenChange={(open) => !open && closeDialog()}
        title='Como acompanhar minhas candidaturas?'
      >
        <p className='text-muted-foreground text-sm'>
          No painel de candidaturas você vê todas as vagas em que se candidatou,
          com status como <strong>Candidatado</strong>,{' '}
          <strong>Em análise</strong>,<strong>Entrevista</strong>,{' '}
          <strong>Oferta</strong> ou <strong>Reprovado</strong>.
        </p>
        <ul className='text-muted-foreground mt-3 list-disc space-y-1 ps-4 text-sm'>
          <li>
            A coluna de <strong>Status</strong> mostra em que etapa cada
            processo está.
          </li>
          <li>
            A data de <strong>Candidatado em</strong> ajuda a entender a linha
            do tempo de cada vaga.
          </li>
          <li>
            Use o detalhe da candidatura para ver informações do job e do
            currículo enviado.
          </li>
        </ul>
      </GuideDialog>

      <GuideDialog
        open={openGuide === 'resumes'}
        onOpenChange={(open) => !open && closeDialog()}
        title='Enviando e gerenciando meus currículos'
      >
        <p className='text-muted-foreground text-sm'>
          Você pode manter vários currículos cadastrados e escolher o mais
          adequado a cada vaga.
        </p>
        <ul className='text-muted-foreground mt-3 list-disc space-y-1 ps-4 text-sm'>
          <li>
            Acesse <strong>Configurações &gt; Currículos</strong> para enviar
            PDFs atualizados.
          </li>
          <li>
            Nomeie cada currículo de forma clara, como &quot;Backend
            Node.js&quot; ou &quot;QA Automação&quot;.
          </li>
          <li>
            Na hora de se candidatar, selecione o currículo que mais conversa
            com a vaga.
          </li>
        </ul>
      </GuideDialog>

      <GuideDialog
        open={openGuide === 'filters'}
        onOpenChange={(open) => !open && closeDialog()}
        title='Filtros de vagas e recomendações'
      >
        <p className='text-muted-foreground text-sm'>
          Os filtros ajudam a reduzir a lista de vagas e focar nas oportunidades
          certas.
        </p>
        <ul className='text-muted-foreground mt-3 list-disc space-y-1 ps-4 text-sm'>
          <li>
            Filtre por <strong>localização</strong>,{' '}
            <strong>modelo de trabalho</strong> e
            <strong> tipo de contrato</strong>.
          </li>
          <li>
            Ajuste a <strong>faixa salarial</strong> para bater com sua
            expectativa.
          </li>
          <li>
            Combine filtros com busca por palavra-chave para resultados mais
            específicos.
          </li>
        </ul>
      </GuideDialog>

      <GuideDialog
        open={openGuide === 'interviews'}
        onOpenChange={(open) => !open && closeDialog()}
        title='Organizando entrevistas e próximos passos'
      >
        <p className='text-muted-foreground text-sm'>
          Quando uma candidatura evolui para entrevista, é importante organizar
          bem suas etapas.
        </p>
        <ul className='text-muted-foreground mt-3 list-disc space-y-1 ps-4 text-sm'>
          <li>
            Use o status <strong>Entrevista</strong> para identificar
            rapidamente processos prioritários.
          </li>
          <li>
            Mantenha anotações pessoais fora da plataforma (ex.: bloco de notas)
            com perguntas e feedbacks.
          </li>
          <li>
            Revise a descrição da vaga e o currículo enviado antes de cada
            conversa.
          </li>
        </ul>
      </GuideDialog>

      <GuideDialog
        open={openGuide === 'messages'}
        onOpenChange={(open) => !open && closeDialog()}
        title='Mensagens com empresas e recrutadores'
      >
        <p className='text-muted-foreground text-sm'>
          A aba de mensagens serve para centralizar a comunicação com
          recrutadores e empresas.
        </p>
        <ul className='text-muted-foreground mt-3 list-disc space-y-1 ps-4 text-sm'>
          <li>
            Responda mensagens o quanto antes para não perder prazos de testes
            ou entrevistas.
          </li>
          <li>Seja objetivo, educado e profissional em todas as conversas.</li>
          <li>
            Use as mensagens para tirar dúvidas sobre escopo, modelo de trabalho
            e etapas do processo.
          </li>
        </ul>
      </GuideDialog>

      <GuideDialog
        open={openGuide === 'profile'}
        onOpenChange={(open) => !open && closeDialog()}
        title='Perfil do candidato'
      >
        <p className='text-muted-foreground text-sm'>
          Um perfil atualizado aumenta as chances de receber vagas e abordagens
          mais relevantes.
        </p>
        <ul className='text-muted-foreground mt-3 list-disc space-y-1 ps-4 text-sm'>
          <li>
            Mantenha seu <strong>nome</strong>, <strong>cidade</strong> e{' '}
            <strong>nível de senioridade</strong> sempre corretos.
          </li>
          <li>
            Descreva, no resumo, o tipo de vaga que você está buscando no
            momento.
          </li>
          <li>
            Atualize seu perfil sempre que mudar de foco (ex.: de pleno para
            sênior, de QA para Backend).
          </li>
        </ul>
      </GuideDialog>

      <GuideDialog
        open={openGuide === 'notifications'}
        onOpenChange={(open) => !open && closeDialog()}
        title='Alertas e notificações'
      >
        <p className='text-muted-foreground text-sm'>
          Configure notificações para não perder mudanças importantes nas suas
          candidaturas.
        </p>
        <ul className='text-muted-foreground mt-3 list-disc space-y-1 ps-4 text-sm'>
          <li>
            Ative alertas para quando uma candidatura mudar de status ou surgir
            uma nova mensagem.
          </li>
          <li>
            No futuro, você poderá escolher entre notificações por e-mail, web
            ou mobile.
          </li>
          <li>
            Se estiver recebendo muitas notificações, ajuste as preferências em
            configurações.
          </li>
        </ul>
      </GuideDialog>
    </div>
  )
}

type GuideDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: React.ReactNode
}

function GuideDialog({
  open,
  onOpenChange,
  title,
  children,
}: GuideDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-base'>{title}</DialogTitle>
          <DialogDescription className='text-xs'>
            Guia rápido para tirar melhor proveito da plataforma.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-2'>{children}</div>
      </DialogContent>
    </Dialog>
  )
}

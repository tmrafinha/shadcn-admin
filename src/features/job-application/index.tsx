import { useState } from 'react'
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  Check,
  Sparkles,
  Clock,
  DollarSign,
  Send,
  Github,
  Globe,
  Linkedin,
  Building2,
  Zap,
  Edit3,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

export default function QuickApply() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')

  const job = {
    title: 'Senior Full Stack Developer',
    company: 'Google',
    logo: '🔍',
    location: 'São Paulo, SP',
    salary: 'R$ 25.000 - R$ 35.000',
    remote: 'Híbrido',
  }

  const userProfile = {
    fullName: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '+55 11 99999-9999',
    location: 'São Paulo, SP',
    currentRole: 'Full Stack Developer',
    yearsExperience: '5',
    linkedinUrl: 'linkedin.com/in/joaosilva',
    githubUrl: 'github.com/joaosilva',
    portfolioUrl: 'joaosilva.dev',
    resumeFile: 'curriculo_joao_silva.pdf',
    resumeUpdated: '15 dias atrás',
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 1500)
  }

  if (submitted) {
    return (
      <>
        <Header>
          <Search />
          <div className='ms-auto flex items-center gap-4'>
            <ThemeSwitch />
            <ConfigDrawer />
            <ProfileDropdown />
          </div>
        </Header>

        <Main>
          <div className='flex min-h-[600px] items-center justify-center'>
            <Card className='max-w-2xl w-full bg-card/50 backdrop-blur border-emerald-500/30'>
              <CardContent className='p-8 md:p-12 text-center space-y-6'>
                <div className='mx-auto w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center'>
                  <Check className='w-10 h-10 text-emerald-500' />
                </div>
                
                <div className='space-y-3'>
                  <h1 className='text-3xl md:text-4xl font-bold'>
                    Candidatura Enviada! 🎉
                  </h1>
                  <p className='text-lg text-muted-foreground'>
                    Sua candidatura para <span className='font-semibold text-foreground'>{job.title}</span> na <span className='font-semibold text-foreground'>{job.company}</span> foi enviada com sucesso!
                  </p>
                </div>

                <div className='bg-background/50 border-border/50 rounded-xl p-6 space-y-4'>
                  <h3 className='font-semibold text-lg'>Próximos Passos</h3>
                  <div className='space-y-3 text-sm text-left'>
                    <div className='flex items-start gap-3'>
                      <div className='shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-semibold text-xs'>
                        1
                      </div>
                      <div>
                        <p className='font-medium'>Confirmação por email</p>
                        <p className='text-muted-foreground'>Você receberá um email de confirmação em instantes</p>
                      </div>
                    </div>
                    <div className='flex items-start gap-3'>
                      <div className='shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-semibold text-xs'>
                        2
                      </div>
                      <div>
                        <p className='font-medium'>Análise do currículo</p>
                        <p className='text-muted-foreground'>A {job.company} analisará seu perfil em até 7 dias úteis</p>
                      </div>
                    </div>
                    <div className='flex items-start gap-3'>
                      <div className='shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-semibold text-xs'>
                        3
                      </div>
                      <div>
                        <p className='font-medium'>Feedback garantido</p>
                        <p className='text-muted-foreground'>Você receberá uma resposta, independente do resultado</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='flex flex-col sm:flex-row gap-3 pt-4'>
                  <Button
                    variant='outline'
                    className='flex-1 gap-2'
                    onClick={() => window.location.href = '/jobs'}
                  >
                    <ArrowLeft className='w-4 h-4' />
                    Ver mais vagas
                  </Button>
                  <Button
                    className='flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700'
                    onClick={() => window.location.href = '/applications'}
                  >
                    Minhas Candidaturas
                    <Briefcase className='w-4 h-4' />
                  </Button>
                </div>

                <p className='text-sm text-muted-foreground pt-4'>
                  💡 Dica: Enquanto aguarda, continue explorando outras vagas que combinam com seu perfil!
                </p>
              </CardContent>
            </Card>
          </div>
        </Main>
      </>
    )
  }

  return (
    <>
      <Header>
        <Search />
        <div className='ms-auto flex items-center gap-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='max-w-4xl mx-auto space-y-6 pb-20'>
          <Button
            variant='ghost'
            className='-ml-2 gap-2 hover:text-emerald-500'
            onClick={() => window.history.back()}
          >
            <ArrowLeft className='h-4 w-4' />
            Voltar para a vaga
          </Button>

          <div className='text-center max-w-2xl mx-auto space-y-3'>
            <h1 className='text-3xl md:text-4xl font-bold'>
              Candidatura Rápida ⚡
            </h1>
            <p className='text-lg text-muted-foreground'>
              Seus dados já estão prontos! Revise e envie sua candidatura em segundos.
            </p>
          </div>

          <div className='grid gap-6 lg:grid-cols-3'>
            <div className='lg:col-span-2 space-y-6'>
              {/* Seus Dados */}
              <Card className='bg-card/50 backdrop-blur'>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='flex items-center gap-2'>
                      <div className='rounded-lg bg-emerald-500/10 p-2'>
                        <Check className='h-5 w-5 text-emerald-500' />
                      </div>
                      Seus Dados
                    </CardTitle>
                    <Button variant='ghost' size='sm' className='gap-2 text-muted-foreground hover:text-emerald-500'>
                      <Edit3 className='w-4 h-4' />
                      Editar perfil
                    </Button>
                  </div>
                  <CardDescription>
                    Usaremos as informações do seu perfil GoDev
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid md:grid-cols-2 gap-4'>
                    <div className='bg-background/50 rounded-lg p-4 space-y-2'>
                      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <Mail className='w-4 h-4' />
                        <span>Email</span>
                      </div>
                      <p className='font-medium'>{userProfile.email}</p>
                    </div>

                    <div className='bg-background/50 rounded-lg p-4 space-y-2'>
                      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <Phone className='w-4 h-4' />
                        <span>Telefone</span>
                      </div>
                      <p className='font-medium'>{userProfile.phone}</p>
                    </div>

                    <div className='bg-background/50 rounded-lg p-4 space-y-2'>
                      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <MapPin className='w-4 h-4' />
                        <span>Localização</span>
                      </div>
                      <p className='font-medium'>{userProfile.location}</p>
                    </div>

                    <div className='bg-background/50 rounded-lg p-4 space-y-2'>
                      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <Briefcase className='w-4 h-4' />
                        <span>Cargo Atual</span>
                      </div>
                      <p className='font-medium'>{userProfile.currentRole}</p>
                    </div>
                  </div>

                  <div className='flex flex-wrap gap-2 pt-2'>
                    {userProfile.linkedinUrl && (
                      <Badge variant='outline' className='gap-2 px-3 py-1.5'>
                        <Linkedin className='w-3 h-3' />
                        LinkedIn
                      </Badge>
                    )}
                    {userProfile.githubUrl && (
                      <Badge variant='outline' className='gap-2 px-3 py-1.5'>
                        <Github className='w-3 h-3' />
                        GitHub
                      </Badge>
                    )}
                    {userProfile.portfolioUrl && (
                      <Badge variant='outline' className='gap-2 px-3 py-1.5'>
                        <Globe className='w-3 h-3' />
                        Portfólio
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Currículo */}
              <Card className='bg-card/50 backdrop-blur'>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='flex items-center gap-2'>
                      <div className='rounded-lg bg-emerald-500/10 p-2'>
                        <FileText className='h-5 w-5 text-emerald-500' />
                      </div>
                      Currículo
                    </CardTitle>
                    <Button variant='ghost' size='sm' className='gap-2 text-muted-foreground hover:text-emerald-500'>
                      <Edit3 className='w-4 h-4' />
                      Trocar
                    </Button>
                  </div>
                  <CardDescription>
                    Enviaremos seu currículo mais recente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4'>
                    <div className='flex items-start gap-4'>
                      <div className='w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0'>
                        <FileText className='w-6 h-6 text-emerald-500' />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='font-semibold text-emerald-500 mb-1'>
                          {userProfile.resumeFile}
                        </p>
                        <div className='flex items-center gap-3 text-xs text-muted-foreground'>
                          <span>PDF • 342 KB</span>
                          <span>•</span>
                          <span>Atualizado há {userProfile.resumeUpdated}</span>
                        </div>
                      </div>
                      <Check className='w-5 h-5 text-emerald-500 shrink-0' />
                    </div>
                  </div>

                  <div className='bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 mt-4'>
                    <div className='flex items-start gap-3'>
                      <Sparkles className='w-5 h-5 text-emerald-500 shrink-0 mt-0.5' />
                      <div className='text-sm space-y-1'>
                        <p className='font-medium text-emerald-500'>
                          Match Score: 92%
                        </p>
                        <p className='text-muted-foreground'>
                          Seu perfil tem alta compatibilidade com esta vaga! Suas skills em React, Node.js e TypeScript são um excelente match.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mensagem Opcional */}
              <Card className='bg-card/50 backdrop-blur'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <div className='rounded-lg bg-emerald-500/10 p-2'>
                      <Edit3 className='h-5 w-5 text-emerald-500' />
                    </div>
                    Carta de Apresentação (Opcional)
                  </CardTitle>
                  <CardDescription>
                    Conte por que você é perfeito para esta vaga
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <Textarea
                    placeholder='Exemplo: Tenho 5 anos de experiência com React e Node.js, e recentemente liderei um projeto que aumentou a performance da aplicação em 40%. Estou animado com a oportunidade de trabalhar no Google porque...'
                    rows={6}
                    className='resize-none'
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />
                  <div className='flex items-start gap-2 text-xs text-muted-foreground'>
                    <Sparkles className='w-4 h-4 shrink-0 mt-0.5 text-emerald-500' />
                    <p>
                      <strong>Dica:</strong> Mencione projetos específicos, resultados quantificáveis e tecnologias relevantes para esta vaga.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className='flex justify-between items-center pt-4'>
                <Button
                  variant='outline'
                  onClick={() => window.history.back()}
                  className='gap-2'
                  disabled={isSubmitting}
                >
                  <ArrowLeft className='w-4 h-4' />
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmit}
                  size='lg'
                  className='gap-2 bg-emerald-600 hover:bg-emerald-700'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className='w-5 h-5' />
                      Enviar Candidatura
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className='space-y-6'>
              <Card className='bg-card/50 backdrop-blur sticky top-6'>
                <CardHeader>
                  <CardTitle className='text-lg'>Vaga Selecionada</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex items-start gap-3'>
                    <div className='text-4xl bg-background/80 p-3 rounded-lg border border-border/50'>
                      {job.logo}
                    </div>
                    <div className='flex-1'>
                      <h3 className='font-bold text-lg leading-tight mb-1'>
                        {job.title}
                      </h3>
                      <p className='text-muted-foreground font-medium'>
                        {job.company}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className='space-y-3 text-sm'>
                    <div className='flex items-center gap-2 text-muted-foreground'>
                      <MapPin className='w-4 h-4' />
                      <span>{job.location}</span>
                    </div>
                    <div className='flex items-center gap-2 text-muted-foreground'>
                      <Briefcase className='w-4 h-4' />
                      <span>{job.remote}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <DollarSign className='w-4 h-4 text-emerald-500' />
                      <span className='font-semibold text-emerald-500'>
                        {job.salary}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className='bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4'>
                    <div className='flex items-start gap-2'>
                      <Zap className='w-4 h-4 text-emerald-500 shrink-0 mt-0.5' />
                      <div className='text-xs space-y-1'>
                        <p className='font-semibold text-emerald-500'>
                          Candidatura Instantânea
                        </p>
                        <p className='text-muted-foreground leading-relaxed'>
                          Seus dados estão prontos! Clique em enviar e pronto. ⚡
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className='bg-linear-to-br from-emerald-500/10 via-emerald-600/5 to-transparent border-emerald-500/20'>
                <CardContent className='p-6'>
                  <div className='space-y-3 text-center'>
                    <div className='mx-auto w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center'>
                      <Building2 className='w-6 h-6 text-emerald-500' />
                    </div>
                    <div>
                      <h4 className='font-semibold mb-1'>Empresa Verificada ✓</h4>
                      <p className='text-xs text-muted-foreground'>
                        {job.company} é uma empresa verificada e confiável no GoDev
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className='bg-card/50 backdrop-blur'>
                <CardHeader>
                  <CardTitle className='text-lg flex items-center gap-2'>
                    <Clock className='w-4 h-4 text-emerald-500' />
                    Por que candidatar-se agora?
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3 text-sm'>
                  <div className='flex items-start gap-2'>
                    <div className='w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2' />
                    <p className='text-muted-foreground'>
                      Vagas populares recebem <strong className='text-foreground'>centenas de candidaturas</strong> nas primeiras 48h
                    </p>
                  </div>
                  <div className='flex items-start gap-2'>
                    <div className='w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2' />
                    <p className='text-muted-foreground'>
                      Empresas geralmente revisam candidatos na <strong className='text-foreground'>ordem de chegada</strong>
                    </p>
                  </div>
                  <div className='flex items-start gap-2'>
                    <div className='w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2' />
                    <p className='text-muted-foreground'>
                      Seu perfil tem <strong className='text-foreground'>92% de match</strong> com esta vaga
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Main>
    </>
  )
}
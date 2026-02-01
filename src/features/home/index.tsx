import { Lock, Crown, Briefcase, Globe, BadgeCheck, Timer, ArrowRight, Check, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Link } from '@tanstack/react-router'

export function Home() {
  const isUserPremium = false

  const sections = [
    {
      title: 'Vagas',
      description: 'Encontre oportunidades alinhadas ao seu perfil e momento de carreira.',
      items: [
        {
          title: 'Vagas nacionais',
          subtitle: 'CLT e PJ',
          description: 'Oportunidades no Brasil em empresas de todos os portes',
          benefits: ['Remoto, híbrido ou presencial', 'Filtros avançados por stack', 'Notificações instantâneas'],
          icon: Briefcase,
          href: '/jobs',
          locked: false,
          cta: 'Explorar vagas',
          bgImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
        },
        {
          title: 'Vagas internacionais',
          subtitle: 'A partir de R$ 20k/mês',
          description: 'Oportunidades globais filtradas para brasileiros',
          benefits: ['Salários em dólar/euro', 'Empresas que aceitam brasileiros', 'Suporte para relocação'],
          icon: Globe,
          href: '/jobs?scope=international',
          locked: !isUserPremium,
          premium: true,
          cta: 'Ver vagas internacionais',
          bgImage: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1200&q=80',
        },
      ],
    },
    {
      title: 'Preparação para entrevistas',
      description: 'Treine no ritmo real das entrevistas técnicas.',
      items: [
        {
          title: 'Simulados cronometrados',
          subtitle: 'Como nas big techs',
          description: 'Pratique com tempo real e feedback detalhado',
          benefits: ['Questões de FAANG', 'Análise de performance', 'Dicas personalizadas'],
          icon: Timer,
          href: '/interview-prep',
          locked: !isUserPremium,
          premium: true,
          cta: 'Começar treino',
          bgImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80',
        },
      ],
    },
    {
      title: 'Certificações',
      description: 'Valide seu nível técnico e destaque seu perfil para recrutadores.',
      items: [
        {
          title: 'Certificações por tecnologia',
          subtitle: 'React, Node, Java e mais',
          description: 'Prove suas habilidades com certificados reconhecidos',
          benefits: ['Selo verificado no perfil', 'Destaque para recrutadores', 'Múltiplos níveis'],
          icon: BadgeCheck,
          href: '/certifications',
          locked: !isUserPremium,
          premium: true,
          cta: 'Ver certificações',
          bgImage: 'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?w=1200&q=80',
        },
      ],
    },
  ]

  return (
    <>
      <Header>
        <div className="ms-auto flex items-center gap-4">
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className="pb-20">
        <div className="space-y-16">
          {/* Hero Banner */}
          <div className="group relative overflow-hidden rounded-2xl">
            <img
              src="/images/go-dev-banner8.png"
              alt="Hero banner"
              className="
                h-[200px] w-full object-cover md:h-[230px] opacity-90
                transition-transform duration-700 ease-out
                group-hover:scale-105
              "
            />

            {/* Overlay suave no hover */}
            <div
              className="
                pointer-events-none absolute inset-0
                bg-gradient-to-t from-black/30 via-transparent to-transparent
                opacity-0 transition-opacity duration-500
                group-hover:opacity-100
              "
            />
          </div>

          {sections.map((section) => (
            <div key={section.title} className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">{section.title}</h2>
                <p className="text-muted-foreground">{section.description}</p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const isLocked = item.locked
                  const CardWrapper = isLocked ? 'div' : Link

                  return (
                    <CardWrapper
                      key={item.title}
                      {...(!isLocked && { to: item.href })}
                      className="group block"
                    >
                      <Card className="relative h-full overflow-hidden border-0 bg-transparent transition-all duration-500 hover:scale-[1.02]">
                        {/* Background Image with Zoom Effect */}
                        <div className="absolute inset-0">
                          <div className="h-full w-full overflow-hidden">
                            <img
                              src={item.bgImage}
                              alt=""
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          </div>
                          {/* Gradient Overlay com a cor primary (verde) */}
                          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/95 via-emerald-900/85 to-emerald-800/70" />
                          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
                          <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 group-hover:bg-black/10" />
                        </div>

                        {/* Content */}
                        <CardContent className="relative flex h-full min-h-[420px] flex-col p-6">
                          <div className="flex-1 space-y-5">
                            {/* Header with Icon and Badge */}
                            <div className="flex items-start justify-between gap-3">
                              <div className="rounded-xl bg-white/10 p-3 backdrop-blur-md ring-1 ring-white/20 transition-all group-hover:bg-white/20">
                                <Icon className="h-7 w-7 text-white" strokeWidth={2} />
                              </div>

                              {item.premium && (
                                <Badge className="gap-1.5 border-0 bg-emerald-400/90 px-3 py-1 text-xs font-semibold text-emerald-950 shadow-lg shadow-emerald-500/30 backdrop-blur-sm">
                                  <Crown className="h-3.5 w-3.5" />
                                  Premium
                                </Badge>
                              )}
                            </div>

                            {/* Title and Subtitle */}
                            <div className="space-y-1.5">
                              <h3 className="text-2xl font-bold leading-tight text-white drop-shadow-lg">
                                {item.title}
                              </h3>
                              <p className="text-sm font-medium text-white/90 drop-shadow">
                                {item.subtitle}
                              </p>
                            </div>

                            {/* Description */}
                            <p className="text-sm leading-relaxed text-white/95 drop-shadow">
                              {item.description}
                            </p>

                            {/* Benefits List */}
                            <ul className="space-y-2 pt-2">
                              {item.benefits.map((benefit) => (
                                <li key={benefit} className="flex items-start gap-2 text-sm text-white/95 drop-shadow">
                                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" strokeWidth={3} />
                                  <span className="font-medium">{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* CTA */}
                          <div className="relative z-10 pt-6">
                            {isLocked ? (
                              <div className="space-y-3">
                                <Button
                                  size="lg"
                                  className="w-full gap-2 bg-primary text-base font-semibold text-primary-foreground shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] hover:bg-primary-dark"
                                  asChild
                                >
                                  <Link
                                    to="/pricing"
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                  >
                                    Desbloquear com Premium
                                  </Link>
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="lg"
                                className="group/btn w-full gap-2 bg-white text-base font-semibold text-black shadow-xl transition-all hover:scale-[1.02] hover:bg-white/95"
                              >
                                {item.cta}
                                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </CardWrapper>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Trust Signal - Social Proof */}
          {/* <div className="rounded-2xl border bg-muted/50 p-8 text-center backdrop-blur-sm">
            <div className="mx-auto max-w-2xl space-y-4">
              <p className="text-sm font-medium text-muted-foreground">
                Junte-se a mais de 15.000 desenvolvedores
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8 opacity-60 grayscale">
                <div className="h-8 w-24 rounded bg-foreground/10" />
                <div className="h-8 w-24 rounded bg-foreground/10" />
                <div className="h-8 w-24 rounded bg-foreground/10" />
                <div className="h-8 w-24 rounded bg-foreground/10" />
              </div>
            </div>
          </div> */}
        </div>
      </Main>
    </>
  )
}
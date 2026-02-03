import {
  Briefcase,
  Globe,
  BadgeCheck,
  Timer,
  ArrowRight,
  Check,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

/* ================= VISUAL TOKENS ================= */

const CARD_BASE =
  'relative h-full overflow-hidden rounded-xl border border-border/60 bg-card/50 backdrop-blur transition-all duration-300'

const CARD_HOVER =
  'hover:-translate-y-1 hover:shadow-lg'

const PREMIUM_STRIPE =
  'pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/80 to-transparent'

const PREMIUM_GLOW =
  'shadow-[0_0_0_1px_rgba(16,185,129,0.25),0_14px_40px_rgba(16,185,129,0.30)]'

// imagem bloqueada
const PREMIUM_IMAGE_MUTED =
  'brightness-[0.75] saturate-[1.05]'

const PREMIUM_IMAGE_OVERLAY =
  'absolute inset-0 bg-emerald-900/55 mix-blend-multiply'

// botões
const LOCKED_BUTTON =
  'bg-zinc-900/80 text-zinc-200 border border-zinc-700 hover:bg-zinc-900'

const PRIMARY_BUTTON =
  'bg-primary text-primary-foreground hover:bg-primary/90'

export function Home() {
  const isUserPremium = false

  const sections = [
    {
      title: 'Vagas',
      description: 'Oportunidades alinhadas ao seu momento.',
      items: [
        {
          title: 'Vagas nacionais',
          subtitle: 'CLT e PJ',
          description: 'Empresas brasileiras de todos os portes',
          benefits: [
            'Remoto, híbrido ou presencial',
            'Filtros por stack',
            'Alertas instantâneos',
          ],
          icon: Briefcase,
          href: '/jobs',
          locked: false,
          cta: 'Explorar vagas',
          bgImage:
            'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=1200&q=80',
        },
        {
          title: 'Vagas internacionais',
          subtitle: 'A partir de R$ 20k/mês',
          description: 'Oportunidades globais para brasileiros',
          benefits: [
            'Salários em dólar/euro',
            'Empresas internacionais',
            'Relocation friendly',
          ],
          icon: Globe,
          href: '/jobs?scope=international',
          locked: !isUserPremium,
          premium: true,
          cta: 'Ver vagas',
          // 🔥 IMAGEM NOVA (melhor)
          bgImage:
            'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80',
        },
      ],
    },
    {
      title: 'Preparação',
      description: 'Treine como em entrevistas reais.',
      items: [
        {
          title: 'Simulados técnicos',
          subtitle: 'Big tech style',
          description: 'Questões no ritmo real',
          benefits: ['FAANG-style', 'Feedback técnico', 'Evolução contínua'],
          icon: Timer,
          href: '/interview-prep',
          locked: !isUserPremium,
          premium: true,
          cta: 'Começar',
          bgImage:
            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80',
        },
      ],
    },
    {
      title: 'Certificações',
      description: 'Destaque técnico validado.',
      items: [
        {
          title: 'Certificações',
          subtitle: 'Por tecnologia',
          description: 'Comprove suas habilidades',
          benefits: ['Selo verificado', 'Visibilidade no perfil'],
          icon: BadgeCheck,
          href: '/certifications',
          locked: !isUserPremium,
          premium: true,
          cta: 'Ver certificações',
          bgImage:
            'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?w=1200&q=80',
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
        <div className="space-y-12">
          {sections.map((section) => (
            <div key={section.title} className="space-y-4">
              <div>
                <h2 className="text-xl font-bold">{section.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {section.description}
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const Wrapper = item.locked ? 'div' : Link

                  return (
                    <Wrapper
                      key={item.title}
                      {...(!item.locked && { to: item.href })}
                      className={cn(
                        'group block',
                        item.locked && 'cursor-not-allowed'
                      )}
                    >
                      <Card
                        className={cn(
                          CARD_BASE,
                          CARD_HOVER,
                          item.locked && PREMIUM_GLOW
                        )}
                      >
                        {item.locked && <div className={PREMIUM_STRIPE} />}

                        {/* Background */}
                        <div className="absolute inset-0">
                          <img
                            src={item.bgImage}
                            alt=""
                            className={cn(
                              'h-full w-full object-cover transition-transform duration-700 group-hover:scale-105',
                              item.locked && PREMIUM_IMAGE_MUTED
                            )}
                          />

                          {item.locked && (
                            <div className={PREMIUM_IMAGE_OVERLAY} />
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                        </div>

                        {/* Content */}
                        <CardContent className="relative flex min-h-[280px] flex-col p-5">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="rounded-md bg-white/10 p-2 ring-1 ring-white/20">
                                <Icon className="h-5 w-5 text-white" />
                              </div>

                              {item.premium && (
                                <Badge className="bg-emerald-950/90 text-emerald-200 border border-emerald-800 text-[10px] font-semibold">
                                  Premium
                                </Badge>
                              )}
                            </div>

                            <div>
                              <h3 className="text-base font-bold text-white">
                                {item.title}
                              </h3>
                              <p className="text-xs text-white/75">
                                {item.subtitle}
                              </p>
                            </div>

                            <p className="text-sm text-white/85 leading-snug">
                              {item.description}
                            </p>

                            <ul className="space-y-1">
                              {item.benefits.map((b) => (
                                <li
                                  key={b}
                                  className="flex items-center gap-2 text-xs text-white/80"
                                >
                                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                                  {b}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="pt-4">
                            {item.locked ? (
                              <Button
                                size="sm"
                                className={cn('w-full', LOCKED_BUTTON)}
                                asChild
                              >
                                <Link
                                  to="/pricing"
                                  onClick={() =>
                                    window.scrollTo({ top: 0, behavior: 'smooth' })
                                  }
                                >
                                  Premium
                                </Link>
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                className={cn('w-full', PRIMARY_BUTTON)}
                              >
                                {item.cta}
                                <ArrowRight className="ml-1 h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Wrapper>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </Main>
    </>
  )
}
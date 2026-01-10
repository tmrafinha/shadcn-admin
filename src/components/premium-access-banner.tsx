import { useMemo, useState } from 'react'
import {
  ArrowRight,
  BellRing,
  Briefcase,
  Crown,
  ShieldCheck,
  TrendingUp,
  Zap,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

type PremiumAccessBannerProps = {
  isUserPremium: boolean
  priceLabel?: string // ex: "R$ 67,90"
  onSubscribeClick?: () => void
}

export function PremiumAccessBanner({
  isUserPremium,
  priceLabel = 'R$ 67,90',
  onSubscribeClick,
}: PremiumAccessBannerProps) {
  const [open, setOpen] = useState(false)

  if (isUserPremium) return null

  // Mesmo padrão visual que você já vem usando
  const PREMIUM_BADGE_CLASS =
    'gap-1 whitespace-nowrap border border-emerald-300/40 bg-gradient-to-r from-lime-400 via-emerald-400 to-emerald-500 text-white shadow-sm dark:border-emerald-400/20'

  const PREMIUM_CARD_STRIPE_CLASS =
    'pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-emerald-400/90 to-transparent'

  const PREMIUM_GLOW_CLASS =
    'shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_14px_40px_rgba(16,185,129,0.10)] dark:shadow-[0_0_0_1px_rgba(16,185,129,0.12),0_14px_40px_rgba(16,185,129,0.12)]'

  const PREMIUM_TEXTURE_CLASS =
    'pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(16,185,129,0.18),transparent_60%)]'

  const handleSubscribe = () => {
    onSubscribeClick?.()
  }

  const price = useMemo(() => {
    const match = priceLabel.match(/(\d[\d\.\,]*)/)
    const num = match?.[1] ?? priceLabel
    return {
      prefix: priceLabel.includes('R$') ? 'R$' : '',
      value: num,
    }
  }, [priceLabel])

  return (
    <>
      {/* ✅ Banner/Card (arrumado no mobile) */}
      <Card
        className={`relative overflow-hidden border-border/60 bg-card/50 backdrop-blur ${PREMIUM_GLOW_CLASS}`}
      >
        <div className={PREMIUM_CARD_STRIPE_CLASS} />
        <div className={PREMIUM_TEXTURE_CLASS} />

        <CardContent className="p-4">
          {/* Top: badge + headline */}
          <div className="flex items-start gap-3">
            <Badge variant="secondary" className={PREMIUM_BADGE_CLASS}>
              <Crown className="h-3 w-3" />
              Premium
            </Badge>

            <div className="min-w-0">
              <p className="text-sm font-semibold">
                Destrave o acesso às oportunidades que pagam de verdade.
              </p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Por{' '}
                <span className="font-semibold text-foreground">{priceLabel}</span>
                , você entra no fluxo de{' '}
                <span className="font-semibold text-foreground">vagas 10k+/mês</span>,{' '}
                <span className="font-semibold text-foreground">projetos recorrentes</span> e{' '}
                <span className="font-semibold text-foreground">match priorizado</span>.
                <span className="font-semibold text-foreground">
                  {' '}
                  1 PJ garantido ou dinheiro de volta.
                </span>
              </p>
            </div>
          </div>

          {/* Bottom: mobile (preço + botão full) / desktop (preço ao lado + botão) */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Mobile price pill */}
            <div className="relative overflow-hidden rounded-lg border border-border/60 bg-background/40 px-3 py-2 sm:hidden">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground">
                    Entrada única
                  </p>
                  <p className="leading-none font-bold text-primary">
                    <span className="align-top text-xs">{price.prefix}</span>{' '}
                    <span className="text-xl">{price.value}</span>
                  </p>
                </div>
                <Badge variant="secondary" className={PREMIUM_BADGE_CLASS}>
                  <Crown className="h-3 w-3" />
                  Premium
                </Badge>
              </div>
            </div>

            {/* Desktop price (sem quebrar) */}
            <div className="hidden text-right sm:block">
              <p className="text-[11px] font-medium text-muted-foreground">
                Entrada única
              </p>
              <p className="leading-none font-bold text-primary">
                <span className="align-top text-xs">{price.prefix}</span>{' '}
                <span className="text-2xl">{price.value}</span>
              </p>
            </div>

            <Button
              size="sm"
              className="h-10 w-full gap-2 sm:h-9 sm:w-auto"
              onClick={() => setOpen(true)}
            >
              Quero destravar <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ✅ Dialog (scroll só no conteúdo, sem footer "flutuando" por cima) */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="relative sm:max-w-xl !fixed !top-[50%] !left-[50%] !-translate-x-1/2 !-translate-y-1/2 z-[100]">
          <div className={PREMIUM_CARD_STRIPE_CLASS} />
          <div className={PREMIUM_TEXTURE_CLASS} />

          <div className="max-h-[calc(75vh-6rem)] sm:max-h-[calc(85vh-8rem)] overflow-y-auto pr-2">
            <DialogHeader className="text-start">
              <DialogTitle className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className={PREMIUM_BADGE_CLASS}>
                  <Crown className="h-3 w-3" />
                  Premium
                </Badge>
                <span className="text-base sm:text-lg">GoDev Premium</span>
              </DialogTitle>

              <DialogDescription className="mt-1">
                <span className="font-semibold text-foreground">
                  Transforme aplicações em propostas:
                </span>{' '}
                entre no grupo que recebe as melhores oportunidades (PJ e CLT) e
                chegue primeiro nas vagas.
                <br />
                Por{' '}
                <span className="font-semibold text-foreground">{priceLabel}</span>{' '}
                — e com garantia:
                <span className="font-semibold text-foreground">
                  {' '}
                  1 projeto PJ garantido ou dinheiro de volta.
                </span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Caixa de valor */}
              <div
                className={`relative overflow-hidden rounded-xl border border-border/60 bg-background/40 p-4 ${PREMIUM_GLOW_CLASS}`}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold">
                      Acesso Premium (porta de entrada)
                    </p>
                    <p className="text-muted-foreground text-xs">
                      A GoDev conecta fornecedores de tecnologia com empresas
                      contratando. No Premium, você ganha prioridade e entra nas
                      oportunidades "acima da média".
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-[11px] font-medium text-muted-foreground">
                      Entrada
                    </p>
                    <p className="leading-none font-bold text-primary whitespace-nowrap">
                      <span className="align-top text-xs">{price.prefix}</span>{' '}
                      <span className="text-3xl">{price.value}</span>
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Benefícios */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-background/50 p-3">
                    <div className="rounded-md bg-primary/10 p-2">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Vagas 10k+ / mês</p>
                      <p className="text-xs text-muted-foreground">
                        Acesso ao pipeline Premium com faixas acima de 10k/mês.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-background/50 p-3">
                    <div className="rounded-md bg-primary/10 p-2">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Projetos recorrentes</p>
                      <p className="text-xs text-muted-foreground">
                        Contratos que renovam: renda mais previsível.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-background/50 p-3">
                    <div className="rounded-md bg-primary/10 p-2">
                      <BellRing className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Chegue primeiro</p>
                      <p className="text-xs text-muted-foreground">
                        Alertas + prioridade no match pra você não perder timing.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-background/50 p-3">
                    <div className="rounded-md bg-primary/10 p-2">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Aplicação mais rápida</p>
                      <p className="text-xs text-muted-foreground">
                        Menos fricção, mais velocidade pra converter em entrevista.
                      </p>
                    </div>
                  </div>

                  <div className="sm:col-span-2 flex items-start gap-3 rounded-lg border border-border/50 bg-background/50 p-3">
                    <div className="rounded-md bg-primary/10 p-2">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        Garantia real (sem pegadinha)
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Se não vier{' '}
                        <span className="font-semibold text-foreground">
                          1 projeto PJ
                        </span>
                        , você pede reembolso e pronto.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fechamento */}
              <p className="text-sm text-muted-foreground">
                Você não precisa de "mais vagas".
                <span className="font-semibold text-foreground">
                  {' '}
                  Você precisa das vagas certas — e de prioridade pra ser visto.
                </span>
              </p>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <a href="https://pay.kiwify.com.br/J4oFiud" className="w-full">
              <Button className="w-full gap-2" onClick={handleSubscribe}>
                <Crown className="h-4 w-4" />
                Ativar Premium por {priceLabel}
              </Button>
            </a>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
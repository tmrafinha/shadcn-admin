// src/assets/godev-logo.tsx
import { cn } from '@/lib/utils'

type GoDevLogoSize = 'sm' | 'md' | 'lg' | 'xl'

type GoDevLogoProps = {
  className?: string
  collapsed?: boolean
  size?: GoDevLogoSize
}

const sizes: Record<
  GoDevLogoSize,
  { collapsed: string; expanded: string; text: string; textWidth: string }
> = {
  sm: { collapsed: 'h-7 w-7', expanded: 'h-6',  text: 'text-lg',  textWidth: 'max-w-[4.75rem]' },
  md: { collapsed: 'h-9 w-9', expanded: 'h-7',  text: 'text-xl',  textWidth: 'max-w-[5.5rem]' },
  lg: { collapsed: 'h-12 w-12', expanded: 'h-10', text: 'text-2xl', textWidth: 'max-w-[6.5rem]' },
  xl: { collapsed: 'h-16 w-16', expanded: 'h-14', text: 'text-3xl', textWidth: 'max-w-[7.5rem]' },
}

export function GoDevLogo({ className, collapsed, size = 'md' }: GoDevLogoProps) {
  const s = sizes[size]

  // entrada mais rápida, saída mais suave
  const wrapTransition = collapsed
    ? 'duration-450 ease-out'   // fechando: mais suave
    : 'duration-220 ease-out'   // abrindo: mais rápido

  const textTransition = collapsed
    ? 'duration-500 ease-out'   // sumindo: bem suave
    : 'duration-200 ease-out'   // aparecendo: rápido

  const imgTransition = collapsed
    ? 'duration-380 ease-out'
    : 'duration-220 ease-out'

  return (
    <div
      className={cn(
        'flex items-center overflow-hidden',
        // evita "pulo" animando só o necessário
        'transition-[gap] motion-reduce:transition-none',
        wrapTransition,
        collapsed ? 'justify-center gap-0' : 'gap-2',
        className,
      )}
    >
      <img
        src="/images/logo-godev.png"
        alt="Go Dev logo"
        className={cn(
          'w-auto object-contain',
          'transition-[height,width] motion-reduce:transition-none',
          imgTransition,
          collapsed ? s.collapsed : s.expanded,
        )}
      />

      <span
        className={cn(
          'font-bold text-slate-900 dark:text-white whitespace-nowrap overflow-hidden',
          s.text,
          // anima só max-width, opacity e transform (mais estável que width)
          'transition-[max-width,opacity,transform] motion-reduce:transition-none',
          textTransition,
          collapsed
            ? 'max-w-0 opacity-0 translate-x-0' // saída: sem puxar tanto pro lado
            : cn(s.textWidth, 'opacity-100 translate-x-0'),
        )}
      >
        GoDev
      </span>
    </div>
  )
}
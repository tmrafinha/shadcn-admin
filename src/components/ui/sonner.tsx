// src/components/ui/sonner-toaster.tsx (ou onde estiver seu Toaster)
import { Toaster as Sonner, ToasterProps } from 'sonner'
import { useTheme } from '@/context/theme-provider'

export function Toaster({ ...props }: ToasterProps) {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      position="top-center"
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        style: {
          fontSize: '0.95rem',
        },
        classNames: {
          // estilo base de qualquer toast
          toast:
            'group toast border shadow-lg shadow-black/20 rounded-lg px-4 py-3 [&_div[data-title]]:font-semibold',
          // sucesso bem verdinho
          success:
            'bg-emerald-500 text-emerald-50 border-emerald-400',
          // erro mais evidente também (opcional)
          error:
            'bg-destructive text-destructive-foreground border-destructive/60',
        },
      }}
      className="toaster group [&_div[data-content]]:w-full"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}
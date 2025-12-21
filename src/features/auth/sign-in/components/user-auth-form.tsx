import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { login } from '@/services/auth.service'
import type { LoginResponseData } from '@/features/auth/auth.types'

const formSchema = z.object({
  email: z
    .string(),
  password: z
    .string()
    .min(1, 'Digite sua senha')
    .min(5, 'Senha deve ter pelo menos 5 caracteres'),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    const promise = login({
      email: values.email,
      password: values.password,
    })

    toast.promise<LoginResponseData>(promise, {
      loading: 'Entrando...',
      success: (res) => {
        const { user, token } = res

        auth.setUser({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          companyId: user.companyId,
        })

        auth.setAccessToken(token)

        const targetPath = redirectTo || '/'
        navigate({ to: targetPath, replace: true })

        setIsLoading(false)

        return `Bem-vindo de volta, ${user.name}!`
      },
      error: (err: any) => {
        setIsLoading(false)

        const msgFromApi =
          err?.response?.data?.message ??
          err?.response?.data?.errors?.[0]?.message

        return (
          msgFromApi || 'Não foi possível fazer login. Verifique seus dados.'
        )
      },
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              {/* <Link
                to='/forgot-password'
                className='absolute end-0 -top-0.5 text-sm font-medium text-muted-foreground hover:opacity-75'
              >
                Esqueceu a senha?
              </Link> */}
            </FormItem>
          )}
        />

        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <LogIn className='mr-2 h-4 w-4' />}
          Entrar
        </Button>

      </form>
    </Form>
  )
}
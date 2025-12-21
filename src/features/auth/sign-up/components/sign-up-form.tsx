import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

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
import { useAuthStore } from '@/stores/auth-store'
import { register } from '@/services/auth.service'
import type { RegisterResponseData } from '@/features/auth/auth.types'

const formSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Digite seu nome'),
    email: z
      .string()
      .email('Digite um e-mail válido'),
    password: z
      .string()
      .min(1, 'Digite sua senha')
      .min(5, 'Senha deve ter pelo menos 5 caracteres'),
    confirmPassword: z
      .string()
      .min(1, 'Confirme sua senha'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não conferem.',
    path: ['confirmPassword'],
  })

export function SignUpForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    const promise = register({
      name: values.name,
      email: values.email,
      password: values.password,
      role: 'CANDIDATE', // fixo por enquanto
    })

    toast.promise<RegisterResponseData>(promise, {
      loading: 'Criando sua conta...',
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

        navigate({ to: '/', replace: true })
        setIsLoading(false)

        return `Bem-vindo, ${user.name}!`
      },
      error: (err: any) => {
        setIsLoading(false)

        const msgFromApi =
          err?.response?.data?.message ??
          err?.response?.data?.errors?.[0]?.message

        return (
          msgFromApi ||
          'Não foi possível criar sua conta. Tente novamente.'
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
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder='Seu nome completo' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar senha</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className='mt-2' disabled={isLoading}>
          {isLoading && (
            <span className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
          )}
          Criar Conta
        </Button>
      </form>
    </Form>
  )
}
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'
import { updateMyProfile } from '@/services/users.service'

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

const profileFormSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Nome deve ter pelo menos 2 caracteres.')
      .max(100, 'Nome muito longo.'),
    newPassword: z
      .string()
      .min(6, 'Senha deve ter pelo menos 6 caracteres.')
      .optional()
      .or(z.literal('')),
    confirmNewPassword: z
      .string()
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) =>
      !data.newPassword || data.newPassword === data.confirmNewPassword,
    {
      message: 'As senhas não conferem.',
      path: ['confirmNewPassword'],
    },
  )

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { auth } = useAuthStore()
  const user = auth.user

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name ?? '',
      newPassword: '',
      confirmNewPassword: '',
    },
  })

  // Garante que, se o user chegar depois, o form seja atualizado
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        newPassword: '',
        confirmNewPassword: '',
      })
    }
  }, [user, form])

  async function onSubmit(values: ProfileFormValues) {
    if (!user) {
      toast.error('Você precisa estar logado para atualizar o perfil.')
      return
    }

    setIsSubmitting(true)

    try {
      const payload: { name?: string; password?: string } = {
        name: values.name,
      }

      if (values.newPassword) {
        payload.password = values.newPassword
      }

      const promise = updateMyProfile(payload)

      await toast.promise(promise, {
        loading: 'Salvando alterações...',
        success: (updatedUser) => {
          // atualiza o auth store com o novo nome
          auth.setUser({
            ...auth.user!,
            name: updatedUser.name,
          })

          // limpa campos de senha
          form.reset({
            name: updatedUser.name,
            newPassword: '',
            confirmNewPassword: '',
          })

          return payload.password
            ? 'Perfil e senha atualizados com sucesso!'
            : 'Perfil atualizado com sucesso!'
        },
        error: (err: any) => {
          const msg =
            err?.response?.data?.message ??
            err?.response?.data?.errors?.[0]?.message ??
            'Não foi possível atualizar o perfil.'
          return msg
        },
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const roleLabel = (() => {
    switch (user?.role) {
      case 'CANDIDATE':
        return 'Candidato'
      case 'RECRUITER':
        return 'Recrutador'
      case 'COMPANY_ADMIN':
        return 'Administrador da empresa'
      case 'ADMIN':
        return 'Administrador'
      default:
        return 'Usuário'
    }
  })()

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('space-y-6', className)}
        {...props}
      >
        {/* Dados básicos */}
        <div className="grid gap-4 sm:grid-cols-1">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="sm:col-span-1">
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Seu nome"
                    {...field}
                    disabled={isSubmitting || !user}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Info não editável */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FormLabel>Cargo / Papel</FormLabel>
            <Input
              value={roleLabel}
              disabled
              className="mt-1.5"
            />
            <p className="text-muted-foreground mt-1 text-xs">
              Definido de acordo com seu tipo de conta.
            </p>
          </div>

          <div className="sm:col-span-1">
            <FormLabel>Email</FormLabel>
            <Input
              value={user?.email ?? ''}
              disabled
              className="mt-1.5"
            />
            <p className="text-muted-foreground mt-1 text-xs">
              Este é o e-mail vinculado à sua conta.
            </p>
          </div>

          {user?.companyId && (
            <div>
              <FormLabel>Empresa vinculada</FormLabel>
              <Input
                value={user.companyId}
                disabled
                className="mt-1.5 font-mono text-xs"
              />
              <p className="text-muted-foreground mt-1 text-xs">
                ID da empresa associada à sua conta.
              </p>
            </div>
          )}
        </div>

        {/* Troca de senha opcional */}
        <div className="space-y-3">
          <p className="text-sm font-medium">Alterar senha (opcional)</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Deixe em branco para não alterar"
                      {...field}
                      disabled={isSubmitting || !user}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar nova senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Repita a nova senha"
                      {...field}
                      disabled={isSubmitting || !user}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Preencha os campos acima apenas se quiser definir uma nova senha.
          </p>
        </div>

        <Button type="submit" disabled={isSubmitting || !user}>
          {isSubmitting ? 'Salvando...' : 'Atualizar perfil'}
        </Button>

        {!user && (
          <p className="text-muted-foreground text-xs">
            Faça login para editar seus dados de perfil.
          </p>
        )}
      </form>
    </Form>
  )
}
import { Link, useSearch } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'

export function SignIn() {
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })

  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>Login</CardTitle>
          <CardDescription>
            Digite seu email e senha abaixo. <br />
            Ainda não tem conta?{' '}
            <Link
              to='/sign-up'
              search={redirect ? { redirect } : undefined}
              className='underline underline-offset-4 hover:text-primary'
            >
              Criar conta
            </Link>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <UserAuthForm redirectTo={redirect} />
        </CardContent>

        <CardFooter>
          <p className='px-8 text-center text-sm text-muted-foreground'>
            Ao entrar, você concorda com nossos{' '}
            <a
              href='/terms'
              className='underline underline-offset-4 hover:text-primary'
            >
              Termos de Responsabilidade
            </a>{' '}
            e{' '}
            <a
              href='/privacy'
              className='underline underline-offset-4 hover:text-primary'
            >
              Política de Privacidade
            </a>
            .
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
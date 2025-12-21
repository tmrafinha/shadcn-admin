import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { useAuthStore } from '@/stores/auth-store' // ajuste o path

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location }) => {
    const { user, accessToken } = useAuthStore.getState().auth

    if (!accessToken || !user) {
      throw redirect({
        to: '/sign-in',
        search: { redirect: location.href }, // opcional pra voltar depois
      })
    }
  },
  component: AuthenticatedLayout,
})
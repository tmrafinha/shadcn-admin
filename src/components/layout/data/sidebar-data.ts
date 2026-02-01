import {
  LayoutDashboard,
  Monitor,
  ListTodo,
  HelpCircle,
  Settings,
  UserCog,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Briefcase,
  Award,
  LibraryBig,
  Tag,
  Home,
} from 'lucide-react'
import { type SidebarData } from '../types'
import type { AuthUser } from '@/stores/auth-store'

// fallback caso não tenha usuário logado ainda
const fallbackUser: SidebarData['user'] = {
  name: 'Convidado',
  email: 'entre@seuemail.com',
  avatar: '/avatars/shadcn.jpg',
}

// parte estática (times, menus, etc.)
const baseSidebarData: Omit<SidebarData, 'user'> = {
  teams: [
    {
      name: 'Shadcn Admin',
      logo: Command,
      plan: 'Vite + ShadcnUI',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
     {
      title: 'Geral',
      items: [
        {
          title: 'Home',
          url: '/home',
          icon: Home,
        },
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Candidaturas',
          url: '/applications',
          icon: ListTodo,
        },
        // {
        //   title: 'Mensagens',
        //   url: '/chats',
        //   icon: MessagesSquare,
        // },
        // {
        //   title: 'Usuários',
        //   url: '/users',
        //   icon: Users,
        // },
      ],
    },
    {
      title: 'Mais Acessados',
      items: [
        {
          title: 'Vagas',
          url: '/jobs',
          icon: Briefcase,
        },
        {
          title: 'Certificações',
          url: '/certifications',
          icon: Award,
        },
        {
          title: 'Preparação para Entrevista',
          url: '/prepare',
          icon: LibraryBig,
        },
        // {
        //   title: 'Usuários',
        //   url: '/users',
        //   icon: Users,
        // },
      ],
    },
    {
      title: 'Configurações',
      items: [
        {
          title: 'Planos',
          url: '/pricing',
          icon: Tag,
        },
        {
          title: 'Configurações',
          icon: Settings,
          items: [
            {
              title: 'Perfil',
              url: '/settings',
              icon: UserCog,
            },
            {
              title: 'Currículos',
              url: '/settings/curriculum',
              icon: Monitor,
            },
          ],
        },
        {
          title: 'Ajuda',
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    },
  ],
}

// 👉 export estático pra quem ainda importa `sidebarData`
export const sidebarData: SidebarData = {
  user: fallbackUser,
  ...baseSidebarData,
}

// 👉 função pra montar com o usuário logado (AppSidebar usa essa)
export function buildSidebarData(user: AuthUser | null): SidebarData {
  return {
    user: user
      ? {
          name: user.name,
          email: user.email,
          // se no futuro tiver avatarUrl na API, troca aqui
          avatar: '/images/image.png',
        }
      : fallbackUser,
    ...baseSidebarData,
  }
}
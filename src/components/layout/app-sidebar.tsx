import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { NavGroup } from './nav-group'
import { GoDevLogo } from '@/assets/godev-logo'
import { useAuthStore } from '@/stores/auth-store'
import { buildSidebarData } from './data/sidebar-data'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  const { auth } = useAuthStore()
  const data = buildSidebarData(auth.user)

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <GoDevLogo collapsed={isCollapsed} />
      </SidebarHeader>

      <SidebarContent>
        {data.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>

      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
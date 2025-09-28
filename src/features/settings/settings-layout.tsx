import { Outlet } from '@tanstack/react-router'
import { Monitor, Bell, Palette, Wrench, UserCog } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { SidebarNav } from './components/sidebar-nav'

interface SettingsProps {
  role: 'admin' | 'teacher' | 'student'
  basePath: string
}

const getSettingsItems = (basePath: string) => [
  {
    title: 'Profile',
    href: `${basePath}/settings/`,
    icon: <UserCog size={18} />,
  },
  {
    title: 'Account',
    href: `${basePath}/settings/account`,
    icon: <Wrench size={18} />,
  },
  {
    title: 'Appearance',
    href: `${basePath}/settings/appearance`,
    icon: <Palette size={18} />,
  },
  {
    title: 'Notifications',
    href: `${basePath}/settings/notifications`,
    icon: <Bell size={18} />,
  },
  {
    title: 'Display',
    href: `${basePath}/settings/display`,
    icon: <Monitor size={18} />,
  },
]

const getRoleTitle = (role: string) => {
  switch (role) {
    case 'admin':
      return 'Administrator Settings'
    case 'teacher':
      return 'Teacher Settings'
    case 'student':
      return 'Student Settings'
    default:
      return 'Settings'
  }
}

const getRoleDescription = (role: string) => {
  switch (role) {
    case 'admin':
      return 'Manage your admin account settings and system preferences.'
    case 'teacher':
      return 'Manage your teacher profile and course preferences.'
    case 'student':
      return 'Manage your student profile and learning preferences.'
    default:
      return 'Manage your account settings and preferences.'
  }
}

export function Settings({ role, basePath }: SettingsProps) {
  const sidebarNavItems = getSettingsItems(basePath)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {getRoleTitle(role)}
        </h1>
        <p className="text-muted-foreground">
          {getRoleDescription(role)}
        </p>
      </div>
      <Separator />
      <div className="flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12">
        <aside className="top-0 lg:sticky lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex w-full overflow-y-hidden p-1">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
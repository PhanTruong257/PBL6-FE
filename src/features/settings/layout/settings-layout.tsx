import { Outlet } from '@tanstack/react-router'
import { Monitor, Bell, Palette, Wrench, UserCog } from 'lucide-react'
import { SidebarNav } from '../components/sidebar-nav'
import { Separator } from '@/components/ui/separator'
import type { UserRole } from '@/types/user'

interface SettingsLayoutProps {
  role: UserRole
  basePath: string
}

const getSettingsItems = (basePath: string) => [
  {
    title: 'Hồ sơ',
    href: `${basePath}/settings/profile`,
    icon: <UserCog size={18} />,
  },
  {
    title: 'Tài khoản',
    href: `${basePath}/settings/account`,
    icon: <Wrench size={18} />,
  },
  {
    title: 'Giao diện',
    href: `${basePath}/settings/appearance`,
    icon: <Palette size={18} />,
  },
  {
    title: 'Thông báo',
    href: `${basePath}/settings/notifications`,
    icon: <Bell size={18} />,
  },
  {
    title: 'Hiển thị',
    href: `${basePath}/settings/display`,
    icon: <Monitor size={18} />,
  },
]

const getRoleTitle = (role: UserRole) => {
  switch (role) {
    case 'admin':
      return 'Cài đặt Quản trị viên'
    case 'teacher':
      return 'Cài đặt Giảng viên'
    case 'student':
      return 'Cài đặt Sinh viên'
    default:
      return 'Cài đặt'
  }
}

const getRoleDescription = (role: UserRole) => {
  switch (role) {
    case 'admin':
      return 'Quản lý cài đặt tài khoản và hệ thống'
    case 'teacher':
      return 'Quản lý hồ sơ và tùy chọn giảng dạy'
    case 'student':
      return 'Quản lý hồ sơ và tùy chọn học tập'
    default:
      return 'Quản lý cài đặt tài khoản và tùy chọn'
  }
}

export function SettingsLayout({ role, basePath }: SettingsLayoutProps) {
  const sidebarNavItems = getSettingsItems(basePath)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {getRoleTitle(role)}
        </h1>
        <p className="text-muted-foreground">{getRoleDescription(role)}</p>
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

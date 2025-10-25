import { cn } from "@/libs/utils/cn"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { useRecoilValue } from 'recoil'
import { currentUserState } from '@/global/recoil/user'
import { getNavigationByRole } from '@/libs/constants/sidebar-navigation.const'
import type { MenuItem } from '@/libs/constants/sidebar-navigation.const'

export interface BaseMenuItem {
  title: string
  href?: string
}

export interface SidebarProps {
  className?: string
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  menuItems?: MenuItem[]
  bottomMenuItems?: MenuItem[]
  logoUrl?: string
  appName?: string
}

export function Sidebar({ className, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const user = useRecoilValue(currentUserState)

  // Map 'user' role to 'student' for navigation
  const userRole: 'admin' | 'teacher' | 'student' = 
    user?.role === 'user' ? 'student' : 
    user?.role === 'admin' ? 'admin' : 
    user?.role === 'teacher' ? 'teacher' : 
    'student'
  
  const navigation = getNavigationByRole(userRole)

  const filterByPermission = (items: MenuItem[]) => {
    if (!user?.permissions?.length) return items
    return items.filter((item) => {
      if (!item.permission) return true
      return user.permissions!.some((p) => p.key === item.permission)
    })
  }

  const mainMenuItems = filterByPermission(navigation.main)
  const bottomItems = filterByPermission(navigation.bottom)

  return (
    <div className={cn(
      "flex h-full flex-col border-r bg-sidebar",
      isCollapsed ? "w-[60px]" : "w-64",
      "transition-all duration-300 ease-in-out",
      className
    )}>
      {!isCollapsed && (
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-6 w-6"
            />
            <span className="text-sidebar-foreground">PBL6</span>
          </Link>
        </div>
      )}

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="grid gap-1">
          {mainMenuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <Button
                key={`main-${index}-${item.title}`}
                variant="ghost"
                className={cn(
                  "justify-start gap-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isCollapsed && "justify-center px-2"
                )}
                asChild
              >
                <Link to={item.href}>
                  <Icon className="h-4 w-4 shrink-0" />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              </Button>
            )
          })}
        </nav>
      </ScrollArea>

      <div className="mt-auto">
        <Separator className="my-2" />
        <nav className="grid gap-1 px-3 pb-4">
          {bottomItems.map((item, index) => {
            const Icon = item.icon
            return (
              <Button
                key={`bottom-${index}-${item.title}`}
                variant="ghost"
                className={cn(
                  "justify-start gap-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isCollapsed && "justify-center px-2"
                )}
                asChild
              >
                <Link to={item.href}>
                  <Icon className="h-4 w-4 shrink-0" />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              </Button>
            )
          })}
        </nav>

        <div className="border-t p-3">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start gap-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              isCollapsed && "justify-center px-2"
            )}
            onClick={onToggleCollapse}
          >
            <ChevronLeft className={cn(
              "h-4 w-4 shrink-0 transition-transform duration-200",
              isCollapsed && "rotate-180"
            )} />
            {!isCollapsed && <span>Thu gọn</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}
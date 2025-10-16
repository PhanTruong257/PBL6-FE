import { cn } from "@/libs/utils/cn"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  ChevronLeft,
  Home,
  BookOpen,
  Users,
  Settings,
  Calendar,
  FileText,
  GraduationCap,
  BarChart3,
  HelpCircle
} from "lucide-react"
import { Link } from "@tanstack/react-router"
import type React from "react"

export interface BaseMenuItem {
  title: string
  href?: string
}

export interface MenuItem extends BaseMenuItem {
  icon: React.ComponentType<{ className?: string }>
  submenu?: BaseMenuItem[]
}

export interface SidebarProps {
  className?: string
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  menuItems: MenuItem[]
  bottomMenuItems?: MenuItem[]
  logoUrl?: string
  appName?: string
}

const menuItems = [
  {
    title: "Trang chủ",
    href: "/user/dashboard",
    icon: Home,
  },
  {
    title: "Khóa học",
    href: "/user/courses",
    icon: BookOpen,
  },
  {
    title: "Lịch học",
    href: "/user/schedule",
    icon: Calendar,
  },
  {
    title: "Bài tập",
    href: "/user/assignments",
    icon: FileText,
  },
  {
    title: "Điểm số",
    href: "/user/grades",
    icon: BarChart3,
  },
  {
    title: "Sinh viên",
    href: "/user/students",
    icon: Users,
  },
  {
    title: "Giảng viên",
    href: "/user/teachers",
    icon: GraduationCap,
  },
]

const bottomMenuItems = [
  {
    title: "Trợ giúp",
    href: "/user/help",
    icon: HelpCircle,
  },
  {
    title: "Cài đặt",
    href: "/user/settings",
    icon: Settings,
  },
]

export function Sidebar({ className, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  return (
    <div className={cn(
      "flex h-full flex-col border-r bg-sidebar",
      isCollapsed ? "w-[60px]" : "w-64",
      "transition-all duration-300 ease-in-out",
      className
    )}>
      {/* Logo area - in header now, keeping minimal branding */}
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

      {/* Main navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="grid gap-1">
          {menuItems.map((item, index) => {
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

      {/* Bottom section */}
      <div className="mt-auto">
        <Separator className="my-2" />
        <nav className="grid gap-1 px-3 pb-4">
          {bottomMenuItems.map((item, index) => {
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

        {/* Collapse toggle */}
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
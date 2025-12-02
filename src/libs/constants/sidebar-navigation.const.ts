import {
  Users,
  Settings,
  Calendar,
  HelpCircle,
  BookMarked,
  ClipboardList,
  MessageSquare,
  Library,
  Bot,
  Shield,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface MenuItem {
  title: string
  href: string
  icon: LucideIcon
  badge?: string | number
  permission?: string
}

export interface SidebarNavigation {
  main: MenuItem[]
  bottom: MenuItem[]
}

/**
 * Admin sidebar navigation
 */
export const ADMIN_SIDEBAR_NAV: SidebarNavigation = {
  main: [
    {
      title: 'Quản lý người dùng',
      href: '/admin/manage-users',
      icon: Users,
    },
    {
      title: 'Phân quyền',
      href: '/admin/permissions',
      icon: Shield,
    },
    {
      title: 'Tin nhắn',
      href: '/conversation',
      icon: MessageSquare,
    },
    {
      title: 'Trợ lý AI',
      href: '/chatbot',
      icon: Bot,
    },
  ],
  bottom: [
    {
      title: 'Cài đặt hệ thống',
      href: '/admin/settings',
      icon: Settings,
    },
    {
      title: 'Trợ giúp',
      href: '/admin/help',
      icon: HelpCircle,
    },
  ],
}

/**
 * Teacher sidebar navigation
 */
export const TEACHER_SIDEBAR_NAV: SidebarNavigation = {
  main: [
    {
      title: 'Lớp học của tôi',
      href: '/classes',
      icon: BookMarked,
    },
    {
      title: 'Ngân hàng câu hỏi',
      href: '/questions',
      icon: Library,
    },
    {
      title: 'Quản lý bài kiểm tra',
      href: '/exam',
      icon: ClipboardList,
    },
    {
      title: 'Lịch kiểm tra',
      href: '/calendar',
      icon: Calendar,
    },
    {
      title: 'Tin nhắn',
      href: '/conversation',
      icon: MessageSquare,
    },
    {
      title: 'Trợ lý AI',
      href: '/chatbot',
      icon: Bot,
    },
  ],
  bottom: [
    {
      title: 'Cài đặt',
      href: '/profile',
      icon: Settings,
    },
    {
      title: 'Trợ giúp',
      href: '/dashboard',
      icon: HelpCircle,
    },
  ],
}

/**
 * Student sidebar navigation
 */
export const STUDENT_SIDEBAR_NAV: SidebarNavigation = {
  main: [
    {
      title: 'Lớp học của tôi',
      href: '/classes',
      icon: BookMarked,
    },
    {
      title: 'Làm bài kiểm tra',
      href: '/exam/student',
      icon: ClipboardList,
    },
    {
      title: 'Lịch kiểm tra',
      href: '/calendar',
      icon: Calendar,
    },
    {
      title: 'Tin nhắn',
      href: '/conversation',
      icon: MessageSquare,
    },
    {
      title: 'Trợ lý AI',
      href: '/chatbot',
      icon: Bot,
    },
  ],
  bottom: [
    {
      title: 'Cài đặt',
      href: '/profile',
      icon: Settings,
    },
  ],
}

/**
 * Get navigation by user role
 */
export function getNavigationByRole(
  role: 'admin' | 'teacher' | 'student',
): SidebarNavigation {
  switch (role) {
    case 'admin':
      return ADMIN_SIDEBAR_NAV
    case 'teacher':
      return TEACHER_SIDEBAR_NAV
    case 'student':
      return STUDENT_SIDEBAR_NAV
    default:
      return STUDENT_SIDEBAR_NAV
  }
}

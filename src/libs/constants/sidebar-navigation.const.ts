import {
  Home,
  BookOpen,
  Users,
  Settings,
  Calendar,
  FileText,
  GraduationCap,
  BarChart3,
  HelpCircle,
  LayoutDashboard,
  BookMarked,
  ClipboardList,
  Trophy,
  Bell,
  UserCog,
  FolderKanban,
  MessageSquare,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface MenuItem {
  title: string
  href: string
  icon: LucideIcon
  badge?: string | number
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
      title: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Quản lý người dùng',
      href: '/admin/users',
      icon: Users,
    },
    {
      title: 'Quản lý khóa học',
      href: '/admin/courses',
      icon: BookOpen,
    },
    {
      title: 'Quản lý giáo viên',
      href: '/admin/teachers',
      icon: GraduationCap,
    },
    {
      title: 'Quản lý sinh viên',
      href: '/admin/students',
      icon: Users,
    },
    {
      title: 'Thống kê & Báo cáo',
      href: '/admin/reports',
      icon: BarChart3,
    },
    {
      title: 'Thông báo',
      href: '/admin/notifications',
      icon: Bell,
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
      title: 'Dashboard',
      href: '/teacher/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Khóa học của tôi',
      href: '/teacher/my-courses',
      icon: BookMarked,
    },
    {
      title: 'Tạo khóa học',
      href: '/teacher/create-course',
      icon: FolderKanban,
    },
    {
      title: 'Quản lý bài tập',
      href: '/teacher/assignments',
      icon: ClipboardList,
    },
    {
      title: 'Sinh viên của tôi',
      href: '/teacher/students',
      icon: Users,
    },
    {
      title: 'Lịch giảng dạy',
      href: '/teacher/schedule',
      icon: Calendar,
    },
    {
      title: 'Thống kê',
      href: '/teacher/statistics',
      icon: BarChart3,
    },
    {
      title: 'Tin nhắn',
      href: '/teacher/messages',
      icon: MessageSquare,
    },
  ],
  bottom: [
    {
      title: 'Cài đặt',
      href: '/teacher/settings',
      icon: Settings,
    },
    {
      title: 'Trợ giúp',
      href: '/teacher/help',
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
      title: 'Trang chủ',
      href: '/student/dashboard',
      icon: Home,
    },
    {
      title: 'Khóa học của tôi',
      href: '/student/my-courses',
      icon: BookOpen,
    },
    {
      title: 'Khám phá khóa học',
      href: '/student/explore-courses',
      icon: BookMarked,
    },
    {
      title: 'Bài tập',
      href: '/student/assignments',
      icon: FileText,
    },
    {
      title: 'Lịch học',
      href: '/student/schedule',
      icon: Calendar,
    },
    {
      title: 'Điểm số',
      href: '/student/grades',
      icon: Trophy,
    },
    {
      title: 'Tin nhắn',
      href: '/student/messages',
      icon: MessageSquare,
    },
    {
      title: 'Thông báo',
      href: '/student/notifications',
      icon: Bell,
    },
  ],
  bottom: [
    {
      title: 'Hồ sơ của tôi',
      href: '/student/profile',
      icon: UserCog,
    },
    {
      title: 'Cài đặt',
      href: '/student/settings',
      icon: Settings,
    },
    {
      title: 'Trợ giúp',
      href: '/student/help',
      icon: HelpCircle,
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

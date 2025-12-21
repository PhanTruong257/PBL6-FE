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
  History,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { User, UserRole } from '@/types/user'
import { PERMISSIONS } from './permissions.constant'

/**
 * Navigation item with role and permission-based access control
 */
export interface NavigationItem {
  title: string
  href: string
  icon: LucideIcon
  badge?: string | number

  // Access control
  roles?: UserRole[] // Which roles can see this item
  permissions?: string[] // Required permissions (checked against user.permissions)
  requireAllPermissions?: boolean // true = AND logic, false = OR logic (default: false)
}

/**
 * Navigation configuration structure
 */
export interface NavigationConfig {
  main: NavigationItem[]
  bottom: NavigationItem[]
}

/**
 * Unified sidebar navigation configuration
 * Single source of truth for all navigation items
 *
 * Access Control Logic:
 * 1. If `roles` is empty array [] or undefined, item is visible to ALL roles
 * 2. If `roles` has values, user must have one of the specified roles
 * 3. If `permissions` is empty array [] or undefined, NO permission check is performed
 * 4. If `permissions` has values, user must have required permissions (OR/AND based on requireAllPermissions)
 * 5. Both role AND permission checks must pass for item to be visible
 *
 * @example
 * ```ts
 * Visible to all authenticated users (no role/permission restrictions)
 * { title: 'Tin nhắn', href: '/conversation', icon: MessageSquare }
 *
 * Visible to admin role only, no permission check
 * { title: 'Admin Panel', href: '/admin', icon: Shield, roles: ['admin'] }
 *
 * Visible to teacher role with specific permissions
 * { title: 'Ngân hàng câu hỏi', href: '/questions', icon: Library,
 *   roles: ['teacher'], permissions: [PERMISSIONS.QUESTIONS_LIST] }
 * ```
 */
export const SIDEBAR_NAVIGATION: NavigationConfig = {
  main: [
    // ==================== ADMIN ONLY ====================
    {
      title: 'Quản lý người dùng',
      href: '/admin/manage-users',
      icon: Users,
      roles: ['admin'],
      permissions: [PERMISSIONS.USER_LIST], // GET.users.list
    },
    {
      title: 'Phân quyền',
      href: '/admin/permissions',
      icon: Shield,
      roles: ['admin'],
      permissions: [
        PERMISSIONS.ROLES_LIST, // GET.users.admin.roles
        PERMISSIONS.PERMISSIONS_LIST, // GET.users.admin.permissions
      ],
      requireAllPermissions: false, // OR logic: user needs at least one
    },
    {
      title: 'Nhật ký hoạt động',
      href: '/admin/audit-logs',
      icon: History,
      roles: ['admin'],
      permissions: [PERMISSIONS.AUDIT_LOGS_LIST], // GET.audit-logs
    },

    // ==================== TEACHER ONLY ====================
    {
      title: 'Ngân hàng câu hỏi',
      href: '/questions',
      icon: Library,
      roles: ['teacher'],
      permissions: [
        PERMISSIONS.QUESTIONS_LIST, // GET.questions
        PERMISSIONS.QUESTIONS_CREATE, // POST.questions
      ],
      requireAllPermissions: false, // OR logic: can view or create
    },
    {
      title: 'Quản lý bài kiểm tra',
      href: '/exam',
      icon: ClipboardList,
      roles: ['teacher'],
      permissions: [
        PERMISSIONS.EXAMS_LIST, // GET.exams
        PERMISSIONS.EXAMS_CREATE, // POST.exams
        PERMISSIONS.SUBMISSIONS_GRADE, // PUT.submissions.:id.grade
      ],
      requireAllPermissions: false, // OR logic: needs at least one
    },

    // ==================== TEACHER & STUDENT ====================
    {
      title: 'Lớp học của tôi',
      href: '/classes',
      icon: BookMarked,
      roles: ['teacher', 'student', 'user'],
      permissions: [PERMISSIONS.CLASSES_LIST], // GET.classes
    },
    {
      title: 'Lịch kiểm tra',
      href: '/calendar',
      icon: Calendar,
      roles: ['teacher', 'student', 'user'],
      // No specific permission required - calendar is accessible if user has class access
    },

    // ==================== STUDENT ONLY ====================
    {
      title: 'Làm bài kiểm tra',
      href: '/exam/student',
      icon: ClipboardList,
      roles: ['student', 'user'],
      permissions: [
        PERMISSIONS.STUDENTS_EXAMS, // GET.students.exams
        PERMISSIONS.EXAMS_START, // POST.exams.:exam_id.start
      ],
      requireAllPermissions: false, // OR logic: can view or start exams
    },

    // ==================== ALL ROLES ====================
    {
      title: 'Tin nhắn',
      href: '/conversation',
      icon: MessageSquare,
      roles: [], // All roles can access
      permissions: [
        PERMISSIONS.CHATS_CONVERSATIONS_LIST, // GET.chats.users.:userId.conversations
        PERMISSIONS.CHATS_MESSAGES_CREATE, // POST.chats.messages
      ],
      requireAllPermissions: false, // OR logic
    },
    {
      title: 'Trợ lý AI',
      href: '/chatbot',
      icon: Bot,
      roles: [], // All roles can access
      // No specific permission required - chatbot is open to all authenticated users
    },
  ],

  bottom: [
    // ==================== GENERAL USER SETTINGS ====================
    {
      title: 'Cài đặt',
      href: '/profile',
      icon: Settings,
      roles: [],
      permissions: [
        PERMISSIONS.USER_PROFILE, // GET.users.profile
        PERMISSIONS.USER_UPDATE_PROFILE, // PATCH.users.profile
      ],
      requireAllPermissions: false, // OR logic
    },

    // ==================== HELP - ALL ROLES ====================
    // {
    //   title: 'Trợ giúp',
    //   href: '/dashboard',
    //   icon: HelpCircle,
    //   roles: [], // All roles can access help
    //   // No specific permission required
    // },
  ],
}

/**
 * Filter navigation items based on user role and permissions
 *
 * @param user - Current user object with role and permissions
 * @param navigation - Navigation configuration (defaults to SIDEBAR_NAVIGATION)
 * @returns Filtered navigation configuration based on user's access rights
 *
 * @example
 * ```ts
 * const user = useRecoilValue(currentUserState)
 * const navigation = getNavigationForUser(user)
 * ```
 */
export function getNavigationForUser(
  user: User | null,
  navigation: NavigationConfig = SIDEBAR_NAVIGATION
): NavigationConfig {
  if (!user) {
    return { main: [], bottom: [] }
  }

  const filterItems = (items: NavigationItem[]): NavigationItem[] => {
    return items.filter((item) => {
      // Check role access
      if (item.roles && item.roles.length > 0) {
        if (!item.roles.includes(user.role)) {
          return false
        }
      }

      // Check permissions
      if (item.permissions && item.permissions.length > 0) {
        const userPermissionKeys = user.permissions?.map((p) => p.key) || []

        if (item.requireAllPermissions) {
          // AND logic: user must have ALL specified permissions
          const hasAllPerms = item.permissions.every((perm) =>
            userPermissionKeys.includes(perm)
          )
          if (!hasAllPerms) {
            return false
          }
        } else {
          // OR logic: user must have AT LEAST ONE permission
          const hasAnyPerm = item.permissions.some((perm) =>
            userPermissionKeys.includes(perm)
          )
          if (!hasAnyPerm) {
            return false
          }
        }
      }

      return true
    })
  }

  return {
    main: filterItems(navigation.main),
    bottom: filterItems(navigation.bottom),
  }
}

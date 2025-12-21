import type { User } from '@/types/user'

/**
 * System-wide permission keys.
 * Permission naming convention from DB: METHOD.resource.action
 * Examples: GET.users.list, POST.classes.create, DELETE.exams.:id
 */
export const PERMISSIONS = {
  // ==================== USER MANAGEMENT ====================
  USER_LIST: 'GET.users.list',
  USER_ME: 'GET.users.me',
  USER_PROFILE: 'GET.users.profile',
  USER_PROFILE_BY_EMAIL: 'GET.users.get-profile-by-email',
  USER_CREATE: 'POST.users.create',
  USER_UPDATE_PROFILE: 'PATCH.users.profile',
  USER_UPDATE: 'PATCH.users.:id.profile',
  USER_CHANGE_PASSWORD: 'PUT.users.change-password',
  USER_BLOCK: 'POST.users.admin.block.:id',
  USER_UNBLOCK: 'POST.users.admin.unblock.:id',
  USER_SEARCH: 'POST.users.search-by-name-or-email',

  // ==================== ROLE & PERMISSION MANAGEMENT ====================
  ROLES_LIST: 'GET.users.admin.roles',
  ROLES_CREATE: 'POST.users.admin.roles.create',
  ROLES_UPDATE: 'PUT.users.admin.roles.:roleId',
  ROLES_DELETE: 'DELETE.users.admin.roles.:roleId',
  ROLES_ASSIGN_PERMISSIONS: 'POST.users.admin.roles.assign-permissions',
  PERMISSIONS_LIST: 'GET.users.admin.permissions',
  PERMISSIONS_CREATE: 'POST.users.admin.permissions.create',

  // ==================== CLASS MANAGEMENT ====================
  CLASSES_LIST: 'GET.classes',
  CLASSES_DETAIL: 'GET.classes.:class_id',
  CLASSES_CREATE: 'POST.classes.create',
  CLASSES_UPDATE: 'PUT.classes.:class_id',
  CLASSES_DELETE: 'DELETE.classes.:class_id',
  CLASSES_ADD_STUDENTS: 'POST.classes.add-students',
  CLASSES_REMOVE_STUDENT: 'DELETE.classes.:class_id.students.:user_id',
  CLASSES_JOIN: 'POST.classes.:class_code.joinclass',
  CLASSES_JOIN_BY_CODE: 'POST.classes.join-by-code',
  CLASSES_STUDENTS: 'GET.classes.:class_id.students',
  CLASSES_ADD_POST: 'POST.classes.add-new-post',
  CLASSES_UPLOAD_POST: 'POST.classes.:id.upload-post-with-files',
  CLASSES_UPLOAD_FILES: 'POST.classes.:id.upload-files',
  CLASSES_GET_MATERIALS: 'GET.classes.:id.get-all-materials',

  // ==================== QUESTION MANAGEMENT ====================
  QUESTIONS_LIST: 'GET.questions',
  QUESTIONS_DETAIL: 'GET.questions.:id',
  QUESTIONS_CREATE: 'POST.questions',
  QUESTIONS_UPDATE: 'PUT.questions.:id',
  QUESTIONS_DELETE: 'DELETE.questions.:id',
  QUESTIONS_IMPORT: 'POST.questions.import',
  QUESTIONS_IMPORT_PREVIEW: 'POST.questions.import.preview',
  QUESTIONS_IMPORT_TEMPLATE: 'GET.questions.import.template',
  QUESTIONS_EXPORT_EXCEL: 'GET.questions.export.excel',
  QUESTIONS_EXPORT_TEXT: 'GET.questions.export.text',
  QUESTIONS_EXPORT_DOCX: 'GET.questions.export.docx',
  QUESTIONS_RANDOM: 'POST.questions.random',

  // ==================== QUESTION CATEGORIES ====================
  QUESTION_CATEGORIES_LIST: 'GET.question-categories',
  QUESTION_CATEGORIES_DETAIL: 'GET.question-categories.:id',
  QUESTION_CATEGORIES_CREATE: 'POST.question-categories',
  QUESTION_CATEGORIES_UPDATE: 'PUT.question-categories.:id',
  QUESTION_CATEGORIES_DELETE: 'DELETE.question-categories.:id',

  // ==================== EXAM MANAGEMENT ====================
  EXAMS_LIST: 'GET.exams',
  EXAMS_DETAIL: 'GET.exams.:id',
  EXAMS_CREATE: 'POST.exams',
  EXAMS_UPDATE: 'PUT.exams.:id',
  EXAMS_DELETE: 'DELETE.exams.:id',
  EXAMS_START: 'POST.exams.:exam_id.start',
  EXAMS_VERIFY_PASSWORD: 'POST.exams.:exam_id.verify-password',
  EXAMS_ANSWER_CORRECTNESS: 'POST.exams.answer-correctness',

  // ==================== STUDENT EXAMS ====================
  STUDENTS_EXAMS: 'GET.students.exams',

  // ==================== SUBMISSION MANAGEMENT ====================
  SUBMISSIONS_LIST: 'GET.submissions.exam.:examId',
  SUBMISSIONS_DETAIL: 'GET.submissions.:id',
  SUBMISSIONS_QUESTION: 'GET.submissions.:submission_id.questions.:order',
  SUBMISSIONS_ANSWER: 'POST.submissions.:submission_id.answers',
  SUBMISSIONS_UPDATE_ANSWERS: 'PUT.submissions.:id.answers',
  SUBMISSIONS_RESUME: 'GET.submissions.:submission_id.resume',
  SUBMISSIONS_SUBMIT: 'POST.submissions.:submission_id.submit',
  SUBMISSIONS_UPDATE_TIME: 'PATCH.submissions.:submission_id.time',
  SUBMISSIONS_GRADE: 'PUT.submissions.:id.grade',
  SUBMISSIONS_CONFIRM_GRADING: 'PUT.submissions.:id.confirm-grading',

  // ==================== CHAT MANAGEMENT ====================
  CHATS_MESSAGES_CREATE: 'POST.chats.messages',
  CHATS_MESSAGES_GET: 'GET.chats.messages.:id',
  CHATS_MESSAGES_UPDATE: 'PUT.chats.messages.:id',
  CHATS_MESSAGES_DELETE: 'DELETE.chats.messages.:id',
  CHATS_CONVERSATIONS_CREATE: 'POST.chats.conversations',
  CHATS_CONVERSATIONS_GET: 'GET.chats.conversations.:id',
  CHATS_CONVERSATIONS_LIST: 'GET.chats.users.:userId.conversations',
  CHATS_CONVERSATIONS_MESSAGES: 'GET.chats.conversations.:conversationId.messages',
  CHATS_CONVERSATIONS_BETWEEN: 'GET.chats.conversations.between.:userId1.:userId2',
  CHATS_CONVERSATIONS_DELETE: 'DELETE.chats.conversations.:id',
  CHATS_CONVERSATIONS_MARK_READ: 'POST.chats.conversations.:conversationId.mark-as-read',
  CHATS_UNREAD_COUNT: 'GET.chats.users.:userId.unread-count',
  CHATS_UNREAD_BY_CONVERSATION: 'GET.chats.users.:userId.unread-by-conversation',
  CHATS_UPLOAD: 'POST.chats.upload',
  CHATS_DOWNLOAD: 'GET.chats.download.:filename',

  // ==================== MATERIALS MANAGEMENT ====================
  MATERIALS_LIST: 'GET.materials.class.:classId',
  MATERIALS_UPLOAD: 'POST.materials.upload',
  MATERIALS_DOWNLOAD: 'GET.materials.download.:filename',
  MATERIALS_DELETE: 'DELETE.materials.:materialId',

  // ==================== AUDIT LOGS ====================
  AUDIT_LOGS_LIST: 'GET.audit-logs',
  AUDIT_LOGS_DETAIL: 'GET.audit-logs.:id',
  AUDIT_LOGS_EXPORT: 'GET.audit-logs.export',
  AUDIT_LOGS_USER: 'GET.audit-logs.user.:userId',
} as const

/**
 * Permission key type
 */
export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

/**
 * Check if user has specific permission
 *
 * @param user - Current user object
 * @param permission - Permission key to check
 * @returns true if user has the permission
 *
 * @example
 * ```ts
 * if (hasPermission(user, PERMISSIONS.EXAM_CREATE)) {
 *   // Show create exam button
 * }
 * ```
 */
export function hasPermission(user: User | null, permission: PermissionKey): boolean {
  if (!user?.permissions) return false
  return user.permissions.some((p) => p.key === permission)
}

/**
 * Check if user has ANY of the specified permissions (OR logic)
 *
 * @param user - Current user object
 * @param permissions - Array of permission keys to check
 * @returns true if user has at least one of the permissions
 *
 * @example
 * ```ts
 * if (hasAnyPermission(user, [PERMISSIONS.EXAM_CREATE, PERMISSIONS.EXAM_GRADE])) {
 *   // Show exam management section
 * }
 * ```
 */
export function hasAnyPermission(user: User | null, permissions: PermissionKey[]): boolean {
  if (!user?.permissions) return false
  const userPermissionKeys = user.permissions.map((p) => p.key)
  return permissions.some((perm) => userPermissionKeys.includes(perm))
}

/**
 * Check if user has ALL of the specified permissions (AND logic)
 *
 * @param user - Current user object
 * @param permissions - Array of permission keys to check
 * @returns true if user has all of the permissions
 *
 * @example
 * ```ts
 * if (hasAllPermissions(user, [PERMISSIONS.EXAM_CREATE, PERMISSIONS.EXAM_GRADE])) {
 *   // Show full exam management features
 * }
 * ```
 */
export function hasAllPermissions(user: User | null, permissions: PermissionKey[]): boolean {
  if (!user?.permissions) return false
  const userPermissionKeys = user.permissions.map((p) => p.key)
  return permissions.every((perm) => userPermissionKeys.includes(perm))
}

/**
 * Check if user has specific role
 *
 * @param user - Current user object
 * @param role - Role to check
 * @returns true if user has the role
 *
 * @example
 * ```ts
 * if (hasRole(user, 'admin')) {
 *   // Show admin panel
 * }
 * ```
 */
export function hasRole(user: User | null, role: User['role']): boolean {
  return user?.role === role
}

/**
 * Check if user has ANY of the specified roles (OR logic)
 *
 * @param user - Current user object
 * @param roles - Array of roles to check
 * @returns true if user has at least one of the roles
 *
 * @example
 * ```ts
 * if (hasAnyRole(user, ['admin', 'teacher'])) {
 *   // Show teacher/admin features
 * }
 * ```
 */
export function hasAnyRole(user: User | null, roles: User['role'][]): boolean {
  if (!user) return false
  return roles.includes(user.role)
}

/**
 * Get user's permission keys as an array of strings
 *
 * @param user - Current user object
 * @returns Array of permission keys
 *
 * @example
 * ```ts
 * const permissions = getUserPermissions(user)
 * console.log(permissions) // ['user:read', 'class:create', ...]
 * ```
 */
export function getUserPermissions(user: User | null): string[] {
  return user?.permissions?.map((p) => p.key) || []
}

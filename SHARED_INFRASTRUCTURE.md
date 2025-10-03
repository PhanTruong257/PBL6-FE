# 📁 Cấu trúc Shared Infrastructure - PBL6 Frontend

Đây là tài liệu mô tả chi tiết các thành phần shared (dùng chung) trong project.

## 📦 Tổng quan cấu trúc

```
src/
├── context/          # React Context definitions
├── providers/        # Provider wrappers
├── hooks/            # Custom hooks (dùng chung)
├── libs/             # Core utilities, constants, HTTP client
├── types/            # Global TypeScript types
└── components/       # Shared UI components
```

---

## 🎨 1. Context (`src/context/`)

### `theme-context.tsx`
**Mục đích:** Định nghĩa Theme Context và danh sách themes có sẵn

**Exports:**
- `Theme` - Type: 8 themes (light, dark, galaxy, dracula, nord, ocean, sunset, forest)
- `ThemeInfo` - Interface cho thông tin theme
- `ThemeContext` - Context object
- `AVAILABLE_THEMES` - Array of available themes

**Sử dụng:**
```typescript
import { ThemeContext, AVAILABLE_THEMES } from '@/context/theme-context.tsx'
```

---

## 🔌 2. Providers (`src/providers/`)

### `theme-provider.tsx`
**Mục đích:** Provider quản lý theme, sync với localStorage, apply CSS classes

**Props:**
- `children` - React nodes
- `defaultTheme?` - Default theme (mặc định: 'light')
- `storageKey?` - localStorage key (mặc định: 'pbl6-ui-theme')

**Sử dụng:**
```tsx
<ThemeProvider defaultTheme="dark" storageKey="custom-theme-key">
  {children}
</ThemeProvider>
```

### `app-providers.tsx` ⭐
**Mục đích:** Root provider wrapper, gom tất cả providers trong đúng thứ tự

**Providers included:**
1. `StrictMode`
2. `TanStackQueryProvider` (React Query)
3. `ThemeProvider`

**Sử dụng:**
```tsx
import { AppProviders } from '@/providers'

<AppProviders>
  <RouterProvider router={router} />
</AppProviders>
```

### `index.ts`
```typescript
export { ThemeProvider } from './theme-provider'
export { AppProviders } from './app-providers'
```

---

## 🪝 3. Hooks (`src/hooks/`)

### `use-theme.ts`
**Mục đích:** Hook để access theme context

**Returns:**
- `theme` - Current theme
- `setTheme(theme)` - Function to change theme
- `themes` - Array of available themes

**Sử dụng:**
```typescript
import { useTheme } from '@/hooks/use-theme'

const { theme, setTheme, themes } = useTheme()
```

---

### `use-auth.ts`
**Mục đích:** Re-export các auth hooks từ `features/auth`

**Exports:**
- `useLogin()` - Login mutation
- `useRegister()` - Register mutation
- `useForgotPassword()` - Forgot password
- `useVerifyCode()` - Verify OTP code
- `useResetPassword()` - Reset password
- `useResendCode()` - Resend verification code
- `useLogout()` - Logout mutation
- `useCurrentUser()` - Get current user from API
- `useIsAuthenticated()` - Check auth status
- `useUserFromStorage()` - Get user from localStorage
- `useAuthError()` - Handle auth errors

---

### `use-role-guard.ts`
**Mục đích:** Guards và role checks

**Exports:**

#### `useRoleGuard(allowedRoles)`
Guard route dựa trên role, tự động redirect nếu không có quyền

```typescript
const { isAuthenticated, user, isLoading } = useRoleGuard(['admin', 'teacher'])
```

#### `useHasRole(role)`
Check xem user có role cụ thể không

```typescript
const isAdmin = useHasRole('admin')
```

#### `useHasAnyRole(roles)`
Check xem user có bất kỳ role nào trong list không

```typescript
const canManageCourses = useHasAnyRole(['admin', 'teacher'])
```

---

### `use-debounce.ts`
**Mục đích:** Debounce value changes (tránh call API liên tục)

**Signature:**
```typescript
useDebounce<T>(value: T, delay?: number): T
```

**Sử dụng:**
```typescript
const [searchTerm, setSearchTerm] = useState('')
const debouncedSearch = useDebounce(searchTerm, 500)

useEffect(() => {
  // Call API với debouncedSearch
}, [debouncedSearch])
```

---

### `use-local-storage.ts`
**Mục đích:** Hook quản lý localStorage với React state sync

**Signature:**
```typescript
useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void]
```

**Returns:**
- `[0]` - Current value
- `[1]` - Setter function (như useState)
- `[2]` - Remove function

**Sử dụng:**
```typescript
const [user, setUser, removeUser] = useLocalStorage('user', null)

setUser({ name: 'John' })
removeUser() // Clear localStorage
```

---

### `use-media-query.ts`
**Mục đích:** Responsive hooks cho breakpoints

**Exports:**

#### `useWindowSize()`
```typescript
const { width, height } = useWindowSize()
```

#### `useMediaQuery(query)`
```typescript
const isLarge = useMediaQuery('(min-width: 1024px)')
```

#### Convenience hooks:
```typescript
const isMobile = useIsMobile()    // max-width: 768px
const isTablet = useIsTablet()    // 769px - 1024px
const isDesktop = useIsDesktop()  // min-width: 1025px
```

---

### `index.ts`
Export tất cả hooks:
```typescript
export { useTheme } from './use-theme'
export { useLogin, useRegister, useLogout } from './use-auth'
export { useRoleGuard, useHasRole, useHasAnyRole } from './use-role-guard'
export { useDebounce } from './use-debounce'
export { useLocalStorage } from './use-local-storage'
export { useWindowSize, useMediaQuery, useIsMobile, useIsTablet, useIsDesktop } from './use-media-query'
```

---

## 📚 4. Libs (`src/libs/`)

### `constants/`

#### `storage.constant.ts`
Định nghĩa keys cho localStorage

```typescript
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  USER: 'auth_user',
  THEME: 'pbl6-ui-theme',
  LANGUAGE: 'app_language',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
  LAST_VISITED_PAGE: 'last_visited_page',
}
```

#### `roles.constant.ts`
User roles và permissions

```typescript
export const USER_ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
}

export const ROLE_PERMISSIONS = {
  admin: ['users.view', 'users.create', 'courses.manage', ...],
  teacher: ['courses.view', 'my-courses.manage', 'students.view', ...],
  student: ['courses.view', 'assignments.submit', 'grades.view', ...],
}
```

#### `routes.constant.ts`
Application routes

```typescript
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  TEACHER_DASHBOARD: '/teacher/dashboard',
  STUDENT_DASHBOARD: '/student/dashboard',
  // ...
}

export const DEFAULT_ROUTES_BY_ROLE = {
  admin: ROUTES.ADMIN_DASHBOARD,
  teacher: ROUTES.TEACHER_DASHBOARD,
  student: ROUTES.STUDENT_DASHBOARD,
}
```

#### `index.ts`
Export constants và app config

```typescript
export const APP_CONFIG = {
  NAME: 'PBL6 LMS',
  VERSION: '1.0.0',
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  ITEMS_PER_PAGE: 10,
  REQUEST_TIMEOUT: 30000,
}

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 100,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[0-9]{10,11}$/,
}
```

---

### `http/`

#### `axios-instance.ts`
Axios instance với interceptors

**Features:**
- Auto attach Bearer token
- Handle 401 unauthorized (auto logout)
- Base URL từ env

**Sử dụng:**
```typescript
import { httpClient } from '@/libs/http'

const response = await httpClient.get('/users')
```

#### `api-client.ts`
Type-safe API client wrapper

**Methods:**
- `apiClient.get<T>(url, config?)`
- `apiClient.post<T, D>(url, payload?, config?)`
- `apiClient.put<T, D>(url, payload?, config?)`
- `apiClient.patch<T, D>(url, payload?, config?)`
- `apiClient.delete<T>(url, config?)`
- `apiClient.upload<T>(url, formData, onProgress?)`

**Sử dụng:**
```typescript
import { apiClient } from '@/libs/http'

const user = await apiClient.get<User>('/users/me')
await apiClient.post<User, CreateUserRequest>('/users', { name: 'John' })
```

---

### `utils/`

#### `storage.ts`
LocalStorage utilities

```typescript
// Generic storage
getStorageItem<T>(key: string): T | null
setStorageItem<T>(key: string, value: T): void
removeStorageItem(key: string): void
clearStorage(): void

// Token utilities
tokenStorage.getAccessToken()
tokenStorage.getRefreshToken()
tokenStorage.setTokens(accessToken, refreshToken)
tokenStorage.clearTokens()
tokenStorage.getUser<T>()
tokenStorage.setUser<T>(user)
```

#### `string.ts`
String manipulation

```typescript
capitalize(str): string
titleCase(str): string
truncate(str, length, suffix?): string
randomString(length?): string
slugify(str): string
getInitials(name): string
```

#### `number.ts`
Number formatting

```typescript
formatNumber(num): string           // 1,000,000
formatCurrency(amount): string      // 1.000.000 ₫
formatPercent(value, decimals?): string  // 75%
formatFileSize(bytes): string       // 1.5 MB
clamp(value, min, max): number
randomNumber(min, max): number
```

#### `validation.ts`
Validation utilities

```typescript
isValidEmail(email): boolean
isValidPhone(phone): boolean
isValidPassword(password): boolean
isValidUrl(url): boolean
isEmpty(value): boolean
```

#### `date.ts`
Date formatting

```typescript
formatDate(date): string              // "3 tháng 10, 2025"
formatDateTime(date): string          // "3 tháng 10, 2025 14:30"
formatTime(date): string              // "14:30"
getRelativeTime(date): string         // "2 giờ trước"
isToday(date): boolean
isPast(date): boolean
isFuture(date): boolean
addDays(date, days): Date
subtractDays(date, days): Date
```

#### `cn.ts`
Tailwind class merger (from shadcn/ui)

```typescript
import { cn } from '@/libs/utils'

<div className={cn('base-class', isActive && 'active-class')} />
```

---

## 📘 5. Types (`src/types/`)

### `api.ts`
API response types

```typescript
interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  errors?: Record<string, string[]>
}

interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

### `user.ts`
User-related types

```typescript
type UserRole = 'admin' | 'teacher' | 'student'
type UserStatus = 'active' | 'inactive' | 'suspended'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  avatar?: string
  role: UserRole
  status: UserStatus
  // ...
}
```

### `common.ts`
Common shared types

```typescript
type Nullable<T> = T | null
type Optional<T> = T | undefined
type ID = string | number
type Timestamp = string | Date

interface SelectOption<T = string> {
  label: string
  value: T
  disabled?: boolean
}

interface PaginationConfig {
  page: number
  limit: number
  total?: number
}

type LoadingState = 'idle' | 'loading' | 'success' | 'error'
```

### `course.ts`
Course-related types

```typescript
type CourseLevel = 'beginner' | 'intermediate' | 'advanced'

interface Course {
  id: string
  title: string
  description: string
  level: CourseLevel
  instructor: User
  // ...
}
```

---

## 🎯 Import Examples

### Best practices:

```typescript
// ✅ GOOD: Import từ barrel exports
import { useTheme } from '@/hooks'
import { STORAGE_KEYS, USER_ROLES } from '@/libs/constants'
import { formatDate, formatCurrency } from '@/libs/utils'
import type { User, Course } from '@/types'

// ❌ BAD: Import trực tiếp từ file cụ thể
import { useTheme } from '@/hooks/use-theme'
import { STORAGE_KEYS } from '@/libs/constants/storage.constant'
```

---

## 📋 Checklist sử dụng

### Khi cần theme:
- [ ] Import `useTheme` từ `@/hooks`
- [ ] Dùng `theme` và `setTheme` từ hook

### Khi cần auth:
- [ ] Import hooks từ `@/hooks`
- [ ] Dùng `useIsAuthenticated()` để check login status
- [ ] Dùng `useRoleGuard(['admin'])` để guard routes

### Khi cần format data:
- [ ] Import từ `@/libs/utils`
- [ ] Dùng `formatDate`, `formatCurrency`, `formatNumber`, etc.

### Khi cần call API:
- [ ] Import `apiClient` từ `@/libs/http`
- [ ] Define types trong `@/types`
- [ ] Dùng `apiClient.get<Type>(url)`

### Khi cần constants:
- [ ] Import từ `@/libs/constants`
- [ ] Dùng `ROUTES`, `USER_ROLES`, `STORAGE_KEYS`

---

## 🚀 Next Steps

Cấu trúc này đã sẵn sàng cho:
1. ✅ Refactor Auth feature (tách pages + components)
2. ✅ Build Admin feature
3. ✅ Build Teacher feature
4. ✅ Build Student feature

**Tất cả infrastructure đã được code xong!** 🎉

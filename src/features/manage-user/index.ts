// Export types
export type { 
  ExtendedUser, 
  UserFilters, 
  CreateUserRequest, 
  UpdateUserRequest,
} from './types'

// Export API services
export * from './api'

// Export hooks
export * from './hooks'

// Export schemas
export * from './schemas'

// Export components
export * from './components'

// Export pages
export { ManageUserPage } from './pages'

// Legacy page export for backward compatibility
export { ManageUserPage as ManageTeacherPage } from './pages'

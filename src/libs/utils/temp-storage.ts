const TEMP_KEYS = {
  RESET_EMAIL: 'temp_reset_email',
  RESET_CODE: 'temp_reset_code',
} as const

export const tempStorage = {
  // Email
  setResetEmail: (email: string) => {
    sessionStorage.setItem(TEMP_KEYS.RESET_EMAIL, email)
  },

  getResetEmail: (): string | null => {
    return sessionStorage.getItem(TEMP_KEYS.RESET_EMAIL)
  },

  // Code
  setResetCode: (code: string) => {
    sessionStorage.setItem(TEMP_KEYS.RESET_CODE, code)
  },

  getResetCode: (): string | null => {
    return sessionStorage.getItem(TEMP_KEYS.RESET_CODE)
  },

  // Clear all temp data
  clearResetData: () => {
    sessionStorage.removeItem(TEMP_KEYS.RESET_EMAIL)
    sessionStorage.removeItem(TEMP_KEYS.RESET_CODE)
  },

  // Check if has data
  hasResetData: (): boolean => {
    return !!sessionStorage.getItem(TEMP_KEYS.RESET_EMAIL)
  },
}

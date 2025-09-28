import { AccountForm } from './account-form'

interface SettingsAccountProps {
  role?: 'admin' | 'teacher' | 'student'
}

export function SettingsAccount({ role }: SettingsAccountProps) {
  return <AccountForm role={role} />
}
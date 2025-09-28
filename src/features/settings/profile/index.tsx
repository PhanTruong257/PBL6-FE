import { ProfileForm } from './profile-form'

interface SettingsProfileProps {
  role: 'admin' | 'teacher' | 'student'
}

export function SettingsProfile({ role }: SettingsProfileProps) {
  return <ProfileForm role={role} />
}
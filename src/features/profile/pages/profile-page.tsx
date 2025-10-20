import { useState } from 'react'
import { RequireAuth } from '@/components/auth'
import { ProfileHeader } from '../components/profile-header'
import { ProfileStats } from '../components/profile-stats'
import { ProfileForm } from '../components/profile-form'
import { PermissionDemo } from '../components/permission-demo'
import { useProfile, useUpdateProfile, useChangePassword, useUploadAvatar } from '../hooks/use-profile'
import type { UpdateProfileFormData, ChangePasswordFormData } from '../schemas/profile-schemas'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false)
  
  // API hooks
  const { 
    data: profile, 
    isLoading, 
    error, 
    refetch 
  } = useProfile()
  
  const updateProfileMutation = useUpdateProfile()
  const changePasswordMutation = useChangePassword()
  const uploadAvatarMutation = useUploadAvatar()

  // Handlers
  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const handleUpdateProfile = async (data: UpdateProfileFormData) => {
    try {
      await updateProfileMutation.mutateAsync(data)
      setIsEditing(false)
    } catch (error) {
      // Error is handled in the mutation
      console.error('Profile update failed:', error)
    }
  }

  const handleChangePassword = async (data: ChangePasswordFormData) => {
    try {
      await changePasswordMutation.mutateAsync(data)
      // Keep form open but reset it (handled in ProfileForm)
    } catch (error) {
      // Error is handled in the mutation
      console.error('Password change failed:', error)
    }
  }

  const handleAvatarUpload = async (file: File) => {
    try {
      await uploadAvatarMutation.mutateAsync(file)
      // Profile will be automatically updated via cache
    } catch (error) {
      // Error is handled in the mutation
      console.error('Avatar upload failed:', error)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <RequireAuth>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              {/* Header Skeleton */}
              <div className="bg-white rounded-lg shadow p-8">
                <div className="flex gap-8">
                  <Skeleton className="h-32 w-32 rounded-full" />
                  <div className="flex-1 space-y-4">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-32" />
                    <div className="grid grid-cols-2 gap-4">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </RequireAuth>
    )
  }

  // Error state
  if (error) {
    return (
      <RequireAuth>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Alert variant="destructive" className="max-w-md mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load profile information. Please try again.
              </AlertDescription>
            </Alert>
            <div className="text-center mt-4">
              <Button onClick={() => refetch()} variant="outline">
                Retry
              </Button>
            </div>
          </div>
        </div>
      </RequireAuth>
    )
  }

  // No profile data
  if (!profile) {
    return (
      <RequireAuth>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Alert className="max-w-md mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No profile information found.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </RequireAuth>
    )
  }

  const isUpdating = updateProfileMutation.isPending || 
                    changePasswordMutation.isPending || 
                    uploadAvatarMutation.isPending

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Back button when editing */}
            {isEditing && (
              <Button
                variant="ghost"
                onClick={handleCancelEdit}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Profile
              </Button>
            )}

            {/* Profile Header */}
            {!isEditing && (
              <ProfileHeader
                profile={profile}
                onEditClick={handleEditClick}
                onAvatarUpload={handleAvatarUpload}
                isUpdating={isUpdating}
              />
            )}

            {/* Stats Section (only show when not editing) */}
            {!isEditing && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {profile.role === 'admin' ? 'System Overview' : 
                   profile.role === 'teacher' ? 'Teaching Statistics' : 
                   'Learning Progress'}
                </h2>
                <ProfileStats profile={profile} />
              </div>
            )}

            {/* Permission Demo Section (only show when not editing) */}
            {!isEditing && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Permissions & Access Control Demo
                </h2>
                <PermissionDemo />
              </div>
            )}

            {/* Edit Form */}
            {isEditing && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Edit Profile
                </h2>
                <ProfileForm
                  profile={profile}
                  onUpdateProfile={handleUpdateProfile}
                  onChangePassword={handleChangePassword}
                  isUpdating={isUpdating}
                  onCancel={handleCancelEdit}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </RequireAuth>
  )
}
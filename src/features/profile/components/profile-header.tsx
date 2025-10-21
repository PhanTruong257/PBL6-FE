import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Camera, Mail, Phone, MapPin, Calendar, User } from 'lucide-react'
import type { ProfileApiResponse } from '../api'

interface ProfileHeaderProps {
  profile: ProfileApiResponse
  onEditClick: () => void
  onAvatarUpload: (file: File) => void
  isUpdating?: boolean
}

export const ProfileHeader = ({ 
  profile, 
  onEditClick, 
  onAvatarUpload, 
  isUpdating = false 
}: ProfileHeaderProps) => {
  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-500 hover:bg-red-600'
      case 'teacher':
        return 'bg-blue-500 hover:bg-blue-600'
      case 'user':
      case 'student':
        return 'bg-green-500 hover:bg-green-600'
      default:
        return 'bg-gray-500 hover:bg-gray-600'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'blocked':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not provided'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return 'Invalid date'
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)')
        return
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        alert('File size must be less than 5MB')
        return
      }

      onAvatarUpload(file)
    }
  }

  return (
    <Card className="border-none shadow-lg">
      <CardContent className="p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                <AvatarImage 
                  src={profile.avatar || ''} 
                  alt={profile.full_name}
                  className="object-cover"
                />
                <AvatarFallback className="text-3xl font-semibold bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                  {getInitials(profile.full_name)}
                </AvatarFallback>
              </Avatar>
              
              {/* Avatar Upload Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="h-8 w-8 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={isUpdating}
                />
              </div>
            </div>
            
            {/* Role & Status Badges */}
            <div className="flex flex-col items-center space-y-2">
              <Badge className={`${getRoleColor(profile.role)} text-white font-medium px-3 py-1`}>
                {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
              </Badge>
              <Badge variant="outline" className={getStatusColor(profile.status)}>
                {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Profile Information */}
          <div className="flex-1 space-y-6">
            {/* Name & Edit Button */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {profile.full_name}
                </h1>
                <p className="text-lg text-gray-600 mt-1">
                  ID: #{profile.user_id}
                </p>
              </div>
              <Button 
                onClick={onEditClick}
                disabled={isUpdating}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Edit Profile
              </Button>
            </div>

            {/* Contact Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-900">{profile.email}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-gray-900">{profile.phone || 'Not provided'}</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="text-gray-900">{profile.address || 'Not provided'}</p>
                </div>
              </div>

              {/* Date of Birth */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                  <p className="text-gray-900">{formatDate(profile.dateOfBirth)}</p>
                </div>
              </div>

              {/* Gender */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                    <User className="h-5 w-5 text-pink-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Gender</p>
                  <p className="text-gray-900">
                    {profile.gender 
                      ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)
                      : 'Not specified'
                    }
                  </p>
                </div>
              </div>

              {/* Joined Date */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-indigo-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Member Since</p>
                  <p className="text-gray-900">{formatDate(profile.created_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
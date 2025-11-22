import type { User } from '@/types'
import type { ClassBasicInfo } from '@/types/class'

export interface Material {
  material_id: number
  title: string
  file_url: string
  file_size?: number
  type?: string
  uploaded_at?: Date
}

export interface PostCardProps {
  id: number
  sender: User
  title: string
  message: string
  created_at: Date
  replies: PostCardProps[]
  materials?: Material[]
}

export interface ClassDetailData {
  classInfo: ClassBasicInfo
  formattedPostData: PostCardProps[]
}

export interface ClassDetailHookReturn {
  classInfo: ClassBasicInfo
  postData: PostCardProps[]
  activeTab: string
  setActiveTab: (tab: string) => void
  isAddMemberModalOpen: boolean
  setIsAddMemberModalOpen: (open: boolean) => void
  showSettings: boolean
  setShowSettings: (show: boolean) => void
  isTeacher: boolean
  isLoading: boolean
  error: Error | null
  refetch?: () => void
}

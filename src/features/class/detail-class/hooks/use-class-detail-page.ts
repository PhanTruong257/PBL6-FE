import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { currentUserState } from '@/global/recoil/user'
import { useClassDetail } from './use-class-detail'
import type { ClassDetailHookReturn } from '../types'

export function useClassDetailPage(classId: string): ClassDetailHookReturn {
  const [activeTab, setActiveTab] = useState('posts')
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  // Get current user from recoil
  const currentUser = useRecoilValue(currentUserState)
  const isTeacher = currentUser?.role === 'teacher'

  // Fetch real class data
  const { data: classData, isLoading, error } = useClassDetail(classId)

  return {
    classInfo: classData?.classInfo || {
      class_id: 0,
      class_name: '',
      class_code: '',
      teacher_id: 0,
      description: '',
      created_at: new Date(),
    },
    postData: classData?.formattedPostData || [],
    activeTab,
    setActiveTab,
    isAddMemberModalOpen,
    setIsAddMemberModalOpen,
    showSettings,
    setShowSettings,
    isTeacher,
    isLoading,
    error: error as Error | null,
  }
}

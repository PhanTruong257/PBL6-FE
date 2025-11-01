import { useState } from 'react'
import { mockClassDetail, mockUser } from '../mock-data'
import type { ClassDetailHookReturn } from '../types'

export function useClassDetailPage(_classId: string): ClassDetailHookReturn {
    const [activeTab, setActiveTab] = useState('posts')
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false)
    const [showSettings, setShowSettings] = useState(false)

    // Simulate logged in user (teacher)
    const currentUser = mockUser
    const isTeacher = currentUser.role === 'teacher'

    return {
        classInfo: mockClassDetail.classInfo,
        postData: mockClassDetail.formattedPostData,
        activeTab,
        setActiveTab,
        isAddMemberModalOpen,
        setIsAddMemberModalOpen,
        showSettings,
        setShowSettings,
        isTeacher,
        isLoading: false,
        error: null
    }
}
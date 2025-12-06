import {
  ClassSettings,
  ClassMainContent,
  AddMemberModal,
  ImportStudentsExcelDialog,
  StickyPostButton,
} from '../components'
import { ClassDetailHeader } from '../components'
import { useClassDetailPage } from '../hooks'
import { useClassSocket } from '../hooks/use-class-socket'
import { useSearch } from '@tanstack/react-router'
import { useState } from 'react'

export function ClassDetailPage() {
  // Get classId from URL search params
  const searchParams = useSearch({ from: '/classes/detail-class' })
  const classId = searchParams.id?.toString() || ''
  const numericClassId = classId ? parseInt(classId, 10) : null

  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)

  const {
    classInfo,
    postData,
    activeTab,
    setActiveTab,
    isAddMemberModalOpen,
    setIsAddMemberModalOpen,
    showSettings,
    setShowSettings,
    isTeacher,
    isLoading,
    error,
    refetch,
  } = useClassDetailPage(classId)

  // Setup real-time socket for this class
  useClassSocket({
    classId: numericClassId,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">
          Có lỗi xảy ra khi tải thông tin lớp học
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <ClassDetailHeader
        classInfo={classInfo}
        isTeacher={isTeacher}
        onAddMember={() => setIsAddMemberModalOpen(true)}
        onImportStudents={() => setIsImportDialogOpen(true)}
        onToggleSettings={() => setShowSettings(!showSettings)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {showSettings ? (
            <ClassSettings
              onBack={() => setShowSettings(false)}
              classInfo={classInfo}
            />
          ) : (
            <ClassMainContent
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              postData={postData}
              classId={classInfo.class_id}
              classInfo={classInfo}
              onRefresh={refetch}
            />
          )}
        </div>
      </div>

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onOpenChange={setIsAddMemberModalOpen}
        classInfo={classInfo}
      />

      {/* Import Students Excel Dialog */}
      <ImportStudentsExcelDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        classInfo={classInfo}
        onImportSuccess={() => refetch?.()}
      />

      {/* Sticky Post Button - Only show when not in settings and in posts tab */}
      {!showSettings && activeTab === 'posts' && (
        <StickyPostButton classInfo={classInfo} onPostCreated={refetch} />
      )}
    </div>
  )
}

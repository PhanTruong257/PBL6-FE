import { ClassSettings, ClassMainContent, AddMemberModal, StickyPostButton } from '../components'
import { ClassDetailHeader } from '../components'
import { useClassDetailPage } from '../hooks'
import { useSearch } from '@tanstack/react-router'

export function ClassDetailPage() {
    // Get classId from URL search params
    const searchParams = useSearch({ from: '/classes/detail-class' })
    const classId = searchParams.id?.toString() || ''

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
        error
    } = useClassDetailPage(classId)

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
                <div className="text-red-500">Có lỗi xảy ra khi tải thông tin lớp học</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <ClassDetailHeader
                classInfo={classInfo}
                isTeacher={isTeacher}
                onAddMember={() => setIsAddMemberModalOpen(true)}
                onToggleSettings={() => setShowSettings(!showSettings)}
            />

            <div className="flex h-full">
                {/* Main Content */}
                <div className="flex-1 flex flex-col">
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

            {/* Sticky Post Button - Only show when not in settings and in posts tab */}
            {!showSettings && activeTab === 'posts' && <StickyPostButton classInfo={classInfo} />}
        </div>
    )
}
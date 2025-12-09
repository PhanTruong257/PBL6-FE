import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PostCard } from './post-card'
import { MaterialsView } from './materials-view'
import { StudentsView } from './students-view'
import type { PostCardProps } from '../types'
import { useMaterialsDetail } from '../hooks/use-class-detail'
import type { Material_full_info } from '@/types/material'
import type { ClassBasicInfo } from '@/types/class'
import { MessageSquare } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useLocation } from '@tanstack/react-router'

interface ClassMainContentProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  postData: PostCardProps[]
  classId: number
  classInfo: ClassBasicInfo
  onRefresh?: () => void
}

export function ClassMainContent({
  activeTab,
  setActiveTab,
  postData,
  classId,
  classInfo,
  onRefresh,
}: ClassMainContentProps) {
  const { data: materials, refetch: refetchMaterials } =
    useMaterialsDetail(classId)
  const location = useLocation()
  const postsContainerRef = useRef<HTMLDivElement>(null)

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (value === 'materials') {
      // Refetch materials when switching to materials tab
      refetchMaterials()
    }
  }

  // Auto-scroll to bottom on initial load and when posts change
  useEffect(() => {
    if (
      activeTab === 'posts' &&
      postsContainerRef.current &&
      postData.length > 0
    ) {
      // Small delay to ensure DOM is fully rendered
      setTimeout(() => {
        if (postsContainerRef.current) {
          postsContainerRef.current.scrollTop =
            postsContainerRef.current.scrollHeight
        }
      }, 100)
    }
  }, [activeTab, postData.length])

  // Smooth scroll when coming from notification
  useEffect(() => {
    if (
      location.hash === '#scroll-to-bottom' &&
      activeTab === 'posts' &&
      postsContainerRef.current
    ) {
      setTimeout(() => {
        postsContainerRef.current?.scrollTo({
          top: postsContainerRef.current.scrollHeight,
          behavior: 'smooth',
        })
      }, 100)
    }
  }, [location.hash, activeTab])

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 flex-shrink-0">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 w-96">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tab Content */}
      {activeTab === 'posts' ? (
        <div className="flex-1 p-6 overflow-hidden">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            {postData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <MessageSquare className="h-16 w-16 mb-4 text-gray-300" />
                <p className="text-lg font-medium text-gray-600">
                  Chưa có bài đăng nào
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Hãy đăng thông báo đầu tiên cho lớp của bạn
                </p>
              </div>
            ) : (
              <div
                ref={postsContainerRef}
                className="space-y-6 overflow-y-auto"
              >
                {postData.map((post) => (
                  <PostCard
                    key={post.id}
                    id={post.id}
                    sender={post.sender}
                    title={post.title}
                    message={post.message}
                    created_at={post.created_at}
                    replies={post.replies}
                    materials={post.materials}
                    classId={classId}
                    onRefresh={onRefresh}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'materials' ? (
        <div className="flex-1 overflow-hidden">
          <MaterialsView
            materials={materials || ([] as Material_full_info[])}
            classInfo={classInfo}
          />
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <StudentsView classId={classId} />
        </div>
      )}
    </div>
  )
}

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PostCard} from './post-card'
import { MaterialsView } from './materials-view'
import { StudentsView } from './students-view'
import type { PostCardProps } from '../types'
import { useMaterialsDetail } from '../hooks/use-class-detail'
import type { Material_full_info } from '@/types/material'

interface ClassMainContentProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  postData: PostCardProps[]
  classId: number
}


export function ClassMainContent({ activeTab, setActiveTab, postData, classId }: ClassMainContentProps) {
  const {data: materials} = useMaterialsDetail(classId)
  return (
    <>
      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-96">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
            </TabsList>
        </Tabs>
      </div>

      {/* Tab Content */}
      {activeTab === 'posts' ? (
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            {postData.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                sender={post.sender}
                title={post.title}
                message={post.message}
                created_at={post.created_at}
                replies={post.replies}
                classId={classId}
              />
            ))}
          </div>
        </div>
      ) : activeTab === 'materials' ? (
        <MaterialsView 
        materials={materials||([] as Material_full_info[])}/>
      ) : (
        <StudentsView classId={classId} />
      )}

      
    </>
  )
}
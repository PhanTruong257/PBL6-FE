import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PostCard, type PostCardProps } from './post-card'

interface ClassMainContentProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  postData: PostCardProps[]
}


export function ClassMainContent({ activeTab, setActiveTab, postData }: ClassMainContentProps) {
  return (
    <>
      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-60">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
            </TabsList>
        </Tabs>
      </div>

      {/* Posts Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {postData.map((post) => (
            <PostCard
              id={post.id}
              sender={post.sender}
              message={post.message}
              create_at={post.create_at}
              replies={post.replies}
            />
          ))}
        </div>
      </div>

      
    </>
  )
}
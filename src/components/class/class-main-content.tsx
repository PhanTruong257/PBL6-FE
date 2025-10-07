import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { PostCard } from './post-card'
import { 
  Paperclip,
  Send,
  Smile,
  AtSign,
  Hash,
  MoreHorizontal,
} from 'lucide-react'

interface ClassMainContentProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const POSTS_DATA = [
  {
    id: '1',
    author: 'Vo Đức Hoàng',
    avatar: 'bg-red-500',
    timestamp: '10:00 AM',
    content: 'Thầy gửi các em mẫu SRS như sau, với các yêu cầu...',
    repliesCount: '5 replies from Franz, Giselle, and Irina',
    replies: [
      {
        id: '1-1',
        author: 'Vo Đức Hoàng',
        avatar: 'bg-red-500',
        timestamp: '10:23 AM',
        content: 'File mẫu SRS',
        attachment: {
          name: 'SRS_Template.docx',
          url: 'box.com/s/v9eo8eual89kqul/July/Promotion.doc',
          type: 'docx'
        }
      }
    ]
  },
  {
    id: '2',
    author: 'Ngô VD',
    avatar: 'bg-green-500',
    timestamp: '23:00 AM',
    title: 'Báo cáo SRS',
    content: 'Đã thứa thầy nhóm 1 nộp báo cáo SRS à.',
    showMore: true,
    repliesCount: '15 replies from Oscar, Babak, and Cecily',
    replies: [
      {
        id: '2-1',
        author: 'Phuc Nguyên Hữu',
        avatar: 'bg-gray-400',
        timestamp: '11:23 AM',
        content: 'Em thầm gia làm phần Figma UI à.'
      }
    ]
  }
]

export function ClassMainContent({ activeTab, setActiveTab }: ClassMainContentProps) {
  return (
    <>
      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-80">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="onenote">OneNote</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Posts Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {POSTS_DATA.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              author={post.author}
              avatar={post.avatar}
              timestamp={post.timestamp}
              content={post.content}
              title={post.title}
              repliesCount={post.repliesCount}
              replies={post.replies}
              showMore={post.showMore}
            />
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Type a new message"
                className="w-full px-4 py-3 pr-24 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <AtSign className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Hash className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
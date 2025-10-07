import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MessageCircle, MoreHorizontal } from 'lucide-react'

interface Reply {
  id: string
  author: string
  avatar: string
  timestamp: string
  content: string
  attachment?: {
    name: string
    url: string
    type: string
  }
}

interface PostCardProps {
  id: string
  author: string
  avatar: string
  timestamp: string
  content: string
  title?: string
  repliesCount?: string
  replies?: Reply[]
  showMore?: boolean
}

export function PostCard({
  author,
  avatar,
  timestamp,
  content,
  title,
  repliesCount,
  replies = [],
  showMore = false
}: PostCardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className={`${avatar} text-white`}>{author.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-semibold text-gray-900">{author}</span>
              <span className="text-sm text-gray-500">{timestamp}</span>
            </div>
            {title && <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>}
            <p className="text-gray-800 mb-3">{content}</p>
            {showMore && (
              <div className="text-sm text-blue-600 mb-4">
                See more
              </div>
            )}
            {repliesCount && (
              <div className="text-sm text-blue-600 mb-4">
                {repliesCount}
              </div>
            )}
            
            {/* Replies */}
            {replies.map((reply, index) => (
              <div key={index} className="ml-4 border-l-2 border-gray-200 pl-4 mb-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className={`${reply.avatar} text-white text-xs`}>
                      {reply.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900 text-sm">{reply.author}</span>
                      <span className="text-xs text-gray-500">{reply.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-800 mb-2">{reply.content}</p>
                    
                    {/* File attachment */}
                    {reply.attachment && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center space-x-3 max-w-sm">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">W</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{reply.attachment.name}</p>
                          <p className="text-xs text-gray-500">{reply.attachment.url}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                {index === replies.length - 1 && showMore && (
                  <div className="text-sm text-blue-600 mt-2 ml-11">
                    See more
                  </div>
                )}
              </div>
            ))}
            
            <div className="flex items-center space-x-4 mt-4">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <MessageCircle className="h-4 w-4 mr-1" />
                Reply
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
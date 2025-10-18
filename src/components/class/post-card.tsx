import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { User } from '@/types'
import { MessageCircle} from 'lucide-react'
import { useState } from 'react'
import { replyInput } from './reply-input'



export interface PostCardProps {
  id: number
  sender: User
  message?: string
  create_at: Date
  replies?: PostCardProps[]
}

export function PostCard({
  id,
  sender,
  message,
  create_at,
  replies,
}: PostCardProps) {
  const [hideReply, setHideReply] = useState<boolean>(true)
  const [hideReplyInput, setHideReplyInput] = useState<boolean>(true)
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className={`${sender.avatar} text-white`}>{sender.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-semibold text-gray-900">{sender.fullName}</span>
              <span className="text-sm text-gray-500">{create_at.toLocaleDateString()+' '+create_at.toLocaleTimeString()}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Thông báo</h3>
            <p className="text-gray-800 mb-3">{message}</p>
            {replies && (
              <div className="text-sm text-blue-600 mb-4" onClick={()=>{setHideReply(!hideReply)}}>
                <a className='no-underline hover:underline cursor-pointer'>{replies.length} replies for this post</a>
              </div>
            )}
            
            {/* Replies */}
            {!hideReply && replies && (
              replies.map((reply, index) => (
              <div key={index} className="ml-4 border-l-2 border-gray-200 pl-4 mb-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className={`${reply.sender.avatar} text-white text-xs`}>
                      {reply.sender.fullName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900 text-sm">{reply.sender.fullName}</span>
                      <span className="text-xs text-gray-500">{create_at.toLocaleDateString()+' '+create_at.toLocaleTimeString()}</span>
                    </div>
                    <p className="text-sm text-gray-800 mb-2">{reply.message}</p>  
                  </div>
                </div>
              </div>
            )))}
            
            <div className="flex items-center space-x-4 mt-4">
              {hideReplyInput?
              <>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900" onClick={()=>setHideReplyInput(!hideReplyInput)}>
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Reply
              </Button>
              </>
              :
              replyInput(setHideReplyInput)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
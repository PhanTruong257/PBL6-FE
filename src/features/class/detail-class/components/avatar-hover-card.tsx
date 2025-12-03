import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { MessageCircle, Phone, Video, Mail, Linkedin } from 'lucide-react'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card'
import { useNavigate } from '@tanstack/react-router'
import { useRecoilValue } from 'recoil'
import { currentUserState } from '@/global/recoil/user'
import { httpClient } from '@/libs/http'
import { toast } from 'sonner'
import type { User } from '@/types'

interface AvatarHoverCardProps {
  user: User
  placeHolder?: string
}

export function AvatarHoverCard({ user , placeHolder}: AvatarHoverCardProps) {
  const navigate = useNavigate()
  const currentUser = useRecoilValue(currentUserState)

  /**
   * Navigate to direct chat with the user
   * Creates conversation if it doesn't exist
   */
  const handleNavigateToChat = async () => {
    if (!currentUser?.user_id) {
      toast.error('Vui lòng đăng nhập để nhắn tin')
      return
    }

    // Don't allow chatting with yourself
    if (currentUser.user_id === user.user_id) {
      toast.info('Bạn không thể nhắn tin với chính mình')
      return
    }

    try {
      // Check if conversation already exists
      let conversationId: number | null = null
      
      try {
        const checkResponse = await httpClient.get(
          `/chats/conversations/between/${currentUser.user_id}/${user.user_id}`,
        )
        const existingData = checkResponse.data
        if (existingData?.data?.conversation || existingData?.conversation) {
          const conversation = existingData?.data?.conversation || existingData?.conversation
          conversationId = conversation.id
        }
      } catch (error) {
        // Conversation doesn't exist, will create new one
      }

      // Create new conversation if doesn't exist
      if (!conversationId) {
        const createResponse = await httpClient.post('/chats/conversations', {
          sender_id: currentUser.user_id,
          receiver_id: user.user_id,
        })
        const conversationData = createResponse.data
        const conversation = conversationData?.data?.conversation || conversationData?.conversation || conversationData?.data
        conversationId = conversation?.id
      }

      // Navigate to conversation page with the conversation selected
      if (conversationId) {
        navigate({
          to: '/conversation',
          search: { conversationId: conversationId },
        })
      } else {
        // Fallback: just navigate to conversation page
        navigate({ to: '/conversation' })
      }
    } catch (error) {
      console.error('Error navigating to chat:', error)
      toast.error('Có lỗi xảy ra khi mở cuộc trò chuyện')
    }
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div onClick={handleNavigateToChat} role="button" tabIndex={0}>
          <Avatar className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all">
            <AvatarImage src={user.avatar ?? placeHolder} />
            <AvatarFallback className={`${user.avatar} text-white`}>{user.email.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </HoverCardTrigger>

      <HoverCardContent className="!w-72">
        <div className="flex items-center space-x-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={user.avatar ?? placeHolder} />
            <AvatarFallback className={`${user.avatar} text-white`}>{user.email.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-gray-900">{user.email}</div>
            <div className="text-xs text-gray-500">{user.role ?? 'user'}</div>
          </div>
        </div>

        <div className="mt-3 border-t pt-3 space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Phone className="w-4 h-4 text-gray-500" />
            <span>{user.phone ?? 'No phone'}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Mail className="w-4 h-4 text-gray-500" />
            <span className="truncate">{user.email ?? 'No email'}</span>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 hover:bg-blue-100 hover:text-blue-600"
              onClick={(e) => {
                e.stopPropagation()
                handleNavigateToChat()
              }}
              title="Nhắn tin"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Linkedin className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

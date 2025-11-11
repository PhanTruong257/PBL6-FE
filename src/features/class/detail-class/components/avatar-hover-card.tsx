import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { MessageCircle, Phone, Video, Mail, Linkedin } from 'lucide-react'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card'
import type { User } from '@/types'

interface AvatarHoverCardProps {
  user: User
  placeHolder?: string
}

export function AvatarHoverCard({ user , placeHolder}: AvatarHoverCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div>
          <Avatar className="w-10 h-10 cursor-pointer">
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
            <Button variant="ghost" size="icon" className="h-8 w-8">
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

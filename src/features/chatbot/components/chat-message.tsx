import type { ChatMessage } from '../types'

interface ChatMessageProps {
  message: ChatMessage
  isLast?: boolean
  messageRef?: React.RefObject<HTMLDivElement>
}

export function ChatMessageComponent({ message, isLast = false, messageRef }: ChatMessageProps) {
  return (
    <div 
      className={`flex flex-col gap-2 mb-3 w-full ${
        message.role === 'user' ? 'items-end' : 'items-start'
      }`}
    >
      <div className="flex items-center gap-2">
        {message.role === 'ai' && (
          <img 
            src="src/assets/images/ai.png" 
            alt="AI" 
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
        )}
        <span className="text-xs font-semibold text-gray-600">
          {message.role === "user" ? "You" : "Edu Assist"}
        </span>
        {message.role === 'user' && (
          <img 
            src="src/assets/images/user.png" 
            alt="User" 
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
        )}
      </div>
      <div 
        ref={isLast ? messageRef : undefined}
        className={`px-3.5 py-2.5 rounded-[18px] text-sm leading-relaxed max-w-[70%] whitespace-pre-wrap ${
          message.role === 'user'
            ? 'bg-blue-600 text-white rounded-br-1'
            : 'bg-green-100 text-black rounded-bl-1'
        }`}
      >
        {message.content}
      </div>
    </div>
  )
}
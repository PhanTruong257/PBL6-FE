import Markdown from "react-markdown"
import aiImg from '@/assets/images/ai.png';
interface StreamingResponseProps {
  content: string
  aiRef?: React.RefObject<HTMLDivElement>
}

export function StreamingResponse({ content, aiRef }: StreamingResponseProps) {
  if (!content.trim()) return null

  return (
    <div className="flex flex-col gap-2 mb-3 w-full items-start">
      <div className="flex items-center gap-2">
        <img 
          src={aiImg} 
          alt="AI" 
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
        <span className="text-xs font-semibold text-gray-600">
          Edu Assist
        </span>
      </div>
      <div 
        ref={aiRef}
        className="px-3.5 py-2.5 rounded-[18px] text-sm leading-relaxed max-w-[70%] bg-green-100 text-black rounded-bl-1"
      >
        <Markdown>
          {content}
        </Markdown>
      </div>
    </div>
  )
}